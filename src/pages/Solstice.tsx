import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react'
import type { Hobby, HobbyStatus } from '../types'
import { STATUS_LABELS } from '../types'
import { loadHobbies, saveHobbies } from '../storage'
import { PlantIllustration, plantShapeForId } from '../components/PlantIllustration'
import './Solstice.css'

type SeasonStatus = Exclude<HobbyStatus, 'archive'>

const SEASON_ZONES: {
  status: SeasonStatus
  hint: string
  empty: string
}[] = [
  {
    status: 'in-season',
    hint: 'What you feel like tending right now',
    empty: 'Room for whatever wants attention',
  },
  {
    status: 'resting',
    hint: 'Still yours — just quieter for a while',
    empty: 'A soft pause is always welcome',
  },
  {
    status: 'proud-shelf',
    hint: 'Finished, loved, or worth smiling at',
    empty: 'Wins can wait here when they arrive',
  },
]

const ZONE_STATUSES: HobbyStatus[] = ['in-season', 'resting', 'proud-shelf', 'archive']

function SolsticeDecor() {
  return (
    <svg className="solstice-decor" viewBox="0 0 120 48" aria-hidden="true">
      <defs>
        <radialGradient id="solsticeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9a0" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#f5d76e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f5d76e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="36" cy="24" r="14" fill="url(#solsticeGlow)" />
      <circle cx="36" cy="24" r="8" fill="#ffe9a0" stroke="#c4a24e" strokeWidth="1.4" />
      <path
        d="M58 24 C66 10 86 10 94 24 C86 38 66 38 58 24 Z"
        fill="#d8e8d0"
        stroke="#74a892"
        strokeWidth="1.3"
      />
      <circle cx="78" cy="22" r="2" fill="#fffef8" opacity="0.8" />
      <path
        d="M8 40 Q36 32 64 40 T120 38"
        fill="none"
        stroke="#95d5b2"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.7"
      />
    </svg>
  )
}

function TinyPlant({ hobby }: { hobby: Hobby }) {
  const color = hobby.color ?? 'sage'
  const shape = plantShapeForId(hobby.id, hobby.status)
  return (
    <PlantIllustration
      shape={shape}
      color={color}
      size={28}
      heart={hobby.status === 'proud-shelf'}
      className="solstice-chip__plant"
    />
  )
}

