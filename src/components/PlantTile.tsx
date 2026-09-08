import type { Hobby } from '../types'
import { progressPercent } from '../types'
import './PlantTile.css'

interface PlantTileProps {
  hobby: Hobby
  onSelect: (id: string) => void
}

const EMOJI_BY_STATUS = {
  'in-season': '🌿',
  resting: '🌱',
  'proud-shelf': '🪴',
  archive: '📦',
} as const

export function PlantTile({ hobby, onSelect }: PlantTileProps) {
  const pct = progressPercent(hobby.progress)
  const color = hobby.color ?? 'sage'

  return (
    <button
      type="button"
      className={`plant-tile plant-tile--${color}`}
      onClick={() => onSelect(hobby.id)}
      aria-label={`${hobby.name}, ${pct}% tended. Open bench.`}
    >
      <span className="plant-tile__pot" aria-hidden="true">
        <span className="plant-tile__leaf">{EMOJI_BY_STATUS[hobby.status]}</span>
      </span>
      <span className="plant-tile__body">
        <span className="plant-tile__name">{hobby.name}</span>
        {hobby.petName ? (
          <span className="plant-tile__pet">{hobby.petName}</span>
        ) : (
          <span className="plant-tile__pet plant-tile__pet--muted">tap to tend</span>
        )}
        <span className="plant-tile__bar" aria-hidden="true">
          <span className="plant-tile__fill" style={{ width: `${pct}%` }} />
        </span>
      </span>
    </button>
  )
}
