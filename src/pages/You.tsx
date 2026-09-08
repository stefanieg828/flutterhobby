import { PLAYABLE_THEMES, THEME_COPY, type PlayableTheme } from '../theme'
import { useTheme } from '../ThemeContext'
import './You.css'

export function You() {
  const { theme, setTheme, copy } = useTheme()

  return (
    <section className="page you">
      <header className="page__header">
        <p className="eyebrow">You</p>
        <h1>Your space</h1>
        <p className="lede">
          Ad-free by design. No account, no payments — just local hobbies on this device for now.
        </p>
      </header>

      <div className="you-card">
        <h2>Home theme</h2>
        <p className="you-theme-current">
          Active: <strong>{copy.roomName}</strong> with {copy.buddyName}
        </p>
        <div className="you-theme-row" role="group" aria-label="Switch Home theme">
          {PLAYABLE_THEMES.map((name) => (
            <button
              key={name}
              type="button"
              className={`you-theme-btn${theme === name ? ' you-theme-btn--active' : ''}`}
              onClick={() => setTheme(name)}
              aria-pressed={theme === name}
            >
              <span className="you-theme-btn__name">{name}</span>
              <span className="you-theme-btn__buddy">{THEME_COPY[name as PlayableTheme].buddyName}</span>
            </button>
          ))}
        </div>
        <p className="you-theme-hint">Choice saves in localStorage on this device.</p>
      </div>

      <div className="you-card">
        <h2>About FlutterHobby</h2>
        <p>
          A cozy hobby tracker with greenhouse and basement vibes. Grow — or dust off — what you
          love at your own pace. Domain: <strong>flutterhobby.fun</strong>
        </p>
      </div>

      <div className="you-card">
        <h2>Privacy</h2>
        <p>
          Progress and theme choice are stored in your browser&apos;s localStorage. Nothing is sent
          to a server yet. Clearing site data will reset your room.
        </p>
      </div>

      <div className="you-card you-card--note">
        <h2>Coming later</h2>
        <ul>
          <li>Optional sync / account (still ad-free)</li>
          <li>More theme unlocks &amp; buddy art</li>
          <li>Export / backup</li>
        </ul>
      </div>
    </section>
  )
}
