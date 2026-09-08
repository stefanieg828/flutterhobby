import type { ThemeName } from './types'

/** Themes with a full Home skin today. */
export const PLAYABLE_THEMES = [
  'Greenhouse',
  'Basement',
  'Closet',
  'Desktop',
  'Workshop',
] as const
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
  emptyHint: string
  roomAria: string
  rightAria: string
  objectWord: string
  emptyKind: 'pot' | 'crate' | 'hanger' | 'icon' | 'peg'
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
    emptyHint: 'Nothing planted yet — tap + on the potting bench.',
    roomAria: 'Hobby greenhouse',
    rightAria: 'Proud shelf and potting bench',
    objectWord: 'pot',
    emptyKind: 'pot',
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
    emptyHint: 'Nothing stashed yet — tap + on the workbench.',
    roomAria: 'Hobby basement',
    rightAria: 'Proud shelf and workbench',
    objectWord: 'crate',
    emptyKind: 'crate',
  },
  Closet: {
    roomName: 'Closet of selves',
    tagline: 'Try on hobbies, find your fit',
    brandMark: '✦',
    buddyName: 'Mira',
    whisperEmpty: 'Empty hangers — hang something!',
    whisperLoading: 'Opening the closet…',
    whisperTended: 'That look suits you ♡',
    whisperIdle: 'Tap a look to tend at the vanity.',
    whisperNoActive: 'Wake a look or hang something new.',
    createTitle: 'Hang a new hobby',
    createFab: 'Hang a new hobby',
    benchEyebrow: 'Vanity',
    tendButton: '👗 Try on / Steam',
    tendConfirm: '✨ Log this try-on',
    tendChooserTitle: 'How much did you get to?',
    tendChooserCopy: "Any amount counts. Pick a try-on size — there's no wrong answer.",
    progressLabel: 'Fit',
    lastTendedPrefix: 'Last tried on',
    notTendedYet: 'Not tried yet — try it on or steam it whenever you like.',
    amountHint: (amount) => `+${amount}% fit`,
    presets: [
      { id: 'little', label: 'A little', bump: 5, hint: 'A quick peek' },
      { id: 'some', label: 'Some', bump: 15, hint: 'A solid try-on' },
      { id: 'lot', label: 'A lot', bump: 25, hint: 'Steamed & styled' },
    ],
    workbenchPlaque: 'Vanity',
    workbenchChalk: 'Try on, steam, keep going ♡',
    archiveHint: 'Folded away, not deleted',
    recolorLegend: 'Recolor hanger',
    splashEmoji: '✨',
    emptyHint: 'Nothing hanging yet — tap + on the vanity.',
    roomAria: 'Hobby closet of selves',
    rightAria: 'Proud shelf and vanity',
    objectWord: 'look',
    emptyKind: 'hanger',
  },
  Desktop: {
    roomName: 'Desktop',
    tagline: 'Open hobbies, save your spark',
    brandMark: '▣',
    buddyName: 'Pixel',
    whisperEmpty: 'Empty desktop — drop something!',
    whisperLoading: 'Booting the desktop…',
    whisperTended: 'Saved — nice work ♡',
    whisperIdle: 'Tap an icon to tend at the dock.',
    whisperNoActive: 'Wake a file or open something new.',
    createTitle: 'Open a new hobby',
    createFab: 'Open a new hobby',
    benchEyebrow: 'Dock',
    tendButton: '📂 Open / Save',
    tendConfirm: '💾 Log this save',
    tendChooserTitle: 'How much did you get to?',
    tendChooserCopy: "Any amount counts. Pick a save size — there's no wrong answer.",
    progressLabel: 'Progress',
    lastTendedPrefix: 'Last saved',
    notTendedYet: 'Not saved yet — open it or save whenever you like.',
    amountHint: (amount) => `+${amount}% progress`,
    presets: [
      { id: 'little', label: 'A little', bump: 5, hint: 'A quick open' },
      { id: 'some', label: 'Some', bump: 15, hint: 'A solid save' },
      { id: 'lot', label: 'A lot', bump: 25, hint: 'Fully saved' },
    ],
    workbenchPlaque: 'Dock',
    workbenchChalk: 'Open, save, keep going ♡',
    archiveHint: 'Trashed to archive, not deleted',
    recolorLegend: 'Recolor icon',
    splashEmoji: '💾',
    emptyHint: 'Nothing open yet — tap + on the dock.',
    roomAria: 'Hobby desktop',
    rightAria: 'Proud shelf and dock',
    objectWord: 'icon',
    emptyKind: 'icon',
  },
  Workshop: {
    roomName: 'Workshop',
    tagline: 'Tighten hobbies, hang them proud',
    brandMark: '⚒',
    buddyName: 'Rip',
    whisperEmpty: 'Empty pegboard — hang something!',
    whisperLoading: 'Switching on the workshop light…',
    whisperTended: 'Nice tighten — looking solid ♡',
    whisperIdle: 'Tap a piece to tend on the workbench.',
    whisperNoActive: 'Wake a WIP or start something new.',
    createTitle: 'Start a new hobby',
    createFab: 'Start a new hobby',
    benchEyebrow: 'Workbench',
    tendButton: '🔧 Tighten / Hang on the wall',
    tendConfirm: '🔩 Log this tighten',
    tendChooserTitle: 'How much did you get to?',
    tendChooserCopy: "Any amount counts. Pick a tighten size — there's no wrong answer.",
    progressLabel: 'Build',
    lastTendedPrefix: 'Last tended',
    notTendedYet: 'Not tended yet — tighten it or hang it whenever you like.',
    amountHint: (amount) => `+${amount}% build`,
    presets: [
      { id: 'little', label: 'A little', bump: 5, hint: 'A tiny tighten' },
      { id: 'some', label: 'Some', bump: 15, hint: 'A solid hang' },
      { id: 'lot', label: 'A lot', bump: 25, hint: 'Fully hung' },
    ],
    workbenchPlaque: 'Workbench',
    workbenchChalk: 'Tighten, hang, keep going ♡',
    archiveHint: 'Shelved, not deleted',
    recolorLegend: 'Recolor piece',
    splashEmoji: '🔧',
    emptyHint: 'Nothing started yet — tap + on the workbench.',
    roomAria: 'Hobby workshop',
    rightAria: 'Proud shelf and workbench',
    objectWord: 'piece',
    emptyKind: 'peg',
  },
}

export function themeBuddy(theme: PlayableTheme): string {
  return THEME_COPY[theme].buddyName
}

export function themeStatusLabel(theme: ThemeName): 'Ready' | 'Coming soon' {
  return isPlayableTheme(theme) ? 'Ready' : 'Coming soon'
}

/** CSS skin class on the Home room (Greenhouse has no extra class). */
export function themeRoomClass(theme: PlayableTheme): string {
  if (theme === 'Greenhouse') return ''
  return theme.toLowerCase()
}

export const BUDDY_THEME: Record<string, PlayableTheme> = {
  Sprout: 'Greenhouse',
  Dusty: 'Basement',
  Mira: 'Closet',
  Pixel: 'Desktop',
  Rip: 'Workshop',
}
