import './MiraBuddy.css'

interface MiraBuddyProps {
  message?: string
  scene?: boolean
  quiet?: boolean
  tending?: boolean
}

export function MiraBuddy({ message, scene = false, quiet = false, tending = false }: MiraBuddyProps) {
  const showBubble = Boolean(message) && !quiet
  const classes = [
    'mira-buddy',
    scene ? 'mira-buddy--scene' : '',
    quiet ? 'mira-buddy--quiet' : '',
    tending ? 'mira-buddy--tending' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes} aria-label="Mira, your closet buddy">
      <div className="mira-buddy__avatar" aria-hidden="true">
        <svg viewBox="0 0 140 150" width="140" height="150" role="img">
          <ellipse cx="64" cy="140" rx="32" ry="6" fill="#e8d4e0" opacity="0.55" />

          {/* soft scarf wings */}
          <ellipse cx="30" cy="80" rx="20" ry="26" fill="#f2d6e4" stroke="#5a4060" strokeWidth="2" transform="rotate(-14 30 80)" />
          <ellipse cx="98" cy="80" rx="20" ry="26" fill="#e8c8dc" stroke="#5a4060" strokeWidth="2" transform="rotate(14 98 80)" />
          <path d="M22 70 Q30 78 26 92" stroke="#fffef8" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M106 70 Q98 78 102 92" stroke="#fffef8" strokeWidth="2" fill="none" opacity="0.5" />

          {/* body — pastel fabric blob */}
          <ellipse cx="64" cy="98" rx="28" ry="26" fill="#d8b8d0" stroke="#5a4060" strokeWidth="2.3" />
          <ellipse cx="64" cy="104" rx="16" ry="12" fill="#e8d0e0" opacity="0.55" />

          {/* hands */}
          <ellipse cx="36" cy="106" rx="8" ry="6" fill="#e0c0d4" stroke="#5a4060" strokeWidth="1.8" />
          <ellipse cx="92" cy="104" rx="8" ry="6" fill="#e0c0d4" stroke="#5a4060" strokeWidth="1.8" />

          {/* feet */}
          <ellipse cx="52" cy="124" rx="8" ry="6" fill="#c4a0b8" stroke="#5a4060" strokeWidth="1.8" />
          <ellipse cx="76" cy="124" rx="8" ry="6" fill="#c4a0b8" stroke="#5a4060" strokeWidth="1.8" />

          {/* head */}
          <circle cx="64" cy="56" r="25" fill="#f0d8e8" stroke="#5a4060" strokeWidth="2.3" />

          {/* sparkly eyes */}
          <ellipse cx="54" cy="54" rx="6.5" ry="7.5" fill="#2a2030" />
          <ellipse cx="74" cy="54" rx="6.5" ry="7.5" fill="#2a2030" />
          <circle cx="56.5" cy="51" r="2.4" fill="#fff" />
          <circle cx="76.5" cy="51" r="2.4" fill="#fff" />
          <circle cx="52" cy="56" r="1.2" fill="#ffe9a0" />
          <circle cx="72" cy="56" r="1.2" fill="#ffe9a0" />
          <path d="M58 68 Q64 73 70 68" stroke="#5a4060" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="44" cy="62" r="3.2" fill="#e8a0b0" opacity="0.55" />
          <circle cx="84" cy="62" r="3.2" fill="#e8a0b0" opacity="0.55" />

          {/* hanger prop */}
          <g transform={tending ? 'translate(88 78) rotate(-12) scale(0.9)' : 'translate(82 100) scale(0.55)'}>
            <path d="M20 8 Q20 0 28 0 Q34 0 34 6" stroke="#8a7a68" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M4 16 Q20 8 36 16" stroke="#8a7a68" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M8 18 L32 18 L34 40 Q20 48 6 40 Z" fill="#b39bc8" stroke="#5a4060" strokeWidth="1.6" opacity="0.9" />
          </g>

          {/* steam wisps when tending */}
          {tending ? (
            <g fill="none" stroke="#c4b4d8" strokeWidth="1.4" opacity="0.7">
              <path d="M100 70 Q108 62 104 54" />
              <path d="M108 74 Q118 66 114 56" />
            </g>
          ) : null}
        </svg>
      </div>
      {showBubble ? (
        <div className="mira-buddy__bubble">
          <p className="mira-buddy__name">Mira</p>
          <p className="mira-buddy__msg">{message}</p>
        </div>
      ) : null}
    </aside>
  )
}
