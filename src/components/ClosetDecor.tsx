/** Placeholder closet room skin — CSS/SVG only, not final art. */
export function ClosetDecor() {
  return (
    <div className="cl-decor" aria-hidden="true">
      <div className="cl-decor__blush" />
      <div className="cl-decor__glow" />

      <svg className="cl-decor__walls" viewBox="0 0 400 560" preserveAspectRatio="none">
        <defs>
          <linearGradient id="clWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8e8f0" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#e8d0e0" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="392" height="552" rx="16" fill="url(#clWall)" stroke="#c4a0b8" strokeWidth="6" />
        <rect x="18" y="20" width="8" height="500" rx="2" fill="#d8b8d0" opacity="0.55" />
        <rect x="374" y="20" width="8" height="500" rx="2" fill="#d8b8d0" opacity="0.55" />
        {/* closet rod */}
        <line x1="40" y1="70" x2="360" y2="70" stroke="#8a7a68" strokeWidth="4" strokeLinecap="round" />
        <circle cx="40" cy="70" r="5" fill="#c4ad8c" stroke="#5a4060" strokeWidth="1.5" />
        <circle cx="360" cy="70" r="5" fill="#c4ad8c" stroke="#5a4060" strokeWidth="1.5" />
        {/* hanging empties */}
        {[80, 140, 200, 260, 320].map((x, i) => (
          <g key={i} opacity="0.35">
            <path d={`M${x} 70 L${x} 82`} stroke="#8a7a68" strokeWidth="1.5" />
            <path d={`M${x - 12} 88 Q${x} 80 ${x + 12} 88`} stroke="#8a7a68" strokeWidth="1.8" fill="none" />
          </g>
        ))}
      </svg>

      <svg className="cl-decor__lights" viewBox="0 0 360 40">
        <path d="M10 12 Q90 28 180 10 T350 14" stroke="#d8b8d0" strokeWidth="1.5" fill="none" />
        {[40, 100, 160, 220, 280, 330].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={16 + (i % 2) * 6} r="4" fill="#ffe9a0" opacity="0.85" />
            <circle cx={cx} cy={16 + (i % 2) * 6} r="2" fill="#fffef8" opacity="0.8" />
          </g>
        ))}
      </svg>

      <div className="cl-decor__floor" />
    </div>
  )
}
