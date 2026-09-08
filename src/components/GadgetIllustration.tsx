import type { HobbyStatus, PlantColor } from '../types'

export type GadgetShape = 'crate' | 'radio' | 'lamp' | 'toolbox' | 'jar' | 'spool'

const CRATE_FILLS: Record<PlantColor, { body: string; rim: string; accent: string }> = {
  sage: { body: '#7a9a78', rim: '#5a7a58', accent: '#9fbc8f' },
  blush: { body: '#c48898', rim: '#a06878', accent: '#e8a0b0' },
  sky: { body: '#6a98b8', rim: '#4a7898', accent: '#7eb8da' },
  honey: { body: '#c4a040', rim: '#a08028', accent: '#e6b84d' },
  lavender: { body: '#9278a8', rim: '#725888', accent: '#b39bc8' },
  terracotta: { body: '#a86848', rim: '#885038', accent: '#c47a5a' },
}

const SHAPES: GadgetShape[] = ['crate', 'radio', 'lamp', 'toolbox', 'jar', 'spool']

/** Stable hash → gadget shape so shelves look varied without storing shape. */
export function gadgetShapeForId(id: string, status?: HobbyStatus): GadgetShape {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  if (status === 'resting') return h % 2 === 0 ? 'jar' : 'spool'
  if (status === 'proud-shelf') return h % 2 === 0 ? 'lamp' : 'radio'
  if (status === 'archive') return 'crate'
  return SHAPES[h % SHAPES.length]
}

interface GadgetIllustrationProps {
  shape: GadgetShape
  color?: PlantColor
  size?: number
  className?: string
  heart?: boolean
}

function GadgetBody({ shape, fill }: { shape: GadgetShape; fill: { body: string; rim: string; accent: string } }) {
  switch (shape) {
    case 'crate':
      return (
        <g>
          <rect x="22" y="38" width="56" height="48" rx="3" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <rect x="22" y="38" width="56" height="10" rx="2" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.6" />
          <line x1="50" y1="48" x2="50" y2="86" stroke="#3d2e1f" strokeWidth="1.6" opacity="0.55" />
          <line x1="28" y1="62" x2="72" y2="62" stroke="#3d2e1f" strokeWidth="1.4" opacity="0.45" />
          <rect x="30" y="52" width="16" height="8" rx="1" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.1" opacity="0.85" />
          <rect x="54" y="68" width="14" height="10" rx="1" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1.1" />
        </g>
      )
    case 'radio':
      return (
        <g>
          <rect x="24" y="42" width="52" height="40" rx="4" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <rect x="30" y="48" width="22" height="14" rx="2" fill="#2a3028" stroke="#3d2e1f" strokeWidth="1.3" />
          <circle cx="64" cy="55" r="7" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.5" />
          <circle cx="64" cy="55" r="2.5" fill="#3d2e1f" />
          <rect x="32" y="68" width="8" height="6" rx="1" fill="#5a4a3a" stroke="#3d2e1f" strokeWidth="1" />
          <rect x="44" y="68" width="8" height="6" rx="1" fill="#5a4a3a" stroke="#3d2e1f" strokeWidth="1" />
          <path d="M40 42 L40 28 Q50 22 60 28 L60 42" stroke="#3d2e1f" strokeWidth="2" fill="none" />
          <circle cx="50" cy="26" r="3" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.2" />
        </g>
      )
    case 'lamp':
      return (
        <g>
          <path d="M36 48 L64 48 L58 72 L42 72 Z" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <ellipse cx="50" cy="48" rx="16" ry="5" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.6" />
          <rect x="46" y="72" width="8" height="14" rx="1" fill="#8a7a68" stroke="#3d2e1f" strokeWidth="1.5" />
          <ellipse cx="50" cy="88" rx="14" ry="4" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.5" />
          <circle cx="50" cy="40" r="4" fill="#ffe9a0" stroke="#c4a24e" strokeWidth="1.2" opacity="0.9" />
        </g>
      )
    case 'toolbox':
      return (
        <g>
          <rect x="20" y="48" width="60" height="36" rx="3" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <rect x="20" y="48" width="60" height="12" rx="2" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.6" />
          <path d="M38 48 L38 40 Q50 34 62 40 L62 48" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.6" />
          <rect x="44" y="58" width="12" height="8" rx="1" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1.2" />
          <line x1="28" y1="70" x2="72" y2="70" stroke="#3d2e1f" strokeWidth="1.2" opacity="0.4" />
        </g>
      )
    case 'jar':
      return (
        <g>
          <rect x="34" y="36" width="32" height="10" rx="2" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.6" />
          <path
            d="M30 46 L34 86 Q50 94 66 86 L70 46 Z"
            fill={fill.body}
            stroke="#3d2e1f"
            strokeWidth="2"
            opacity="0.85"
          />
          <ellipse cx="50" cy="46" rx="20" ry="5" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.4" opacity="0.7" />
          <path d="M38 58 L42 78" stroke="#fffef8" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
          <circle cx="50" cy="64" r="3" fill="#e6b84d" stroke="#3d2e1f" strokeWidth="1" />
        </g>
      )
    case 'spool':
      return (
        <g>
          <ellipse cx="50" cy="42" rx="22" ry="8" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.8" />
          <rect x="28" y="42" width="44" height="36" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <ellipse cx="50" cy="78" rx="22" ry="8" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.8" />
          <path
            d="M34 48 Q50 54 66 48 Q50 60 34 54 Q50 66 66 60"
            stroke={fill.accent}
            strokeWidth="2.2"
            fill="none"
            opacity="0.85"
          />
          <circle cx="50" cy="60" r="4" fill="#5c4a3a" stroke="#3d2e1f" strokeWidth="1.2" />
        </g>
      )
  }
}

export function GadgetIllustration({
  shape,
  color = 'sage',
  size = 72,
  className,
  heart = false,
}: GadgetIllustrationProps) {
  const fill = CRATE_FILLS[color] ?? CRATE_FILLS.sage
  return (
    <svg
      className={className}
      viewBox="0 0 100 110"
      width={size}
      height={size * 1.1}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="102" rx="26" ry="5" fill="#3a3228" opacity="0.35" />
      <GadgetBody shape={shape} fill={fill} />
      {heart ? (
        <path
          d="M50 92 C48 90 44 90 44 93 C44 96 50 100 50 100 C50 100 56 96 56 93 C56 90 52 90 50 92 Z"
          fill="#fffef8"
          stroke="#3d2e1f"
          strokeWidth="1.2"
        />
      ) : null}
    </svg>
  )
}
