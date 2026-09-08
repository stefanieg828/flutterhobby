import { THEMES, BUDDIES } from '../types'
import './Collections.css'

export function Collections() {
  return (
    <section className="page collections">
      <header className="page__header">
        <p className="eyebrow">Collections</p>
        <h1>Themes & buddies</h1>
        <p className="lede">
          Pick a vibe for your space. Buddies are placeholder companions for now — copy only, art later.
        </p>
      </header>

      <div className="collections__block">
        <h2>Themes</h2>
        <ul className="theme-list">
          {THEMES.map((theme) => (
            <li key={theme} className="theme-card">
              <span className="theme-card__name">{theme}</span>
              <span className="theme-card__badge">Coming soon</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="collections__block">
        <h2>Buddies</h2>
        <ul className="buddy-list">
          {BUDDIES.map((buddy) => (
            <li key={buddy.name} className="buddy-card">
              <strong>{buddy.name}</strong>
              <p>{buddy.vibe}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
