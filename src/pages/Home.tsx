import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Hobby, HobbyStatus } from '../types'
import { STATUS_LABELS, applyProgressBump, computeNextNudgeAt } from '../types'
import { loadHobbies, saveHobbies } from '../storage'
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
  return (
    <div className="gh-decor" aria-hidden="true">
      {/* warm sunbeams */}
      <div className="gh-decor__sunbeams" />
      <div className="gh-decor__haze" />

      {/* greenhouse glass + white wood frames */}
      <svg className="gh-decor__panes" viewBox="0 0 400 560" preserveAspectRatio="none">
        <defs>
          <linearGradient id="paneGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffef8" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#fdfbe2" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#c8e0c0" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="392" height="552" rx="18" fill="url(#paneGlass)" stroke="#e8e0d0" strokeWidth="7" />
        <rect x="10" y="10" width="380" height="540" rx="14" fill="none" stroke="#f5f0e6" strokeWidth="3" opacity="0.7" />
        <line x1="134" y1="10" x2="134" y2="550" stroke="#f0ebe0" strokeWidth="5" opacity="0.85" />
        <line x1="266" y1="10" x2="266" y2="550" stroke="#f0ebe0" strokeWidth="5" opacity="0.85" />
        <line x1="10" y1="145" x2="390" y2="145" stroke="#f0ebe0" strokeWidth="4" opacity="0.75" />
        <line x1="10" y1="290" x2="390" y2="290" stroke="#f0ebe0" strokeWidth="4" opacity="0.65" />
        <line x1="10" y1="420" x2="390" y2="420" stroke="#f0ebe0" strokeWidth="4" opacity="0.55" />
        {/* soft glass glare */}
        <rect x="22" y="24" width="95" height="55" rx="6" fill="#fffef8" opacity="0.28" />
        <rect x="148" y="160" width="100" height="48" rx="5" fill="#fdfbe2" opacity="0.18" />
        <rect x="280" y="28" width="95" height="50" rx="6" fill="#fffef8" opacity="0.22" />
      </svg>

      {/* dense hanging vines left */}
      <svg className="gh-decor__vines gh-decor__vines--left" viewBox="0 0 80 340">
        <path d="M40 0 C28 50 52 90 30 140 C12 190 48 230 34 300 C28 320 36 335 40 340" stroke="#3d6b42" strokeWidth="3" fill="none" />
        <path d="M52 10 C60 70 38 110 58 170 C70 210 48 250 62 300" stroke="#4a7a4e" strokeWidth="2.2" fill="none" opacity="0.85" />
        <ellipse cx="24" cy="48" rx="14" ry="8" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.3" transform="rotate(-35 24 48)" />
        <ellipse cx="48" cy="72" rx="13" ry="7.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.3" transform="rotate(28 48 72)" />
        <ellipse cx="20" cy="110" rx="12" ry="7" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.3" transform="rotate(-22 20 110)" />
        <ellipse cx="52" cy="140" rx="13" ry="7.5" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.3" transform="rotate(32 52 140)" />
        <ellipse cx="26" cy="178" rx="11" ry="6.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.3" transform="rotate(-18 26 178)" />
        <ellipse cx="50" cy="210" rx="12" ry="7" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.3" transform="rotate(24 50 210)" />
        <ellipse cx="28" cy="250" rx="11" ry="6.5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.3" transform="rotate(-26 28 250)" />
        <ellipse cx="48" cy="285" rx="10" ry="6" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.3" transform="rotate(20 48 285)" />
        <ellipse cx="32" cy="318" rx="9" ry="5.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.3" transform="rotate(-14 32 318)" />
        <circle cx="38" cy="95" r="3" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1" />
        <circle cx="44" cy="195" r="2.5" fill="#c47a5a" stroke="#2a4030" strokeWidth="1" />
      </svg>

      {/* dense vines right */}
      <svg className="gh-decor__vines gh-decor__vines--right" viewBox="0 0 80 300">
        <path d="M40 0 C52 45 28 85 50 135 C68 180 32 220 46 280" stroke="#3d6b42" strokeWidth="3" fill="none" />
        <path d="M28 8 C18 60 42 100 22 155 C10 195 36 235 26 285" stroke="#4a7a4e" strokeWidth="2.2" fill="none" opacity="0.85" />
        <ellipse cx="54" cy="42" rx="14" ry="8" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.3" transform="rotate(32 54 42)" />
        <ellipse cx="30" cy="78" rx="12" ry="7" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.3" transform="rotate(-28 30 78)" />
        <ellipse cx="56" cy="118" rx="13" ry="7.5" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.3" transform="rotate(22 56 118)" />
        <ellipse cx="26" cy="155" rx="11" ry="6.5" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.3" transform="rotate(-30 26 155)" />
        <ellipse cx="52" cy="190" rx="12" ry="7" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.3" transform="rotate(18 52 190)" />
        <ellipse cx="30" cy="230" rx="11" ry="6.5" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.3" transform="rotate(-24 30 230)" />
        <ellipse cx="48" cy="265" rx="10" ry="6" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.3" transform="rotate(16 48 265)" />
        <circle cx="40" cy="100" r="2.8" fill="#e6b84d" stroke="#2a4030" strokeWidth="1" />
        <circle cx="38" cy="210" r="2.5" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1" />
      </svg>

      {/* top draping vines */}
      <svg className="gh-decor__vines-top" viewBox="0 0 360 70">
        <path d="M0 8 Q40 28 80 10 T160 14 T240 8 T320 16 T360 10" stroke="#3d6b42" strokeWidth="2.5" fill="none" />
        <path d="M20 4 Q60 22 100 6 T200 12 T300 4" stroke="#4a7a4e" strokeWidth="1.8" fill="none" opacity="0.8" />
        <ellipse cx="50" cy="22" rx="11" ry="6.5" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.2" transform="rotate(40 50 22)" />
        <ellipse cx="110" cy="18" rx="10" ry="6" fill="#8fbc8f" stroke="#2a4030" strokeWidth="1.2" transform="rotate(-35 110 18)" />
        <ellipse cx="170" cy="24" rx="12" ry="7" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.2" transform="rotate(25 170 24)" />
        <ellipse cx="230" cy="16" rx="10" ry="6" fill="#9fd49f" stroke="#2a4030" strokeWidth="1.2" transform="rotate(-40 230 16)" />
        <ellipse cx="290" cy="22" rx="11" ry="6.5" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.2" transform="rotate(30 290 22)" />
      </svg>

      {/* glowing string lights */}
      <svg className="gh-decor__lights" viewBox="0 0 360 40">
        <defs>
          <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M8 10 Q60 28 120 12 T240 14 T352 10" stroke="#c4a24e" strokeWidth="1.6" fill="none" />
        {[
          [36, 16, '#ffe9a0'],
          [78, 22, '#fff4c8'],
          [120, 12, '#ffe0b0'],
          [162, 20, '#fff8d8'],
          [204, 14, '#ffe9a0'],
          [246, 20, '#fff4c8'],
          [288, 12, '#ffe0b0'],
          [328, 16, '#fff8d8'],
        ].map(([cx, cy, fill], i) => (
          <g key={i} filter="url(#bulbGlow)">
            <circle cx={cx} cy={cy} r="5" fill={String(fill)} opacity="0.95" />
            <circle cx={cx} cy={cy} r="2.8" fill="#fffef8" opacity="0.85" />
            <rect x={Number(cx) - 1.5} y={Number(cy) - 8} width="3" height="3.5" rx="0.5" fill="#8a7040" />
          </g>
        ))}
      </svg>

      <div className="gh-decor__floor" />
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
}: {
  hobbies: Hobby[]
  onSelect: (id: string) => void
  slots?: number
  emptyKind?: 'pot' | 'crate' | 'hanger' | 'icon' | 'peg'
}) {
  const empties = Math.max(0, slots - hobbies.length)
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
  const skin = theme === 'Greenhouse' ? '' : ` center-stage--${theme.toLowerCase()}`
  return (
    <div
      className={`center-stage${watering ? ' center-stage--watering' : ''}${sparkles ? ' center-stage--sparkle' : ''}${skin}`}
    >
      <div className="center-stage__sprout">
        <ThemeBuddy theme={theme} scene quiet tending={watering} />
      </div>
      <div className="center-stage__plant" aria-hidden="true">
        <ThemeObjectArt theme={theme} id="center-demo" size={72} demo />
        {watering ? (
          <svg className={`center-stage__sparkles${sparkles ? ' center-stage__sparkles--hot' : ''}`} viewBox="0 0 80 60" aria-hidden="true">
            <g fill="#f5d76e" stroke="#c4a24e" strokeWidth="0.8">
              <path d="M18 28 L20 22 L22 28 L28 30 L22 32 L20 38 L18 32 L12 30 Z" />
              <path d="M42 14 L43.5 10 L45 14 L49 15.5 L45 17 L43.5 21 L42 17 L38 15.5 Z" />
              <path d="M58 34 L59.5 30 L61 34 L65 35.5 L61 37 L59.5 41 L58 37 L54 35.5 Z" />
              <circle cx="32" cy="42" r="2" fill="#ffe9a0" stroke="none" />
              <circle cx="52" cy="24" r="1.6" fill="#fffef8" stroke="none" />
            </g>
            {theme === 'Greenhouse' ? (
              <g fill="#7eb8da" opacity="0.85">
                <ellipse cx="28" cy="18" rx="2" ry="3.2" transform="rotate(12 28 18)" />
                <ellipse cx="36" cy="12" rx="1.6" ry="2.6" transform="rotate(-8 36 12)" />
                <ellipse cx="44" cy="20" rx="1.8" ry="2.8" transform="rotate(18 44 20)" />
              </g>
            ) : (
              <g fill="#c4ad8c" opacity="0.75">
                <circle cx="28" cy="18" r="1.8" />
                <circle cx="36" cy="12" r="1.4" />
                <circle cx="44" cy="20" r="1.6" />
              </g>
            )}
          </svg>
        ) : null}
      </div>
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
  // Greenhouse default
  return (
    <svg className="potting-bench__props" viewBox="0 0 200 72" aria-hidden="true">
      <g transform="translate(4,8)">
        <path d="M14 16 L48 16 L45 48 Q30 56 16 48 Z" fill="#6aaa6a" stroke="#2a4030" strokeWidth="2.2" />
        <rect x="10" y="10" width="42" height="9" rx="2" fill="#7cb87c" stroke="#2a4030" strokeWidth="2.2" />
        <path d="M48 14 C64 10 68 30 56 36" stroke="#2a4030" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M56 36 L64 44" stroke="#2a4030" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M30 28 C28 26 24 26 24 30 C24 33 30 38 30 38 C30 38 36 33 36 30 C36 26 32 26 30 28 Z" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1.2" />
      </g>
      <g transform="translate(78,22)">
        <rect x="0" y="8" width="46" height="30" rx="3" fill="#c4ad8c" stroke="#2a4030" strokeWidth="2" />
        <path d="M4 8 C6 0 40 0 42 8" fill="#d7c4a8" stroke="#2a4030" strokeWidth="1.8" />
        <rect x="6" y="14" width="16" height="12" rx="2" fill="#e8d4b0" stroke="#2a4030" strokeWidth="1.3" />
        <rect x="24" y="14" width="16" height="12" rx="2" fill="#d4c0a0" stroke="#2a4030" strokeWidth="1.3" />
      </g>
      <g transform="translate(132,6)">
        <rect x="10" y="0" width="7" height="22" rx="2" fill="#c4ad8c" stroke="#2a4030" strokeWidth="1.6" />
        <path d="M6 22 L22 22 L18 48 Q14 54 10 48 Z" fill="#8a9aa8" stroke="#2a4030" strokeWidth="1.6" />
      </g>
      <g transform="translate(158,18)">
        <rect x="0" y="0" width="40" height="28" rx="2" fill="#3d4a40" stroke="#2a4030" strokeWidth="1.8" />
        <rect x="-2" y="-2" width="44" height="4" rx="1" fill="#a6855e" stroke="#2a4030" strokeWidth="1.2" />
        <text x="20" y="12" textAnchor="middle" fontSize="4.2" fill="#e8f0e4" fontFamily="sans-serif">{chalkLine1}</text>
        <text x="20" y="20" textAnchor="middle" fontSize="4.2" fill="#e8f0e4" fontFamily="sans-serif">{chalkLine2}</text>
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
  const skin = theme === 'Greenhouse' ? '' : ` potting-bench--${theme.toLowerCase()}`
  return (
    <div className={`potting-bench${skin}`}>
      <div className="potting-bench__surface">
        <BenchProps theme={theme} chalkLine1={line1} chalkLine2={line2} />
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
      <p className="potting-bench__chalk">{chalk}</p>
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
    if (stored.length === 0) {
      saveHobbies(SEED)
      setHobbies(SEED)
    } else {
      setHobbies(stored)
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
    void deleteAllPhotosForHobby(id)
    void deleteAllAudioForHobby(id)
    deleteAllAchievementsForHobby(id)
  }

  function enterHyperfocus(id: string) {
    setSelectedId(null)
    setCreateOpen(false)
    setHyperfocusId(id)
  }

  function leaveHyperfocus(message: string) {
    setHyperfocusId(null)
    setExitToast(message)
    window.setTimeout(() => setExitToast((cur) => (cur === message ? null : cur)), 2200)
  }

  return (
    <section className={`page home greenhouse${roomSkin ? ` ${roomSkin}` : ''}`}>
      <header className="greenhouse__header">
        <p className="greenhouse__brand">
          <span className="greenhouse__butterfly" aria-hidden="true">
            {copy.brandMark}
          </span>
          FlutterHobby
        </p>
        <p className="greenhouse__tagline">{copy.tagline}</p>
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
      </div>

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
