import type { Hobby } from '../types'
import { progressPercent } from '../types'
import { useTheme } from '../ThemeContext'
import { ThemeObjectArt } from './ThemeObjectArt'
import './PlantTile.css'

interface PlantTileProps {
  hobby: Hobby
  onSelect: (id: string) => void
  /** Tiny pot-on-shelf look: art + name tag only, no Material chrome. */
  compact?: boolean
}

export function PlantTile({ hobby, onSelect, compact = false }: PlantTileProps) {
  const { theme, copy } = useTheme()
  const pct = progressPercent(hobby.progress)
  const color = hobby.color ?? 'sage'
  const tag = hobby.petName || hobby.name
  const size = compact ? 50 : 68

  return (
    <button
      type="button"
      className={`plant-tile${compact ? ' plant-tile--compact' : ''} plant-tile--${color}`}
      onClick={() => onSelect(hobby.id)}
      aria-label={`${hobby.name}, ${pct}% tended. Open ${copy.benchEyebrow.toLowerCase()}.`}
      title={hobby.name}
    >
      <span className="plant-tile__art">
        <ThemeObjectArt
          theme={theme}
          id={hobby.id}
          status={hobby.status}
          color={color}
          size={size}
          heart={hobby.status === 'proud-shelf'}
        />
        <span className="plant-tile__bar" aria-hidden="true">
          <span className="plant-tile__fill" style={{ width: `${pct}%` }} />
        </span>
      </span>
      <span className="plant-tile__tag" data-object={copy.objectWord}>
        {tag}
      </span>
    </button>
  )
}
