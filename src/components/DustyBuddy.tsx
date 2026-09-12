import { PaintedBuddyArt } from './PaintedBuddyArt'
import './DustyBuddy.css'

interface DustyBuddyProps {
  message?: string
  scene?: boolean
  quiet?: boolean
  /** mid-scene dusting / flashlight pose */
  tending?: boolean
}

export function DustyBuddy({
  message,
  scene = false,
  quiet = false,
  tending = false,
}: DustyBuddyProps) {
  const showBubble = Boolean(message) && !quiet
  const classes = [
    'dusty-buddy',
    scene ? 'dusty-buddy--scene' : '',
    quiet ? 'dusty-buddy--quiet' : '',
    tending ? 'dusty-buddy--tending' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes} aria-label="Dusty, your basement buddy">
      <div className="dusty-buddy__avatar" aria-hidden="true">
        <PaintedBuddyArt
          name="dusty"
          className="dusty-buddy__painted"
          fallback={<svg viewBox="0 0 140 150" width="140" height="150" role="img">
          <defs>
            <radialGradient id="dustyBeam" cx="20%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#ffe9a0" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#f5d76e" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f5d76e" stopOpacity="0" />
            </radialGradient>
            <filter id="dustyFuzz" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur" />
              <feOffset dx="0" dy="0" result="off" />
              <feMerge>
                <feMergeNode in="off" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse cx="64" cy="140" rx="34" ry="6" fill="#3a3228" opacity="0.45" />

          {/* flashlight beam when tending */}
          {tending ? (
            <polygon points="108,92 138,70 138,130" fill="url(#dustyBeam)" />
          ) : null}

          {/* fuzzy moth wings */}
          <g filter="url(#dustyFuzz)">
            <ellipse
              cx="28"
              cy="78"
              rx="22"
              ry="28"
              fill="#c4b49a"
              stroke="#3d2e1f"
              strokeWidth="2"
              transform="rotate(-16 28 78)"
              opacity="0.95"
            />
            <ellipse
              cx="100"
              cy="78"
              rx="22"
              ry="28"
              fill="#b8a888"
              stroke="#3d2e1f"
              strokeWidth="2"
              transform="rotate(16 100 78)"
              opacity="0.95"
            />
            <ellipse
              cx="28"
              cy="78"
              rx="12"
              ry="16"
              fill="#d8c8a8"
              opacity="0.75"
              transform="rotate(-16 28 78)"
            />
            <ellipse
              cx="100"
              cy="78"
              rx="12"
              ry="16"
              fill="#d0c0a0"
              opacity="0.75"
              transform="rotate(16 100 78)"
            />
            {/* wing dust spots */}
            <circle cx="22" cy="70" r="2.2" fill="#8a7040" opacity="0.45" />
            <circle cx="34" cy="88" r="1.8" fill="#8a7040" opacity="0.4" />
            <circle cx="106" cy="72" r="2" fill="#8a7040" opacity="0.45" />
            <circle cx="94" cy="90" r="1.6" fill="#8a7040" opacity="0.4" />
          </g>

          {/* body */}
          <ellipse cx="64" cy="96" rx="30" ry="28" fill="#8a7a68" stroke="#3d2e1f" strokeWidth="2.4" />
          <ellipse cx="64" cy="102" rx="18" ry="14" fill="#a09078" opacity="0.55" />
          {/* fluff tufts */}
          <circle cx="42" cy="86" r="6" fill="#9a8a74" stroke="#3d2e1f" strokeWidth="1.2" />
          <circle cx="86" cy="86" r="6" fill="#9a8a74" stroke="#3d2e1f" strokeWidth="1.2" />
          <circle cx="64" cy="78" r="5" fill="#a89880" stroke="#3d2e1f" strokeWidth="1.1" />

          {/* hands */}
          <ellipse cx="34" cy="104" rx="9" ry="7" fill="#8a7a68" stroke="#3d2e1f" strokeWidth="2" />
          <ellipse cx="94" cy="102" rx="9" ry="7" fill="#8a7a68" stroke="#3d2e1f" strokeWidth="2" />

          {/* feet */}
          <ellipse cx="50" cy="124" rx="9" ry="7" fill="#6e5e4e" stroke="#3d2e1f" strokeWidth="2" />
          <ellipse cx="78" cy="124" rx="9" ry="7" fill="#6e5e4e" stroke="#3d2e1f" strokeWidth="2" />

          {/* head */}
          <circle cx="64" cy="56" r="26" fill="#9a8a74" stroke="#3d2e1f" strokeWidth="2.4" />
          {/* fuzzy antennae */}
          <path d="M52 34 Q44 18 38 12" stroke="#3d2e1f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M76 34 Q84 18 90 12" stroke="#3d2e1f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="38" cy="12" r="4" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1.5" />
          <circle cx="90" cy="12" r="4" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1.5" />

          {/* face */}
          <ellipse cx="54" cy="54" rx="6.5" ry="7.5" fill="#1a1a1a" />
          <ellipse cx="74" cy="54" rx="6.5" ry="7.5" fill="#1a1a1a" />
          <circle cx="56.5" cy="51" r="2.2" fill="#fff" />
          <circle cx="76.5" cy="51" r="2.2" fill="#fff" />
          <path
            d="M58 68 Q64 72 70 68"
            stroke="#3d2e1f"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="44" cy="62" r="3.5" fill="#c47a5a" opacity="0.4" />
          <circle cx="84" cy="62" r="3.5" fill="#c47a5a" opacity="0.4" />

          {/* flashlight */}
          <g
            transform={
              tending
                ? 'translate(96 88) rotate(-18) scale(0.85)'
                : 'translate(88 104) scale(0.55)'
            }
          >
            <rect x="0" y="8" width="28" height="14" rx="3" fill="#5a6a70" stroke="#3d2e1f" strokeWidth="2" />
            <rect x="28" y="4" width="14" height="22" rx="3" fill="#8a9aa8" stroke="#3d2e1f" strokeWidth="2" />
            <circle cx="42" cy="15" r="5" fill="#ffe9a0" stroke="#c4a24e" strokeWidth="1.4" />
            <circle cx="42" cy="15" r="2.5" fill="#fffef8" opacity="0.9" />
            <rect x="6" y="11" width="8" height="8" rx="1" fill="#3d4a40" stroke="#3d2e1f" strokeWidth="1" />
          </g>
        </svg>}
        />
      </div>
      {showBubble ? (
        <div className="dusty-buddy__bubble">
          <p className="dusty-buddy__name">Dusty</p>
          <p className="dusty-buddy__msg">{message}</p>
        </div>
      ) : null}
    </aside>
  )
}
