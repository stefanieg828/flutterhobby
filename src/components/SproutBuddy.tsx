import './SproutBuddy.css'

interface SproutBuddyProps {
  message?: string
  /** larger scene placement without speech card chrome */
  scene?: boolean
  /** hide speech bubble entirely — message lives elsewhere in the room */
  quiet?: boolean
  /** mid-scene watering pose with tipped can */
  watering?: boolean
}

export function SproutBuddy({
  message,
  scene = false,
  quiet = false,
  watering = false,
}: SproutBuddyProps) {
  const showBubble = Boolean(message) && !quiet
  const classes = [
    'sprout-buddy',
    scene ? 'sprout-buddy--scene' : '',
    quiet ? 'sprout-buddy--quiet' : '',
    watering ? 'sprout-buddy--watering' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes} aria-label="Sprout, your greenhouse buddy">
      <div className="sprout-buddy__avatar" aria-hidden="true">
        <svg viewBox="0 0 140 150" width="140" height="150" role="img">
          <ellipse cx="62" cy="140" rx="36" ry="7" fill="#c5d9b8" opacity="0.5" />
          {/* wings */}
          <ellipse
            cx="28"
            cy="78"
            rx="18"
            ry="24"
            fill="#f2d6e4"
            stroke="#2a4030"
            strokeWidth="2"
            transform="rotate(-18 28 78)"
          />
          <ellipse
            cx="100"
            cy="78"
            rx="18"
            ry="24"
            fill="#f2d6e4"
            stroke="#2a4030"
            strokeWidth="2"
            transform="rotate(18 100 78)"
          />
          <ellipse
            cx="28"
            cy="78"
            rx="9"
            ry="13"
            fill="#fce8f2"
            opacity="0.85"
            transform="rotate(-18 28 78)"
          />
          <ellipse
            cx="100"
            cy="78"
            rx="9"
            ry="13"
            fill="#fce8f2"
            opacity="0.85"
            transform="rotate(18 100 78)"
          />
          {/* body */}
          <ellipse cx="64" cy="96" rx="34" ry="32" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2.4" />
          <ellipse cx="64" cy="104" rx="20" ry="15" fill="#b58dcc" opacity="0.55" />
          {/* hands */}
          <ellipse cx="30" cy="100" rx="10" ry="8" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2" />
          <ellipse cx="98" cy="98" rx="10" ry="8" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2" />
          {/* feet */}
          <ellipse cx="48" cy="124" rx="10" ry="8" fill="#8d67b8" stroke="#2a4030" strokeWidth="2" />
          <ellipse cx="80" cy="124" rx="10" ry="8" fill="#8d67b8" stroke="#2a4030" strokeWidth="2" />
          {/* bushy tail */}
          <path
            d="M94 116 Q112 120 108 132 Q100 138 92 128"
            fill="#8d67b8"
            stroke="#2a4030"
            strokeWidth="2"
          />
          <path
            d="M98 122 Q108 124 106 130"
            stroke="#b58dcc"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* head */}
          <circle cx="64" cy="58" r="30" fill="#a67bc4" stroke="#2a4030" strokeWidth="2.4" />
          <circle cx="38" cy="48" r="7.5" fill="#a67bc4" stroke="#2a4030" strokeWidth="2" />
          <circle cx="90" cy="48" r="7.5" fill="#a67bc4" stroke="#2a4030" strokeWidth="2" />
          {/* head sprout */}
          <path
            d="M64 32 C64 22 64 14 64 8"
            stroke="#3d6b42"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx="50"
            cy="12"
            rx="12"
            ry="7.5"
            fill="#7cb87c"
            stroke="#2a4030"
            strokeWidth="1.8"
            transform="rotate(-28 50 12)"
          />
          <ellipse
            cx="78"
            cy="10"
            rx="11"
            ry="7"
            fill="#8fbc8f"
            stroke="#2a4030"
            strokeWidth="1.8"
            transform="rotate(30 78 10)"
          />
          <ellipse
            cx="50"
            cy="12"
            rx="5"
            ry="3"
            fill="#9fd49f"
            opacity="0.7"
            transform="rotate(-28 50 12)"
          />
          {/* face */}
          <ellipse cx="52" cy="56" rx="8" ry="9" fill="#1a1a1a" />
          <ellipse cx="76" cy="56" rx="8" ry="9" fill="#1a1a1a" />
          <circle cx="55" cy="52" r="2.6" fill="#fff" />
          <circle cx="79" cy="52" r="2.6" fill="#fff" />
          <circle cx="49" cy="58" r="1.3" fill="#fff" opacity="0.85" />
          <circle cx="73" cy="58" r="1.3" fill="#fff" opacity="0.85" />
          <path
            d="M56 70 Q64 76 72 70"
            stroke="#2a4030"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="40" cy="64" r="4.5" fill="#e8a0b0" opacity="0.55" />
          <circle cx="88" cy="64" r="4.5" fill="#e8a0b0" opacity="0.55" />
          {/* watering can — larger when watering */}
          {quiet || watering ? (
            <g
              transform={
                watering
                  ? 'translate(92 78) rotate(-28) scale(0.78)'
                  : 'translate(86 100) scale(0.52)'
              }
            >
              <path
                d="M8 12 L42 12 L39 42 Q24 50 10 42 Z"
                fill="#6aaa6a"
                stroke="#2a4030"
                strokeWidth="2.5"
              />
              <rect
                x="4"
                y="6"
                width="42"
                height="9"
                rx="2"
                fill="#7cb87c"
                stroke="#2a4030"
                strokeWidth="2.5"
              />
              <path
                d="M42 10 C56 6 60 24 50 30"
                stroke="#2a4030"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M50 30 L60 40"
                stroke="#2a4030"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M24 24 C22 22 18 22 18 26 C18 29 24 34 24 34 C24 34 30 29 30 26 C30 22 26 22 24 24 Z"
                fill="#e8a0b0"
                stroke="#2a4030"
                strokeWidth="1.3"
              />
              {watering ? (
                <g fill="#7eb8da" opacity="0.9">
                  <ellipse cx="66" cy="48" rx="2.2" ry="3.5" transform="rotate(25 66 48)" />
                  <ellipse cx="74" cy="56" rx="1.8" ry="3" transform="rotate(18 74 56)" />
                  <ellipse cx="58" cy="54" rx="1.6" ry="2.6" transform="rotate(30 58 54)" />
                </g>
              ) : null}
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
