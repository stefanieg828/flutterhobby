import type { Hobby } from '../types'
import { progressPercent } from '../types'
import { PlantIllustration, plantShapeForId } from './PlantIllustration'
import './PlantTile.css'

interface PlantTileProps {
  hobby: Hobby
  onSelect: (id: string) => void
}

export function PlantTile({ hobby, onSelect }: PlantTileProps) {
  const pct = progressPercent(hobby.progress)
  const color = hobby.color ?? 'sage'
  const shape = plantShapeForId(hobby.id, hobby.status)

  return (
    <button
      type="button"
      className={`plant-tile plant-tile--${color}`}
      onClick={() => onSelect(hobby.id)}
      aria-label={`${hobby.name}, ${pct}% tended. Open bench.`}
    >
      <span className="plant-tile__art">
        <PlantIllustration
          shape={shape}
          color={color}
          size={68}
          heart={hobby.status === 'proud-shelf'}
        />
        <span className="plant-tile__bar" aria-hidden="true">
          <span className="plant-tile__fill" style={{ width: `${pct}%` }} />
        </span>
      </span>
      <span className="plant-tile__name">{hobby.name}</span>
      {hobby.petName ? (
        <span className="plant-tile__pet">{hobby.petName}</span>
      ) : (
        <span className="plant-tile__pet plant-tile__pet--muted">tap to tend</span>
      )}
    </button>
  )
}
