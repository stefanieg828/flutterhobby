/** Placeholder workshop room skin — CSS/SVG only, not final art. */
export function WorkshopDecor() {
  return (
    <div className="ws-decor" aria-hidden="true">
      <div className="ws-decor__dust" />
      <div className="ws-decor__lamp" />

      <svg className="ws-decor__walls" viewBox="0 0 400 560" preserveAspectRatio="none">
        <defs>
          <pattern id="wsPeg" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="2.2" fill="#5c4a3a" opacity="0.35" />
          </pattern>
        </defs>
        <rect x="4" y="4" width="392" height="552" rx="14" fill="#c4ad8c" fillOpacity="0.15" stroke="#8a7040" strokeWidth="6" />
        <rect x="24" y="40" width="70" height="200" fill="url(#wsPeg)" opacity="0.7" stroke="#8a7040" strokeWidth="2" />
        <rect x="306" y="40" width="70" height="200" fill="url(#wsPeg)" opacity="0.7" stroke="#8a7040" strokeWidth="2" />
        {/* tools on pegboard */}
        <line x1="40" y1="70" x2="40" y2="110" stroke="#5a6a70" strokeWidth="3" />
        <rect x="34" y="60" width="12" height="10" rx="1" fill="#8a9aa8" stroke="#3d2e1f" strokeWidth="1.2" />
        <path d="M340 80 L360 100 L350 110 L330 90 Z" fill="#c47a5a" stroke="#3d2e1f" strokeWidth="1.4" opacity="0.7" />
      </svg>

      <svg className="ws-decor__lights" viewBox="0 0 360 50">
        <line x1="40" y1="8" x2="40" y2="28" stroke="#5c4a3a" strokeWidth="2" />
        <line x1="180" y1="4" x2="180" y2="24" stroke="#5c4a3a" strokeWidth="2" />
        <line x1="320" y1="8" x2="320" y2="28" stroke="#5c4a3a" strokeWidth="2" />
        <ellipse cx="40" cy="34" rx="14" ry="8" fill="#ffe9a0" opacity="0.75" />
        <ellipse cx="180" cy="30" rx="16" ry="9" fill="#ffe9a0" opacity="0.8" />
        <ellipse cx="320" cy="34" rx="14" ry="8" fill="#ffe9a0" opacity="0.75" />
      </svg>

      <div className="ws-decor__floor" />
    </div>
  )
}
