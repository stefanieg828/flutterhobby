/** Placeholder desktop room skin — CSS/SVG only, not final art. */
export function DesktopDecor() {
  return (
    <div className="dk-decor" aria-hidden="true">
      <div className="dk-decor__wallpaper" />
      <div className="dk-decor__scan" />

      <svg className="dk-decor__walls" viewBox="0 0 400 560" preserveAspectRatio="none">
        <rect x="4" y="4" width="392" height="552" rx="12" fill="none" stroke="#5a6a70" strokeWidth="5" opacity="0.55" />
        {/* menu bar */}
        <rect x="16" y="16" width="368" height="22" rx="4" fill="#2a3028" opacity="0.55" />
        <circle cx="30" cy="27" r="4" fill="#e8a0b0" />
        <circle cx="42" cy="27" r="4" fill="#e6b84d" />
        <circle cx="54" cy="27" r="4" fill="#7cb87c" />
        <rect x="120" y="22" width="160" height="10" rx="3" fill="#fffef8" opacity="0.2" />
        {/* faint grid */}
        {[80, 160, 240, 320, 400, 480].map((y) => (
          <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="#7eb8da" strokeWidth="0.6" opacity="0.12" />
        ))}
      </svg>

      <svg className="dk-decor__icons" viewBox="0 0 80 200">
        <rect x="16" y="20" width="36" height="28" rx="3" fill="#e6b84d" stroke="#3d2e1f" strokeWidth="1.4" opacity="0.45" />
        <rect x="20" y="60" width="28" height="32" rx="2" fill="#7eb8da" stroke="#3d2e1f" strokeWidth="1.3" opacity="0.4" />
        <rect x="14" y="106" width="40" height="28" rx="2" fill="#e8a0b0" stroke="#3d2e1f" strokeWidth="1.3" opacity="0.4" />
      </svg>

      <div className="dk-decor__taskbar" />
      <div className="dk-decor__floor" />
    </div>
  )
}
