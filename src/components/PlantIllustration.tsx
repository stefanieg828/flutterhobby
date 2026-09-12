import { useState } from 'react'
import type { HobbyStatus, PlantColor } from '../types'
import './PlantIllustration.css'

export type PlantShape = 'fern' | 'bloom' | 'sprout' | 'bush' | 'cactus' | 'vine'

type PotStyle = 'terracotta' | 'ceramic' | 'wicker' | 'glass' | 'heart'

const POT_PALETTE: Record<
  PlantColor,
  { body: string; rim: string; soil: string; glaze?: string; style: PotStyle }
> = {
  sage: { body: '#8fbc8f', rim: '#6a9a6a', soil: '#5c4a3a', glaze: '#b8d8b0', style: 'ceramic' },
  blush: { body: '#e8a0b0', rim: '#c4788a', soil: '#5c4a3a', glaze: '#f5c8d0', style: 'ceramic' },
  sky: { body: '#7eb8da', rim: '#5a8fb0', soil: '#5c4a3a', glaze: '#b0d8f0', style: 'ceramic' },
  honey: { body: '#e6b84d', rim: '#b8892a', soil: '#5c4a3a', glaze: '#f5d878', style: 'ceramic' },
  lavender: { body: '#b39bc8', rim: '#8a6fa0', soil: '#5c4a3a', glaze: '#d0bce0', style: 'ceramic' },
  terracotta: { body: '#c47a5a', rim: '#a86348', soil: '#5c4a3a', style: 'terracotta' },
}

const SHAPES: PlantShape[] = ['fern', 'bloom', 'sprout', 'bush', 'cactus', 'vine']

/** Stable hash → plant shape so shelves look varied without storing shape. */
export function plantShapeForId(id: string, status?: HobbyStatus): PlantShape {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  if (status === 'resting') return h % 2 === 0 ? 'sprout' : 'vine'
  if (status === 'proud-shelf') return h % 2 === 0 ? 'bloom' : 'bush'
  if (status === 'archive') return 'cactus'
  return SHAPES[h % SHAPES.length]
}

/** Stable hash → painted pot sprite index 1..8 (Greenhouse PNGs). */
export function plantSpriteIndexForId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return (h % 8) + 1
}

export function plantPaintedSrcForId(id: string): string {
  const n = String(plantSpriteIndexForId(id)).padStart(2, '0')
  return `${import.meta.env.BASE_URL}art/greenhouse/plants/plant-${n}.png`
}

function potStyleFor(id: string | undefined, color: PlantColor, status?: HobbyStatus): PotStyle {
  if (status === 'proud-shelf') return 'heart'
  if (status === 'resting') {
    let h = 0
    const s = id ?? color
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
    return h % 2 === 0 ? 'glass' : 'wicker'
  }
  if (color === 'terracotta') return 'terracotta'
  let h = 0
  const s = id ?? color
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  const styles: PotStyle[] = ['terracotta', 'ceramic', 'wicker', 'ceramic']
  return styles[h % styles.length]
}

interface PlantIllustrationProps {
  shape: PlantShape
  color?: PlantColor
  size?: number
  className?: string
  heart?: boolean
  /** optional id for pot-style variation / painted sprite hash */
  plantId?: string
  status?: HobbyStatus
  /** Prefer painted Greenhouse plant-01..08 PNGs when plantId is set */
  painted?: boolean
}

