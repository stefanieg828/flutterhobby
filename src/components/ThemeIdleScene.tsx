import type { PlayableTheme } from '../theme'
import { themeIdleSrc } from '../themeArt'
import './GreenhouseScene.css'

const IDLE_POS = { x: 48, y: 76 }

interface ThemeIdleSceneProps {
  theme: PlayableTheme
  sparkles?: boolean
}

/**
 * Live idle buddy jacket for painted rooms (non-Greenhouse).
 * No carry choreography — Home opens HobbyBench instantly on shelf tap.
 */
export function ThemeIdleScene({ theme, sparkles = false }: ThemeIdleSceneProps) {
  const src = themeIdleSrc(theme)
  const name =
    theme === 'Basement'
      ? 'Dusty'
      : theme === 'Closet'
        ? 'Mira'
        : theme === 'Desktop'
          ? 'Pixel'
          : theme === 'Workshop'
            ? 'Rip'
            : 'Sprout'

  return (
    <div
      className={`gh-actor gh-actor--idle${sparkles ? ' gh-actor--sparkle' : ''}`}
      style={{
        left: `${IDLE_POS.x}%`,
        top: `${IDLE_POS.y}%`,
      }}
      aria-label={`${name} waiting in the room`}
      data-carry-phase="idle"
    >
      <div className="gh-actor__body">
        <img className="gh-actor__sprite" src={src} alt="" draggable={false} />
        {sparkles ? (
          <svg className="gh-actor__sparkles" viewBox="0 0 80 60" aria-hidden="true">
            <g fill="#f5d76e" stroke="#c4a24e" strokeWidth="0.8">
              <path d="M18 28 L20 22 L22 28 L28 30 L22 32 L20 38 L18 32 L12 30 Z" />
              <path d="M42 14 L43.5 10 L45 14 L49 15.5 L45 17 L43.5 21 L42 17 L38 15.5 Z" />
              <path d="M58 34 L59.5 30 L61 34 L65 35.5 L61 37 L59.5 41 L58 37 L54 35.5 Z" />
            </g>
          </svg>
        ) : null}
      </div>
    </div>
  )
}
