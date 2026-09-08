export type HobbyStatus = 'in-season' | 'resting' | 'proud-shelf'

export type NudgeCadence = 'daily' | 'every-few-days' | 'weekly' | 'when-inspired'

export interface Hobby {
  id: string
  name: string
  creating: string
  cadence: NudgeCadence
  petName?: string
  status: HobbyStatus
  progress: number
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
}

export const CADENCE_LABELS: Record<NudgeCadence, string> = {
  daily: 'Daily',
  'every-few-days': 'Every few days',
  weekly: 'Weekly',
  'when-inspired': 'When inspired',
}
