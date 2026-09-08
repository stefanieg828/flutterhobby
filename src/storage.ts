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