export function Solstice() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [draft, setDraft] = useState<Record<string, HobbyStatus>>({})
  const [ready, setReady] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<HobbyStatus | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const [showArchive, setShowArchive] = useState(false)

  useEffect(() => {
    const stored = loadHobbies()
    setHobbies(stored)
    const next: Record<string, HobbyStatus> = {}
    for (const h of stored) next[h.id] = h.status
    setDraft(next)
    setReady(true)
  }, [])

  const dirty = useMemo(() => {
    if (!ready) return false
    return hobbies.some((h) => draft[h.id] !== h.status)
  }, [ready, hobbies, draft])

  const byZone = useMemo(() => {
    const groups: Record<HobbyStatus, Hobby[]> = {
      'in-season': [],
      resting: [],
      'proud-shelf': [],
      archive: [],
    }
    for (const hobby of hobbies) {
      const status = draft[hobby.id] ?? hobby.status
      groups[status].push({ ...hobby, status })
    }
    return groups
  }, [hobbies, draft])

  const moveHobby = useCallback((id: string, status: HobbyStatus) => {
    setDraft((prev) => {
      if (prev[id] === status) return prev
      return { ...prev, [id]: status }
    })
    setSelectedId(null)
    setDraggingId(null)
    setDropTarget(null)
    if (status === 'archive') setShowArchive(true)
  }, [])

  function handleChipActivate(id: string) {
    setSelectedId((cur) => (cur === id ? null : id))
  }

  function handleZoneActivate(status: HobbyStatus) {
    if (selectedId) {
      moveHobby(selectedId, status)
      return
    }
  }

  function onDragStart(e: DragEvent, id: string) {
    setDraggingId(id)
    setSelectedId(id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragEnd() {
    setDraggingId(null)
    setDropTarget(null)
  }

  function onDragOver(e: DragEvent, status: HobbyStatus) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dropTarget !== status) setDropTarget(status)
  }

  function onDragLeave(status: HobbyStatus) {
    setDropTarget((cur) => (cur === status ? null : cur))
  }

  function onDrop(e: DragEvent, status: HobbyStatus) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggingId
    if (id) moveHobby(id, status)
  }

  function turnTheSeason() {
    const next = hobbies.map((h) => ({
      ...h,
      status: draft[h.id] ?? h.status,
    }))
    saveHobbies(next)
    setHobbies(next)
    setSavedFlash(true)
    setSelectedId(null)
    window.setTimeout(() => setSavedFlash(false), 2200)
  }

  function resetDraft() {
    const next: Record<string, HobbyStatus> = {}
    for (const h of hobbies) next[h.id] = h.status
    setDraft(next)
    setSelectedId(null)
  }

  const totalActive = hobbies.filter((h) => (draft[h.id] ?? h.status) !== 'archive').length

  return (
    <section className="page solstice">
      <header className="page__header solstice__header">
        <p className="eyebrow">Solstice</p>
        <h1>Turn the season</h1>
        <p className="lede">
          A calm check-in. Sort what you&apos;re tending, what&apos;s resting, and what belongs on
          the proud shelf. Nothing here is a grade — just a gentle rearrange.
        </p>
        <SolsticeDecor />
      </header>

      {!ready ? (
        <p className="solstice-muted">Opening the season circle…</p>
      ) : hobbies.length === 0 ? (
        <div className="solstice-empty-all">
          <p>No hobbies planted yet.</p>
          <p className="solstice-muted">Plant something on Home, then come back to turn the season.</p>
        </div>
      ) : (
        <>
          <p className="solstice-guide" aria-live="polite">
            {selectedId
              ? 'Tap a column to place it — or drag if you like.'
              : 'Drag a hobby, or tap one then tap a column.'}
          </p>

          <div className="solstice-board" role="region" aria-label="Season columns">
            {SEASON_ZONES.map((zone) => {
              const list = byZone[zone.status]
              const isDrop = dropTarget === zone.status
              const isSelectedTarget = Boolean(selectedId)
              return (
                <section
                  key={zone.status}
                  className={`solstice-zone solstice-zone--${zone.status}${
                    isDrop ? ' solstice-zone--drop' : ''
                  }${isSelectedTarget ? ' solstice-zone--receptive' : ''}`}
                  aria-labelledby={`solstice-${zone.status}`}
                  onDragOver={(e) => onDragOver(e, zone.status)}
                  onDragLeave={() => onDragLeave(zone.status)}
                  onDrop={(e) => onDrop(e, zone.status)}
                  onClick={() => handleZoneActivate(zone.status)}
                >
                  <header className="solstice-zone__head">
                    <h2 id={`solstice-${zone.status}`}>{STATUS_LABELS[zone.status]}</h2>
                    <span className="solstice-zone__count">{list.length}</span>
                  </header>
                  <p className="solstice-zone__hint">{zone.hint}</p>
                  <ul className="solstice-zone__list">
                    {list.length === 0 ? (
                      <li className="solstice-zone__empty">{zone.empty}</li>
                    ) : (
                      list.map((hobby) => (
                        <li key={hobby.id}>
                          <button
                            type="button"
                            className={`solstice-chip${
                              selectedId === hobby.id ? ' solstice-chip--selected' : ''
                            }${draggingId === hobby.id ? ' solstice-chip--dragging' : ''}`}
                            draggable
                            onDragStart={(e) => onDragStart(e, hobby.id)}
                            onDragEnd={onDragEnd}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleChipActivate(hobby.id)
                            }}
                            aria-pressed={selectedId === hobby.id}
                            aria-label={`${hobby.name}. ${
                              selectedId === hobby.id
                                ? 'Selected. Tap a column to move.'
                                : 'Tap to select, or drag to a column.'
                            }`}
                          >
                            <TinyPlant hobby={hobby} />
                            <span className="solstice-chip__name">{hobby.name}</span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </section>
              )
            })}
          </div>

          {selectedId ? (
            <div className="solstice-tapbar" role="group" aria-label="Move selected hobby">
              <span className="solstice-tapbar__label">Place in</span>
              {ZONE_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`solstice-tapbar__btn solstice-tapbar__btn--${status}`}
                  onClick={() => moveHobby(selectedId, status)}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          ) : null}

          <details
            className="solstice-archive"
            open={showArchive || byZone.archive.length > 0}
            onToggle={(e) => setShowArchive((e.target as HTMLDetailsElement).open)}
          >
            <summary className="solstice-archive__summary">
              <span>Archive</span>
              <span className="solstice-zone__count">{byZone.archive.length}</span>
            </summary>
            <p className="solstice-archive__hint">
              Optional tuck-away. You can also archive from Home anytime.
            </p>
            <div
              className={`solstice-archive__drop${
                dropTarget === 'archive' ? ' solstice-archive__drop--active' : ''
              }${selectedId ? ' solstice-archive__drop--receptive' : ''}`}
              onDragOver={(e) => onDragOver(e, 'archive')}
              onDragLeave={() => onDragLeave('archive')}
              onDrop={(e) => onDrop(e, 'archive')}
              onClick={() => handleZoneActivate('archive')}
            >
              {byZone.archive.length === 0 ? (
                <p className="solstice-zone__empty">Nothing archived this season.</p>
              ) : (
                <ul className="solstice-zone__list">
                  {byZone.archive.map((hobby) => (
                    <li key={hobby.id}>
                      <button
                        type="button"
                        className={`solstice-chip${
                          selectedId === hobby.id ? ' solstice-chip--selected' : ''
                        }`}
                        draggable
                        onDragStart={(e) => onDragStart(e, hobby.id)}
                        onDragEnd={onDragEnd}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleChipActivate(hobby.id)
                        }}
                        aria-pressed={selectedId === hobby.id}
                      >
                        <TinyPlant hobby={hobby} />
                        <span className="solstice-chip__name">{hobby.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>

          <footer className="solstice-actions">
            {dirty ? (
              <button type="button" className="solstice-actions__reset" onClick={resetDraft}>
                Undo sorting
              </button>
            ) : (
              <span className="solstice-actions__spacer" />
            )}
            <button
              type="button"
              className={`solstice-actions__turn${dirty ? ' solstice-actions__turn--ready' : ''}${
                savedFlash ? ' solstice-actions__turn--saved' : ''
              }`}
              onClick={turnTheSeason}
              disabled={!dirty && !savedFlash}
            >
              {savedFlash ? 'Season turned ♡' : 'Turn the season'}
            </button>
          </footer>

          <p className="solstice-footnote" aria-live="polite">
            {savedFlash
              ? 'Saved to this device — Home will match.'
              : dirty
                ? `Unsaved changes across ${totalActive} living hobbies.`
                : 'Statuses match Home until you rearrange.'}
          </p>
        </>
      )}
    </section>
  )
}
