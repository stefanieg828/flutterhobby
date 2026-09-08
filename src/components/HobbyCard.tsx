import type { Hobby } from '../types'
import { STATUS_LABELS, CADENCE_LABELS } from '../types'
import './HobbyCard.css'

interface HobbyCardProps {
  hobby: Hobby
  onTend: (id: string) => void
}

export function HobbyCard({ hobby, onTend }: HobbyCardProps) {
  const statusClass = `chip chip--${hobby.status}`

  return (
    <article className="hobby-card">
      <div className="hobby-card__header">
        <h3 className="hobby-card__title">{hobby.name}</h3>
        <span className={statusClass}>{STATUS_LABELS[hobby.status]}</span>
      </div>
      <p className="hobby-card__creating">{hobby.creating}</p>
      {hobby.petName ? (
        <p className="hobby-card__pet">Buddy pet: {hobby.petName}</p>
      ) : null}
      <div className="hobby-card__meta">
        <span>Nudge: {CADENCE_LABELS[hobby.cadence]}</span>
        <span>Progress: {hobby.progress}</span>
      </div>
      <div className="hobby-card__progress" aria-hidden="true">
        <div
          className="hobby-card__progress-bar"
          style={{ width: `${Math.min(hobby.progress * 5, 100)}%` }}
        />
      </div>
      <button
        type="button"
        className="hobby-card__tend"
        onClick={() => onTend(hobby.id)}
      >
        Tend / Water
      </button>
    </article>
  )
}
