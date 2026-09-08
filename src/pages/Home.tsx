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

function GreenhouseDecor() {
  return (
    <div className="gh-decor" aria-hidden="true">
      <svg className="gh-decor__panes" viewBox="0 0 400 520" preserveAspectRatio="none">
        <rect x="6" y="6" width="388" height="508" rx="14" fill="none" stroke="#7a9872" strokeWidth="5" />
        <line x1="136" y1="6" x2="136" y2="514" stroke="#9bb892" strokeWidth="3.5" />
        <line x1="264" y1="6" x2="264" y2="514" stroke="#9bb892" strokeWidth="3.5" />
        <line x1="6" y1="130" x2="394" y2="130" stroke="#9bb892" strokeWidth="3.5" />
        <line x1="6" y1="260" x2="394" y2="260" stroke="#9bb892" strokeWidth="3.5" />
        <line x1="6" y1="390" x2="394" y2="390" stroke="#9bb892" strokeWidth="3.5" />
        <rect x="18" y="18" width="100" height="48" rx="4" fill="#e8f4e4" opacity="0.5" />
        <rect x="148" y="148" width="100" height="48" rx="4" fill="#fdfbe2" opacity="0.4" />
        <rect x="276" y="18" width="100" height="48" rx="4" fill="#e8f4e4" opacity="0.45" />
        <rect x="18" y="278" width="100" height="48" rx="4" fill="#fdfbe2" opacity="0.28" />
      </svg>
      <svg className="gh-decor__vines gh-decor__vines--left" viewBox="0 0 60 220">
        <path
          d="M30 0 C20 40 42 70 20 110 C8 145 36 170 26 215"
          stroke="#4a7a4e"
          strokeWidth="2.5"
          fill="none"
        />
        <ellipse cx="18" cy="40" rx="11" ry="6.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-30 18 40)" />
        <ellipse cx="38" cy="72" rx="10" ry="6" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(25 38 72)" />
        <ellipse cx="14" cy="112" rx="10" ry="6" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-22 14 112)" />
        <ellipse cx="36" cy="152" rx="9" ry="5.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(18 36 152)" />
        <ellipse cx="18" cy="190" rx="9" ry="5.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-15 18 190)" />
      </svg>
      <svg className="gh-decor__vines gh-decor__vines--right" viewBox="0 0 60 220">
        <path
          d="M30 0 C40 38 18 72 40 115 C52 150 24 175 34 215"
          stroke="#4a7a4e"
          strokeWidth="2.5"
          fill="none"
        />
        <ellipse cx="42" cy="44" rx="11" ry="6.5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(28 42 44)" />
        <ellipse cx="22" cy="80" rx="10" ry="6" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-22 22 80)" />
        <ellipse cx="44" cy="126" rx="10" ry="6" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.4" transform="rotate(20 44 126)" />
        <ellipse cx="24" cy="168" rx="9" ry="5.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.4" transform="rotate(-16 24 168)" />
      </svg>
      <svg className="gh-decor__lights" viewBox="0 0 320 28">
        <path d="M4 8 Q80 22 160 8 T316 10" stroke="#c4a24e" strokeWidth="1.5" fill="none" />
        <circle cx="40" cy="14" r="3.5" fill="#f7ecd0" stroke="#2a4030" strokeWidth="1" />
        <circle cx="100" cy="16" r="3.5" fill="#fce8f2" stroke="#2a4030" strokeWidth="1" />
        <circle cx="160" cy="10" r="3.5" fill="#f7ecd0" stroke="#2a4030" strokeWidth="1" />
        <circle cx="220" cy="16" r="3.5" fill="#e8f4e4" stroke="#2a4030" strokeWidth="1" />
        <circle cx="280" cy="12" r="3.5" fill="#fce8f2" stroke="#2a4030" strokeWidth="1" />
      </svg>
      <div className="gh-decor__floor" />
    </div>
  )
}

function ShelfBracket({ side }: { side: 'left' | 'right' }) {
  return (
    <span className={`shelf-unit__bracket shelf-unit__bracket--${side}`} aria-hidden="true">
      <svg viewBox="0 0 18 28" width="14" height="22">
        <path
          d={side === 'left' ? 'M16 2 L4 2 L4 24 L16 24' : 'M2 2 L14 2 L14 24 L2 24'}
          fill="none"
          stroke="#5c4a3a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={side === 'left' ? 4 : 14} cy="8" r="1.6" fill="#2a4030" />
        <circle cx={side === 'left' ? 4 : 14} cy="18" r="1.6" fill="#2a4030" />
      </svg>
    </span>
  )
}

