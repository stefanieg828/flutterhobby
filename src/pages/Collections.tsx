import { useCallback, useEffect, useMemo, useState } from 'react'
import { THEMES, BUDDIES, hobbyItems } from '../types'
import type { Hobby, HobbyItem } from '../types'
import {
  BUDDY_THEME,
  PLAYABLE_THEMES,
  THEME_COPY,
  themeBuddy,
  type PlayableTheme,
} from '../theme'
import { useTheme } from '../ThemeContext'
import { loadHobbies, saveHobbies } from '../storage'
import { NestItemsPanel } from '../components/NestItemsPanel'
import './Collections.css'

export function Collections() {
  const { theme, setTheme } = useTheme()
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [ready, setReady] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    setHobbies(loadHobbies())
    setReady(true)
  }, [])

  const persist = useCallback((next: Hobby[]) => {
    setHobbies(next)
    saveHobbies(next)
  }, [])

  const activeHobbies = useMemo(
    () => hobbies.filter((h) => h.status !== 'archive'),
    [hobbies],
  )

  function handleItemsChange(hobbyId: string, items: HobbyItem[]) {
    persist(hobbies.map((h) => (h.id === hobbyId ? { ...h, items } : h)))
  }

  return (
    <section className="page collections">
      <header className="page__header">
        <p className="eyebrow">Collections</p>
        <h1>Nests, themes & buddies</h1>
        <p className="lede">
          Peek inside a hobby for nested scraps, then switch your Home room anytime. Same soft
          engine — pick a vibe that fits today.
        </p>
      </header>

      <div className="collections__block">
        <h2>Hobby nests</h2>
        <p className="collections__sub">
          Nested projects, scraps, or piles under each hobby. Placeholder-simple and mobile-friendly.
        </p>
        {!ready ? (
          <p className="collections__muted">Loading your local hobbies…</p>
        ) : activeHobbies.length === 0 ? (
          <p className="collections__muted">
            No hobbies yet — plant one on Home, then nest scraps here.
          </p>
        ) : (
          <ul className="nest-hobby-list">
            {activeHobbies.map((hobby) => {
              const open = openId === hobby.id
              const count = hobbyItems(hobby).length
              return (
                <li key={hobby.id} className={`nest-hobby${open ? ' nest-hobby--open' : ''}`}>
                  <button
                    type="button"
                    className="nest-hobby__toggle"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : hobby.id)}
                  >
                    <span className="nest-hobby__name">{hobby.name}</span>
                    <span className="nest-hobby__meta">
                      {count === 0 ? 'No items yet' : `${count} nested`}
                    </span>
                  </button>
                  {open ? (
                    <NestItemsPanel
                      hobby={hobby}
                      onChange={(items) => handleItemsChange(hobby.id, items)}
                    />
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="collections__block">
        <h2>Themes</h2>
        <ul className="theme-list">
          {THEMES.map((name) => {
            const playable = (PLAYABLE_THEMES as readonly string[]).includes(name)
            const active = theme === name
            const label = playable ? THEME_COPY[name as PlayableTheme].roomName : name
            return (
              <li key={name} className={`theme-card${active ? ' theme-card--active' : ''}`}>
                <div className="theme-card__copy">
                  <span className="theme-card__name">{label}</span>
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
            const paired = BUDDY_THEME[buddy.name]
            const isActiveBuddy = paired === theme
            return (
              <li
                key={buddy.name}
                className={`buddy-card${isActiveBuddy ? ' buddy-card--active' : ''}`}
              >
                <div className="buddy-card__top">
                  <strong>{buddy.name}</strong>
                  {paired ? (
                    <span className="buddy-card__pair">
                      {isActiveBuddy
                        ? 'On Home now'
                        : `With ${THEME_COPY[paired].roomName}`}
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
