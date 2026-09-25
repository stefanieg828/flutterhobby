import { useState, type ReactNode } from 'react'
import type { PlayableTheme } from '../theme'
import { THEME_BUDDY_ART, themeIdleSrc } from '../themeArt'

export type BuddyArtName = 'sprout' | 'dusty' | 'mira' | 'pixel' | 'rip'

interface PaintedBuddyArtProps {
  name: BuddyArtName
  /** Greenhouse watering pose (chroma-keyed sprout-water). */
  watering?: boolean
  /** Prefer theme idle jacket (transparent stand sprite) over lineup vignette. */
  idle?: boolean
  theme?: PlayableTheme
  className?: string
  fallback: ReactNode
}

function buddySrc(name: BuddyArtName, watering?: boolean, idle?: boolean, theme?: PlayableTheme): string {
  const base = import.meta.env.BASE_URL
  if (name === 'sprout' && watering) {
    return `${base}art/greenhouse/sprout-watering.png`
  }
  if (idle && theme) {
    return themeIdleSrc(theme)
  }
  if (idle && name === 'sprout') {
    return `${base}art/greenhouse/sprout-idle.png`
  }
  if (idle) {
    const slug =
      name === 'dusty'
        ? 'basement'
        : name === 'mira'
          ? 'closet'
          : name === 'pixel'
            ? 'desktop'
            : name === 'rip'
              ? 'workshop'
              : 'greenhouse'
    const file =
      name === 'dusty'
        ? 'dusty-idle.png'
        : name === 'mira'
          ? 'mira-idle.png'
          : name === 'pixel'
            ? 'pixel-idle.png'
            : name === 'rip'
              ? 'rip-idle.png'
              : 'sprout-idle.png'
    return `${base}art/${slug}/${file}`
  }
  return `${base}art/buddies/${name}.png`
}

/** Painted idle/lineup PNG first; SVG fallback if the file is missing. */
export function PaintedBuddyArt({ name, watering, idle, theme, className, fallback }: PaintedBuddyArtProps) {
  const [usePainted, setUsePainted] = useState(true)
  if (!usePainted) return fallback
  return (
    <img
      className={className}
      src={buddySrc(name, watering, idle, theme)}
      alt=""
      draggable={false}
      onError={() => setUsePainted(false)}
    />
  )
}

export { THEME_BUDDY_ART }
