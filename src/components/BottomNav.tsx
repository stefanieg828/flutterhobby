import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import './BottomNav.css'

/* Little hand-drawn-ish icons; stroke uses currentColor so the active state
   recolors them with the label. */
const icon = (children: ReactNode) => (
  <svg
    className="bottom-nav__icon"
    viewBox="0 0 24 24"
    width="22"
    height="22"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const icons = {
  home: icon(
    <>
      <path d="M3.5 11.2 12 4l8.5 7.2" />
      <path d="M5.8 9.6V19a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1V9.6" />
      <path d="M10 20v-4.6a2 2 0 0 1 4 0V20" />
    </>,
  ),
  collections: icon(
    <>
      <path d="M8 4.5h8l-.6 2.5H8.6z" />
      <path d="M7.2 7h9.6a1.4 1.4 0 0 1 1.4 1.5l-.8 9.9a1.8 1.8 0 0 1-1.8 1.6H8.4a1.8 1.8 0 0 1-1.8-1.6l-.8-9.9A1.4 1.4 0 0 1 7.2 7Z" />
      <path d="M12 16.6s-2.6-1.5-2.6-3.3a1.4 1.4 0 0 1 2.6-.8 1.4 1.4 0 0 1 2.6.8c0 1.8-2.6 3.3-2.6 3.3Z" />
    </>,
  ),
  solstice: icon(
    <>
      <circle cx="12" cy="12" r="3.9" />
      <path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5l1.5 1.5M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5" />
    </>,
  ),
  you: icon(
    <>
      <path d="M12 20.2s-7.4-4.4-7.4-9.8A4 4 0 0 1 12 7.6a4 4 0 0 1 7.4 2.8c0 5.4-7.4 9.8-7.4 9.8Z" />
    </>,
  ),
}

const tabs = [
  { to: '/', label: 'Home', icon: icons.home, end: true },
  { to: '/collections', label: 'Collections', icon: icons.collections },
  { to: '/solstice', label: 'Solstice', icon: icons.solstice },
  { to: '/you', label: 'You', icon: icons.you },
] as const

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <div className="bottom-nav__shelf">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={'end' in tab ? tab.end : false}
            className={({ isActive }) =>
              `bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`
            }
          >
            {tab.icon}
            <span className="bottom-nav__label">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
