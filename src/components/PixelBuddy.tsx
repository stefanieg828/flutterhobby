import './PixelBuddy.css'

interface PixelBuddyProps {
  message?: string
  scene?: boolean
  quiet?: boolean
  tending?: boolean
}

export function PixelBuddy({ message, scene = false, quiet = false, tending = false }: PixelBuddyProps) {
  const showBubble = Boolean(message) && !quiet
  const classes = [
    'pixel-buddy',
    scene ? 'pixel-buddy--scene' : '',
    quiet ? 'pixel-buddy--quiet' : '',
    tending ? 'pixel-buddy--tending' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes} aria-label="Pixel, your desktop buddy">
      <div className="pixel-buddy__avatar" aria-hidden="true">
        {/* shorter overall viewBox character */}
        <svg viewBox="0 0 140 130" width="140" height="120" role="img">
          <ellipse cx="64" cy="122" rx="30" ry="5" fill="#5a6a70" opacity="0.35" />

          {/* stubby folder body */}
          <path
            d="M28 48 L48 48 L54 56 L100 56 L100 104 L28 104 Z"
            fill="#e6b84d"
            stroke="#3d2e1f"
            strokeWidth="2.4"
          />
          <path
            d="M28 56 L100 56 L100 48 L62 48 L56 42 L28 42 Z"
            fill="#f5d76e"
            stroke="#3d2e1f"
            strokeWidth="2"
          />
          {/* pixel highlights */}
          <rect x="38" y="68" width="10" height="10" fill="#ffe9a0" stroke="#3d2e1f" strokeWidth="1.2" />
          <rect x="52" y="68" width="10" height="10" fill="#fffef8" stroke="#3d2e1f" strokeWidth="1.2" opacity="0.85" />
          <rect x="38" y="82" width="10" height="10" fill="#fffef8" stroke="#3d2e1f" strokeWidth="1.2" opacity="0.7" />
          <rect x="52" y="82" width="10" height="10" fill="#c4a040" stroke="#3d2e1f" strokeWidth="1.2" />

          {/* little arms */}
          <rect x="18" y="72" width="12" height="10" rx="2" fill="#e6b84d" stroke="#3d2e1f" strokeWidth="1.8" />
          <rect x="98" y="70" width="12" height="10" rx="2" fill="#e6b84d" stroke="#3d2e1f" strokeWidth="1.8" />

          {/* feet tabs */}
          <rect x="40" y="104" width="14" height="8" rx="2" fill="#c4a040" stroke="#3d2e1f" strokeWidth="1.6" />
          <rect x="72" y="104" width="14" height="8" rx="2" fill="#c4a040" stroke="#3d2e1f" strokeWidth="1.6" />

          {/* face on folder */}
          <rect x="66" y="66" width="8" height="10" rx="1" fill="#2a3028" />
          <rect x="82" y="66" width="8" height="10" rx="1" fill="#2a3028" />
          <rect x="68" y="67" width="3" height="3" fill="#7eb8da" />
          <rect x="84" y="67" width="3" height="3" fill="#7eb8da" />
          <path d="M70 88 Q78 94 86 88" stroke="#3d2e1f" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* cursor / save prop */}
          <g transform={tending ? 'translate(104 58) scale(0.95)' : 'translate(106 88) scale(0.55)'}>
            <path d="M0 0 L0 22 L6 16 L10 26 L14 24 L10 14 L18 14 Z" fill="#fffef8" stroke="#2a3028" strokeWidth="1.6" />
          </g>
        </svg>
      </div>
      {showBubble ? (
        <div className="pixel-buddy__bubble">
          <p className="pixel-buddy__name">Pixel</p>
          <p className="pixel-buddy__msg">{message}</p>
        </div>
      ) : null}
    </aside>
  )
}
