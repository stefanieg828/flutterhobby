import { useEffect, useState } from 'react'
import type { Hobby } from '../types'
import { PLAYABLE_THEMES, THEME_COPY, type PlayableTheme } from '../theme'
import { useTheme } from '../ThemeContext'
import { loadHobbies } from '../storage'
import { NudgeHints } from '../components/NudgeHints'
import { InstallAppButton } from '../components/InstallApp'
import './You.css'

export function You() {
  const { theme, setTheme, copy } = useTheme()
  const [hobbies, setHobbies] = useState<Hobby[]>([])

  useEffect(() => {
    setHobbies(loadHobbies())
  }, [])

  return (
    <section className="page you">
      <header className="page__header">
        <p className="eyebrow">You</p>
        <h1>Your space</h1>
        <p className="lede">
          Ad-free by design. No account, no payments — just local hobbies on this device for now.
        </p>
      </header>

      <NudgeHints hobbies={hobbies} title="Might be ready for a sip" />

      <InstallAppButton variant="card" />

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
              <span className="you-theme-btn__name">{THEME_COPY[name as PlayableTheme].roomName}</span>
              <span className="you-theme-btn__buddy">{THEME_COPY[name as PlayableTheme].buddyName}</span>
            </button>
          ))}
        </div>
        <p className="you-theme-hint">Choice saves in localStorage on this device.</p>
      </div>

      <div className="you-card">
        <h2>About FlutterHobby</h2>
        <p>
          A cozy hobby tracker with five room vibes — greenhouse, basement, closet, desktop, and
          workshop. Tend what you love at your own pace. Domain: <strong>flutterhobby.fun</strong>
        </p>
      </div>

      <div className="you-card">
        <h2>Privacy</h2>
        <p>
          Hobby metadata, nests, pride badges, and theme choice live in localStorage. Optional
          progress photos and audio clips are stored as blobs in IndexedDB on this device. Nothing
          is sent to a server yet. Clearing site data will reset your room.
        </p>
      </div>

      <div className="you-card you-card--note">
        <h2>Coming later</h2>
        <ul>
          <li>Optional sync / account (still ad-free)</li>
          <li>Painted buddy &amp; room art polish</li>
          <li>Export / backup</li>
          <li>Optional push nudges (in-app only for now)</li>
        </ul>
      </div>
    </section>
  )
}
