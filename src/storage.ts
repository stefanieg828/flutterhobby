import type { Hobby } from './types'
import { progressPercent } from './types'

const STORAGE_KEY = 'flutterhobby-hobbies'
/** Marks progress as 0–100 percent (vs older tend-count × 5 display). */
const PROGRESS_AS_PERCENT_KEY = 'flutterhobby-progress-as-percent'

function migrateProgressToPercent(hobbies: Hobby[]): Hobby[] {
  return hobbies.map((h) => ({
    ...h,
    progress: progressPercent(Number(h.progress) * 5),
  }))
}

export function loadHobbies(): Hobby[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Hobby[]
    if (!Array.isArray(parsed)) return []

    if (!localStorage.getItem(PROGRESS_AS_PERCENT_KEY) && parsed.length > 0) {
      const migrated = migrateProgressToPercent(parsed)
      saveHobbies(migrated)
      return migrated
    }

    return parsed.map((h) => ({
      ...h,
      progress: progressPercent(Number(h.progress) || 0),
    }))
  } catch {
    return []
  }
}

export function saveHobbies(hobbies: Hobby[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hobbies))
  localStorage.setItem(PROGRESS_AS_PERCENT_KEY, '1')
}

export function createHobbyId(): string {
  return `hobby-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
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
