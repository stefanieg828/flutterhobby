import type { Hobby } from './types'

const STORAGE_KEY = 'flutterhobby-hobbies'

export function loadHobbies(): Hobby[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Hobby[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHobbies(hobbies: Hobby[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hobbies))
}

export function createHobbyId(): string {
  return `hobby-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
