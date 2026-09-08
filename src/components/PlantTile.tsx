import type { Hobby } from '../types'
import { progressPercent } from '../types'
import { PlantIllustration, plantShapeForId } from './PlantIllustration'
import './PlantTile.css'

interface PlantTileProps {
  hobby: Hobby
  onSelect: (id: string) => void
  /** Tiny pot-on-shelf look: art + name tag only, no Material chrome. */
  compact?: boolean
}

export function PlantTile({ hobby, onSelect, compact = false }: PlantTileProps) {
  const pct = progressPercent(hobby.progress)
  const color = hobby.color ?? 'sage'
  const shape = plantShapeForId(hobby.id, hobby.status)
  const tag = hobby.petName || hobby.name

  return (
    <button
      type="button"
      className={`plant-tile${compact ? ' plant-tile--compact' : ''} plant-tile--${color}`}
      onClick={() => onSelect(hobby.id)}
      aria-label={`${hobby.name}, ${pct}% tended. Open bench.`}
      title={hobby.name}
    >
      <span className="plant-tile__art">
        <PlantIllustration
          shape={shape}
          color={color}
          size={compact ? 58 : 68}
          heart={hobby.status === 'proud-shelf'}
        />
        <span className="plant-tile__bar" aria-hidden="true">
          <span className="plant-tile__fill" style={{ width: `${pct}%` }} />
        </span>
      </span>
      <span className="plant-tile__tag">{tag}</span>
    </button>
  )
}
