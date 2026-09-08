import type { HobbyStatus, PlantColor } from '../types'

export type OutfitShape = 'dress' | 'scarf' | 'jacket' | 'tee' | 'skirt' | 'bag'

const FILLS: Record<PlantColor, { body: string; rim: string; accent: string }> = {
  sage: { body: '#7a9a78', rim: '#5a7a58', accent: '#9fbc8f' },
  blush: { body: '#e8a0b0', rim: '#c4788a', accent: '#f2d6e4' },
  sky: { body: '#7eb8da', rim: '#5a8fb0', accent: '#b8d8ec' },
  honey: { body: '#e6b84d', rim: '#b8892a', accent: '#f5d76e' },
  lavender: { body: '#b39bc8', rim: '#8a6fa0', accent: '#d4c4e0' },
  terracotta: { body: '#c47a5a', rim: '#a86348', accent: '#e0a888' },
}

const SHAPES: OutfitShape[] = ['dress', 'scarf', 'jacket', 'tee', 'skirt', 'bag']

export function outfitShapeForId(id: string, status?: HobbyStatus): OutfitShape {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  if (status === 'resting') return h % 2 === 0 ? 'tee' : 'scarf'
  if (status === 'proud-shelf') return h % 2 === 0 ? 'dress' : 'jacket'
  if (status === 'archive') return 'bag'
  return SHAPES[h % SHAPES.length]
}

interface Props {
  shape: OutfitShape
  color?: PlantColor
  size?: number
  className?: string
  heart?: boolean
}

function Body({ shape, fill }: { shape: OutfitShape; fill: { body: string; rim: string; accent: string } }) {
  const hanger = (
    <g>
      <path d="M50 18 Q50 10 58 10 Q64 10 64 16" stroke="#8a7a68" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M28 28 Q50 20 72 28" stroke="#8a7a68" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <line x1="50" y1="16" x2="50" y2="22" stroke="#8a7a68" strokeWidth="1.8" />
    </g>
  )

  switch (shape) {
    case 'dress':
      return (
        <g>
          {hanger}
          <path d="M36 30 L64 30 L70 86 Q50 96 30 86 Z" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <path d="M36 30 L30 42 L40 40 Z" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.4" />
          <path d="M64 30 L70 42 L60 40 Z" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.4" />
          <ellipse cx="50" cy="48" rx="6" ry="3" fill={fill.rim} opacity="0.7" />
        </g>
      )
    case 'scarf':
      return (
        <g>
          {hanger}
          <path
            d="M34 32 Q50 28 66 32 L62 48 Q50 44 38 48 Z"
            fill={fill.body}
            stroke="#3d2e1f"
            strokeWidth="2"
          />
          <path d="M40 48 Q36 70 32 88" stroke={fill.accent} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M60 48 Q64 70 68 88" stroke={fill.rim} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M38 56 Q50 52 62 56" stroke="#fffef8" strokeWidth="1.4" opacity="0.45" />
        </g>
      )
    case 'jacket':
      return (
        <g>
          {hanger}
          <path d="M32 30 L68 30 L74 78 L58 82 L50 58 L42 82 L26 78 Z" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <line x1="50" y1="34" x2="50" y2="58" stroke="#3d2e1f" strokeWidth="1.5" />
          <circle cx="46" cy="44" r="2" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1" />
          <circle cx="46" cy="52" r="2" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1" />
        </g>
      )
    case 'tee':
      return (
        <g>
          {hanger}
          <path d="M34 30 L66 30 L70 42 L62 40 L60 78 L40 78 L38 40 L30 42 Z" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <ellipse cx="50" cy="34" rx="8" ry="4" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.3" />
        </g>
      )
    case 'skirt':
      return (
        <g>
          {hanger}
          <path d="M38 30 L62 30 L72 82 Q50 90 28 82 Z" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <rect x="38" y="28" width="24" height="8" rx="2" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1.4" />
          <path d="M40 50 L44 74" stroke="#fffef8" strokeWidth="1.6" opacity="0.35" />
        </g>
      )
    case 'bag':
      return (
        <g>
          <path d="M40 34 Q50 24 60 34" stroke="#8a7a68" strokeWidth="2.2" fill="none" />
          <rect x="30" y="34" width="40" height="48" rx="4" fill={fill.body} stroke="#3d2e1f" strokeWidth="2" />
          <rect x="38" y="48" width="24" height="18" rx="2" fill={fill.accent} stroke="#3d2e1f" strokeWidth="1.3" />
          <circle cx="50" cy="42" r="2.5" fill={fill.rim} stroke="#3d2e1f" strokeWidth="1" />
        </g>
      )
  }
}

export function OutfitIllustration({
  shape,
  color = 'blush',
  size = 72,
  className,
  heart = false,
}: Props) {
  const fill = FILLS[color] ?? FILLS.blush
  return (
    <svg className={className} viewBox="0 0 100 110" width={size} height={size * 1.1} aria-hidden="true">
      <ellipse cx="50" cy="102" rx="24" ry="5" fill="#c4b49a" opacity="0.3" />
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
