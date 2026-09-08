import type { PlayableTheme } from '../theme'
import { SproutBuddy } from './SproutBuddy'
import { DustyBuddy } from './DustyBuddy'
import { MiraBuddy } from './MiraBuddy'
import { PixelBuddy } from './PixelBuddy'
import { RipBuddy } from './RipBuddy'

interface ThemeBuddyProps {
  theme: PlayableTheme
  message?: string
  scene?: boolean
  quiet?: boolean
  tending?: boolean
}

export function ThemeBuddy({ theme, message, scene, quiet, tending = false }: ThemeBuddyProps) {
  switch (theme) {
    case 'Basement':
      return <DustyBuddy message={message} scene={scene} quiet={quiet} tending={tending} />
    case 'Closet':
      return <MiraBuddy message={message} scene={scene} quiet={quiet} tending={tending} />
    case 'Desktop':
      return <PixelBuddy message={message} scene={scene} quiet={quiet} tending={tending} />
    case 'Workshop':
      return <RipBuddy message={message} scene={scene} quiet={quiet} tending={tending} />
    default:
      return <SproutBuddy message={message} scene={scene} quiet={quiet} watering={tending} />
  }
}
