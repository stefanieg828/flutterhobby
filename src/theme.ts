import type { ThemeName } from './types'

/** Themes with a full Home skin today. */
export const PLAYABLE_THEMES = ['Greenhouse', 'Basement'] as const
export type PlayableTheme = (typeof PLAYABLE_THEMES)[number]

const THEME_KEY = 'flutterhobby-theme'

export function isPlayableTheme(theme: string): theme is PlayableTheme {
  return (PLAYABLE_THEMES as readonly string[]).includes(theme)
}

export function loadTheme(): PlayableTheme {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw && isPlayableTheme(raw)) return raw
  } catch {
    /* ignore */
  }
  return 'Greenhouse'
}

export function saveTheme(theme: PlayableTheme): void {
  localStorage.setItem(THEME_KEY, theme)
}

export interface ThemeCopy {
  roomName: string
  tagline: string
  brandMark: string
  buddyName: string
  whisperEmpty: string
  whisperLoading: string
  whisperTended: string
  whisperIdle: string
  whisperNoActive: string
  createTitle: string
  createFab: string
  benchEyebrow: string
  tendButton: string
  tendConfirm: string
  tendChooserTitle: string
  tendChooserCopy: string
  progressLabel: string
  lastTendedPrefix: string
  notTendedYet: string
  amountHint: (amount: number) => string
  presets: { id: string; label: string; bump: number; hint: string }[]
  workbenchPlaque: string
  workbenchChalk: string
  archiveHint: string
  recolorLegend: string
  splashEmoji: string
}

export const THEME_COPY: Record<PlayableTheme, ThemeCopy> = {
  Greenhouse: {
    roomName: 'Greenhouse',
    tagline: 'Grow hobbies, grow joy',
    brandMark: '✿',
    buddyName: 'Sprout',
    whisperEmpty: 'Empty shelves — plant something!',
    whisperLoading: 'Opening the greenhouse…',
    whisperTended: 'That sip counted ♡',
    whisperIdle: 'Tap a pot to tend on the bench.',
    whisperNoActive: 'Wake a plant or plant something new.',
    createTitle: 'Plant a new hobby',
    createFab: 'Plant a new hobby',
    benchEyebrow: 'Potting bench',
    tendButton: '💧 Water / Tend',
    tendConfirm: '💧 Log this sip',
    tendChooserTitle: 'How much did you get to?',
    tendChooserCopy: "Any amount counts. Pick a sip size — there's no wrong answer.",
    progressLabel: 'Growth',
    lastTendedPrefix: 'Last watered',
    notTendedYet: 'Not tended yet — give it a first sip whenever you like.',
    amountHint: (amount) => `+${amount}% growth`,
    presets: [
      { id: 'little', label: 'A little', bump: 5, hint: 'A tiny sip' },
      { id: 'some', label: 'Some', bump: 15, hint: 'A nice watering' },
      { id: 'lot', label: 'A lot', bump: 25, hint: 'A deep drink' },
    ],
    workbenchPlaque: 'Potting Bench',
    workbenchChalk: 'Small steps, big growth ♡',
    archiveHint: 'Tucked away, not deleted',
    recolorLegend: 'Recolor pot',
    splashEmoji: '💧',
  },
  Basement: {
    roomName: 'Basement',
    tagline: 'Dust off hobbies, plug back in',
    brandMark: '✧',
    buddyName: 'Dusty',
    whisperEmpty: 'Empty crates — stash something!',
    whisperLoading: 'Flipping on the basement light…',
    whisperTended: 'All dusted — nice work ♡',
    whisperIdle: 'Tap a crate to tend on the workbench.',
    whisperNoActive: 'Wake a project or stash something new.',
    createTitle: 'Stash a new hobby',
    createFab: 'Stash a new hobby',
    benchEyebrow: 'Workbench',
    tendButton: '🧹 Dust off / Plug in',
    tendConfirm: '🔌 Log this dust-off',
    tendChooserTitle: 'How much did you get to?',
    tendChooserCopy: "Any amount counts. Pick a dust-off size — there's no wrong answer.",
    progressLabel: 'Progress',
    lastTendedPrefix: 'Last tended',
    notTendedYet: 'Not tended yet — dust it off or plug it in whenever you like.',
    amountHint: (amount) => `+${amount}% progress`,
    presets: [
      { id: 'little', label: 'A little', bump: 5, hint: 'A tiny wipe' },
      { id: 'some', label: 'Some', bump: 15, hint: 'A solid dust-off' },
      { id: 'lot', label: 'A lot', bump: 25, hint: 'Fully plugged in' },
    ],
    workbenchPlaque: 'Workbench',
    workbenchChalk: 'Dust off, plug in, keep going ♡',
    archiveHint: 'Boxed up, not deleted',
    recolorLegend: 'Recolor crate',
    splashEmoji: '✨',
  },
}

export function themeBuddy(theme: PlayableTheme): string {
  return THEME_COPY[theme].buddyName
}

export function themeStatusLabel(theme: ThemeName): 'Ready' | 'Coming soon' {
  return isPlayableTheme(theme) ? 'Ready' : 'Coming soon'
}
