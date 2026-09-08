import { THEMES, BUDDIES } from '../types'
import { PLAYABLE_THEMES, themeBuddy, type PlayableTheme } from '../theme'
import { useTheme } from '../ThemeContext'
import './Collections.css'

export function Collections() {
  const { theme, setTheme } = useTheme()

  return (
    <section className="page collections">
      <header className="page__header">
        <p className="eyebrow">Collections</p>
        <h1>Themes & buddies</h1>
        <p className="lede">
          Switch your Home room anytime. Greenhouse and Basement are playable now — other skins
          stay on the shelf for later.
        </p>
      </header>

      <div className="collections__block">
        <h2>Themes</h2>
        <ul className="theme-list">
          {THEMES.map((name) => {
            const playable = (PLAYABLE_THEMES as readonly string[]).includes(name)
            const active = theme === name
            return (
              <li key={name} className={`theme-card${active ? ' theme-card--active' : ''}`}>
                <div className="theme-card__copy">
                  <span className="theme-card__name">{name}</span>
                  {playable ? (
                    <span className="theme-card__meta">Buddy: {themeBuddy(name as PlayableTheme)}</span>
                  ) : null}
                </div>
                {playable ? (
                  <button
                    type="button"
                    className={`theme-card__action${active ? ' theme-card__action--active' : ''}`}
                    onClick={() => setTheme(name as PlayableTheme)}
                    aria-pressed={active}
                  >
                    {active ? 'Active' : 'Use theme'}
                  </button>
                ) : (
                  <span className="theme-card__badge">Coming soon</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="collections__block">
        <h2>Buddies</h2>
        <ul className="buddy-list">
          {BUDDIES.map((buddy) => {
            const paired =
              buddy.name === 'Sprout'
                ? 'Greenhouse'
                : buddy.name === 'Dusty'
                  ? 'Basement'
                  : null
            const isActiveBuddy =
              (buddy.name === 'Sprout' && theme === 'Greenhouse') ||
              (buddy.name === 'Dusty' && theme === 'Basement')
            return (
              <li
                key={buddy.name}
                className={`buddy-card${isActiveBuddy ? ' buddy-card--active' : ''}`}
              >
                <div className="buddy-card__top">
                  <strong>{buddy.name}</strong>
                  {paired ? (
                    <span className="buddy-card__pair">
                      {isActiveBuddy ? 'On Home now' : `With ${paired}`}
                    </span>
                  ) : (
                    <span className="theme-card__badge">Coming soon</span>
                  )}
                </div>
                <p>{buddy.vibe}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
