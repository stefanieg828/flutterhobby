import type { HobbyStatus, PlantColor } from '../types'

export type WorkshopShape = 'frame' | 'gear' | 'block' | 'peg' | 'clamp' | 'plank'

const FILLS: Record<PlantColor, { body: string; rim: string; accent: string }> = {
  sage: { body: '#7a9a78', rim: '#5a7a58', accent: '#9fbc8f' },
  blush: { body: '#c48898', rim: '#a06878', accent: '#e8a0b0' },
  sky: { body: '#6a98b8', rim: '#4a7898', accent: '#7eb8da' },
  honey: { body: '#c4a040', rim: '#a08028', accent: '#e6b84d' },
  lavender: { body: '#9278a8', rim: '#725888', accent: '#b39bc8' },
  terracotta: { body: '#a86848', rim: '#885038', accent: '#c47a5a' },
}

const SHAPES: WorkshopShape[] = ['frame', 'gear', 'block', 'peg', 'clamp', 'plank']

export function workshopShapeForId(id: string, status?: HobbyStatus): WorkshopShape {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  if (status === 'resting') return h % 2 === 0 ? 'block' : 'plank'
  if (status === 'proud-shelf') return h % 2 === 0 ? 'frame' : 'gear'
  if (status === 'archive') return 'peg'
  return SHAPES[h % SHAPES.length]
}

interface Props {
  shape: WorkshopShape
  color?: PlantColor
  size?: number
  className?: string
  heart?: boolean
}

function Body({ shape, fill }: { shape: WorkshopShape; fill: { body: string; rim: string; accent: string } }) {
  switch (shape) {
    case 'frame':
      return (
        <g>
          <rect x="24" y="28" width="52" height="58" rx="2" fill={fill.rim} stroke="#3d2e1f" strokeWidth="2" />
          <rect x="32" y="36" width="36" height="42" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.5" opacity="0.75" />
          <circle cx="28" cy="32" r="2" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1" />
          <circle cx="72" cy="32" r="2" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1" />
        </g>
      )
    case 'gear':
      return (
        <g>
          <circle cx="50" cy="58" r="22" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <circle cx="50" cy="58" r="8" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.5" />
          {[0, 45, 90, 135].map((deg) => (
            <rect
              key={deg}
              x="46"
              y="32"
              width="8"
              height="12"
              rx="1"
              fill={fill.rim}
              stroke="#3d2e1f"
              strokeWidth="1.2"
              transform={`rotate(${deg} 50 58)`}
            />
          ))}
        </g>
      )
    case 'block':
      return (
        <g>
          <rect x="28" y="48" width="44" height="36" rx="2" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <path d="M28 48 L40 36 L84 36 L72 48 Z" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.8" />
          <path d="M72 48 L84 36 L84 72 L72 84 Z" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.6" opacity="0.85" />
        </g>
      )
    case 'peg':
      return (
        <g>
          <rect x="22" y="34" width="56" height="48" rx="2" fill="#8a7a68" stroke="#3d2e1f" strokeWidth="2" opacity="0.55" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={34 + col * 16}
                cy={46 + row * 14}
                r="3.5"
                fill="#5c4a3a"
                stroke="#3d2e1f"
                strokeWidth="1"
              />
            )),
          )}
          <circle cx="50" cy="60" r="5" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.3" />
        </g>
      )
    case 'clamp':
      return (
        <g>
          <rect x="40" y="28" width="20" height="50" rx="2" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <rect x="28" y="30" width="44" height="10" rx="2" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.6" />
          <rect x="28" y="66" width="44" height="10" rx="2" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.6" />
          <circle cx="50" cy="52" r="5" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.3" />
        </g>
      )
    case 'plank':
      return (
        <g>
          <rect x="18" y="48" width="64" height="18" rx="2" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" transform="rotate(-12 50 57)" />
          <line x1="28" y1="50" x2="70" y2="42" stroke="#3d2e1f" strokeWidth="1.2" opacity="0.35" transform="rotate(-12 50 57)" />
          <circle cx="30" cy="62" r="3" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1" />
          <circle cx="70" cy="50" r="3" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1" />
        </g>
      )
  }
}

export function WorkshopPieceIllustration({
  shape,
  color = 'terracotta',
  size = 72,
  className,
  heart = false,
}: Props) {
  const fill = FILLS[color] ?? FILLS.terracotta
  return (
    <svg className={className} viewBox="0 0 100 110" width={size} height={size * 1.1} aria-hidden="true">
      <ellipse cx="50" cy="102" rx="26" ry="5" fill="#3a3228" opacity="0.3" />
      <Body shape={shape} fill={fill} />
      {heart ? (
        <path
          d="M50 94 C48 92 44 92 44 95 C44 98 50 102 50 102 C50 102 56 98 56 95 C56 92 52 92 50 94 Z"
          fill="#fffef8"
          stroke="#3d2e1f"
          strokeWidth="1.2"
        />
      ) : null}
    </svg>
  )
}
