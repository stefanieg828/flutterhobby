import { useState, type FormEvent } from 'react'
import type { Hobby, NudgeCadence } from '../types'
import { CADENCE_LABELS } from '../types'
import { createHobbyId } from '../storage'
import './CreateHobbyForm.css'

interface CreateHobbyFormProps {
  onCreate: (hobby: Hobby) => void
}

export function CreateHobbyForm({ onCreate }: CreateHobbyFormProps) {
  const [name, setName] = useState('')
  const [creating, setCreating] = useState('')
  const [cadence, setCadence] = useState<NudgeCadence>('every-few-days')
  const [petName, setPetName] = useState('')
  const [open, setOpen] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !creating.trim()) return

    const hobby: Hobby = {
      id: createHobbyId(),
      name: name.trim(),
      creating: creating.trim(),
      cadence,
      petName: petName.trim() || undefined,
      status: 'in-season',
      progress: 0,
      createdAt: new Date().toISOString(),
    }

    onCreate(hobby)
    setName('')
    setCreating('')
    setCadence('every-few-days')
    setPetName('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button type="button" className="create-hobby__toggle" onClick={() => setOpen(true)}>
        + Plant a new hobby
      </button>
    )
  }

  return (
    <form className="create-hobby" onSubmit={handleSubmit}>
      <h3>Plant a new hobby</h3>
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
        <select
          value={cadence}
          onChange={(e) => setCadence(e.target.value as NudgeCadence)}
        >
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
      <div className="create-hobby__actions">
        <button type="submit">Plant it</button>
        <button type="button" className="create-hobby__cancel" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  )
}
