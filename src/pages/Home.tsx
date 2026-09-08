import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Hobby, HobbyStatus } from '../types'
import { STATUS_LABELS } from '../types'
import { loadHobbies, saveHobbies } from '../storage'
import { CreateHobbyForm } from '../components/CreateHobbyForm'
import { SproutBuddy } from '../components/SproutBuddy'
import { PlantTile } from '../components/PlantTile'
import { HobbyBench } from '../components/HobbyBench'
import './Home.css'

const SEED: Hobby[] = [
  {
    id: 'seed-watercolor',
    name: 'Watercolor mornings',
    creating: 'Soft landscapes in gouache',
    cadence: 'every-few-days',
    petName: 'Fern',
    status: 'in-season',
    progress: 3,
    color: 'sage',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-knitting',
    name: 'Cozy knit scarf',
    creating: 'Learning brioche stitch',
    cadence: 'weekly',
    status: 'resting',
    progress: 1,
    color: 'blush',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-zine',
    name: 'Mini zine shelf',
    creating: 'Printed edition of doodle comics',
    cadence: 'when-inspired',
    petName: 'Ink',
    status: 'proud-shelf',
    progress: 12,
    color: 'honey',
    createdAt: new Date().toISOString(),
  },
]

const ZONE_ORDER: HobbyStatus[] = ['in-season', 'resting', 'proud-shelf']

const ZONE_HINTS: Record<HobbyStatus, string> = {
  'in-season': 'Plants you are growing right now',
  resting: 'Quiet for a bit — still welcome here',
  'proud-shelf': 'Finished or celebrated wins',
  archive: 'Tucked away, not deleted',
}

function GreenhouseDecor() {
  return (
    <div className="gh-decor" aria-hidden="true">
      {/* glass panes */}
      <svg className="gh-decor__panes" viewBox="0 0 400 220" preserveAspectRatio="none">
        <rect x="8" y="8" width="384" height="204" rx="12" fill="none" stroke="#8da881" strokeWidth="4" />
        <line x1="136" y1="8" x2="136" y2="212" stroke="#a8c09e" strokeWidth="3" />
        <line x1="264" y1="8" x2="264" y2="212" stroke="#a8c09e" strokeWidth="3" />
        <line x1="8" y1="78" x2="392" y2="78" stroke="#a8c09e" strokeWidth="3" />
        <line x1="8" y1="148" x2="392" y2="148" stroke="#a8c09e" strokeWidth="3" />
        <rect x="20" y="20" width="100" height="44" rx="4" fill="#e8f4e4" opacity="0.45" />
        <rect x="148" y="90" width="100" height="44" rx="4" fill="#fdfbe2" opacity="0.35" />
        <rect x="276" y="20" width="100" height="44" rx="4" fill="#e8f4e4" opacity="0.4" />
      </svg>
      {/* trailing vines */}
      <svg className="gh-decor__vines gh-decor__vines--left" viewBox="0 0 60 160">
        <path d="M30 0 C20 30 40 50 22 80 C10 105 35 120 28 155" stroke="#4a7a4e" strokeWidth="2.5" fill="none" />
        <ellipse cx="18" cy="36" rx="10" ry="6" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-30 18 36)" />
        <ellipse cx="36" cy="62" rx="9" ry="5.5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(25 36 62)" />
        <ellipse cx="16" cy="96" rx="9" ry="5.5" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-20 16 96)" />
        <ellipse cx="34" cy="128" rx="8" ry="5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(18 34 128)" />
      </svg>
      <svg className="gh-decor__vines gh-decor__vines--right" viewBox="0 0 60 160">
        <path d="M30 0 C40 28 20 55 38 85 C50 110 25 125 32 155" stroke="#4a7a4e" strokeWidth="2.5" fill="none" />
        <ellipse cx="42" cy="40" rx="10" ry="6" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(28 42 40)" />
        <ellipse cx="24" cy="70" rx="9" ry="5.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-22 24 70)" />
        <ellipse cx="44" cy="108" rx="9" ry="5.5" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.4" transform="rotate(20 44 108)" />
      </svg>
      {/* string lights hint */}
      <svg className="gh-decor__lights" viewBox="0 0 320 28">
        <path d="M4 8 Q80 22 160 8 T316 10" stroke="#c4a24e" strokeWidth="1.5" fill="none" />
        <circle cx="40" cy="14" r="3.5" fill="#f7ecd0" stroke="#2a4030" strokeWidth="1" />
        <circle cx="100" cy="16" r="3.5" fill="#fce8f2" stroke="#2a4030" strokeWidth="1" />
        <circle cx="160" cy="10" r="3.5" fill="#f7ecd0" stroke="#2a4030" strokeWidth="1" />
        <circle cx="220" cy="16" r="3.5" fill="#e8f4e4" stroke="#2a4030" strokeWidth="1" />
        <circle cx="280" cy="12" r="3.5" fill="#fce8f2" stroke="#2a4030" strokeWidth="1" />
      </svg>
    </div>
  )
}

