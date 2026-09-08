import type { Hobby } from '../types'
import { STATUS_LABELS, CADENCE_LABELS, progressPercent } from '../types'
import './HobbyCard.css'

interface HobbyCardProps {
  hobby: Hobby
  onTend: (id: string, amountPercent: number) => void
  onSelect?: (id: string) => void
}

export function HobbyCard({ hobby, onTend, onSelect }: HobbyCardProps) {
  const statusClass = `chip chip--${hobby.status}`
  const pct = progressPercent(hobby.progress)

  return (
    <article
      className="hobby-card"
      onClick={onSelect ? () => onSelect(hobby.id) : undefined}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(hobby.id)
              }
            }
          : undefined
      }
    >
      <div className="hobby-card__header">
        <h3 className="hobby-card__title">{hobby.name}</h3>
        <span className={statusClass}>{STATUS_LABELS[hobby.status]}</span>
      </div>
      <p className="hobby-card__creating">{hobby.creating}</p>
      {hobby.petName ? <p className="hobby-card__pet">Buddy pet: {hobby.petName}</p> : null}
      <div className="hobby-card__meta">
        <span>Nudge: {CADENCE_LABELS[hobby.cadence]}</span>
        <span>{pct}% growth</span>
      </div>
      <div className="hobby-card__progress" aria-hidden="true">
        <div className="hobby-card__progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <button
        type="button"
        className="hobby-card__tend"
        onClick={(e) => {
          e.stopPropagation()
          // Legacy card shortcut: gentle default sip (bench has the full chooser).
          onTend(hobby.id, 5)
        }}
      >
        Tend / Water
      </button>
    </article>
  )
}
