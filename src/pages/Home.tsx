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

      <SproutBuddy message={sproutMessage} />

      <div className="greenhouse__room">
        <CreateHobbyForm onCreate={handleCreate} />

        {!ready ? (
          <p className="muted">Loading your greenhouse…</p>
        ) : hobbies.length === 0 ? (
          <p className="muted greenhouse__empty">Nothing planted yet. Add your first hobby above.</p>
        ) : (
          <>
            {ZONE_ORDER.map((status) => (
              <section key={status} className={`shelf shelf--${status}`} aria-labelledby={`shelf-${status}`}>
                <div className="shelf__rail">
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
                <div className="shelf__ledge" aria-hidden="true" />
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