function PottingClutter() {
  return (
    <div className="gh-clutter" aria-hidden="true">
      <svg className="gh-clutter__can" viewBox="0 0 64 56" width="56" height="48">
        <path d="M18 22 L46 22 L44 48 Q32 54 20 48 Z" fill="#6aaa6a" stroke="#2a4030" strokeWidth="2" />
        <rect x="14" y="16" width="36" height="8" rx="2" fill="#7cb87c" stroke="#2a4030" strokeWidth="2" />
        <path d="M46 20 C58 18 60 30 52 34" stroke="#2a4030" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M52 34 L58 40" stroke="#2a4030" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="34" r="4" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1.3" />
      </svg>
      <svg className="gh-clutter__bag" viewBox="0 0 48 40" width="44" height="36">
        <path d="M8 12 L40 12 L38 36 Q24 40 10 36 Z" fill="#c4ad8c" stroke="#2a4030" strokeWidth="2" />
        <path d="M14 12 C16 4 32 4 34 12" fill="#d7c4a8" stroke="#2a4030" strokeWidth="2" />
        <text x="24" y="28" textAnchor="middle" fontSize="7" fill="#5c4a3a" fontFamily="sans-serif">
          soil
        </text>
      </svg>
      <svg className="gh-clutter__trowel" viewBox="0 0 40 48" width="32" height="38">
        <rect x="16" y="2" width="8" height="20" rx="2" fill="#c4ad8c" stroke="#2a4030" strokeWidth="1.8" />
        <path d="M12 22 L28 22 L24 44 Q20 48 16 44 Z" fill="#8a9aa8" stroke="#2a4030" strokeWidth="1.8" />
      </svg>
    </div>
  )
}

