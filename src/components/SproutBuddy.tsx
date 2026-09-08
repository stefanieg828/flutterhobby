import './SproutBuddy.css'

interface SproutBuddyProps {
  message?: string
  /** larger scene placement without speech card chrome */
  scene?: boolean
}

export function SproutBuddy({ message, scene = false }: SproutBuddyProps) {
  return (
    <aside
      className={`sprout-buddy${scene ? ' sprout-buddy--scene' : ''}`}
      aria-label="Sprout, your greenhouse buddy"
    >
      <div className="sprout-buddy__avatar" aria-hidden="true">
        <svg viewBox="0 0 120 140" width="120" height="140" role="img">
          {/* soft ground shadow */}
          <ellipse cx="60" cy="128" rx="34" ry="7" fill="#c5d9b8" opacity="0.55" />
          {/* pale pink/lavender wings */}
          <ellipse
            cx="28"
            cy="72"
            rx="16"
            ry="22"
            fill="#f2d6e4"
            stroke="#2a4030"
            strokeWidth="2"
            transform="rotate(-18 28 72)"
          />
          <ellipse
            cx="92"
            cy="72"
            rx="16"
            ry="22"
            fill="#f2d6e4"
            stroke="#2a4030"
            strokeWidth="2"
            transform="rotate(18 92 72)"
          />
          <ellipse
            cx="28"
            cy="72"
            rx="8"
            ry="12"
            fill="#fce8f2"
            opacity="0.85"
            transform="rotate(-18 28 72)"
          />
          <ellipse
            cx="92"
            cy="72"
            rx="8"
            ry="12"
            fill="#fce8f2"
            opacity="0.85"
            transform="rotate(18 92 72)"
          />
          {/* body */}
          <ellipse cx="60" cy="88" rx="32" ry="30" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2.4" />
          {/* belly highlight */}
          <ellipse cx="60" cy="96" rx="18" ry="14" fill="#b58dcc" opacity="0.55" />
          {/* stubby arms */}
          <ellipse cx="28" cy="92" rx="9" ry="7" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2" />
          <ellipse cx="92" cy="92" rx="9" ry="7" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2" />
          {/* stubby legs */}
          <ellipse cx="46" cy="116" rx="9" ry="7" fill="#8d67b8" stroke="#2a4030" strokeWidth="2" />
          <ellipse cx="74" cy="116" rx="9" ry="7" fill="#8d67b8" stroke="#2a4030" strokeWidth="2" />
          {/* tiny tail */}
          <path
            d="M88 108 Q102 112 98 120"
            stroke="#8d67b8"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M88 108 Q102 112 98 120"
            stroke="#2a4030"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* head */}
          <circle cx="60" cy="58" r="28" fill="#a67bc4" stroke="#2a4030" strokeWidth="2.4" />
          {/* ears / nubs */}
          <circle cx="36" cy="48" r="7" fill="#a67bc4" stroke="#2a4030" strokeWidth="2" />
          <circle cx="84" cy="48" r="7" fill="#a67bc4" stroke="#2a4030" strokeWidth="2" />
          {/* sprout on head */}
          <path
            d="M60 34 C60 24 60 16 60 10"
            stroke="#3d6b42"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx="48"
            cy="14"
            rx="11"
            ry="7"
            fill="#7cb87c"
            stroke="#2a4030"
            strokeWidth="1.8"
            transform="rotate(-28 48 14)"
          />
          <ellipse
            cx="72"
            cy="12"
            rx="10"
            ry="6.5"
            fill="#8fbc8f"
            stroke="#2a4030"
            strokeWidth="1.8"
            transform="rotate(30 72 12)"
          />
          {/* sparkly eyes */}
          <ellipse cx="48" cy="56" rx="7.5" ry="8.5" fill="#1a1a1a" />
          <ellipse cx="72" cy="56" rx="7.5" ry="8.5" fill="#1a1a1a" />
          <circle cx="51" cy="52" r="2.4" fill="#fff" />
          <circle cx="75" cy="52" r="2.4" fill="#fff" />
          <circle cx="46" cy="58" r="1.2" fill="#fff" opacity="0.85" />
          <circle cx="70" cy="58" r="1.2" fill="#fff" opacity="0.85" />
          {/* smile */}
          <path
            d="M52 68 Q60 74 68 68"
            stroke="#2a4030"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* cheeks */}
          <circle cx="38" cy="64" r="4" fill="#e8a0b0" opacity="0.55" />
          <circle cx="82" cy="64" r="4" fill="#e8a0b0" opacity="0.55" />
        </svg>
      </div>
      {message ? (
        <div className="sprout-buddy__bubble">
          <p className="sprout-buddy__name">Sprout</p>
          <p className="sprout-buddy__msg">{message}</p>
        </div>
      ) : null}
    </aside>
  )
}
