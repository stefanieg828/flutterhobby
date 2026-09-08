import './SproutBuddy.css'

interface SproutBuddyProps {
  message?: string
  /** larger scene placement without speech card chrome */
  scene?: boolean
  /** hide speech bubble entirely — message lives elsewhere in the room */
  quiet?: boolean
}

export function SproutBuddy({ message, scene = false, quiet = false }: SproutBuddyProps) {
  const showBubble = Boolean(message) && !quiet

  return (
    <aside
      className={`sprout-buddy${scene ? ' sprout-buddy--scene' : ''}${quiet ? ' sprout-buddy--quiet' : ''}`}
      aria-label="Sprout, your greenhouse buddy"
    >
      <div className="sprout-buddy__avatar" aria-hidden="true">
        <svg viewBox="0 0 120 140" width="120" height="140" role="img">
          <ellipse cx="60" cy="128" rx="34" ry="7" fill="#c5d9b8" opacity="0.55" />
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
          <ellipse cx="60" cy="88" rx="32" ry="30" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2.4" />
          <ellipse cx="60" cy="96" rx="18" ry="14" fill="#b58dcc" opacity="0.55" />
          <ellipse cx="28" cy="92" rx="9" ry="7" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2" />
          <ellipse cx="92" cy="92" rx="9" ry="7" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2" />
          <ellipse cx="46" cy="116" rx="9" ry="7" fill="#8d67b8" stroke="#2a4030" strokeWidth="2" />
          <ellipse cx="74" cy="116" rx="9" ry="7" fill="#8d67b8" stroke="#2a4030" strokeWidth="2" />
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
          <circle cx="60" cy="58" r="28" fill="#a67bc4" stroke="#2a4030" strokeWidth="2.4" />
          <circle cx="36" cy="48" r="7" fill="#a67bc4" stroke="#2a4030" strokeWidth="2" />
          <circle cx="84" cy="48" r="7" fill="#a67bc4" stroke="#2a4030" strokeWidth="2" />
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
          <ellipse cx="48" cy="56" rx="7.5" ry="8.5" fill="#1a1a1a" />
          <ellipse cx="72" cy="56" rx="7.5" ry="8.5" fill="#1a1a1a" />
          <circle cx="51" cy="52" r="2.4" fill="#fff" />
          <circle cx="75" cy="52" r="2.4" fill="#fff" />
          <circle cx="46" cy="58" r="1.2" fill="#fff" opacity="0.85" />
          <circle cx="70" cy="58" r="1.2" fill="#fff" opacity="0.85" />
          <path
            d="M52 68 Q60 74 68 68"
            stroke="#2a4030"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="38" cy="64" r="4" fill="#e8a0b0" opacity="0.55" />
          <circle cx="82" cy="64" r="4" fill="#e8a0b0" opacity="0.55" />
          {/* tiny watering can in quiet scene mode */}
          {quiet ? (
            <g transform="translate(78 95) scale(0.55)">
              <path d="M8 10 L36 10 L34 34 Q22 40 10 34 Z" fill="#6aaa6a" stroke="#2a4030" strokeWidth="2.5" />
              <rect x="4" y="4" width="36" height="8" rx="2" fill="#7cb87c" stroke="#2a4030" strokeWidth="2.5" />
              <path d="M36 8 C48 6 50 20 42 24" stroke="#2a4030" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </g>
          ) : null}
        </svg>
      </div>
      {showBubble ? (
        <div className="sprout-buddy__bubble">
          <p className="sprout-buddy__name">Sprout</p>
          <p className="sprout-buddy__msg">{message}</p>
        </div>
      ) : null}
    </aside>
  )
}
