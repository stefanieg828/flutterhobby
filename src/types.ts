export type HobbyStatus = 'in-season' | 'resting' | 'proud-shelf' | 'archive'

export type NudgeCadence = 'daily' | 'every-few-days' | 'weekly' | 'when-inspired'

export type PlantColor = 'sage' | 'blush' | 'sky' | 'honey' | 'lavender' | 'terracotta'

export interface Hobby {
  id: string
  name: string
  creating: string
  cadence: NudgeCadence
  petName?: string
  status: HobbyStatus
  progress: number
  color?: PlantColor
  createdAt: string
  lastTendedAt?: string
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

export function progressPercent(progress: number): number {
  return Math.min(Math.round(progress * 5), 100)
}
