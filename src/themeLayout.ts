import type { CSSProperties } from 'react'
import type { PlayableTheme } from './theme'

/**
 * Per-theme placement of the Home room overlays (hobby objects, their signs,
 * the bench "+" target, and the idle buddy) over each painted room-bg.png.
 *
 * All numbers are percentages. A `Place` maps 1:1 onto CSS `left/right/top/
 * bottom/width/height` of an absolutely positioned box, plus an optional
 * `translate(tx%, ty%)` of the box's own size. Sides that are left out become
 * `auto`; width/height that are left out fall back to the stylesheet.
 *
 * Greenhouse keeps the hand-tuned nested values from commit 62fed82 verbatim
 * (column → tier → bay/sign). The other rooms use full-room columns and tiers
 * so every value below them is simply "% of the room" measured off the PNG.
 */
export interface Place {
  left?: number
  right?: number
  top?: number
  bottom?: number
  width?: number
  height?: number
  tx?: number
  ty?: number
}

export interface ShelfGroupLayout {
  /** `.left-tier` / `.proud-unit` box, relative to its column. */
  tier: Place
  /** `.shelf-bay` row, relative to the tier. Objects are centred in it. */
  bay: Place
  /** `.wood-sign`, relative to the tier. */
  sign: Place
  /** Objects hang from the bay's top edge (closet rails) instead of standing on its bottom edge. */
  hang?: boolean
  /** Let the sign text wrap inside `sign.width` (narrow painted plaques/tags). */
  signWrap?: boolean
}

export interface BenchLayout {
  /** `.potting-bench` box (carry anchor), relative to the right column. */
  box: Place
  /** `.potting-bench__surface` holding the "+" FAB, relative to the bench box. */
  fab: Place
  /** `.potting-bench__legs` holding the bench name, relative to the bench box. */
  label: Place
  /**
   * chalkboard: light chalk text on a painted chalkboard (Greenhouse).
   * plaque: dark ink straight onto a blank painted plaque/sign/screen.
   * tag: small cream name tag pinned on bare furniture (no painted blank left).
   */
  labelOn: 'chalkboard' | 'plaque' | 'tag'
}

export interface ThemeLayout {
  leftColumn: Place
  rightColumn: Place
  inSeason: ShelfGroupLayout
  resting: ShelfGroupLayout
  proud: ShelfGroupLayout
  bench: BenchLayout
  /** Idle buddy anchor (room %); the actor is drawn with translate(-50%, -70%). */
  idle: { x: number; y: number }
  /** Carry target if the bench box can't be measured (room %). */
  benchFallback: { x: number; y: number }
}

const FULL: Place = { left: 0, right: 0, top: 0, bottom: 0 }
const FULL_LEFT_COLUMN: Place = { left: 0, top: 0, width: 100, height: 100 }
const FULL_RIGHT_COLUMN: Place = { right: 0, top: 0, width: 100, height: 100 }
/** Wide enough that three compact tiles never wrap at any supported width. */
const BAY_SPAN = 40
const BAY_HEIGHT = 24

/** Objects centred on x whose tiles stand with their base on a ledge at y. */
function onLedge(x: number, y: number): Place {
  return { left: x - BAY_SPAN / 2, width: BAY_SPAN, bottom: 100 - y, height: BAY_HEIGHT }
}

/** Objects centred on x whose tiles hang from a rail at y. */
function onRail(x: number, y: number): Place {
  return { left: x - BAY_SPAN / 2, width: BAY_SPAN, top: y, height: BAY_HEIGHT }
}

/** Sign centred on a painted plaque/tag at (x, y); width (room %) enables wrapping. */
function onPlaque(x: number, y: number, width?: number): Place {
  return { left: x, top: y, width, tx: -50, ty: -50 }
}

/** "+" FAB centred on x, standing on a surface at y. */
function standingOn(x: number, y: number): Place {
  return { left: x, top: y, tx: -50, ty: -100 }
}

function centredAt(x: number, y: number): Place {
  return { left: x, top: y, tx: -50, ty: -50 }
}

const IDLE_FLOOR = { x: 48, y: 76 }

