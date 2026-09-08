import './SproutBuddy.css'

interface SproutBuddyProps {
  message?: string
}

export function SproutBuddy({ message }: SproutBuddyProps) {
  return (
    <aside className="sprout-buddy" aria-label="Sprout, your greenhouse buddy">
      <div className="sprout-buddy__avatar" aria-hidden="true">
        <svg viewBox="0 0 80 90" width="72" height="80" role="img">
          <ellipse cx="40" cy="78" rx="22" ry="6" fill="#d4e8d0" />
          <path
            d="M40 72 C40 48 40 36 40 28"
            stroke="#5a8f6b"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="28" cy="34" rx="14" ry="9" fill="#8fbc8f" transform="rotate(-25 28 34)" />
          <ellipse cx="52" cy="32" rx="13" ry="8" fill="#7cb87c" transform="rotate(28 52 32)" />
          <circle cx="40" cy="52" r="14" fill="#f4e8c8" stroke="#d4b896" strokeWidth="2" />
          <circle cx="35" cy="50" r="2" fill="#3d5a45" />
          <circle cx="45" cy="50" r="2" fill="#3d5a45" />
          <path
            d="M35 57 Q40 61 45 57"
            stroke="#3d5a45"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="30" cy="54" r="3" fill="#f0b8a8" opacity="0.55" />
          <circle cx="50" cy="54" r="3" fill="#f0b8a8" opacity="0.55" />
        </svg>
      </div>
      <div className="sprout-buddy__bubble">
        <p className="sprout-buddy__name">Sprout</p>
        <p className="sprout-buddy__msg">
          {message ?? 'Your greenhouse is ready. Tap a plant to tend it on the bench.'}
        </p>
      </div>
    </aside>
  )
}
