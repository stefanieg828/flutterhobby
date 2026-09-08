/** Placeholder basement room skin — CSS/SVG only, not final art. */
export function BasementDecor() {
  return (
    <div className="bm-decor" aria-hidden="true">
      <div className="bm-decor__gloom" />
      <div className="bm-decor__beam" />

      <svg className="bm-decor__walls" viewBox="0 0 400 560" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bmWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3228" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2a241c" stopOpacity="0.2" />
          </linearGradient>
          <pattern id="bmBrick" width="40" height="20" patternUnits="userSpaceOnUse">
            <rect width="40" height="20" fill="transparent" />
            <path d="M0 19 H40" stroke="#5a4a3a" strokeWidth="1" opacity="0.35" />
            <path d="M20 0 V20" stroke="#5a4a3a" strokeWidth="1" opacity="0.25" />
          </pattern>
        </defs>
        <rect x="4" y="4" width="392" height="552" rx="16" fill="url(#bmWall)" stroke="#6a5a48" strokeWidth="6" />
        <rect x="10" y="10" width="380" height="540" rx="12" fill="url(#bmBrick)" opacity="0.55" />
        {/* pipes */}
        <rect x="28" y="40" width="10" height="200" rx="3" fill="#5a6a70" stroke="#3d2e1f" strokeWidth="1.5" opacity="0.7" />
        <rect x="22" y="80" width="22" height="8" rx="2" fill="#8a9aa8" stroke="#3d2e1f" strokeWidth="1.2" opacity="0.7" />
        <rect x="360" y="60" width="10" height="160" rx="3" fill="#5a6a70" stroke="#3d2e1f" strokeWidth="1.5" opacity="0.65" />
        {/* cobweb corners */}
        <path d="M20 20 Q40 28 48 48" stroke="#c4b49a" strokeWidth="1" fill="none" opacity="0.35" />
        <path d="M20 28 Q32 34 40 48" stroke="#c4b49a" strokeWidth="0.8" fill="none" opacity="0.28" />
        <path d="M380 20 Q360 28 352 48" stroke="#c4b49a" strokeWidth="1" fill="none" opacity="0.35" />
      </svg>

      {/* hanging bulbs */}
      <svg className="bm-decor__bulbs" viewBox="0 0 360 50">
        <defs>
          <filter id="bmGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M20 8 Q90 28 180 10 T340 12" stroke="#6a5a48" strokeWidth="1.5" fill="none" />
        {[
          [60, 18],
          [140, 22],
          [220, 14],
          [300, 20],
        ].map(([cx, cy], i) => (
          <g key={i} filter="url(#bmGlow)">
            <line x1={cx} y1={8} x2={cx} y2={cy} stroke="#6a5a48" strokeWidth="1.2" />
            <ellipse cx={cx} cy={Number(cy) + 8} rx="6" ry="8" fill="#ffe9a0" opacity="0.85" />
            <ellipse cx={cx} cy={Number(cy) + 6} rx="3" ry="3.5" fill="#fffef8" opacity="0.7" />
          </g>
        ))}
      </svg>

      {/* dusty crates stacked in corners */}
      <svg className="bm-decor__crates bm-decor__crates--left" viewBox="0 0 70 90">
        <rect x="8" y="40" width="48" height="36" rx="2" fill="#8a7040" stroke="#3d2e1f" strokeWidth="1.8" opacity="0.7" />
        <rect x="14" y="18" width="40" height="28" rx="2" fill="#a08050" stroke="#3d2e1f" strokeWidth="1.6" opacity="0.65" />
        <line x1="14" y1="32" x2="54" y2="32" stroke="#3d2e1f" strokeWidth="1" opacity="0.4" />
      </svg>
      <svg className="bm-decor__crates bm-decor__crates--right" viewBox="0 0 70 90">
        <rect x="12" y="48" width="46" height="30" rx="2" fill="#7a6038" stroke="#3d2e1f" strokeWidth="1.8" opacity="0.65" />
        <rect x="18" y="28" width="36" height="26" rx="2" fill="#9a7850" stroke="#3d2e1f" strokeWidth="1.6" opacity="0.6" />
      </svg>

      <div className="bm-decor__floor" />
    </div>
  )
}
