import type { HobbyStatus, PlantColor } from '../types'

export type PlantShape = 'fern' | 'bloom' | 'sprout' | 'bush' | 'cactus' | 'vine'

const POT_FILLS: Record<PlantColor, { body: string; rim: string; soil: string }> = {
  sage: { body: '#8fbc8f', rim: '#6a9a6a', soil: '#5c4a3a' },
  blush: { body: '#e8a0b0', rim: '#c4788a', soil: '#5c4a3a' },
  sky: { body: '#7eb8da', rim: '#5a8fb0', soil: '#5c4a3a' },
  honey: { body: '#e6b84d', rim: '#b8892a', soil: '#5c4a3a' },
  lavender: { body: '#b39bc8', rim: '#8a6fa0', soil: '#5c4a3a' },
  terracotta: { body: '#c47a5a', rim: '#a86348', soil: '#5c4a3a' },
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

interface PlantIllustrationProps {
  shape: PlantShape
  color?: PlantColor
  size?: number
  className?: string
  heart?: boolean
}

function Foliage({ shape }: { shape: PlantShape }) {
  switch (shape) {
    case 'fern':
      return (
        <g>
          <path d="M50 58 C48 40 30 28 22 22" stroke="#3d6b42" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M50 58 C52 38 70 26 78 20" stroke="#3d6b42" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M50 58 C50 42 50 30 50 18" stroke="#4a7a4e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx="22" cy="22" rx="9" ry="5.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.6" transform="rotate(-35 22 22)" />
          <ellipse cx="78" cy="20" rx="9" ry="5.5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.6" transform="rotate(35 78 20)" />
          <ellipse cx="38" cy="32" rx="8" ry="5" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.6" transform="rotate(-20 38 32)" />
          <ellipse cx="62" cy="30" rx="8" ry="5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.6" transform="rotate(22 62 30)" />
          <ellipse cx="50" cy="18" rx="7" ry="4.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.6" />
        </g>
      )
    case 'bloom':
      return (
        <g>
          <path d="M50 60 L50 32" stroke="#3d6b42" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="40" cy="42" rx="7" ry="11" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.6" transform="rotate(-25 40 42)" />
          <ellipse cx="60" cy="42" rx="7" ry="11" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.6" transform="rotate(25 60 42)" />
          <circle cx="50" cy="24" r="11" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1.8" />
          <circle cx="42" cy="20" r="7" fill="#f0b8c4" stroke="#2a4030" strokeWidth="1.4" />
          <circle cx="58" cy="20" r="7" fill="#f0b8c4" stroke="#2a4030" strokeWidth="1.4" />
          <circle cx="50" cy="16" r="6.5" fill="#f5c8d0" stroke="#2a4030" strokeWidth="1.4" />
          <circle cx="50" cy="24" r="4" fill="#e6b84d" stroke="#2a4030" strokeWidth="1.3" />
        </g>
      )
    case 'sprout':
      return (
        <g>
          <path d="M50 62 C50 48 50 40 50 34" stroke="#4a7a4e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx="40" cy="36" rx="10" ry="6" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.6" transform="rotate(-28 40 36)" />
          <ellipse cx="60" cy="34" rx="9" ry="5.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.6" transform="rotate(30 60 34)" />
        </g>
      )
    case 'bush':
      return (
        <g>
          <ellipse cx="50" cy="40" rx="22" ry="18" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.8" />
          <ellipse cx="36" cy="34" rx="12" ry="10" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.5" />
          <ellipse cx="64" cy="34" rx="12" ry="10" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.5" />
          <ellipse cx="50" cy="26" rx="11" ry="9" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.5" />
          <circle cx="42" cy="38" r="2.2" fill="#c47a5a" stroke="#2a4030" strokeWidth="1" />
          <circle cx="58" cy="42" r="2" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1" />
          <circle cx="50" cy="32" r="1.8" fill="#e6b84d" stroke="#2a4030" strokeWidth="1" />
        </g>
      )
    case 'cactus':
      return (
        <g>
          <rect x="44" y="28" width="12" height="34" rx="6" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.8" />
          <path d="M44 44 C30 44 28 34 32 30" stroke="#7cb87c" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M56 48 C70 48 72 38 68 34" stroke="#7cb87c" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M44 44 C30 44 28 34 32 30" stroke="#2a4030" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M56 48 C70 48 72 38 68 34" stroke="#2a4030" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="24" r="3.5" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1.3" />
        </g>
      )
    case 'vine':
      return (
        <g>
          <path d="M50 60 C42 50 58 42 44 32 C38 26 48 20 50 16" stroke="#4a7a4e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="44" cy="48" rx="6" ry="4" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-40 44 48)" />
          <ellipse cx="54" cy="38" rx="6" ry="4" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.4" transform="rotate(35 54 38)" />
          <ellipse cx="42" cy="28" rx="5.5" ry="3.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-25 42 28)" />
          <ellipse cx="52" cy="18" rx="5" ry="3.2" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.4" transform="rotate(20 52 18)" />
        </g>
      )
  }
}

export function PlantIllustration({
  shape,
  color = 'sage',
  size = 72,
  className,
  heart = false,
}: PlantIllustrationProps) {
  const pot = POT_FILLS[color] ?? POT_FILLS.sage
  return (
    <svg
      className={className}
      viewBox="0 0 100 110"
      width={size}
      height={size * 1.1}
      aria-hidden="true"
    >
      <Foliage shape={shape} />
      {/* pot rim */}
      <ellipse cx="50" cy="62" rx="28" ry="7" fill={pot.rim} stroke="#2a4030" strokeWidth="2" />
      {/* pot body */}
      <path
        d="M24 62 L30 96 Q50 104 70 96 L76 62 Z"
        fill={pot.body}
        stroke="#2a4030"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* soil */}
      <ellipse cx="50" cy="64" rx="24" ry="5" fill={pot.soil} opacity="0.85" />
      {/* pot highlight */}
      <path d="M34 70 L36 88" stroke="#fffef8" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      {heart ? (
        <path
          d="M50 78 C48 76 44 76 44 79 C44 82 50 86 50 86 C50 86 56 82 56 79 C56 76 52 76 50 78 Z"
          fill="#fffef8"
          stroke="#2a4030"
          strokeWidth="1.2"
        />
      ) : null}
    </svg>
  )
}
