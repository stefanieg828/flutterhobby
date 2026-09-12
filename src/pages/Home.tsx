import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Hobby, HobbyStatus } from '../types'
import { STATUS_LABELS, applyProgressBump, computeNextNudgeAt } from '../types'
import {
  clearHyperfocusSession,
  loadHobbies,
  loadHyperfocusSession,
  saveHobbies,
  saveHyperfocusSession,
} from '../storage'
import { deleteAllPhotosForHobby } from '../photoStorage'
import { deleteAllAudioForHobby } from '../audioStorage'
import { deleteAllAchievementsForHobby } from '../achievementStorage'
import { useTheme } from '../ThemeContext'
import { themeRoomClass } from '../theme'
import { CreateHobbyForm } from '../components/CreateHobbyForm'
import { ThemeBuddy } from '../components/ThemeBuddy'
import { ThemeObjectArt } from '../components/ThemeObjectArt'
import { BasementDecor } from '../components/BasementDecor'
import { ClosetDecor } from '../components/ClosetDecor'
import { DesktopDecor } from '../components/DesktopDecor'
import { WorkshopDecor } from '../components/WorkshopDecor'
import { PlantTile } from '../components/PlantTile'
import { HobbyBench } from '../components/HobbyBench'
import { HyperfocusView } from '../components/HyperfocusView'
import { NudgeHints } from '../components/NudgeHints'
import { InstallAppButton } from '../components/InstallApp'
import './Home.css'

const SEED: Hobby[] = [
  {
    id: 'seed-watercolor',
    name: 'Watercolor mornings',
    creating: 'Soft landscapes in gouache',
    cadence: 'every-few-days',
    petName: 'Fern',
    status: 'in-season',
    progress: 15,
    color: 'sage',
    createdAt: new Date().toISOString(),
    lastTendedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    nextNudgeAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'seed-item-washes',
        name: 'Sky wash practice',
        note: 'Try softer edges next time',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'seed-knitting',
    name: 'Cozy knit scarf',
    creating: 'Learning brioche stitch',
    cadence: 'weekly',
    status: 'resting',
    progress: 5,
    color: 'blush',
    createdAt: new Date().toISOString(),
    items: [],
    nextNudgeAt: computeNextNudgeAt(new Date().toISOString(), 'weekly'),
  },
  {
    id: 'seed-zine',
    name: 'Mini zine shelf',
    creating: 'Printed edition of doodle comics',
    cadence: 'when-inspired',
    petName: 'Ink',
    status: 'proud-shelf',
    progress: 60,
    color: 'honey',
    createdAt: new Date().toISOString(),
    items: [
      {
        id: 'seed-item-cover',
        name: 'Cover collage scraps',
        createdAt: new Date().toISOString(),
      },
    ],
  },
]

const EMPTY_SLOTS = 3

function GreenhouseDecor() {
  const art = `${import.meta.env.BASE_URL}art/greenhouse`
  return (
    <div className="gh-decor" aria-hidden="true">
      <img className="gh-decor__room-bg" src={`${art}/room-bg.png`} alt="" />
      <div className="gh-decor__haze" />
    </div>
  )
}

function WoodSign({
  status,
  count,
  id,
}: {
  status: HobbyStatus
  count: number
  id: string
}) {
  const icon = status === 'proud-shelf' ? '♡' : status === 'resting' ? '❀' : '❀'
  const label =
    status === 'proud-shelf' ? `${STATUS_LABELS[status]} ♡` : STATUS_LABELS[status]

  return (
    <div className={`wood-sign wood-sign--${status}`}>
      <span className="wood-sign__twine" aria-hidden="true" />
      <div className="wood-sign__plank">
        <span className="wood-sign__icon" aria-hidden="true">
          {icon}
        </span>
        <h2 id={id} className="wood-sign__label">
          {label}
        </h2>
        {count > 0 ? <span className="wood-sign__count">{count}</span> : null}
      </div>
    </div>
  )
}