function Foliage({ shape }: { shape: PlantShape }) {
  switch (shape) {
    case 'fern':
      return (
        <g>
          <path d="M50 58 C48 38 28 24 18 16" stroke="#3d6b42" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M50 58 C52 36 72 22 82 14" stroke="#3d6b42" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M50 58 C50 40 50 26 50 12" stroke="#4a7a4e" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M50 50 C36 44 30 36 26 28" stroke="#4a7a4e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M50 50 C64 42 70 34 74 26" stroke="#4a7a4e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* layered leaves with soft highlight */}
          <ellipse cx="18" cy="16" rx="11" ry="6.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.7" transform="rotate(-38 18 16)" />
          <ellipse cx="18" cy="16" rx="5" ry="2.5" fill="#b8e8b0" opacity="0.55" transform="rotate(-38 18 16)" />
          <ellipse cx="82" cy="14" rx="11" ry="6.5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.7" transform="rotate(38 82 14)" />
          <ellipse cx="82" cy="14" rx="5" ry="2.5" fill="#c8f0c0" opacity="0.5" transform="rotate(38 82 14)" />
          <ellipse cx="34" cy="30" rx="10" ry="6" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.6" transform="rotate(-24 34 30)" />
          <ellipse cx="66" cy="28" rx="10" ry="6" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.6" transform="rotate(26 66 28)" />
          <ellipse cx="42" cy="42" rx="8" ry="5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.5" transform="rotate(-15 42 42)" />
          <ellipse cx="58" cy="40" rx="8" ry="5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.5" transform="rotate(18 58 40)" />
          <ellipse cx="50" cy="12" rx="9" ry="5.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.7" />
          <ellipse cx="50" cy="12" rx="4" ry="2" fill="#d0f0c8" opacity="0.55" />
        </g>
      )
    case 'bloom':
      return (
        <g>
          <path d="M50 62 L50 30" stroke="#3d6b42" strokeWidth="2.8" strokeLinecap="round" />
          <ellipse cx="38" cy="44" rx="8" ry="13" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.7" transform="rotate(-28 38 44)" />
          <ellipse cx="62" cy="44" rx="8" ry="13" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.7" transform="rotate(28 62 44)" />
          <ellipse cx="38" cy="44" rx="3" ry="6" fill="#9fd49f" opacity="0.5" transform="rotate(-28 38 44)" />
          {/* multi-petal flower cluster */}
          <circle cx="50" cy="22" r="13" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1.9" />
          <circle cx="40" cy="18" r="8.5" fill="#f0b8c4" stroke="#2a4030" strokeWidth="1.5" />
          <circle cx="60" cy="18" r="8.5" fill="#f0b8c4" stroke="#2a4030" strokeWidth="1.5" />
          <circle cx="50" cy="12" r="8" fill="#f5c8d0" stroke="#2a4030" strokeWidth="1.5" />
          <circle cx="44" cy="26" r="6.5" fill="#e890a8" stroke="#2a4030" strokeWidth="1.3" />
          <circle cx="56" cy="26" r="6.5" fill="#e890a8" stroke="#2a4030" strokeWidth="1.3" />
          <circle cx="50" cy="22" r="5" fill="#e6b84d" stroke="#2a4030" strokeWidth="1.4" />
          <circle cx="50" cy="22" r="2.2" fill="#fff4c8" opacity="0.8" />
          {/* tiny side bud */}
          <circle cx="68" cy="36" r="4" fill="#f0b8c4" stroke="#2a4030" strokeWidth="1.2" />
          <ellipse cx="68" cy="40" rx="2.5" ry="4" fill="#7cb87c" stroke="#2a4030" strokeWidth="1" />
        </g>
      )
    case 'sprout':
      return (
        <g>
          <path d="M50 64 C50 48 50 38 50 28" stroke="#4a7a4e" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <ellipse cx="38" cy="32" rx="13" ry="7.5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.8" transform="rotate(-30 38 32)" />
          <ellipse cx="38" cy="32" rx="6" ry="3" fill="#c8f0c0" opacity="0.55" transform="rotate(-30 38 32)" />
          <ellipse cx="62" cy="30" rx="12" ry="7" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.8" transform="rotate(32 62 30)" />
          <ellipse cx="62" cy="30" rx="5.5" ry="2.5" fill="#b8e8b0" opacity="0.55" transform="rotate(32 62 30)" />
          {/* tiny new leaf tip */}
          <ellipse cx="50" cy="22" rx="5" ry="3.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.3" />
        </g>
      )
    case 'bush':
      return (
        <g>
          <ellipse cx="50" cy="40" rx="26" ry="20" fill="#6aaa6a" stroke="#2a4030" strokeWidth="2" />
          <ellipse cx="32" cy="34" rx="14" ry="12" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.6" />
          <ellipse cx="68" cy="34" rx="14" ry="12" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.6" />
          <ellipse cx="50" cy="24" rx="13" ry="11" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.6" />
          <ellipse cx="42" cy="44" rx="10" ry="8" fill="#5a9a5a" stroke="#2a4030" strokeWidth="1.3" opacity="0.7" />
          {/* soft leaf highlights */}
          <ellipse cx="36" cy="30" rx="5" ry="4" fill="#b8e8b0" opacity="0.45" />
          <ellipse cx="54" cy="22" rx="5" ry="3.5" fill="#d0f0c8" opacity="0.4" />
          {/* berries / blooms */}
          <circle cx="40" cy="38" r="2.8" fill="#c47a5a" stroke="#2a4030" strokeWidth="1" />
          <circle cx="60" cy="42" r="2.5" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1" />
          <circle cx="50" cy="30" r="2.3" fill="#e6b84d" stroke="#2a4030" strokeWidth="1" />
          <circle cx="70" cy="36" r="2" fill="#b39bc8" stroke="#2a4030" strokeWidth="1" />
        </g>
      )
    case 'cactus':
      return (
        <g>
          <rect x="43" y="26" width="14" height="38" rx="7" fill="#7cb87c" stroke="#2a4030" strokeWidth="2" />
          <rect x="46" y="30" width="3" height="28" rx="1" fill="#b8e8b0" opacity="0.4" />
          <path d="M43 46 C28 46 26 34 30 28" stroke="#7cb87c" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M57 50 C72 50 74 38 70 32" stroke="#7cb87c" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M43 46 C28 46 26 34 30 28" stroke="#2a4030" strokeWidth="1.7" fill="none" strokeLinecap="round" />
          <path d="M57 50 C72 50 74 38 70 32" stroke="#2a4030" strokeWidth="1.7" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="22" r="4.5" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1.4" />
          <circle cx="50" cy="22" r="1.8" fill="#fff4c8" opacity="0.7" />
        </g>
      )
    case 'vine':
      return (
        <g>
          <path
            d="M50 62 C40 50 60 40 42 28 C34 20 48 14 50 8"
            stroke="#4a7a4e"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="42" cy="50" rx="7.5" ry="5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.5" transform="rotate(-42 42 50)" />
          <ellipse cx="56" cy="40" rx="7.5" ry="5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.5" transform="rotate(38 56 40)" />
          <ellipse cx="40" cy="28" rx="7" ry="4.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.5" transform="rotate(-28 40 28)" />
          <ellipse cx="54" cy="16" rx="6.5" ry="4" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.5" transform="rotate(22 54 16)" />
          <ellipse cx="48" cy="8" rx="5" ry="3.5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.3" />
          {/* tiny dormant bud */}
          <circle cx="58" cy="34" r="2.2" fill="#c47a5a" stroke="#2a4030" strokeWidth="0.9" opacity="0.7" />
        </g>
      )
  }
}

