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
  /**
   * How the sign is drawn (default `plaque`):
   * - plaque: one line (icon, label, count) in ink straight on a painted blank.
   * - compact: same ink, stacked — label (wrapping if needed) over icon + count —
   *   for blanks too narrow for one line.
   * - tag: its own small cream hang tag on a twine, for spots with no usable
   *   painted blank (matches the bench name tag).
   */
  signStyle?: SignStyle
}

export type SignStyle = 'plaque' | 'compact' | 'tag'

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
   * tag: small cream hang tag on a twine over bare furniture (no painted blank left).
   */
  labelOn: 'chalkboard' | 'plaque' | 'tag'
}

/**
 * Size of the hobby objects in rooms whose objects are drawn as SVG
 * illustrations (everything except Greenhouse's painted pots). Both numbers
 * scale with the room width (cqw), so objects keep their size relative to the
 * painted furniture at every screen size.
 */
export interface ObjectSize {
  /** Tile (tap target / slot) width, % of room width. */
  tile: number
  /** Extra zoom on the illustration, grown from where it rests (base or hook). */
  scale: number
}

export interface ThemeLayout {
  /** Omitted for Greenhouse, whose painted pots keep their stylesheet size. */
  objects?: ObjectSize
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

/** Sign centred on a painted plaque/tag at (x, y); optional max width (room %). */
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

  // Tall shelving unit (left): each group stands on a board with its sign on
  // the cream plaque hanging just under that board (name tags overlap the
  // plaque's top rim, so the sign sits low). Objects are capped by the plaque
  // above them, which limits how big they can draw here.
  // Workbench + lantern (right) under a hanging blank sign.
  Basement: {
    objects: { tile: 5.3, scale: 1.25 },
    leftColumn: FULL_LEFT_COLUMN,
    rightColumn: FULL_RIGHT_COLUMN,
    inSeason: {
      tier: FULL,
      bay: onLedge(20, 42),
      sign: onPlaque(19.55, 48.4),
    },
    resting: {
      tier: FULL,
      bay: onLedge(20, 61.5),
      sign: onPlaque(19.2, 70.6),
    },
    proud: {
      tier: FULL,
      bay: onLedge(28, 18.3),
      sign: onPlaque(19.7, 25.6, 8.2),
      signStyle: 'compact',
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

  // Wardrobe (left): looks hang on its two rails; each sign is a cream tag
  // hung on the rail's right-hand hook. Proud looks hang off the lit mirror
  // with their tag on the glass; the "+" stands on the vanity top.
  Closet: {
    objects: { tile: 4.6, scale: 1.3 },
    leftColumn: FULL_LEFT_COLUMN,
    rightColumn: FULL_RIGHT_COLUMN,
    inSeason: {
      tier: FULL,
      bay: onRail(16.3, 13),
      sign: onPlaque(28.2, 22.4),
      hang: true,
      signStyle: 'tag',
    },
    resting: {
      tier: FULL,
      bay: onRail(16.3, 42.2),
      sign: onPlaque(28.2, 49.6),
      hang: true,
      signStyle: 'tag',
    },
    proud: {
      tier: FULL,
      bay: onRail(81.5, 3.6),
      sign: onPlaque(81.5, 31.6),
      hang: true,
      signStyle: 'tag',
    },
    bench: {
      box: FULL,
      fab: standingOn(77.5, 50),
      label: centredAt(77.5, 57),
      labelOn: 'tag',
    },
    idle: IDLE_FLOOR,
    benchFallback: { x: 77.5, y: 46 },
  },

  // Two wall shelves (upper-left): In season + Resting stand on the top board,
  // above the two big cream frames that carry their signs. Proud pieces stand
  // on top of the monitor, with their sign on its screen. The "+" stands on the
  // sticky notes; the bench name sits on the filing card just below it.
  Desktop: {
    objects: { tile: 4.8, scale: 1.22 },
    leftColumn: FULL_LEFT_COLUMN,
    rightColumn: FULL_RIGHT_COLUMN,
    inSeason: {
      tier: FULL,
      bay: onLedge(8.8, 14.8),
      sign: onPlaque(9.3, 35.5),
    },
    resting: {
      tier: FULL,
      bay: onLedge(26.5, 14.8),
      sign: onPlaque(21, 35.5),
    },
    proud: {
      tier: FULL,
      bay: onLedge(77.5, 24.8),
      sign: onPlaque(78.5, 41),
    },
    bench: {
      box: FULL,
      fab: standingOn(86, 80),
      label: centredAt(84.6, 95.6),
      labelOn: 'plaque',
    },
    idle: IDLE_FLOOR,
    benchFallback: { x: 86, y: 76 },
  },

  // Pegboard shelf (upper-left): In season stands in front of its blank tags,
  // with a cream tag hung from the drawer knob below. Shavings crate
  // (bottom-left) holds Resting, tag over its label plate. Workbench + tool
  // rack (right) under the blank cream board that carries Proud.
  Workshop: {
    objects: { tile: 5.4, scale: 1.4 },
    leftColumn: FULL_LEFT_COLUMN,
    rightColumn: FULL_RIGHT_COLUMN,
    inSeason: {
      tier: FULL,
      bay: onLedge(10, 42.8),
      sign: onPlaque(17.4, 57.6),
      signStyle: 'tag',
    },
    resting: {
      tier: FULL,
      bay: onLedge(9, 79),
      sign: onPlaque(12.2, 88.4),
      signStyle: 'tag',
    },
    proud: {
      tier: FULL,
      bay: onLedge(79, 50.5),
      sign: onPlaque(78.7, 11.5, 6.2),
      signStyle: 'compact',
    },
    bench: {
      box: FULL,
      fab: standingOn(93.5, 59),
      label: centredAt(93.2, 67),
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
