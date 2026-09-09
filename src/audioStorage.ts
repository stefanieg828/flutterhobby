import { get, set, del, keys } from 'idb-keyval'

/** Metadata only — blobs live in IndexedDB. */
export interface ProgressAudioMeta {
  id: string
  hobbyId: string
  createdAt: string
  /** Recorded / file duration in ms when known. */
  durationMs?: number
  mimeType?: string
}

const META_KEY = 'flutterhobby-progress-audio'
const IDB_PREFIX = 'fh-audio:'

/** Soft cap for recordings / uploads (~3 minutes). */
export const MAX_AUDIO_DURATION_MS = 3 * 60 * 1000
/** Gentle heads-up before the soft cap (~2 minutes). */
export const AUDIO_WARN_DURATION_MS = 2 * 60 * 1000

function audioKey(hobbyId: string, audioId: string): string {
  return `${IDB_PREFIX}${hobbyId}:${audioId}`
}

export function createAudioId(): string {
  return `audio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function loadAllMeta(): Record<string, ProgressAudioMeta[]> {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, ProgressAudioMeta[]>
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

function saveAllMeta(map: Record<string, ProgressAudioMeta[]>): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(map))
  } catch {
    /* ignore quota / private mode */
  }
}

/** Newest first. */
export function listAudioMeta(hobbyId: string): ProgressAudioMeta[] {
  const list = loadAllMeta()[hobbyId] ?? []
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function getAudioBlob(hobbyId: string, audioId: string): Promise<Blob | undefined> {
  try {
    const blob = await get<Blob>(audioKey(hobbyId, audioId))
    return blob instanceof Blob ? blob : undefined
  } catch {
    return undefined
  }
}

/** Prefer a MediaRecorder MIME type the browser actually supports. */
export function pickRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ]
  return candidates.find((t) => MediaRecorder.isTypeSupported(t))
}

export async function addProgressAudio(
  hobbyId: string,
  blob: Blob,
  opts?: { durationMs?: number; mimeType?: string },
): Promise<ProgressAudioMeta> {
  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error('Empty audio')
  }
  const id = createAudioId()
  const createdAt = new Date().toISOString()
  const mimeType = opts?.mimeType || blob.type || undefined
  const durationMs =
    typeof opts?.durationMs === 'number' && opts.durationMs > 0
      ? Math.round(opts.durationMs)
      : undefined

  await set(audioKey(hobbyId, id), blob)

  const map = loadAllMeta()
  const entry: ProgressAudioMeta = { id, hobbyId, createdAt, durationMs, mimeType }
  map[hobbyId] = [entry, ...(map[hobbyId] ?? [])]
  saveAllMeta(map)
  return entry
}

export async function deleteProgressAudio(hobbyId: string, audioId: string): Promise<void> {
  try {
    await del(audioKey(hobbyId, audioId))
  } catch {
    /* ignore */
  }
  const map = loadAllMeta()
  const next = (map[hobbyId] ?? []).filter((p) => p.id !== audioId)
  if (next.length === 0) delete map[hobbyId]
  else map[hobbyId] = next
  saveAllMeta(map)
}

/** Drop all audio clips for a hobby (call when the hobby itself is deleted). */
export async function deleteAllAudioForHobby(hobbyId: string): Promise<void> {
  const map = loadAllMeta()
  const list = map[hobbyId] ?? []
  await Promise.all(
    list.map(async (p) => {
      try {
        await del(audioKey(hobbyId, p.id))
      } catch {
        /* ignore */
      }
    }),
  )
  delete map[hobbyId]
  saveAllMeta(map)

  try {
    const all = await keys()
    const prefix = `${IDB_PREFIX}${hobbyId}:`
    await Promise.all(
      all
        .filter((k) => typeof k === 'string' && k.startsWith(prefix))
        .map((k) => del(k)),
    )
  } catch {
    /* ignore */
  }
}

export function formatAudioDuration(ms: number | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return ''
  const totalSec = Math.round(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