function Pot({
  style,
  body,
  rim,
  soil,
  glaze,
  heart,
}: {
  style: PotStyle
  body: string
  rim: string
  soil: string
  glaze?: string
  heart: boolean
}) {
  if (style === 'glass') {
    return (
      <g>
        <ellipse cx="50" cy="102" rx="26" ry="5" fill="#c5d9b8" opacity="0.3" />
        {/* glass jar */}
        <path
          d="M28 58 L30 96 Q50 106 70 96 L72 58 Z"
          fill="#c8e0e8"
          fillOpacity="0.55"
          stroke="#2a4030"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M32 64 L34 90" stroke="#fffef8" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
        <ellipse cx="50" cy="58" rx="24" ry="6" fill="#a8c8d0" stroke="#2a4030" strokeWidth="2" />
        <ellipse cx="50" cy="60" rx="20" ry="4" fill={soil} opacity="0.75" />
        {/* metal lid ring */}
        <rect x="26" y="52" width="48" height="8" rx="2" fill="#c4ad8c" stroke="#2a4030" strokeWidth="1.8" />
        <rect x="28" y="54" width="44" height="3" rx="1" fill="#e8d4b0" opacity="0.5" />
      </g>
    )
  }

  if (style === 'wicker') {
    return (
      <g>
        <ellipse cx="50" cy="102" rx="28" ry="5" fill="#c5d9b8" opacity="0.3" />
        {/* woven basket */}
        <path
          d="M22 60 L28 98 Q50 108 72 98 L78 60 Z"
          fill="#c4a878"
          stroke="#2a4030"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* weave lines */}
        <path d="M26 68 Q50 74 74 68" stroke="#8a6840" strokeWidth="1.3" fill="none" opacity="0.55" />
        <path d="M27 76 Q50 82 73 76" stroke="#8a6840" strokeWidth="1.3" fill="none" opacity="0.5" />
        <path d="M28 84 Q50 90 72 84" stroke="#8a6840" strokeWidth="1.3" fill="none" opacity="0.45" />
        <path d="M36 62 L40 96" stroke="#a88858" strokeWidth="1.1" fill="none" opacity="0.4" />
        <path d="M50 62 L50 100" stroke="#a88858" strokeWidth="1.1" fill="none" opacity="0.35" />
        <path d="M64 62 L60 96" stroke="#a88858" strokeWidth="1.1" fill="none" opacity="0.4" />
        <ellipse cx="50" cy="60" rx="30" ry="7" fill="#d4b890" stroke="#2a4030" strokeWidth="2" />
        <ellipse cx="50" cy="62" rx="24" ry="4.5" fill={soil} opacity="0.85" />
        {/* handle hint */}
        <path d="M22 60 Q14 48 22 42" stroke="#8a6840" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M78 60 Q86 48 78 42" stroke="#8a6840" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>
    )
  }

  if (style === 'heart') {
    return (
      <g>
        <ellipse cx="50" cy="102" rx="26" ry="5" fill="#c5d9b8" opacity="0.3" />
        <ellipse cx="50" cy="62" rx="28" ry="7" fill={rim} stroke="#2a4030" strokeWidth="2" />
        <path
          d="M24 62 L30 96 Q50 104 70 96 L76 62 Z"
          fill={body}
          stroke="#2a4030"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse cx="50" cy="64" rx="24" ry="5" fill={soil} opacity="0.85" />
        <path d="M34 70 L36 88" stroke="#fffef8" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        {/* decorative heart on pot */}
        <path
          d="M50 78 C48 76 44 76 44 79 C44 82 50 86 50 86 C50 86 56 82 56 79 C56 76 52 76 50 78 Z"
          fill="#fffef8"
          stroke="#2a4030"
          strokeWidth="1.3"
        />
        {/* little star accent */}
        <path
          d="M64 72 L65 69 L66 72 L69 73 L66 74 L65 77 L64 74 L61 73 Z"
          fill="#ffe9a0"
          stroke="#c4a24e"
          strokeWidth="0.7"
        />
      </g>
    )
  }

  // terracotta or ceramic default
  const isTerra = style === 'terracotta'
  return (
    <g>
      <ellipse cx="50" cy="102" rx="26" ry="5" fill="#c5d9b8" opacity="0.35" />
      <ellipse cx="50" cy="62" rx="28" ry="7" fill={rim} stroke="#2a4030" strokeWidth="2" />
      <path
        d="M24 62 L30 96 Q50 104 70 96 L76 62 Z"
        fill={body}
        stroke="#2a4030"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* terracotta banding / ceramic glaze sheen */}
      {isTerra ? (
        <>
          <path d="M27 78 Q50 84 73 78" stroke="#a86348" strokeWidth="2" fill="none" opacity="0.45" />
          <path d="M28 86 Q50 91 72 86" stroke="#a86348" strokeWidth="1.5" fill="none" opacity="0.35" />
        </>
      ) : glaze ? (
        <path d="M34 70 L38 90" stroke={glaze} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      ) : null}
      <ellipse cx="50" cy="64" rx="24" ry="5" fill={soil} opacity="0.85" />
      <path d="M34 70 L36 88" stroke="#fffef8" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      {heart ? (
        <path
          d="M50 78 C48 76 44 76 44 79 C44 82 50 86 50 86 C50 86 56 82 56 79 C56 76 52 76 50 78 Z"
          fill="#fffef8"
          stroke="#2a4030"
          strokeWidth="1.2"
        />
      ) : null}
    </g>
  )
}

