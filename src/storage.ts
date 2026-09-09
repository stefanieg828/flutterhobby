import type { Hobby, HobbyItem } from './types'
import { computeNextNudgeAt, progressPercent } from './types'

const STORAGE_KEY = 'flutterhobby-hobbies'
/** Marks progress as 0–100 percent (vs older tend-count × 5 display). */
const PROGRESS_AS_PERCENT_KEY = 'flutterhobby-progress-as-percent'
/** Schema flag: hobbies may include items[] + nextNudgeAt. */
const NEST_NUDGE_SCHEMA_KEY = 'flutterhobby-nest-nudge-v1'
const DISMISSED_NUDGES_KEY = 'flutterhobby-dismissed-nudges'

function migrateProgressToPercent(hobbies: Hobby[]): Hobby[] {
  return hobbies.map((h) => ({
    ...h,
    progress: progressPercent(Number(h.progress) * 5),
  }))
}

function normalizeItem(raw: unknown): HobbyItem | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Partial<HobbyItem>
  if (typeof item.id !== 'string' || typeof item.name !== 'string') return null
  const name = item.name.trim()
  if (!name) return null
  const note =
    typeof item.note === 'string' && item.note.trim() ? item.note.trim() : undefined
  const createdAt =
    typeof item.createdAt === 'string' && item.createdAt
      ? item.createdAt
      : new Date().toISOString()
  return { id: item.id, name, note, createdAt }
}

/** Ensure items[] exists and backfill nextNudgeAt from last tend / created. */
export function normalizeHobby(raw: Hobby): Hobby {
  const itemsRaw = Array.isArray(raw.items) ? raw.items : []
  const items = itemsRaw
    .map(normalizeItem)
    .filter((item): item is HobbyItem => item != null)

  let nextNudgeAt = raw.nextNudgeAt
  if (typeof nextNudgeAt !== 'string' || !nextNudgeAt) {
    nextNudgeAt = undefined
  }
  if (!nextNudgeAt && raw.cadence !== 'when-inspired') {
    const base = raw.lastTendedAt || raw.createdAt
    if (base) nextNudgeAt = computeNextNudgeAt(base, raw.cadence)
  }
  if (raw.cadence === 'when-inspired') {
    nextNudgeAt = undefined
  }

  return {
    ...raw,
    progress: progressPercent(Number(raw.progress) || 0),
    items,
    nextNudgeAt,
  }
}

export function loadHobbies(): Hobby[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Hobby[]
    if (!Array.isArray(parsed)) return []

    let list = parsed
    if (!localStorage.getItem(PROGRESS_AS_PERCENT_KEY) && list.length > 0) {
      list = migrateProgressToPercent(list)
    }

    const normalized = list.map(normalizeHobby)
    const needsPersist =
      !localStorage.getItem(PROGRESS_AS_PERCENT_KEY) ||
      !localStorage.getItem(NEST_NUDGE_SCHEMA_KEY)

    if (needsPersist && normalized.length > 0) {
      saveHobbies(normalized)
      return normalized
    }

    return normalized
  } catch {
    return []
  }
}

export function saveHobbies(hobbies: Hobby[]): void {
  const normalized = hobbies.map(normalizeHobby)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
  localStorage.setItem(PROGRESS_AS_PERCENT_KEY, '1')
  localStorage.setItem(NEST_NUDGE_SCHEMA_KEY, '1')
}

export function createHobbyId(): string {
  return `hobby-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const LAST_HYPERFOCUS_KEY = 'flutterhobby-last-hyperfocus-id'
const HYPERFOCUS_NOTES_KEY = 'flutterhobby-hyperfocus-notes'

/** Light memory of the last hobby opened in Hyperfocus — never used for guilt. */
export function loadLastHyperfocusId(): string | null {
  try {
    return localStorage.getItem(LAST_HYPERFOCUS_KEY)
  } catch {
    return null
  }
}

export function saveLastHyperfocusId(id: string): void {
  try {
    localStorage.setItem(LAST_HYPERFOCUS_KEY, id)
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadHyperfocusNote(hobbyId: string): string {
  try {
    const raw = localStorage.getItem(HYPERFOCUS_NOTES_KEY)
    if (!raw) return ''
    const map = JSON.parse(raw) as Record<string, string>
    return typeof map[hobbyId] === 'string' ? map[hobbyId] : ''
  } catch {
    return ''
  }
}

export function saveHyperfocusNote(hobbyId: string, note: string): void {
  try {
    const raw = localStorage.getItem(HYPERFOCUS_NOTES_KEY)
    const map = (raw ? JSON.parse(raw) : {}) as Record<string, string>
    const trimmed = note.trim()
    if (trimmed) map[hobbyId] = trimmed
    else delete map[hobbyId]
    localStorage.setItem(HYPERFOCUS_NOTES_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

/** Map of hobbyId → nextNudgeAt that was dismissed (hide until that due stamp changes). */
export function loadDismissedNudges(): Record<string, string> {
  try {
    const raw = localStorage.getItem(DISMISSED_NUDGES_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, string>
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

export function dismissNudge(hobbyId: string, nextNudgeAt: string): void {
  try {
    const map = loadDismissedNudges()
    map[hobbyId] = nextNudgeAt
    localStorage.setItem(DISMISSED_NUDGES_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

export function isNudgeDismissed(
  hobbyId: string,
  nextNudgeAt: string | undefined,
  dismissed: Record<string, string>,
): boolean {
  if (!nextNudgeAt) return false
  return dismissed[hobbyId] === nextNudgeAt
}
