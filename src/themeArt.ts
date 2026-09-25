import type { PlayableTheme } from './theme'

/** Folder slug under public/art/ for painted room + idle jacket. */
export const THEME_ART_SLUG: Record<PlayableTheme, string> = {
  Greenhouse: 'greenhouse',
  Basement: 'basement',
  Closet: 'closet',
  Desktop: 'desktop',
  Workshop: 'workshop',
}

export const THEME_IDLE_FILE: Record<PlayableTheme, string> = {
  Greenhouse: 'sprout-idle.png',
  Basement: 'dusty-idle.png',
  Closet: 'mira-idle.png',
  Desktop: 'pixel-idle.png',
  Workshop: 'rip-idle.png',
}

export const THEME_BUDDY_ART: Record<PlayableTheme, 'sprout' | 'dusty' | 'mira' | 'pixel' | 'rip'> = {
  Greenhouse: 'sprout',
  Basement: 'dusty',
  Closet: 'mira',
  Desktop: 'pixel',
  Workshop: 'rip',
}

/** All five playable themes ship painted room + live idle jacket. */
export function themeUsesPaintedRoom(_theme: PlayableTheme): boolean {
  return true
}

export function themeArtBase(theme: PlayableTheme): string {
  return `${import.meta.env.BASE_URL}art/${THEME_ART_SLUG[theme]}`
}

export function themeRoomBgSrc(theme: PlayableTheme): string {
  return `${themeArtBase(theme)}/room-bg.png`
}

export function themeIdleSrc(theme: PlayableTheme): string {
  return `${themeArtBase(theme)}/${THEME_IDLE_FILE[theme]}`
}
