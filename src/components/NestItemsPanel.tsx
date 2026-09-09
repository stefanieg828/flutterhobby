import { useState, type FormEvent } from 'react'
import type { Hobby, HobbyItem } from '../types'
import { hobbyItems } from '../types'
import { createItemId } from '../storage'
import './NestItemsPanel.css'

interface NestItemsPanelProps {
  hobby: Hobby
  onChange: (items: HobbyItem[]) => void
  /** Compact for tend bench; roomier for Collections. */
  dense?: boolean
}

export function NestItemsPanel({ hobby, onChange, dense = false }: NestItemsPanelProps) {
  const items = hobbyItems(hobby)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editNote, setEditNote] = useState('')

  function resetAdd() {
    setAdding(false)
    setName('')
    setNote('')
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const item: HobbyItem = {
      id: createItemId(),
      name: trimmed,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    onChange([item, ...items])
    resetAdd()
  }

  function startEdit(item: HobbyItem) {
    setEditId(item.id)
    setEditName(item.name)
    setEditNote(item.note ?? '')
    setAdding(false)
  }

  function handleSaveEdit(e: FormEvent) {
    e.preventDefault()
    if (!editId) return
    const trimmed = editName.trim()
    if (!trimmed) return
    onChange(
      items.map((item) =>
        item.id === editId
          ? { ...item, name: trimmed, note: editNote.trim() || undefined }
          : item,
      ),
    )
    setEditId(null)
  }

  function handleDelete(id: string) {
    onChange(items.filter((item) => item.id !== id))
    if (editId === id) setEditId(null)
  }

  return (
    <div className={`nest-panel${dense ? ' nest-panel--dense' : ''}`}>
      <div className="nest-panel__head">
        <p className="nest-panel__title">Nested items</p>
        <p className="nest-panel__hint">Projects, scraps, or piles — keep it light.</p>
      </div>

      {items.length === 0 && !adding ? (
        <p className="nest-panel__empty">Nothing nested yet. Add a scrap whenever you like.</p>
      ) : (
        <ul className="nest-panel__list">
          {items.map((item) => (
            <li key={item.id} className="nest-panel__item">
              {editId === item.id ? (
                <form className="nest-panel__form" onSubmit={handleSaveEdit}>
                  <label>
                    Name
                    <input
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                  </label>
                  <label>
                    Optional note
                    <input
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="A soft reminder"
                    />
                  </label>
                  <div className="nest-panel__actions">
                    <button type="submit">Save</button>
                    <button type="button" className="nest-panel__ghost" onClick={() => setEditId(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="nest-panel__copy">
                    <strong>{item.name}</strong>
                    {item.note ? <span>{item.note}</span> : null}
                  </div>
                  <div className="nest-panel__row-actions">
                    <button type="button" className="nest-panel__ghost" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="nest-panel__danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form className="nest-panel__form nest-panel__form--add" onSubmit={handleAdd}>
          <label>
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sleeve scraps"
              autoFocus
            />
          </label>
          <label>
            Optional note
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Where you left off"
            />
          </label>
          <div className="nest-panel__actions">
            <button type="submit">Add item</button>
            <button type="button" className="nest-panel__ghost" onClick={resetAdd}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="nest-panel__add" onClick={() => setAdding(true)}>
          + Add nested item
        </button>
      )}
    </div>
  )
}