function EmptyRing({ kind = 'pot' }: { kind?: 'pot' | 'crate' | 'hanger' | 'icon' | 'peg' }) {
  if (kind === 'crate') {
    return (
      <span className="empty-ring empty-ring--crate" aria-hidden="true">
        <svg viewBox="0 0 48 56" width="40" height="48">
          <rect x="8" y="22" width="32" height="24" rx="2" fill="none" stroke="#8a7a68" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.5" />
          <line x1="8" y1="30" x2="40" y2="30" stroke="#8a7a68" strokeWidth="1.2" strokeDasharray="3 2.5" opacity="0.4" />
        </svg>
      </span>
    )
  }
  if (kind === 'hanger') {
    return (
      <span className="empty-ring" aria-hidden="true">
        <svg viewBox="0 0 48 56" width="40" height="48">
          <path d="M24 12 Q24 6 30 6 Q34 6 34 10" fill="none" stroke="#c4a0b8" strokeWidth="1.6" strokeDasharray="3 2.5" opacity="0.55" />
          <path d="M12 22 Q24 14 36 22" fill="none" stroke="#c4a0b8" strokeWidth="1.6" strokeDasharray="3 2.5" opacity="0.5" />
        </svg>
      </span>
    )
  }
  if (kind === 'icon') {
    return (
      <span className="empty-ring" aria-hidden="true">
        <svg viewBox="0 0 48 56" width="40" height="48">
          <rect x="10" y="18" width="28" height="22" rx="3" fill="none" stroke="#7eb8da" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.5" />
        </svg>
      </span>
    )
  }
  if (kind === 'peg') {
    return (
      <span className="empty-ring" aria-hidden="true">
        <svg viewBox="0 0 48 56" width="40" height="48">
          <rect x="10" y="16" width="28" height="28" rx="2" fill="none" stroke="#8a7040" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.5" />
          <circle cx="24" cy="30" r="3" fill="none" stroke="#8a7040" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.45" />
        </svg>
      </span>
    )
  }
  return (
    <span className="empty-ring" aria-hidden="true">
      <svg viewBox="0 0 48 56" width="40" height="48">
        <ellipse cx="24" cy="30" rx="16" ry="5" fill="none" stroke="#c4b49a" strokeWidth="1.6" strokeDasharray="3 2.5" opacity="0.55" />
        <path
          d="M10 30 L13 48 Q24 54 35 48 L38 30"
          fill="none"
          stroke="#c4b49a"
          strokeWidth="1.5"
          strokeDasharray="3 2.5"
          opacity="0.45"
        />
      </svg>
    </span>
  )
}

function ShelfBay({
  hobbies,
  onSelect,
  slots = EMPTY_SLOTS,
  emptyKind = 'pot',
  hideEmpty = false,
}: {
  hobbies: Hobby[]
  onSelect: (id: string) => void
  slots?: number
  emptyKind?: 'pot' | 'crate' | 'hanger' | 'icon' | 'peg'
  hideEmpty?: boolean
}) {
  const empties = hideEmpty ? 0 : Math.max(0, slots - hobbies.length)
  return (
    <div className="shelf-bay">
      {hobbies.map((hobby) => (
        <PlantTile key={hobby.id} hobby={hobby} onSelect={onSelect} compact />
      ))}
      {Array.from({ length: empties }, (_, i) => (
        <EmptyRing key={`empty-${i}`} kind={emptyKind} />
      ))}
    </div>
  )
}

function WoodShelf({ tone = 'warm' }: { tone?: 'warm' | 'cool' | 'gold' }) {
  return (
    <div className={`wood-shelf wood-shelf--${tone}`} aria-hidden="true">
      <div className="wood-shelf__plank" />
      <div className="wood-shelf__lip" />
    </div>
  )
}

