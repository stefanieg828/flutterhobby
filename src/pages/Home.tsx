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
      {/* painted greenhouse room — primary cover background */}
      <img className="gh-decor__room-bg" src={`${art}/room-bg.png`} alt="" />

      {/* soft outdoor trees through glass (toned down under painted room) */}
      <img className="gh-decor__trees" src={`${art}/outdoor-trees.svg`} alt="" />

      {/* warm sunbeams */}
      <div className="gh-decor__sunbeams" />
      <div className="gh-decor__haze" />

      {/* greenhouse glass + white wood frames */}
      <svg className="gh-decor__panes" viewBox="0 0 400 560" preserveAspectRatio="none">
        <defs>
          <linearGradient id="paneGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffef8" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#fdfbe2" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#c8e0c0" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="frameWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f0e6" />
            <stop offset="100%" stopColor="#d8d0c0" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="394" height="554" rx="18" fill="url(#paneGlass)" stroke="#c8bca8" strokeWidth="8" />
        <rect x="10" y="10" width="380" height="540" rx="14" fill="none" stroke="#f5f0e6" strokeWidth="3.5" opacity="0.75" />
        {/* white wood muntins */}
        <line x1="134" y1="10" x2="134" y2="550" stroke="#efe8da" strokeWidth="6" opacity="0.9" />
        <line x1="266" y1="10" x2="266" y2="550" stroke="#efe8da" strokeWidth="6" opacity="0.9" />
        <line x1="10" y1="140" x2="390" y2="140" stroke="#efe8da" strokeWidth="5" opacity="0.8" />
        <line x1="10" y1="280" x2="390" y2="280" stroke="#efe8da" strokeWidth="5" opacity="0.7" />
        <line x1="10" y1="410" x2="390" y2="410" stroke="#efe8da" strokeWidth="5" opacity="0.6" />
        {/* soft glass glare */}
        <rect x="20" y="22" width="100" height="58" rx="6" fill="#fffef8" opacity="0.32" />
        <rect x="148" y="155" width="105" height="50" rx="5" fill="#fdfbe2" opacity="0.2" />
        <rect x="278" y="26" width="98" height="52" rx="6" fill="#fffef8" opacity="0.26" />
        <rect x="22" y="300" width="90" height="40" rx="5" fill="#fffef8" opacity="0.12" />
      </svg>

      {/* wooden rafters */}
      <img className="gh-decor__rafters" src={`${art}/rafters.svg`} alt="" />

      {/* dense hanging vines left */}
      <svg className="gh-decor__vines gh-decor__vines--left" viewBox="0 0 90 360">
        <path d="M44 0 C30 55 56 95 32 150 C12 205 52 245 36 320 C28 340 40 355 44 360" stroke="#3d6b42" strokeWidth="3.4" fill="none" />
        <path d="M58 8 C66 75 40 115 62 180 C76 225 50 265 66 320" stroke="#4a7a4e" strokeWidth="2.4" fill="none" opacity="0.85" />
        <path d="M36 20 C22 80 48 120 28 190" stroke="#2f5a38" strokeWidth="1.8" fill="none" opacity="0.7" />
        {[
          [26, 42, -35, '#6aaa6a', 15],
          [52, 68, 28, '#7cb87c', 14],
          [20, 105, -22, '#8fbc8f', 13],
          [56, 132, 32, '#6aaa6a', 14],
          [24, 168, -18, '#9fd49f', 12],
          [54, 200, 24, '#7cb87c', 13],
          [28, 238, -26, '#8fbc8f', 12],
          [50, 272, 20, '#6aaa6a', 11],
          [34, 308, -14, '#9fd49f', 10],
          [48, 338, 16, '#7cb87c', 9],
        ].map(([cx, cy, rot, fill, rx], i) => (
          <g key={i}>
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={Number(rx) * 0.58}
              fill={String(fill)}
              stroke="#2a4030"
              strokeWidth="1.35"
              transform={`rotate(${rot} ${cx} ${cy})`}
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx={Number(rx) * 0.4}
              ry={Number(rx) * 0.22}
              fill="#c8f0c0"
              opacity="0.4"
              transform={`rotate(${rot} ${cx} ${cy})`}
            />
          </g>
        ))}
        <circle cx="40" cy="90" r="3.2" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1" />
        <circle cx="48" cy="188" r="2.8" fill="#c47a5a" stroke="#2a4030" strokeWidth="1" />
        <circle cx="38" cy="255" r="2.5" fill="#e6b84d" stroke="#2a4030" strokeWidth="1" />
      </svg>

      {/* dense vines right */}
      <svg className="gh-decor__vines gh-decor__vines--right" viewBox="0 0 90 320">
        <path d="M46 0 C58 48 30 90 54 145 C72 190 34 230 50 295" stroke="#3d6b42" strokeWidth="3.4" fill="none" />
        <path d="M32 6 C20 65 46 108 24 165 C10 210 38 250 28 300" stroke="#4a7a4e" strokeWidth="2.4" fill="none" opacity="0.85" />
        {[
          [58, 38, 32, '#8fbc8f', 15],
          [30, 72, -28, '#6aaa6a', 13],
          [60, 112, 22, '#7cb87c', 14],
          [26, 148, -30, '#9fd49f', 12],
          [56, 182, 18, '#6aaa6a', 13],
          [30, 220, -24, '#8fbc8f', 12],
          [52, 255, 16, '#7cb87c', 11],
          [36, 290, -12, '#9fd49f', 10],
        ].map(([cx, cy, rot, fill, rx], i) => (
          <g key={i}>
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={Number(rx) * 0.58}
              fill={String(fill)}
              stroke="#2a4030"
              strokeWidth="1.35"
              transform={`rotate(${rot} ${cx} ${cy})`}
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx={Number(rx) * 0.4}
              ry={Number(rx) * 0.22}
              fill="#c8f0c0"
              opacity="0.4"
              transform={`rotate(${rot} ${cx} ${cy})`}
            />
          </g>
        ))}
        <circle cx="42" cy="95" r="3" fill="#e6b84d" stroke="#2a4030" strokeWidth="1" />
        <circle cx="40" cy="200" r="2.6" fill="#e8a0b0" stroke="#2a4030" strokeWidth="1" />
      </svg>

      {/* top draping vines */}
      <svg className="gh-decor__vines-top" viewBox="0 0 360 80">
        <path d="M0 10 Q40 32 80 12 T160 16 T240 10 T320 18 T360 12" stroke="#3d6b42" strokeWidth="2.8" fill="none" />
        <path d="M16 6 Q60 26 100 8 T200 14 T300 6" stroke="#4a7a4e" strokeWidth="2" fill="none" opacity="0.85" />
        <path d="M40 4 Q90 20 140 6 T260 12 T340 4" stroke="#2f5a38" strokeWidth="1.5" fill="none" opacity="0.55" />
        {[
          [48, 24, 40, '#6aaa6a'],
          [108, 20, -35, '#8fbc8f'],
          [168, 26, 25, '#7cb87c'],
          [228, 18, -40, '#9fd49f'],
          [288, 24, 30, '#6aaa6a'],
          [328, 20, -20, '#8fbc8f'],
        ].map(([cx, cy, rot, fill], i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="12"
            ry="7"
            fill={String(fill)}
            stroke="#2a4030"
            strokeWidth="1.25"
            transform={`rotate(${rot} ${cx} ${cy})`}
          />
        ))}
        <circle cx="130" cy="28" r="2.8" fill="#e8a0b0" stroke="#2a4030" strokeWidth="0.9" />
        <circle cx="250" cy="22" r="2.5" fill="#e6b84d" stroke="#2a4030" strokeWidth="0.9" />
      </svg>

      {/* glowing string lights */}
      <svg className="gh-decor__lights" viewBox="0 0 360 48">
        <defs>
          <filter id="bulbGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M6 12 Q55 32 115 14 T235 16 T354 12" stroke="#a88840" strokeWidth="1.8" fill="none" />
        <path d="M6 12 Q55 32 115 14 T235 16 T354 12" stroke="#c4a24e" strokeWidth="1" fill="none" opacity="0.7" />
        {[
          [34, 18, '#ffe9a0'],
          [72, 26, '#fff4c8'],
          [112, 14, '#ffe0b0'],
          [152, 24, '#fff8d8'],
          [192, 16, '#ffe9a0'],
          [232, 24, '#fff4c8'],
          [272, 14, '#ffe0b0'],
          [312, 20, '#fff8d8'],
          [342, 14, '#ffe9a0'],
        ].map(([cx, cy, fill], i) => (
          <g key={i} filter="url(#bulbGlow)">
            <circle cx={cx} cy={cy} r="6.2" fill={String(fill)} opacity="0.55" />
            <circle cx={cx} cy={cy} r="4.6" fill={String(fill)} opacity="0.95" />
            <circle cx={cx} cy={Number(cy) - 0.8} r="2.4" fill="#fffef8" opacity="0.9" />
            <rect x={Number(cx) - 1.6} y={Number(cy) - 9} width="3.2" height="3.8" rx="0.6" fill="#8a7040" stroke="#3d2e1f" strokeWidth="0.6" />
          </g>
        ))}
      </svg>

      {/* wooden plank floor */}
      <div className="gh-decor__floor">
        <img className="gh-decor__floor-img" src={`${art}/floor-planks.svg`} alt="" />
      </div>
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
