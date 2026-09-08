import type { Hobby } from '../types'
import { progressPercent } from '../types'
import { useTheme } from '../ThemeContext'
import { PlantIllustration, plantShapeForId } from './PlantIllustration'
import { GadgetIllustration, gadgetShapeForId } from './GadgetIllustration'
import './PlantTile.css'

interface PlantTileProps {
  hobby: Hobby
  onSelect: (id: string) => void
  /** Tiny pot-on-shelf look: art + name tag only, no Material chrome. */
  compact?: boolean
}

export function PlantTile({ hobby, onSelect, compact = false }: PlantTileProps) {
  const { theme } = useTheme()
  const pct = progressPercent(hobby.progress)
  const color = hobby.color ?? 'sage'
  const tag = hobby.petName || hobby.name
  const size = compact ? 50 : 68
  const isBasement = theme === 'Basement'
  const objectWord = isBasement ? 'crate' : 'pot'

  return (
    <button
      type="button"
      className={`plant-tile${compact ? ' plant-tile--compact' : ''} plant-tile--${color}`}
      onClick={() => onSelect(hobby.id)}
      aria-label={`${hobby.name}, ${pct}% tended. Open ${isBasement ? 'workbench' : 'bench'}.`}
      title={hobby.name}
    >
      <span className="plant-tile__art">
        {isBasement ? (
          <GadgetIllustration
            shape={gadgetShapeForId(hobby.id, hobby.status)}
            color={color}
            size={size}
            heart={hobby.status === 'proud-shelf'}
          />
        ) : (
          <PlantIllustration
            shape={plantShapeForId(hobby.id, hobby.status)}
            color={color}
            size={size}
            heart={hobby.status === 'proud-shelf'}
          />
        )}
        <span className="plant-tile__bar" aria-hidden="true">
          <span className="plant-tile__fill" style={{ width: `${pct}%` }} />
        </span>
      </span>
      <span className="plant-tile__tag" data-object={objectWord}>
        {tag}
      </span>
    </button>
  )
}