function CenterWateringScene({
  watering,
  sparkles,
  theme,
}: {
  watering: boolean
  sparkles: boolean
  theme: import('../theme').PlayableTheme
}) {
  const skin = theme === 'Greenhouse' ? ' center-stage--painted' : ` center-stage--${theme.toLowerCase()}`
  return (
    <div
      className={`center-stage${watering ? ' center-stage--watering' : ''}${sparkles ? ' center-stage--sparkle' : ''}${skin}`}
    >
      {theme === 'Greenhouse' ? (
        <>
          <span className="center-stage__painted-sprout" aria-hidden="true" />
          {sparkles ? (
            <svg className="center-stage__sparkles center-stage__sparkles--hot" viewBox="0 0 80 60" aria-hidden="true">
              <g fill="#f5d76e" stroke="#c4a24e" strokeWidth="0.8">
                <path d="M18 28 L20 22 L22 28 L28 30 L22 32 L20 38 L18 32 L12 30 Z" />
                <path d="M42 14 L43.5 10 L45 14 L49 15.5 L45 17 L43.5 21 L42 17 L38 15.5 Z" />
                <path d="M58 34 L59.5 30 L61 34 L65 35.5 L61 37 L59.5 41 L58 37 L54 35.5 Z" />
              </g>
            </svg>
          ) : null}
        </>
      ) : (
        <div className="center-stage__sprout">
          <ThemeBuddy theme={theme} scene quiet tending={watering} />
        </div>
      )}
      {theme === 'Greenhouse' ? null : (
      <div className="center-stage__plant" aria-hidden="true">
        <ThemeObjectArt theme={theme} id="center-demo" size={88} demo />
        {watering ? (
          <svg className={`center-stage__sparkles${sparkles ? ' center-stage__sparkles--hot' : ''}`} viewBox="0 0 80 60" aria-hidden="true">
            <g fill="#f5d76e" stroke="#c4a24e" strokeWidth="0.8">
              <path d="M18 28 L20 22 L22 28 L28 30 L22 32 L20 38 L18 32 L12 30 Z" />
              <path d="M42 14 L43.5 10 L45 14 L49 15.5 L45 17 L43.5 21 L42 17 L38 15.5 Z" />
              <path d="M58 34 L59.5 30 L61 34 L65 35.5 L61 37 L59.5 41 L58 37 L54 35.5 Z" />
              <circle cx="32" cy="42" r="2" fill="#ffe9a0" stroke="none" />
              <circle cx="52" cy="24" r="1.6" fill="#fffef8" stroke="none" />
            </g>
            <g fill="#c4ad8c" opacity="0.75">
              <circle cx="28" cy="18" r="1.8" />
              <circle cx="36" cy="12" r="1.4" />
              <circle cx="44" cy="20" r="1.6" />
            </g>
          </svg>
        ) : null}
      </div>
      )}
    </div>
  )
}

