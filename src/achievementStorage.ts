/** Optional per-hobby pride badges / achievements — text only in localStorage. */

export interface PrideAchievement {
  id: string
  title: string
  note?: string
  /** Calendar day the win belongs to (YYYY-MM-DD). Defaults to today when adding. */
  achievedOn: string
  createdAt: string
  updatedAt?: string
}

const STORAGE_KEY = 'flutterhobby-achievements'

type AchievementMap = Record<string, PrideAchievement[]>

function todayYmd(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Normalize a date input value (YYYY-MM-DD) or ISO; fall back to today. */
export function normalizeAchievedOn(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return todayYmd()
  const trimmed = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const probe = new Date(`${trimmed}T12:00:00`)
    if (!Number.isNaN(probe.getTime())) return trimmed
  }
  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) return todayYmd(parsed)
  return todayYmd()
}

export function createAchievementId(): string {
  return `ach-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function loadMap(): AchievementMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as AchievementMap
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

function saveMap(map: AchievementMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore quota / private mode */
  }
}

function normalizeAchievement(raw: unknown): PrideAchievement | null {
  if (!raw || typeof raw !== 'object') return null
  const a = raw as Partial<PrideAchievement>
  if (typeof a.id !== 'string' || typeof a.title !== 'string') return null
  const title = a.title.trim()
  if (!title) return null
  const note =
    typeof a.note === 'string' && a.note.trim() ? a.note.trim() : undefined
  const achievedOn = normalizeAchievedOn(
    typeof a.achievedOn === 'string' ? a.achievedOn : undefined,
  )
  const createdAt =
    typeof a.createdAt === 'string' && a.createdAt
      ? a.createdAt
      : new Date().toISOString()
  const updatedAt =
    typeof a.updatedAt === 'string' && a.updatedAt ? a.updatedAt : undefined
  return { id: a.id, title, note, achievedOn, createdAt, updatedAt }
}

/** Newest achievements first (by achievedOn, then createdAt). */
function sortAchievements(list: PrideAchievement[]): PrideAchievement[] {
  return [...list].sort((a, b) => {
    if (a.achievedOn !== b.achievedOn) {
      return a.achievedOn < b.achievedOn ? 1 : -1
    }
    return a.createdAt < b.createdAt ? 1 : -1
  })
}

export function listAchievements(hobbyId: string): PrideAchievement[] {
  const map = loadMap()
  const raw = Array.isArray(map[hobbyId]) ? map[hobbyId] : []
  const list = raw
    .map(normalizeAchievement)
    .filter((a): a is PrideAchievement => a != null)
  return sortAchievements(list)
}

export function addAchievement(
  hobbyId: string,
  input: { title: string; note?: string; achievedOn?: string },
): PrideAchievement {
  const title = input.title.trim()
  if (!title) throw new Error('Title required')
  const achievement: PrideAchievement = {
    id: createAchievementId(),
    title,
    note: input.note?.trim() || undefined,
    achievedOn: normalizeAchievedOn(input.achievedOn),
    createdAt: new Date().toISOString(),
  }
  const map = loadMap()
  const existing = listAchievements(hobbyId)
  map[hobbyId] = sortAchievements([achievement, ...existing])
  saveMap(map)
  return achievement
}

export function updateAchievement(
  hobbyId: string,
  achievementId: string,
  input: { title: string; note?: string; achievedOn?: string },
): PrideAchievement | null {
  const title = input.title.trim()
  if (!title) throw new Error('Title required')
  const map = loadMap()
  const list = listAchievements(hobbyId)
  let updated: PrideAchievement | null = null
  const next = list.map((a) => {
    if (a.id !== achievementId) return a
    updated = {
      ...a,
      title,
      note: input.note?.trim() || undefined,
      achievedOn: normalizeAchievedOn(input.achievedOn ?? a.achievedOn),
      updatedAt: new Date().toISOString(),
    }
    return updated
  })
  if (!updated) return null
  map[hobbyId] = sortAchievements(next)
  saveMap(map)
  return updated
}

export function deleteAchievement(hobbyId: string, achievementId: string): void {
  const map = loadMap()
  const list = listAchievements(hobbyId).filter((a) => a.id !== achievementId)
  if (list.length === 0) delete map[hobbyId]
  else map[hobbyId] = list
  saveMap(map)
}

export function deleteAllAchievementsForHobby(hobbyId: string): void {
  const map = loadMap()
  if (!(hobbyId in map)) return
  delete map[hobbyId]
  saveMap(map)
}

export function formatAchievementDate(ymd: string): string {
  const d = new Date(`${ymd}T12:00:00`)
  if (Number.isNaN(d.getTime())) return ymd
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function defaultAchievedOnInput(): string {
  return todayYmd()
}
