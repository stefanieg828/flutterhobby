import type { HobbyStatus, PlantColor } from '../types'

export type DesktopShape = 'folder' | 'sticky' | 'doc' | 'window' | 'stack' | 'drive'

const FILLS: Record<PlantColor, { body: string; rim: string; accent: string }> = {
  sage: { body: '#7a9a78', rim: '#5a7a58', accent: '#9fbc8f' },
  blush: { body: '#e8a0b0', rim: '#c4788a', accent: '#f2d6e4' },
  sky: { body: '#7eb8da', rim: '#5a8fb0', accent: '#b8d8ec' },
  honey: { body: '#e6b84d', rim: '#b8892a', accent: '#f5d76e' },
  lavender: { body: '#b39bc8', rim: '#8a6fa0', accent: '#d4c4e0' },
  terracotta: { body: '#c47a5a', rim: '#a86348', accent: '#e0a888' },
}

const SHAPES: DesktopShape[] = ['folder', 'sticky', 'doc', 'window', 'stack', 'drive']

export function desktopShapeForId(id: string, status?: HobbyStatus): DesktopShape {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  if (status === 'resting') return h % 2 === 0 ? 'sticky' : 'doc'
  if (status === 'proud-shelf') return h % 2 === 0 ? 'window' : 'folder'
  if (status === 'archive') return 'drive'
  return SHAPES[h % SHAPES.length]
}

interface Props {
  shape: DesktopShape
  color?: PlantColor
  size?: number
  className?: string
  heart?: boolean
}

function Body({ shape, fill }: { shape: DesktopShape; fill: { body: string; rim: string; accent: string } }) {
  switch (shape) {
    case 'folder':
      return (
        <g>
          <path d="M22 40 L38 40 L44 48 L78 48 L78 86 L22 86 Z" fill={fill.body} stroke="#2a3028" strokeWidth="2" />
          <path d="M22 48 L78 48 L78 40 L48 40 L42 34 L22 34 Z" fill={fill.rim} stroke="#2a3028" strokeWidth="1.8" />
          <rect x="30" y="58" width="28" height="4" rx="1" fill={fill.accent} opacity="0.8" />
        </g>
      )
    case 'sticky':
      return (
        <g>
          <rect x="28" y="34" width="44" height="52" rx="2" fill={fill.accent} stroke="#2a3028" strokeWidth="2" />
          <path d="M28 34 L72 34 L66 42 L28 42 Z" fill={fill.body} stroke="#2a3028" strokeWidth="1.4" opacity="0.85" />
          <line x1="36" y1="54" x2="64" y2="54" stroke="#2a3028" strokeWidth="1.2" opacity="0.35" />
          <line x1="36" y1="62" x2="60" y2="62" stroke="#2a3028" strokeWidth="1.2" opacity="0.3" />
          <line x1="36" y1="70" x2="58" y2="70" stroke="#2a3028" strokeWidth="1.2" opacity="0.25" />
        </g>
      )
    case 'doc':
      return (
        <g>
          <path d="M32 28 L60 28 L72 40 L72 88 L32 88 Z" fill="#fffef8" stroke="#2a3028" strokeWidth="2" />
          <path d="M60 28 L60 40 L72 40 Z" fill={fill.rim} stroke="#2a3028" strokeWidth="1.5" />
          <rect x="40" y="50" width="24" height="3" rx="1" fill={fill.body} />
          <rect x="40" y="58" width="20" height="3" rx="1" fill={fill.accent} opacity="0.8" />
          <rect x="40" y="66" width="22" height="3" rx="1" fill={fill.body} opacity="0.7" />
        </g>
      )
    case 'window':
      return (
        <g>
          <rect x="22" y="30" width="56" height="58" rx="4" fill={fill.body} stroke="#2a3028" strokeWidth="2" />
          <rect x="22" y="30" width="56" height="12" rx="4" fill={fill.rim} stroke="#2a3028" strokeWidth="1.6" />
          <circle cx="30" cy="36" r="2.5" fill="#e8a0b0" />
          <circle cx="38" cy="36" r="2.5" fill="#e6b84d" />
          <circle cx="46" cy="36" r="2.5" fill="#7cb87c" />
          <rect x="28" y="48" width="44" height="32" rx="2" fill="#fffef8" stroke="#2a3028" strokeWidth="1.3" opacity="0.9" />
        </g>
      )
    case 'stack':
      return (
        <g>
          <rect x="26" y="56" width="48" height="28" rx="2" fill={fill.rim} stroke="#2a3028" strokeWidth="1.8" transform="rotate(-4 50 70)" />
          <rect x="28" y="44" width="48" height="28" rx="2" fill={fill.body} stroke="#2a3028" strokeWidth="1.8" transform="rotate(3 52 58)" />
          <rect x="30" y="34" width="48" height="28" rx="2" fill={fill.accent} stroke="#2a3028" strokeWidth="2" />
          <line x1="38" y1="46" x2="70" y2="46" stroke="#2a3028" strokeWidth="1.1" opacity="0.35" />
        </g>
      )
    case 'drive':
      return (
        <g>
          <rect x="24" y="42" width="52" height="36" rx="4" fill={fill.body} stroke="#2a3028" strokeWidth="2" />
          <rect x="30" y="50" width="28" height="8" rx="1" fill="#2a3028" opacity="0.35" />
          <circle cx="66" cy="60" r="5" fill={fill.accent} stroke="#2a3028" strokeWidth="1.3" />
          <rect x="40" y="66" width="16" height="4" rx="1" fill={fill.rim} />
        </g>
      )
  }
}

export function DesktopObjectIllustration({
  shape,
  color = 'honey',
  size = 72,
  className,
  heart = false,
}: Props) {
  const fill = FILLS[color] ?? FILLS.honey
  return (
    <svg className={className} viewBox="0 0 100 110" width={size} height={size * 1.1} aria-hidden="true">
      <ellipse cx="50" cy="102" rx="24" ry="5" fill="#5a6a70" opacity="0.25" />
      <Body shape={shape} fill={fill} />
      {heart ? (
        <path
          d="M50 94 C48 92 44 92 44 95 C44 98 50 102 50 102 C50 102 56 98 56 95 C56 92 52 92 50 94 Z"
          fill="#fffef8"
          stroke="#2a3028"
          strokeWidth="1.2"
        />
      ) : null}
    </svg>
  )
}