function BenchProps({ theme, chalkLine1, chalkLine2 }: { theme: import('../theme').PlayableTheme; chalkLine1: string; chalkLine2: string }) {
  if (theme === 'Basement') {
    return (
      <svg className="potting-bench__props" viewBox="0 0 200 72" aria-hidden="true">
        <g transform="translate(6,16)">
          <rect x="0" y="14" width="52" height="30" rx="3" fill="#8a7040" stroke="#3d2e1f" strokeWidth="2" />
          <rect x="0" y="14" width="52" height="10" rx="2" fill="#a08050" stroke="#3d2e1f" strokeWidth="1.6" />
          <path d="M14 14 L14 6 Q26 0 38 6 L38 14" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1.5" />
          <rect x="20" y="26" width="12" height="8" rx="1" fill="#5a4a3a" stroke="#3d2e1f" strokeWidth="1.1" />
        </g>
        <g transform="translate(70,18)">
          <rect x="0" y="10" width="44" height="32" rx="3" fill="#6a5a70" stroke="#3d2e1f" strokeWidth="2" />
          <rect x="6" y="16" width="18" height="12" rx="1" fill="#2a3028" stroke="#3d2e1f" strokeWidth="1.2" />
          <circle cx="34" cy="22" r="6" fill="#e6b84d" stroke="#3d2e1f" strokeWidth="1.3" />
          <path d="M12 10 L12 0 Q22 -4 32 0 L32 10" stroke="#3d2e1f" strokeWidth="1.8" fill="none" />
        </g>
        <g transform="translate(128,10)">
          <rect x="0" y="18" width="22" height="10" rx="2" fill="#5a6a70" stroke="#3d2e1f" strokeWidth="1.5" />
          <rect x="22" y="14" width="10" height="18" rx="2" fill="#8a9aa8" stroke="#3d2e1f" strokeWidth="1.5" />
          <circle cx="36" cy="23" r="4" fill="#ffe9a0" stroke="#c4a24e" strokeWidth="1.1" />
        </g>
        <g transform="translate(158,18)">
          <rect x="0" y="0" width="40" height="28" rx="2" fill="#2a241c" stroke="#3d2e1f" strokeWidth="1.8" />
          <rect x="-2" y="-2" width="44" height="4" rx="1" fill="#8a7040" stroke="#3d2e1f" strokeWidth="1.2" />
          <text x="20" y="12" textAnchor="middle" fontSize="4" fill="#e8d4b0" fontFamily="sans-serif">{chalkLine1}</text>
          <text x="20" y="20" textAnchor="middle" fontSize="4" fill="#e8d4b0" fontFamily="sans-serif">{chalkLine2}</text>
        </g>
      </svg>
    )
  }
  if (theme === 'Closet') {
    return (
      <svg className="potting-bench__props" viewBox="0 0 200 72" aria-hidden="true">
        <g transform="translate(8,12)">
          <path d="M20 8 Q20 0 28 0 Q34 0 34 6" stroke="#8a7a68" strokeWidth="2" fill="none" />
          <path d="M4 16 Q20 8 36 16" stroke="#8a7a68" strokeWidth="2.2" fill="none" />
          <path d="M8 18 L32 18 L34 44 Q20 52 6 44 Z" fill="#b39bc8" stroke="#5a4060" strokeWidth="1.6" />
        </g>
        <g transform="translate(58,20)">
          <ellipse cx="24" cy="18" rx="22" ry="16" fill="#f2d6e4" stroke="#5a4060" strokeWidth="1.8" />
          <path d="M10 18 Q24 8 38 18" stroke="#fffef8" strokeWidth="2" fill="none" opacity="0.5" />
        </g>
        <g transform="translate(118,14)">
          <rect x="0" y="8" width="28" height="36" rx="3" fill="#e8d0e0" stroke="#5a4060" strokeWidth="1.6" />
          <circle cx="14" cy="20" r="6" fill="#ffe9a0" stroke="#c4a24e" strokeWidth="1.2" />
        </g>
        <g transform="translate(158,18)">
          <rect x="0" y="0" width="40" height="28" rx="2" fill="#5a4060" stroke="#3d2e1f" strokeWidth="1.8" />
          <rect x="-2" y="-2" width="44" height="4" rx="1" fill="#c4a0b8" stroke="#5a4060" strokeWidth="1.2" />
          <text x="20" y="12" textAnchor="middle" fontSize="4" fill="#f8e8f0" fontFamily="sans-serif">{chalkLine1}</text>
          <text x="20" y="20" textAnchor="middle" fontSize="4" fill="#f8e8f0" fontFamily="sans-serif">{chalkLine2}</text>
        </g>
      </svg>
    )
  }
  if (theme === 'Desktop') {
    return (
      <svg className="potting-bench__props" viewBox="0 0 200 72" aria-hidden="true">
        <g transform="translate(6,18)">
          <path d="M0 14 L14 14 L18 20 L48 20 L48 44 L0 44 Z" fill="#e6b84d" stroke="#2a3028" strokeWidth="1.8" />
          <path d="M0 20 L48 20 L48 14 L24 14 L20 8 L0 8 Z" fill="#f5d76e" stroke="#2a3028" strokeWidth="1.5" />
        </g>
        <g transform="translate(64,16)">
          <rect x="0" y="8" width="40" height="36" rx="3" fill="#7eb8da" stroke="#2a3028" strokeWidth="1.8" />
          <rect x="0" y="8" width="40" height="10" rx="3" fill="#5a8fb0" stroke="#2a3028" strokeWidth="1.3" />
          <circle cx="8" cy="13" r="2" fill="#e8a0b0" />
          <circle cx="14" cy="13" r="2" fill="#e6b84d" />
          <circle cx="20" cy="13" r="2" fill="#7cb87c" />
        </g>
        <g transform="translate(118,22)">
          <rect x="0" y="0" width="28" height="32" rx="2" fill="#ffe9a0" stroke="#2a3028" strokeWidth="1.5" />
          <line x1="6" y1="10" x2="22" y2="10" stroke="#2a3028" strokeWidth="1" opacity="0.35" />
          <line x1="6" y1="16" x2="18" y2="16" stroke="#2a3028" strokeWidth="1" opacity="0.3" />
        </g>
        <g transform="translate(158,18)">
          <rect x="0" y="0" width="40" height="28" rx="2" fill="#2a3028" stroke="#5a6a70" strokeWidth="1.8" />
          <rect x="-2" y="-2" width="44" height="4" rx="1" fill="#e6b84d" stroke="#2a3028" strokeWidth="1.2" />
          <text x="20" y="12" textAnchor="middle" fontSize="4" fill="#e8f0e4" fontFamily="monospace">{chalkLine1}</text>
          <text x="20" y="20" textAnchor="middle" fontSize="4" fill="#e8f0e4" fontFamily="monospace">{chalkLine2}</text>
        </g>
      </svg>
    )
  }
  if (theme === 'Workshop') {
    return (
      <svg className="potting-bench__props" viewBox="0 0 200 72" aria-hidden="true">
        <g transform="translate(8,14)">
          <rect x="18" y="0" width="8" height="40" rx="1" fill="#8a7040" stroke="#3d2e1f" strokeWidth="1.5" />
          <rect x="8" y="0" width="28" height="14" rx="2" fill="#8a9aa8" stroke="#3d2e1f" strokeWidth="1.6" />
        </g>
        <g transform="translate(58,20)">
          <rect x="0" y="10" width="44" height="28" rx="2" fill="#c47a5a" stroke="#3d2e1f" strokeWidth="1.8" />
          <circle cx="22" cy="24" r="6" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1.3" />
        </g>
        <g transform="translate(118,16)">
          <rect x="4" y="4" width="36" height="40" rx="2" fill="#8a7a68" stroke="#3d2e1f" strokeWidth="1.6" opacity="0.75" />
          <circle cx="14" cy="16" r="3" fill="#5c4a3a" />
          <circle cx="30" cy="16" r="3" fill="#5c4a3a" />
          <circle cx="14" cy="32" r="3" fill="#5c4a3a" />
          <circle cx="30" cy="32" r="3" fill="#e6b84d" />
        </g>
        <g transform="translate(158,18)">
          <rect x="0" y="0" width="40" height="28" rx="2" fill="#3d2e1f" stroke="#8a7040" strokeWidth="1.8" />
          <rect x="-2" y="-2" width="44" height="4" rx="1" fill="#a6855e" stroke="#3d2e1f" strokeWidth="1.2" />
          <text x="20" y="12" textAnchor="middle" fontSize="4" fill="#e8d4b0" fontFamily="sans-serif">{chalkLine1}</text>
          <text x="20" y="20" textAnchor="middle" fontSize="4" fill="#e8d4b0" fontFamily="sans-serif">{chalkLine2}</text>
        </g>
      </svg>
    )
  }
  // Greenhouse default — illustrated watering can, crate, gloves, trowel, chalk
  return (
    <svg className="potting-bench__props" viewBox="0 0 200 72" aria-hidden="true">
      <g transform="translate(2,6)">
        <path d="M14 16 L50 16 L46 50 Q30 58 16 50 Z" fill="#6aaa6a" stroke="#2a4030" strokeWidth="2.3" />
        <path d="M20 24 L24 44" stroke="#9fd49f" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
        <rect x="10" y="8" width="44" height="11" rx="2.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="2.3" />
        <path d="M50 14 C66 8 72 30 58 38" stroke="#2a4030" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M50 14 C66 8 72 30 58 38" stroke="#7cb87c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M58 38 L68 48" stroke="#2a4030" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M31 30 C29 28 25 28 25 32 C25 35 31 40 31 40 C31 40 37 35 37 32 C37 28 33 28 31 30 Z" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1.3" />
      </g>
      <g transform="translate(74,18)">
        <rect x="0" y="10" width="50" height="34" rx="3" fill="#c4ad8c" stroke="#2a4030" strokeWidth="2.1" />
        <path d="M3 10 C6 0 44 0 47 10" fill="#d7c4a8" stroke="#2a4030" strokeWidth="1.9" />
        {/* weave on crate */}
        <path d="M4 20 H46 M4 28 H46 M4 36 H46" stroke="#8a6840" strokeWidth="1" opacity="0.35" />
        {/* gloves */}
        <ellipse cx="16" cy="28" rx="9" ry="7" fill="#e8d4b0" stroke="#2a4030" strokeWidth="1.4" />
        <ellipse cx="14" cy="24" rx="3" ry="4" fill="#d4c0a0" stroke="#2a4030" strokeWidth="1.1" />
        <ellipse cx="34" cy="30" rx="8" ry="6.5" fill="#d4c0a0" stroke="#2a4030" strokeWidth="1.4" />
        <path d="M30 26 Q34 22 38 26" stroke="#2a4030" strokeWidth="1.1" fill="none" />
      </g>
      <g transform="translate(130,4)">
        <rect x="10" y="0" width="8" height="24" rx="2" fill="#c4ad8c" stroke="#2a4030" strokeWidth="1.7" />
        <path d="M5 24 L25 24 L20 52 Q14 58 10 52 Z" fill="#8a9aa8" stroke="#2a4030" strokeWidth="1.7" />
        <path d="M10 32 L14 48" stroke="#c8d4dc" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </g>
      <g transform="translate(156,16)">
        <rect x="0" y="0" width="42" height="32" rx="2.5" fill="#3d4a40" stroke="#2a4030" strokeWidth="1.9" />
        <rect x="-2" y="-3" width="46" height="5" rx="1.2" fill="#a6855e" stroke="#2a4030" strokeWidth="1.2" />
        <text x="21" y="14" textAnchor="middle" fontSize="4.4" fill="#e8f0e4" fontFamily="sans-serif">{chalkLine1}</text>
        <text x="21" y="23" textAnchor="middle" fontSize="4.4" fill="#e8f0e4" fontFamily="sans-serif">{chalkLine2}</text>
      </g>
    </svg>
  )
}