export function PlantIllustration({
  shape,
  color = 'sage',
  size = 72,
  className,
  heart = false,
  plantId,
  status,
  /** Prefer painted Greenhouse pot sprites when plantId is known. */
  painted = true,
}: PlantIllustrationProps) {
  const [usePainted, setUsePainted] = useState(Boolean(painted && plantId))
  const pot = POT_PALETTE[color] ?? POT_PALETTE.sage
  const style = potStyleFor(plantId, color, status ?? (heart ? 'proud-shelf' : undefined))
  const paintedSrc = plantId ? plantPaintedSrcForId(plantId) : null
  const showHeart = heart || style === 'heart' || status === 'proud-shelf'
  const statusClass =
    status === 'resting'
      ? 'plant-painted--resting'
      : status === 'archive'
        ? 'plant-painted--archive'
        : status === 'proud-shelf'
          ? 'plant-painted--proud'
          : ''

  if (usePainted && paintedSrc) {
    return (
      <span
        className={['plant-painted', statusClass, className].filter(Boolean).join(' ')}
        style={{ width: size, height: size * 1.1 }}
        aria-hidden="true"
      >
        <img
          className="plant-painted__img"
          src={paintedSrc}
          alt=""
          draggable={false}
          onError={() => setUsePainted(false)}
        />
        {showHeart ? <span className="plant-painted__heart" /> : null}
      </span>
    )
  }

  return (
    <svg
      className={className}
      viewBox="0 0 100 110"
      width={size}
      height={size * 1.1}
      aria-hidden="true"
    >
      <Foliage shape={shape} />
      <Pot
        style={style}
        body={pot.body}
        rim={pot.rim}
        soil={pot.soil}
        glaze={pot.glaze}
        heart={heart || style === 'heart'}
      />
    </svg>
  )
}
