import type { HobbyStatus, PlantColor } from '../types'
import type { PlayableTheme } from '../theme'
import { PlantIllustration, plantShapeForId } from './PlantIllustration'
import { GadgetIllustration, gadgetShapeForId } from './GadgetIllustration'
import { OutfitIllustration, outfitShapeForId } from './OutfitIllustration'
import { DesktopObjectIllustration, desktopShapeForId } from './DesktopObjectIllustration'
import { WorkshopPieceIllustration, workshopShapeForId } from './WorkshopPieceIllustration'

interface ThemeObjectArtProps {
  theme: PlayableTheme
  id: string
  status?: HobbyStatus
  color?: PlantColor
  size?: number
  className?: string
  heart?: boolean
  /** Force a simple center-stage demo shape */
  demo?: boolean
}

export function ThemeObjectArt({
  theme,
  id,
  status,
  color = 'sage',
  size = 72,
  className,
  heart = false,
  demo = false,
}: ThemeObjectArtProps) {
  switch (theme) {
    case 'Basement':
      return (
        <GadgetIllustration
          shape={demo ? 'crate' : gadgetShapeForId(id, status)}
          color={demo ? 'honey' : color}
          size={size}
          className={className}
          heart={heart}
        />
      )
    case 'Closet':
      return (
        <OutfitIllustration
          shape={demo ? 'dress' : outfitShapeForId(id, status)}
          color={demo ? 'blush' : color}
          size={size}
          className={className}
          heart={heart}
        />
      )
    case 'Desktop':
      return (
        <DesktopObjectIllustration
          shape={demo ? 'folder' : desktopShapeForId(id, status)}
          color={demo ? 'honey' : color}
          size={size}
          className={className}
          heart={heart}
        />
      )
    case 'Workshop':
      return (
        <WorkshopPieceIllustration
          shape={demo ? 'frame' : workshopShapeForId(id, status)}
          color={demo ? 'terracotta' : color}
          size={size}
          className={className}
          heart={heart}
        />
      )
    default:
      return (
        <PlantIllustration
          shape={demo ? 'sprout' : plantShapeForId(id, status)}
          color={demo ? 'sage' : color}
          size={size}
          className={className}
          heart={heart}
        />
      )
  }
}
