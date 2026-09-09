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

/** Active hyperfocus season — survives refresh across days. Gentle, no streaks. */
export interface HyperfocusSession {
  hobbyId: string
  startedAt: string
  /** ISO datetime when focus gently ends; omit for open-ended. */
  until?: string
}

const HYPERFOCUS_SESSION_KEY = 'flutterhobby-hyperfocus-session'

export function loadHyperfocusSession(): HyperfocusSession | null {
  try {
    const raw = localStorage.getItem(HYPERFOCUS_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<HyperfocusSession>
    if (!parsed || typeof parsed.hobbyId !== 'string' || typeof parsed.startedAt !== 'string') {
      return null
    }
    const until =
      typeof parsed.until === 'string' && parsed.until.trim() ? parsed.until.trim() : undefined
    return { hobbyId: parsed.hobbyId, startedAt: parsed.startedAt, until }
  } catch {
    return null
  }
}

export function saveHyperfocusSession(session: HyperfocusSession): void {
  try {
    const payload: HyperfocusSession = {
      hobbyId: session.hobbyId,
      startedAt: session.startedAt,
    }
    if (session.until) payload.until = session.until
    localStorage.setItem(HYPERFOCUS_SESSION_KEY, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

export function clearHyperfocusSession(): void {
  try {
    localStorage.removeItem(HYPERFOCUS_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

/** Human-friendly remaining time for a focus-until moment. */
export function formatFocusRemaining(untilIso: string, now = new Date()): string {
  const until = new Date(untilIso)
  if (Number.isNaN(until.getTime())) return 'Sometime'
  const ms = until.getTime() - now.getTime()
  if (ms <= 0) return 'Focus window rested — stay as long as you like'
  const minutes = Math.round(ms / 60000)
  if (minutes < 60) return `~${Math.max(1, minutes)} min left`
  const hours = Math.round(minutes / 60)
  if (hours < 36) return `~${hours} hour${hours === 1 ? '' : 's'} left`
  const days = Math.round(hours / 24)
  if (days < 14) return `~${days} day${days === 1 ? '' : 's'} left`
  const weeks = Math.round(days / 7)
  if (weeks < 8) return `~${weeks} week${weeks === 1 ? '' : 's'} left`
  const months = Math.round(days / 30)
  return `~${months} month${months === 1 ? '' : 's'} left`
}

/** Value for <input type="datetime-local"> from an ISO string (local wall clock). */
export function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Parse datetime-local value into ISO (or undefined if empty/invalid). */
export function fromDatetimeLocalValue(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}
