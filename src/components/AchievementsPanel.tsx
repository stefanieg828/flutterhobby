import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  addAchievement,
  defaultAchievedOnInput,
  deleteAchievement,
  formatAchievementDate,
  listAchievements,
  updateAchievement,
  type PrideAchievement,
} from '../achievementStorage'
import './AchievementsPanel.css'

interface AchievementsPanelProps {
  hobbyId: string
  dense?: boolean
}

export function AchievementsPanel({ hobbyId, dense = false }: AchievementsPanelProps) {
  const [items, setItems] = useState<PrideAchievement[]>([])
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [achievedOn, setAchievedOn] = useState(defaultAchievedOnInput())
  const [editId, setEditId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editNote, setEditNote] = useState('')
  const [editAchievedOn, setEditAchievedOn] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setItems(listAchievements(hobbyId))
  }, [hobbyId])

  useEffect(() => {
    refresh()
    setAdding(false)
    setEditId(null)
    setConfirmId(null)
    setError(null)
    setTitle('')
    setNote('')
    setAchievedOn(defaultAchievedOnInput())
  }, [hobbyId, refresh])

  function resetAdd() {
    setAdding(false)
    setTitle('')
    setNote('')
    setAchievedOn(defaultAchievedOnInput())
    setError(null)
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    try {
      addAchievement(hobbyId, {
        title: trimmed,
        note: note.trim() || undefined,
        achievedOn,
      })
      refresh()
      resetAdd()
    } catch {
      setError('Could not save that badge on this device.')
    }
  }

  function startEdit(item: PrideAchievement) {
    setEditId(item.id)
    setEditTitle(item.title)
    setEditNote(item.note ?? '')
    setEditAchievedOn(item.achievedOn)
    setAdding(false)
    setConfirmId(null)
    setError(null)
  }

  function handleSaveEdit(e: FormEvent) {
    e.preventDefault()
    if (!editId) return
    const trimmed = editTitle.trim()
    if (!trimmed) return
    try {
      updateAchievement(hobbyId, editId, {
        title: trimmed,
        note: editNote.trim() || undefined,
        achievedOn: editAchievedOn,
      })
      setEditId(null)
      refresh()
    } catch {
      setError('Could not update that badge.')
    }
  }

  function handleDelete(id: string) {
    try {
      deleteAchievement(hobbyId, id)
      setConfirmId(null)
      if (editId === id) setEditId(null)
      refresh()
    } catch {
      setError('Could not remove that badge.')
    }
  }

  return (
    <div className={`ach-panel${dense ? ' ach-panel--dense' : ''}`}>
      <div className="ach-panel__head">
        <p className="ach-panel__title">Proud shelf badges</p>
        <p className="ach-panel__hint">
          Optional — your own wins, whenever you want to notice them. No streaks, no pressure.
        </p>
      </div>

      {items.length === 0 && !adding ? (
        <p className="ach-panel__empty">
          No pride badges yet. Pin a win when it feels worth celebrating — even a tiny one.
        </p>
      ) : (
        <ul className="ach-panel__list" aria-label="Pride badges">
          {items.map((item) => (
            <li key={item.id} className="ach-panel__item">
              {editId === item.id ? (
                <form className="ach-panel__form" onSubmit={handleSaveEdit}>
                  <label>
                    Title
                    <input
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                    />
                  </label>
                  <label>
                    Optional note
                    <input
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="A soft memory"
                    />
                  </label>
                  <label>
                    Date
                    <input
                      type="date"
                      required
                      value={editAchievedOn}
                      onChange={(e) => setEditAchievedOn(e.target.value)}
                    />
                  </label>
                  <div className="ach-panel__actions">
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      className="ach-panel__ghost"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="ach-panel__badge" aria-hidden="true">
                    ✦
                  </div>
                  <div className="ach-panel__copy">
                    <strong>{item.title}</strong>
                    {item.note ? <span>{item.note}</span> : null}
                    <span className="ach-panel__date">
                      {formatAchievementDate(item.achievedOn)}
                    </span>
                  </div>
                  <div className="ach-panel__row-actions">
                    <button
                      type="button"
                      className="ach-panel__ghost"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    {confirmId === item.id ? (
                      <div className="ach-panel__confirm">
                        <p>Lift this badge off the shelf?</p>
                        <button
                          type="button"
                          className="ach-panel__danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Yes, remove
                        </button>
                        <button
                          type="button"
                          className="ach-panel__ghost"
                          onClick={() => setConfirmId(null)}
                        >
                          Keep it
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="ach-panel__danger"
                        onClick={() => setConfirmId(item.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form className="ach-panel__form ach-panel__form--add" onSubmit={handleAdd}>
          <label>
            Title
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. First full song"
              autoFocus
            />
          </label>
          <label>
            Optional note
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why it felt good"
            />
          </label>
          <label>
            Date
            <input
              type="date"
              required
              value={achievedOn}
              onChange={(e) => setAchievedOn(e.target.value)}
            />
          </label>
          <div className="ach-panel__actions">
            <button type="submit">Add badge</button>
            <button type="button" className="ach-panel__ghost" onClick={resetAdd}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="ach-panel__add"
          onClick={() => {
            setAdding(true)
            setEditId(null)
            setConfirmId(null)
            setAchievedOn(defaultAchievedOnInput())
          }}
        >
          + Add pride badge
        </button>
      )}

      {error ? (
        <p className="ach-panel__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