function PottingBenchScene({
  onPlantClick,
  theme,
  plaque,
  chalk,
  fabLabel,
}: {
  onPlantClick: () => void
  theme: import('../theme').PlayableTheme
  plaque: string
  chalk: string
  fabLabel: string
}) {
  // Prefer splitting on comma for chalkboard lines; fall back to ~half
  let line1 = chalk
  let line2 = ''
  if (chalk.includes(',')) {
    const idx = chalk.indexOf(',')
    line1 = chalk.slice(0, idx + 1).trim()
    line2 = chalk.slice(idx + 1).trim()
  } else {
    const words = chalk.split(' ')
    const mid = Math.ceil(words.length / 2)
    line1 = words.slice(0, mid).join(' ')
    line2 = words.slice(mid).join(' ')
  }
  const painted = theme === 'Greenhouse'
  const skin = painted ? ' potting-bench--painted' : ` potting-bench--${theme.toLowerCase()}`
  return (
    <div className={`potting-bench${skin}`}>
      <div className="potting-bench__surface">
        {painted ? null : <BenchProps theme={theme} chalkLine1={line1} chalkLine2={line2} />}
        <button
          type="button"
          className="potting-bench__fab"
          onClick={onPlantClick}
          aria-label={fabLabel}
          title={fabLabel}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <div className="potting-bench__legs">
        <span className="potting-bench__plaque">{plaque}</span>
      </div>
      {painted ? null : <p className="potting-bench__chalk">{chalk}</p>}
    </div>
  )
}

