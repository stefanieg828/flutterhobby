import { PaintedBuddyArt } from './PaintedBuddyArt'
import './RipBuddy.css'

interface RipBuddyProps {
  message?: string
  scene?: boolean
  quiet?: boolean
  tending?: boolean
}

export function RipBuddy({ message, scene = false, quiet = false, tending = false }: RipBuddyProps) {
  const showBubble = Boolean(message) && !quiet
  const classes = [
    'rip-buddy',
    scene ? 'rip-buddy--scene' : '',
    quiet ? 'rip-buddy--quiet' : '',
    tending ? 'rip-buddy--tending' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes} aria-label="Rip, your workshop buddy">
      <div className="rip-buddy__avatar" aria-hidden="true">
        <PaintedBuddyArt
          name="rip"
          className="rip-buddy__painted"
          fallback={<svg viewBox="0 0 140 170" width="140" height="165" role="img">
          <ellipse cx="64" cy="160" rx="34" ry="6" fill="#3a3228" opacity="0.4" />

          {/* overalls body — tall */}
          <ellipse cx="64" cy="108" rx="30" ry="36" fill="#6a8a9a" stroke="#2a3028" strokeWidth="2.4" />
          <path d="M44 88 L54 88 L54 140 L44 140 Z" fill="#4a6a7a" stroke="#2a3028" strokeWidth="1.5" />
          <path d="M74 88 L84 88 L84 140 L74 140 Z" fill="#4a6a7a" stroke="#2a3028" strokeWidth="1.5" />
          <rect x="52" y="96" width="24" height="18" rx="2" fill="#c4ad8c" stroke="#2a3028" strokeWidth="1.5" />

          {/* arms */}
          <ellipse cx="32" cy="108" rx="10" ry="8" fill="#c47a5a" stroke="#2a3028" strokeWidth="2" />
          <ellipse cx="96" cy="106" rx="10" ry="8" fill="#c47a5a" stroke="#2a3028" strokeWidth="2" />

          {/* boots */}
          <ellipse cx="50" cy="146" rx="11" ry="8" fill="#5c4a3a" stroke="#2a3028" strokeWidth="2" />
          <ellipse cx="78" cy="146" rx="11" ry="8" fill="#5c4a3a" stroke="#2a3028" strokeWidth="2" />

          {/* head — taller neck, NO plant */}
          <rect x="58" y="58" width="12" height="14" rx="2" fill="#c47a5a" stroke="#2a3028" strokeWidth="1.5" />
          <circle cx="64" cy="48" r="24" fill="#d09070" stroke="#2a3028" strokeWidth="2.4" />
          {/* goggles */}
          <rect x="44" y="40" width="40" height="16" rx="4" fill="#8a9aa8" stroke="#2a3028" strokeWidth="1.8" />
          <circle cx="54" cy="48" r="6" fill="#7eb8da" stroke="#2a3028" strokeWidth="1.4" opacity="0.85" />
          <circle cx="74" cy="48" r="6" fill="#7eb8da" stroke="#2a3028" strokeWidth="1.4" opacity="0.85" />
          <circle cx="56" cy="46" r="2" fill="#fffef8" opacity="0.7" />
          <circle cx="76" cy="46" r="2" fill="#fffef8" opacity="0.7" />
          <path d="M58 62 Q64 66 70 62" stroke="#2a3028" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* hammer prop */}
          <g transform={tending ? 'translate(98 78) rotate(-28) scale(0.95)' : 'translate(94 108) rotate(-8) scale(0.6)'}>
            <rect x="10" y="0" width="8" height="36" rx="1" fill="#8a7040" stroke="#2a3028" strokeWidth="1.6" />
            <rect x="0" y="0" width="28" height="14" rx="2" fill="#8a9aa8" stroke="#2a3028" strokeWidth="1.8" />
          </g>
        </svg>}
        />
      </div>
      {showBubble ? (
        <div className="rip-buddy__bubble">
          <p className="rip-buddy__name">Rip</p>
          <p className="rip-buddy__msg">{message}</p>
        </div>
      ) : null}
    </aside>
  )
}