function PottingBenchScene({
  onPlantClick,
}: {
  onPlantClick: () => void
}) {
  return (
    <div className="potting-scene">
      <div className="potting-scene__buddy">
        <SproutBuddy scene quiet />
      </div>
      <div className="potting-bench">
        <div className="potting-bench__top">
          <svg className="potting-bench__tools" viewBox="0 0 160 56" aria-hidden="true">
            <path d="M22 18 L48 18 L46 46 Q35 52 24 46 Z" fill="#6aaa6a" stroke="#2a4030" strokeWidth="2" />
            <rect x="18" y="12" width="36" height="8" rx="2" fill="#7cb87c" stroke="#2a4030" strokeWidth="2" />
            <path d="M48 16 C60 14 62 28 54 32" stroke="#2a4030" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M54 32 L60 38" stroke="#2a4030" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="35" cy="30" r="3.5" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1.2" />
            <rect x="78" y="6" width="7" height="18" rx="2" fill="#c4ad8c" stroke="#2a4030" strokeWidth="1.6" />
            <path d="M74 24 L90 24 L86 48 Q82 52 78 48 Z" fill="#8a9aa8" stroke="#2a4030" strokeWidth="1.6" />
            <rect x="102" y="18" width="42" height="28" rx="3" fill="#c4ad8c" stroke="#2a4030" strokeWidth="2" />
            <path d="M108 18 C110 10 136 10 138 18" fill="#d7c4a8" stroke="#2a4030" strokeWidth="1.8" />
            <rect x="110" y="26" width="26" height="14" rx="2" fill="#3d4a40" stroke="#2a4030" strokeWidth="1.4" />
            <text x="123" y="36" textAnchor="middle" fontSize="5.5" fill="#e8f0e4" fontFamily="sans-serif">
              ♡ grow
            </text>
          </svg>
          <button
            type="button"
            className="potting-bench__fab"
            onClick={onPlantClick}
            aria-label="Plant a new hobby"
            title="Plant a new hobby"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
        <div className="potting-bench__body">
          <span className="potting-bench__plaque">Potting Bench</span>
        </div>
        <p className="potting-bench__chalk">Small steps, big growth ♡</p>
      </div>
    </div>
  )
}

export function Home() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [ready, setReady] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [justTendedId, setJustTendedId] = useState<string | null>(null)
  const [showArchive, setShowArchive] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

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
    if (!ready) return 'Opening the greenhouse…'
    if (hobbies.length === 0) return 'Empty shelves — plant something!'
    if (justTendedId) return 'That sip counted ♡'
    if (active === 0) return 'Wake a plant or plant something new.'
    return 'Tap a pot to tend on the bench.'
  }, [ready, hobbies.length, zones, justTendedId])

  function handleCreate(hobby: Hobby) {
    persist([hobby, ...hobbies])
    setSelectedId(hobby.id)
    setCreateOpen(false)
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
      <header className="greenhouse__header">
        <p className="greenhouse__brand">FlutterHobby</p>
        <p className="greenhouse__tagline">Grow hobbies, grow joy</p>
      </header>

      <div className="greenhouse__room">
        <GreenhouseDecor />

        <p className="greenhouse__whisper" aria-live="polite">
          {sproutMessage}
        </p>

        {!ready ? (
          <p className="muted greenhouse__loading">Loading your greenhouse…</p>
        ) : (
          <div className="shelf-unit" role="region" aria-label="Hobby shelves">
            <div className="shelf-unit__back" aria-hidden="true" />
            <div className="shelf-unit__posts" aria-hidden="true">
              <span className="shelf-unit__post shelf-unit__post--left" />
              <span className="shelf-unit__post shelf-unit__post--right" />
            </div>

            {ZONE_ORDER.map((status) => (
              <div
                key={status}
                className={`shelf-tier shelf-tier--${status}`}
                aria-labelledby={`shelf-${status}`}
              >
                <div className={`shelf-sign shelf-sign--${status}`}>
                  <span className="shelf-sign__icon" aria-hidden="true">
                    {status === 'proud-shelf' ? '♥' : status === 'resting' ? '☾' : '❀'}
                  </span>
                  <h2 id={`shelf-${status}`} className="shelf-sign__label">
                    {STATUS_LABELS[status]}
                  </h2>
                  <span className="shelf-sign__count">{zones[status].length}</span>
                </div>

                <div className="shelf-tier__bay">
                  {zones[status].length === 0 ? (
                    <p className="shelf-tier__empty">open space</p>
                  ) : (
                    <div className="shelf-tier__plants">
                      {zones[status].map((hobby) => (
                        <PlantTile key={hobby.id} hobby={hobby} onSelect={setSelectedId} compact />
                      ))}
                    </div>
                  )}
                </div>

                <div className="shelf-board" aria-hidden="true">
                  <ShelfBracket side="left" />
                  <div className="shelf-board__plank" />
                  <ShelfBracket side="right" />
                  <div className="shelf-board__lip" />
                </div>
              </div>
            ))}

            {hobbies.length === 0 ? (
              <p className="muted greenhouse__empty">Nothing planted yet — tap + on the potting bench.</p>
            ) : null}
          </div>
        )}

        <PottingBenchScene onPlantClick={() => setCreateOpen(true)} />

        {createOpen ? (
          <div className="greenhouse__create">
            <CreateHobbyForm
              onCreate={handleCreate}
              open
              onCancel={() => setCreateOpen(false)}
            />
          </div>
        ) : null}

        <details
          className="greenhouse__archive"
          open={showArchive}
          onToggle={(e) => setShowArchive((e.target as HTMLDetailsElement).open)}
        >
          <summary className="greenhouse__archive-summary">
            <span>Archive</span>
            <span className="shelf-sign__count">{zones.archive.length}</span>
          </summary>
          <p className="greenhouse__archive-hint">Tucked away, not deleted</p>
          {zones.archive.length === 0 ? (
            <p className="shelf-tier__empty">Nothing archived.</p>
          ) : (
            <div className="shelf-tier__plants shelf-tier__plants--archive">
              {zones.archive.map((hobby) => (
                <PlantTile key={hobby.id} hobby={hobby} onSelect={setSelectedId} compact />
              ))}
            </div>
          )}
        </details>
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