export function Home() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [ready, setReady] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [justTendedId, setJustTendedId] = useState<string | null>(null)
  const [showArchive, setShowArchive] = useState(false)

  useEffect(() => {
    const stored = loadHobbies()
    if (stored.length === 0) {
      saveHobbies(SEED)
      setHobbies(SEED)
    } else {
      setHobbies(stored)
    }
    setReady(true)
  }, [])

  const persist = useCallback((next: Hobby[]) => {
    setHobbies(next)
    saveHobbies(next)
  }, [])

  const selected = useMemo(
    () => hobbies.find((h) => h.id === selectedId) ?? null,
    [hobbies, selectedId],
  )

  const zones = useMemo(() => {
    const byStatus = (status: HobbyStatus) => hobbies.filter((h) => h.status === status)
    return {
      'in-season': byStatus('in-season'),
      resting: byStatus('resting'),
      'proud-shelf': byStatus('proud-shelf'),
      archive: byStatus('archive'),
    }
  }, [hobbies])

  const sproutMessage = useMemo(() => {
    const active = zones['in-season'].length
    if (!ready) return 'Opening the greenhouse doors…'
    if (hobbies.length === 0) return 'Empty shelves! Plant your first hobby and I will cheer you on.'
    if (justTendedId) return 'That sip counted. Tiny tends add up — progress is saved here.'
    if (active === 0) return 'Nothing in season yet. Wake a resting plant, or plant something new.'
    return `${active} in season. Tap a plant, then Water / Tend on the bench.`
  }, [ready, hobbies.length, zones, justTendedId])

  function handleCreate(hobby: Hobby) {
    persist([hobby, ...hobbies])
    setSelectedId(hobby.id)
  }

  function handleTend(id: string) {
    persist(
      hobbies.map((h) =>
        h.id === id
          ? {
              ...h,
              progress: h.progress + 1,
              lastTendedAt: new Date().toISOString(),
              status: h.status === 'resting' || h.status === 'archive' ? 'in-season' : h.status,
            }
          : h,
      ),
    )
    setJustTendedId(id)
    window.setTimeout(() => setJustTendedId((cur) => (cur === id ? null : cur)), 1200)
  }

  function handleUpdate(hobby: Hobby) {
    persist(hobbies.map((h) => (h.id === hobby.id ? hobby : h)))
  }

  function handleDelete(id: string) {
    persist(hobbies.filter((h) => h.id !== id))
    setSelectedId(null)
  }

  return (
    <section className="page home greenhouse">
      <header className="page__header">
        <p className="eyebrow">Home · Greenhouse</p>
        <h1>Your cozy room</h1>
        <p className="lede">
          Hobbies grow like plants on soft shelves. Tend them when you can — no streaks, ad-free,
          saved on this device.
        </p>
      </header>

      <div className="greenhouse__room">
        <GreenhouseDecor />

        <div className="greenhouse__stage">
          <SproutBuddy message={sproutMessage} scene />
          <div className="greenhouse__bench-hint">
            <PottingClutter />
            <p className="greenhouse__chalk">Small steps, big growth</p>
          </div>
        </div>

        <CreateHobbyForm onCreate={handleCreate} />

        {!ready ? (
          <p className="muted">Loading your greenhouse…</p>
        ) : hobbies.length === 0 ? (
          <p className="muted greenhouse__empty">Nothing planted yet. Add your first hobby above.</p>
        ) : (
          <>
            {ZONE_ORDER.map((status) => (
              <section
                key={status}
                className={`shelf shelf--${status}`}
                aria-labelledby={`shelf-${status}`}
              >
                <div className="shelf__plaque">
                  <span className="shelf__plaque-leaf" aria-hidden="true">
                    {status === 'proud-shelf' ? '♥' : '❀'}
                  </span>
                  <h2 id={`shelf-${status}`} className="shelf__title">
                    {STATUS_LABELS[status]}
                  </h2>
                  <span className="shelf__count">{zones[status].length}</span>
                </div>
                <p className="shelf__hint">{ZONE_HINTS[status]}</p>
                {zones[status].length === 0 ? (
                  <p className="shelf__empty">This shelf is clear for now.</p>
                ) : (
                  <div className="shelf__plants">
                    {zones[status].map((hobby) => (
                      <PlantTile key={hobby.id} hobby={hobby} onSelect={setSelectedId} />
                    ))}
                  </div>
                )}
                <div className="shelf__ledge" aria-hidden="true">
                  <span className="shelf__ledge-edge" />
                </div>
              </section>
            ))}

            <section className="shelf shelf--archive" aria-labelledby="shelf-archive">
              <button
                type="button"
                className="shelf__archive-toggle"
                onClick={() => setShowArchive((v) => !v)}
                aria-expanded={showArchive}
              >
                <span id="shelf-archive" className="shelf__title">
                  Archive
                </span>
                <span className="shelf__count">{zones.archive.length}</span>
                <span className="shelf__chevron">{showArchive ? '▾' : '▸'}</span>
              </button>
              {showArchive ? (
                <>
                  <p className="shelf__hint">{ZONE_HINTS.archive}</p>
                  {zones.archive.length === 0 ? (
                    <p className="shelf__empty">Nothing archived.</p>
                  ) : (
                    <div className="shelf__plants">
                      {zones.archive.map((hobby) => (
                        <PlantTile key={hobby.id} hobby={hobby} onSelect={setSelectedId} />
                      ))}
                    </div>
                  )}
                  <div className="shelf__ledge" aria-hidden="true">
                    <span className="shelf__ledge-edge" />
                  </div>
                </>
              ) : null}
            </section>
          </>
        )}
      </div>

      {selected ? (
        <HobbyBench
          hobby={selected}
          onClose={() => setSelectedId(null)}
          onTend={handleTend}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          justTended={justTendedId === selected.id}
        />
      ) : null}
    </section>
  )
}