function RoomDecor({ theme }: { theme: import('../theme').PlayableTheme }) {
  switch (theme) {
    case 'Basement':
      return <BasementDecor />
    case 'Closet':
      return <ClosetDecor />
    case 'Desktop':
      return <DesktopDecor />
    case 'Workshop':
      return <WorkshopDecor />
    default:
      return <GreenhouseDecor />
  }
}

export function Home() {
  const { theme, copy } = useTheme()
  const roomSkin = themeRoomClass(theme)
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [ready, setReady] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [justTendedId, setJustTendedId] = useState<string | null>(null)
  const [showArchive, setShowArchive] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [hyperfocusId, setHyperfocusId] = useState<string | null>(null)
  const [exitToast, setExitToast] = useState<string | null>(null)

  useEffect(() => {
    const stored = loadHobbies()
    let list = stored
    if (stored.length === 0) {
      saveHobbies(SEED)
      list = SEED
      setHobbies(SEED)
    } else {
      setHobbies(stored)
    }

    // Restore an open hyperfocus season across refresh / days.
    const session = loadHyperfocusSession()
    if (session && list.some((h) => h.id === session.hobbyId)) {
      setHyperfocusId(session.hobbyId)
    } else if (session) {
      clearHyperfocusSession()
    }
    setReady(true)
  }, [])

  const persist = useCallback((next: Hobby[]) => {
    setHobbies(next)
    saveHobbies(next)
  }, [])

  const selected = useMemo(
    () => hobbies.find((h) => h.id === selectedId) ?? null,
    [hobbies, selectedId],
  )

  const hyperfocusHobby = useMemo(
    () => hobbies.find((h) => h.id === hyperfocusId) ?? null,
    [hobbies, hyperfocusId],
  )

  const zones = useMemo(() => {
    const byStatus = (status: HobbyStatus) => hobbies.filter((h) => h.status === status)
    return {
      'in-season': byStatus('in-season'),
      resting: byStatus('resting'),
      'proud-shelf': byStatus('proud-shelf'),
      archive: byStatus('archive'),
    }
  }, [hobbies])

  const sproutMessage = useMemo(() => {
    const active = zones['in-season'].length
    if (!ready) return copy.whisperLoading
    if (hobbies.length === 0) return copy.whisperEmpty
    if (justTendedId) return copy.whisperTended
    if (active === 0) return copy.whisperNoActive
    return copy.whisperIdle
  }, [ready, hobbies.length, zones, justTendedId, copy])

  // Center scene mirrors the mock: Sprout mid-water; sparkles amp up after a tend
  const isWatering = true
  const showSparkles = Boolean(justTendedId)

  function handleCreate(hobby: Hobby) {
    persist([hobby, ...hobbies])
    setSelectedId(hobby.id)
    setCreateOpen(false)
  }

  function handleTend(id: string, amountPercent: number) {
    const now = new Date().toISOString()
    persist(
      hobbies.map((h) =>
        h.id === id
          ? {
              ...h,
              progress: applyProgressBump(h.progress, amountPercent),
              lastTendedAt: now,
              nextNudgeAt: computeNextNudgeAt(now, h.cadence),
              status: h.status === 'resting' || h.status === 'archive' ? 'in-season' : h.status,
            }
          : h,
      ),
    )
    setJustTendedId(id)
    window.setTimeout(() => setJustTendedId((cur) => (cur === id ? null : cur)), 1400)
  }

  function handleUpdate(hobby: Hobby) {
    persist(hobbies.map((h) => (h.id === hobby.id ? hobby : h)))
  }

  function handleDelete(id: string) {
    persist(hobbies.filter((h) => h.id !== id))
    setSelectedId(null)
    if (hyperfocusId === id) {
      clearHyperfocusSession()
      setHyperfocusId(null)
    }
    void deleteAllPhotosForHobby(id)
    void deleteAllAudioForHobby(id)
    deleteAllAchievementsForHobby(id)
  }

  function enterHyperfocus(id: string) {
    setSelectedId(null)
    setCreateOpen(false)
    const existing = loadHyperfocusSession()
    const startedAt =
      existing && existing.hobbyId === id ? existing.startedAt : new Date().toISOString()
    const until = existing && existing.hobbyId === id ? existing.until : undefined
    saveHyperfocusSession({ hobbyId: id, startedAt, until })
    setHyperfocusId(id)
  }

  function leaveHyperfocus(message: string) {
    clearHyperfocusSession()
    setHyperfocusId(null)
    setExitToast(message)
    window.setTimeout(() => setExitToast((cur) => (cur === message ? null : cur)), 2200)
  }

  return (
    <section className={`page home greenhouse${roomSkin ? ` ${roomSkin}` : ''}${theme === 'Greenhouse' ? ' greenhouse--painted' : ''}`}>
      <header className="greenhouse__header">
        <div className="greenhouse__header-row">
          <div className="greenhouse__header-text">
            <p className="greenhouse__brand">
              <span className="greenhouse__butterfly" aria-hidden="true">
                {copy.brandMark}
              </span>
              FlutterHobby
            </p>
            <p className="greenhouse__tagline">{copy.tagline}</p>
          </div>
          <InstallAppButton variant="chip" />
        </div>
      </header>

      <div className="greenhouse__room">
        <RoomDecor theme={theme} />

        <p className="greenhouse__whisper" aria-live="polite">
          {sproutMessage}
        </p>

        {ready ? (
          <NudgeHints hobbies={hobbies} onOpenHobby={setSelectedId} />
        ) : null}

        {!ready ? (
          <p className="muted greenhouse__loading">{copy.whisperLoading}</p>
        ) : (
          <div
            className="gh-scene"
            role="region"
            aria-label={copy.roomAria}
          >
            {/* LEFT — In season + Resting furniture shelves */}
            <aside className="gh-left" aria-label="In season and Resting shelves">
              <div className="left-unit">
                <div className="left-unit__posts" aria-hidden="true">
                  <span className="left-unit__post left-unit__post--left" />
                  <span className="left-unit__post left-unit__post--right" />
                </div>
                <div className="left-unit__back" aria-hidden="true" />

                <div className="left-tier" aria-labelledby="shelf-in-season">
                  <WoodSign status="in-season" count={zones['in-season'].length} id="shelf-in-season" />
                  <ShelfBay
                    hobbies={zones['in-season']}
                    onSelect={setSelectedId}
                    slots={3}
                    emptyKind={copy.emptyKind}
                    hideEmpty={theme === 'Greenhouse'}
                  />
                  <WoodShelf tone="warm" />
                </div>

                <div className="left-tier" aria-labelledby="shelf-resting">
                  <WoodSign status="resting" count={zones.resting.length} id="shelf-resting" />
                  <ShelfBay
                    hobbies={zones.resting}
                    onSelect={setSelectedId}
                    slots={3}
                    emptyKind={copy.emptyKind}
                    hideEmpty={theme === 'Greenhouse'}
                  />
                  <WoodShelf tone="cool" />
                </div>
              </div>
            </aside>

            {/* CENTER — buddy tending */}
            <div className="gh-center">
              <CenterWateringScene
                watering={isWatering}
                sparkles={showSparkles}
                theme={theme}
              />
            </div>

            {/* RIGHT — Proud shelf + workbench */}
            <aside
              className="gh-right"
              aria-label={copy.rightAria}
            >
              <div className="proud-unit" aria-labelledby="shelf-proud-shelf">
                <WoodSign
                  status="proud-shelf"
                  count={zones['proud-shelf'].length}
                  id="shelf-proud-shelf"
                />
                <ShelfBay
                  hobbies={zones['proud-shelf']}
                  onSelect={setSelectedId}
                  slots={2}
                  emptyKind={copy.emptyKind}
                  hideEmpty={theme === 'Greenhouse'}
                />
                <WoodShelf tone="gold" />
              </div>
              <PottingBenchScene
                onPlantClick={() => setCreateOpen(true)}
                theme={theme}
                plaque={copy.workbenchPlaque}
                chalk={copy.workbenchChalk}
                fabLabel={copy.createFab}
              />
            </aside>
          </div>
        )}

        {hobbies.length === 0 && ready ? (
          <p className="muted greenhouse__empty">{copy.emptyHint}</p>
        ) : null}
      </div>

        {createOpen ? (
          <div className="greenhouse__create">
            <CreateHobbyForm
              onCreate={handleCreate}
              open
              onCancel={() => setCreateOpen(false)}
            />
          </div>
        ) : null}

        <details
          className="greenhouse__archive"
          open={showArchive}
          onToggle={(e) => setShowArchive((e.target as HTMLDetailsElement).open)}
        >
          <summary className="greenhouse__archive-summary">
            <span>Archive</span>
            <span className="wood-sign__count">{zones.archive.length}</span>
          </summary>
          <p className="greenhouse__archive-hint">{copy.archiveHint}</p>
          {zones.archive.length === 0 ? (
            <p className="shelf-empty-note">Nothing archived.</p>
          ) : (
            <div className="shelf-bay shelf-bay--archive">
              {zones.archive.map((hobby) => (
                <PlantTile key={hobby.id} hobby={hobby} onSelect={setSelectedId} compact />
              ))}
            </div>
          )}
        </details>

      {selected && !hyperfocusHobby ? (
        <HobbyBench
          hobby={selected}
          onClose={() => setSelectedId(null)}
          onTend={handleTend}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onEnterHyperfocus={enterHyperfocus}
          justTended={justTendedId === selected.id}
        />
      ) : null}

      {hyperfocusHobby ? (
        <HyperfocusView
          hobby={hyperfocusHobby}
          onTend={handleTend}
          onExit={leaveHyperfocus}
          justTended={justTendedId === hyperfocusHobby.id}
        />
      ) : null}

      {exitToast ? (
        <div className="greenhouse__exit-toast" role="status" aria-live="polite">
          {exitToast}
        </div>
      ) : null}
    </section>
  )
}
