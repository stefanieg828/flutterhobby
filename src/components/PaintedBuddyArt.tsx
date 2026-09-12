import { useState, type ReactNode } from 'react'

export type BuddyArtName = 'sprout' | 'dusty' | 'mira' | 'pixel' | 'rip'

interface PaintedBuddyArtProps {
  name: BuddyArtName
  /** Greenhouse watering pose (chroma-keyed sprout-water). */
  watering?: boolean
  className?: string
  fallback: ReactNode
}

function buddySrc(name: BuddyArtName, watering?: boolean): string {
  const base = import.meta.env.BASE_URL
  if (name === 'sprout' && watering) {
    return `${base}art/greenhouse/sprout-watering.png`
  }
  return `${base}art/buddies/${name}.png`
}

/** Painted lineup PNG first; SVG fallback if the file is missing. */
export function PaintedBuddyArt({ name, watering, className, fallback }: PaintedBuddyArtProps) {
  const [usePainted, setUsePainted] = useState(true)
  if (!usePainted) return fallback
  return (
    <img
      className={className}
      src={buddySrc(name, watering)}
      alt=""
      draggable={false}
      onError={() => setUsePainted(false)}
    />
  )
}