export const THEME_LAYOUT: Record<PlayableTheme, ThemeLayout> = {
  // Hand-tuned to greenhouse/room-bg.png (62fed82) — keep verbatim.
  Greenhouse: {
    leftColumn: { left: 1, top: 0, width: 30, height: 100 },
    rightColumn: { right: 0.5, top: 0, width: 29, height: 100 },
    inSeason: {
      tier: { left: 2, right: 6, top: 24, height: 32 },
      bay: { left: 0, right: 0, top: 0, height: 60 },
      sign: { left: 50, top: 70, tx: -50 },
    },
    resting: {
      tier: { left: 2, right: 6, top: 62, height: 36 },
      bay: { left: 0, right: 0, top: 0, height: 52 },
      sign: { left: 50, top: 70, tx: -50 },
    },
    proud: {
      tier: { top: 1, left: 8, right: 1, height: 56 },
      bay: { left: 10, right: 10, top: 52, height: 40 },
      sign: { top: 14, left: 52, tx: -50 },
    },
    bench: {
      box: { left: 2, right: 1, top: 58, bottom: 1 },
      fab: { right: 30, top: 34 },
      label: { right: 12, top: 56 },
      labelOn: 'chalkboard',
    },
    idle: { x: 48, y: 76 },
    benchFallback: { x: 86, y: 78 },
  },

  // Tall shelving unit (left) with three cream plaques hanging off its boards;
  // workbench + lantern (right) under a hanging blank sign.
  Basement: {
    leftColumn: FULL_LEFT_COLUMN,
    rightColumn: FULL_RIGHT_COLUMN,
    inSeason: {
      tier: FULL,
      bay: onLedge(20, 42),
      sign: onPlaque(19.4, 49.5, 9),
      signWrap: true,
    },
    resting: {
      tier: FULL,
      bay: onLedge(20, 61.5),
      sign: onPlaque(19.2, 72, 9),
      signWrap: true,
    },
    proud: {
      tier: FULL,
      bay: onLedge(25.3, 18.3),
      sign: onPlaque(19.5, 27, 9),
      signWrap: true,
    },
    bench: {
      box: FULL,
      fab: standingOn(91.5, 56),
      label: centredAt(91.5, 12),
      labelOn: 'plaque',
    },
    idle: IDLE_FLOOR,
    benchFallback: { x: 91.5, y: 52 },
  },

  // Wardrobe (left): looks hang on its two rails, signs on the small plaques
  // along the top edge. Proud looks hang off the lit mirror frame under the
  // plaque above it; the "+" stands on the vanity top.
  Closet: {
    leftColumn: FULL_LEFT_COLUMN,
    rightColumn: FULL_RIGHT_COLUMN,
    inSeason: {
      tier: FULL,
      bay: onRail(17, 12),
      sign: onPlaque(15.2, 2.6, 11),
      hang: true,
      signWrap: true,
    },
    resting: {
      tier: FULL,
      bay: onRail(20, 39),
      sign: onPlaque(27.2, 2.6, 8.5),
      hang: true,
      signWrap: true,
    },
    proud: {
      tier: FULL,
      bay: onRail(80.5, 4.3),
      sign: onPlaque(89.5, 2.6, 11.5),
      hang: true,
      signWrap: true,
    },
    bench: {
      box: FULL,
      fab: standingOn(77.5, 50),
      label: centredAt(76, 56),
      labelOn: 'tag',
    },
    idle: IDLE_FLOOR,
    benchFallback: { x: 77.5, y: 46 },
  },

  // Two wall shelves (upper-left): In season + Proud stand on the top board
  // above the big cream frames / shield that carry their signs; Resting stands
  // on the lower board in front of the middle frame. Bench name on the monitor.
  Desktop: {
    leftColumn: FULL_LEFT_COLUMN,
    rightColumn: FULL_RIGHT_COLUMN,
    inSeason: {
      tier: FULL,
      bay: onLedge(10.5, 14.8),
      sign: onPlaque(9.3, 29.5, 8.5),
      signWrap: true,
    },
    resting: {
      tier: FULL,
      bay: onLedge(21, 48.3),
      sign: onPlaque(21, 29.5, 9),
      signWrap: true,
    },
    proud: {
      tier: FULL,
      bay: onLedge(31.5, 14.8),
      sign: onPlaque(31.5, 31, 7),
      signWrap: true,
    },
    bench: {
      box: FULL,
      fab: standingOn(86, 80),
      label: centredAt(77, 42),
      labelOn: 'plaque',
    },
    idle: IDLE_FLOOR,
    benchFallback: { x: 86, y: 76 },
  },

  // Pegboard shelf with blank tags (upper-left), shavings crate with a blank
  // label plate (bottom-left), workbench + tool rack (right) under a blank
  // hanging board.
  Workshop: {
    leftColumn: FULL_LEFT_COLUMN,
    rightColumn: FULL_RIGHT_COLUMN,
    inSeason: {
      tier: FULL,
      bay: onLedge(10, 42.8),
      sign: onPlaque(23.9, 36.5, 9.5),
      signWrap: true,
    },
    resting: {
      tier: FULL,
      bay: onLedge(9, 79),
      sign: onPlaque(12.2, 89, 9),
      signWrap: true,
    },
    proud: {
      tier: FULL,
      bay: onLedge(79, 50.5),
      sign: onPlaque(79.3, 10, 6.5),
      signWrap: true,
    },
    bench: {
      box: FULL,
      fab: standingOn(93.5, 59),
      label: centredAt(91.5, 66),
      labelOn: 'tag',
    },
    idle: IDLE_FLOOR,
    benchFallback: { x: 92, y: 56 },
  },
}

export function themeLayout(theme: PlayableTheme): ThemeLayout {
  return THEME_LAYOUT[theme]
}

const pct = (n: number | undefined): string => (n == null ? 'auto' : `${n}%`)

/** Inline style for a `Place` (sides default to auto; size/transform only when given). */
export function placeStyle(p: Place): CSSProperties {
  const style: CSSProperties = {
    left: pct(p.left),
    right: pct(p.right),
    top: pct(p.top),
    bottom: pct(p.bottom),
  }
  if (p.width != null) style.width = `${p.width}%`
  if (p.height != null) style.height = `${p.height}%`
  if (p.tx != null || p.ty != null) style.transform = `translate(${p.tx ?? 0}%, ${p.ty ?? 0}%)`
  return style
}
