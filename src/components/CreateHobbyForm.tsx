import { useState, type FormEvent } from 'react'
import type { Hobby, NudgeCadence, PlantColor } from '../types'
import { CADENCE_LABELS, PLANT_COLORS, computeNextNudgeAt } from '../types'
import { createHobbyId } from '../storage'
import { useTheme } from '../ThemeContext'
import './CreateHobbyForm.css'

interface CreateHobbyFormProps {
  onCreate: (hobby: Hobby) => void
  /** When provided with open, parent controls visibility (e.g. potting-bench FAB). */
  open?: boolean
  onCancel?: () => void
}

export function CreateHobbyForm({ onCreate, open, onCancel }: CreateHobbyFormProps) {
  const { copy } = useTheme()
  const [name, setName] = useState('')
  const [creating, setCreating] = useState('')
  const [cadence, setCadence] = useState<NudgeCadence>('every-few-days')
  const [petName, setPetName] = useState('')
  const [color, setColor] = useState<PlantColor>('sage')
  const [internalOpen, setInternalOpen] = useState(false)

  const controlled = open !== undefined
  const isOpen = controlled ? open : internalOpen

  function close() {
    if (controlled) {
      onCancel?.()
    } else {
      setInternalOpen(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !creating.trim()) return

    const createdAt = new Date().toISOString()
    const hobby: Hobby = {
      id: createHobbyId(),
      name: name.trim(),
      creating: creating.trim(),
      cadence,
      petName: petName.trim() || undefined,
      status: 'in-season',
      progress: 0,
      color,
      createdAt,
      items: [],
      nextNudgeAt: computeNextNudgeAt(createdAt, cadence),
    }

    onCreate(hobby)
    setName('')
    setCreating('')
    setCadence('every-few-days')
    setPetName('')
    setColor('sage')
    close()
  }

  if (!isOpen) {
    if (controlled) return null
    return (
      <button type="button" className="create-hobby__fab" onClick={() => setInternalOpen(true)} aria-label={copy.createFab}>
        +
      </button>
    )
  }

  return (
    <form className="create-hobby" onSubmit={handleSubmit}>
      <h3>{copy.createTitle}</h3>
      <label>
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Watercolor mornings"
        />
      </label>
      <label>
        What are you creating or learning?
        <input
          required
          value={creating}
          onChange={(e) => setCreating(e.target.value)}
          placeholder="e.g. Soft landscapes in gouache"
        />
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
        <input
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="e.g. Fern"
        />
      </label>
      <fieldset className="create-hobby__colors">
        <legend>Pot color</legend>
        <div className="create-hobby__swatches">
          {PLANT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`create-hobby__swatch${color === c.id ? ' create-hobby__swatch--active' : ''}`}
              style={{ background: c.swatch }}
              aria-label={c.label}
              aria-pressed={color === c.id}
              onClick={() => setColor(c.id)}
            />
          ))}
        </div>
      </fieldset>
      <div className="create-hobby__actions">
        <button type="submit">Plant it</button>
        <button type="button" className="create-hobby__cancel" onClick={close}>
          Cancel
        </button>
      </div>
    </form>
  )
}
