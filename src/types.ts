export type HobbyStatus = 'in-season' | 'resting' | 'proud-shelf' | 'archive'

export type NudgeCadence = 'daily' | 'every-few-days' | 'weekly' | 'when-inspired'

export type PlantColor = 'sage' | 'blush' | 'sky' | 'honey' | 'lavender' | 'terracotta'

/** Nested scrap / project / pile under a hobby. Keep shallow — one level only. */
export interface HobbyItem {
  id: string
  name: string
  note?: string
  createdAt: string
}

export interface Hobby {
  id: string
  name: string
  creating: string
  cadence: NudgeCadence
  petName?: string
  status: HobbyStatus
  /** Growth progress as 0–100 percent */
  progress: number
  color?: PlantColor
  createdAt: string
  lastTendedAt?: string
  /** When a soft in-app nudge may gently appear (ISO). Omitted for when-inspired. */
  nextNudgeAt?: string
  /** Nested projects / scraps / piles (optional; normalized to [] on load). */
  items?: HobbyItem[]
}

export const THEMES = ['Greenhouse', 'Basement', 'Closet', 'Desktop', 'Workshop'] as const
export type ThemeName = (typeof THEMES)[number]

export const BUDDIES = [
  { name: 'Sprout', vibe: 'Cheerful seedling who celebrates tiny wins' },
  { name: 'Dusty', vibe: 'Quiet attic friend who loves forgotten projects' },
  { name: 'Mira', vibe: 'Calm guide for when you need a soft restart' },
  { name: 'Pixel', vibe: 'Playful desktop companion for digital crafts' },
  { name: 'Rip', vibe: 'Workshop buddy who thrives on making things' },
] as const

export const STATUS_LABELS: Record<HobbyStatus, string> = {
  'in-season': 'In season',
  resting: 'Resting',
  'proud-shelf': 'Proud shelf',
  archive: 'Archive',
}

export const CADENCE_LABELS: Record<NudgeCadence, string> = {
  daily: 'Daily',
  'every-few-days': 'Every few days',
  weekly: 'Weekly',
  'when-inspired': 'When inspired',
}

export const PLANT_COLORS: { id: PlantColor; label: string; swatch: string }[] = [
  { id: 'sage', label: 'Sage', swatch: '#74a892' },
  { id: 'blush', label: 'Blush', swatch: '#e8a0b0' },
  { id: 'sky', label: 'Sky', swatch: '#7eb8da' },
  { id: 'honey', label: 'Honey', swatch: '#e6b84d' },
  { id: 'lavender', label: 'Lavender', swatch: '#b39bc8' },
  { id: 'terracotta', label: 'Terracotta', swatch: '#c47a5a' },
]

/** Preset tend amounts (percent bumps). */
export const TEND_PRESETS = [
  { id: 'little', label: 'A little', bump: 5, hint: 'A tiny sip' },
  { id: 'some', label: 'Some', bump: 15, hint: 'A nice watering' },
  { id: 'lot', label: 'A lot', bump: 25, hint: 'A deep drink' },
] as const

/** Days until the next soft nudge after a tend / cadence set. */
export const CADENCE_DAYS: Record<NudgeCadence, number | null> = {
  daily: 1,
  'every-few-days': 3,
  weekly: 7,
  'when-inspired': null,
}

export function progressPercent(progress: number): number {
  return Math.min(100, Math.max(0, Math.round(progress)))
}

export function applyProgressBump(current: number, bumpPercent: number): number {
  const bump = Math.max(0, Math.round(bumpPercent))
  return Math.min(100, progressPercent(current) + bump)
}

export function hobbyItems(hobby: Hobby): HobbyItem[] {
  return Array.isArray(hobby.items) ? hobby.items : []
}

/** Compute next soft-nudge time from a base ISO timestamp + cadence. */
export function computeNextNudgeAt(
  baseIso: string,
  cadence: NudgeCadence,
): string | undefined {
  const days = CADENCE_DAYS[cadence]
  if (days == null) return undefined
  const base = new Date(baseIso)
  if (Number.isNaN(base.getTime())) return undefined
  const next = new Date(base.getTime() + days * 24 * 60 * 60 * 1000)
  return next.toISOString()
}

/** True when an in-app gentle nudge may show (never for when-inspired). */
export function isNudgeDue(hobby: Hobby, now = new Date()): boolean {
  if (hobby.cadence === 'when-inspired') return false
  if (hobby.status === 'archive') return false
  if (!hobby.nextNudgeAt) return false
  const due = new Date(hobby.nextNudgeAt)
  if (Number.isNaN(due.getTime())) return false
  return due.getTime() <= now.getTime()
}

export function nudgeHintCopy(hobby: Hobby): string {
  const label = hobby.petName?.trim() || hobby.name
  return `${label} might be ready for a sip — only if it feels nice.`
}
