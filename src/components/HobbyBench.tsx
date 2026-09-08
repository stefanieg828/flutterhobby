import { useEffect, useState, type FormEvent } from 'react'
import type { Hobby, HobbyStatus, NudgeCadence, PlantColor } from '../types'
import {
  CADENCE_LABELS,
  PLANT_COLORS,
  STATUS_LABELS,
  progressPercent,
} from '../types'
import { PlantIllustration, plantShapeForId } from './PlantIllustration'
import './HobbyBench.css'

interface HobbyBenchProps {
  hobby: Hobby
  onClose: () => void
  onTend: (id: string) => void
  onUpdate: (hobby: Hobby) => void
  onDelete: (id: string) => void
  justTended?: boolean
}

const MOVABLE_STATUSES: HobbyStatus[] = [
  'in-season',
  'resting',
  'proud-shelf',
  'archive',
]

export function HobbyBench({
  hobby,
  onClose,
  onTend,
  onUpdate,
  onDelete,
  justTended = false,
}: HobbyBenchProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(hobby.name)
  const [creating, setCreating] = useState(hobby.creating)
  const [cadence, setCadence] = useState<NudgeCadence>(hobby.cadence)
  const [petName, setPetName] = useState(hobby.petName ?? '')
  const [color, setColor] = useState<PlantColor>(hobby.color ?? 'sage')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [splash, setSplash] = useState(false)

  useEffect(() => {
    setName(hobby.name)
    setCreating(hobby.creating)
    setCadence(hobby.cadence)
    setPetName(hobby.petName ?? '')
    setColor(hobby.color ?? 'sage')
    setEditing(false)
    setConfirmDelete(false)
  }, [hobby])

  useEffect(() => {
    if (!justTended) return
    setSplash(true)
    const t = window.setTimeout(() => setSplash(false), 900)
    return () => window.clearTimeout(t)
  }, [justTended, hobby.progress])

  const pct = progressPercent(hobby.progress)
  const shape = plantShapeForId(hobby.id, hobby.status)

  function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !creating.trim()) return
    onUpdate({
      ...hobby,
      name: name.trim(),
      creating: creating.trim(),
      cadence,
      petName: petName.trim() || undefined,
      color,
    })
    setEditing(false)
  }

  function setStatus(status: HobbyStatus) {
    onUpdate({ ...hobby, status })
  }

  function handleTendClick() {
    onTend(hobby.id)
  }

  return (
    <div className="bench-overlay" role="dialog" aria-modal="true" aria-labelledby="bench-title">
      <button type="button" className="bench-overlay__scrim" aria-label="Close bench" onClick={onClose} />
      <div className={`bench ${splash ? 'bench--splash' : ''}`}>
        <div className="bench__wood-top" aria-hidden="true" />
        <header className="bench__header">
          <div>
            <p className="bench__eyebrow">Potting bench</p>
            <h2 id="bench-title">{hobby.name}</h2>
          </div>
          <button type="button" className="bench__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="bench__plant" aria-hidden="true">
          <PlantIllustration
            shape={shape}
            color={hobby.color ?? 'sage'}
            size={120}
            heart={hobby.status === 'proud-shelf'}
            className="bench__plant-art"
          />
          {splash ? <span className="bench__water-drop">💧</span> : null}
          <svg className="bench__tools" viewBox="0 0 80 40" width="72" height="36" aria-hidden="true">
            <path d="M8 28 L28 28 L26 38 Q18 40 10 38 Z" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.5" />
            <rect x="6" y="24" width="24" height="5" rx="1" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.5" />
            <rect x="52" y="8" width="5" height="16" rx="1" fill="#c4ad8c" stroke="#2a4030" strokeWidth="1.4" />
            <path d="M48 24 L62 24 L58 38 Q55 40 52 38 Z" fill="#8a9aa8" stroke="#2a4030" strokeWidth="1.4" />
          </svg>
        </div>

        <p className="bench__creating">{hobby.creating}</p>
        {hobby.petName ? <p className="bench__pet">Pet name: {hobby.petName}</p> : null}

        <div className="bench__progress-block">
          <div className="bench__progress-labels">
            <span>Growth</span>
            <span>
              {pct}% · {hobby.progress} tend{hobby.progress === 1 ? '' : 's'}
            </span>
          </div>
          <div className="bench__progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="bench__progress-bar" style={{ width: `${pct}%` }} />
          </div>
          {hobby.lastTendedAt ? (
            <p className="bench__last">
              Last watered{' '}
              {new Date(hobby.lastTendedAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          ) : (
            <p className="bench__last">Not tended yet — give it a first sip.</p>
          )}
        </div>

        <button type="button" className="bench__tend" onClick={handleTendClick}>
          💧 Water / Tend
        </button>
        {splash ? <p className="bench__feedback">Nice — progress saved on this device.</p> : null}

        <div className="bench__status">
          <p className="bench__section-label">Move to</p>
          <div className="bench__status-row">
            {MOVABLE_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                className={`bench__status-btn${hobby.status === status ? ' bench__status-btn--active' : ''}`}
                onClick={() => setStatus(status)}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        {!editing ? (
          <div className="bench__actions">
            <button type="button" className="bench__secondary" onClick={() => setEditing(true)}>
              Edit hobby
            </button>
            {!confirmDelete ? (
              <button type="button" className="bench__danger" onClick={() => setConfirmDelete(true)}>
                Delete
              </button>
            ) : (
              <div className="bench__confirm">
                <p>Delete forever? This cannot be undone.</p>
                <button type="button" className="bench__danger" onClick={() => onDelete(hobby.id)}>
                  Yes, delete
                </button>
                <button type="button" className="bench__secondary" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <form className="bench__edit" onSubmit={handleSave}>
            <p className="bench__section-label">Edit</p>
            <label>
              Name
              <input required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              What are you creating or learning?
              <input required value={creating} onChange={(e) => setCreating(e.target.value)} />
            </label>
            <label>
              Nudge cadence
              <select value={cadence} onChange={(e) => setCadence(e.target.value as NudgeCadence)}>
                {(Object.keys(CADENCE_LABELS) as NudgeCadence[]).map((key) => (
                  <option key={key} value={key}>
                    {CADENCE_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Optional pet name
              <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="e.g. Fern" />
            </label>
            <fieldset className="bench__colors">
              <legend>Recolor pot</legend>
              <div className="bench__swatches">
                {PLANT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`bench__swatch${color === c.id ? ' bench__swatch--active' : ''}`}
                    style={{ background: c.swatch }}
                    aria-label={c.label}
                    aria-pressed={color === c.id}
                    onClick={() => setColor(c.id)}
                  />
                ))}
              </div>
            </fieldset>
            <div className="bench__edit-actions">
              <button type="submit">Save</button>
              <button type="button" className="bench__secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
