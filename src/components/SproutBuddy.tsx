import { useState } from 'react'
import './SproutBuddy.css'

interface SproutBuddyProps {
  message?: string
  /** larger scene placement without speech card chrome */
  scene?: boolean
  /** hide speech bubble entirely — message lives elsewhere in the room */
  quiet?: boolean
  /** mid-scene watering pose with tipped can */
  watering?: boolean
}

const PAINTED_SRC = `${import.meta.env.BASE_URL}art/greenhouse/sprout-buddy.png`

/** Painted-cozy Sprout — purple winged buddy matching the theme character sheet. */
export function SproutBuddy({
  message,
  scene = false,
  quiet = false,
  watering = false,
}: SproutBuddyProps) {
  const showBubble = Boolean(message) && !quiet
  const [usePainted, setUsePainted] = useState(true)
  const classes = [
    'sprout-buddy',
    scene ? 'sprout-buddy--scene' : '',
    quiet ? 'sprout-buddy--quiet' : '',
    watering ? 'sprout-buddy--watering' : '',
    usePainted ? 'sprout-buddy--painted' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes} aria-label="Sprout, your greenhouse buddy">
      <div className="sprout-buddy__avatar" aria-hidden="true">
        {usePainted ? (
          <img
            className="sprout-buddy__painted"
            src={PAINTED_SRC}
            alt=""
            draggable={false}
            onError={() => setUsePainted(false)}
          />
        ) : (
          <SproutSvg watering={watering} quiet={quiet} />
        )}
      </div>
      {showBubble ? (
        <div className="sprout-buddy__bubble">
          <p className="sprout-buddy__name">Sprout</p>
          <p className="sprout-buddy__msg">{message}</p>
        </div>
      ) : null}
    </aside>
  )
}

function SproutSvg({ watering, quiet }: { watering: boolean; quiet: boolean }) {
  return (
        <svg viewBox="0 0 160 170" width="160" height="170" role="img">
          <defs>
            <radialGradient id="sproutBodyGrad" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#c49ad8" />
              <stop offset="55%" stopColor="#9b6fb8" />
              <stop offset="100%" stopColor="#7a5098" />
            </radialGradient>
            <radialGradient id="sproutHeadGrad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#c8a0dc" />
              <stop offset="60%" stopColor="#a67bc4" />
              <stop offset="100%" stopColor="#8a5aa8" />
            </radialGradient>
            <radialGradient id="wingGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fce8f2" />
              <stop offset="100%" stopColor="#e8b8d0" />
            </radialGradient>
            <filter id="sproutSoft" x="-8%" y="-8%" width="116%" height="116%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="b" />
              <feOffset dy="1" result="o" />
              <feMerge>
                <feMergeNode in="o" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* soft ground shadow */}
          <ellipse cx="72" cy="158" rx="42" ry="8" fill="#8a9a70" opacity="0.35" />
          <ellipse cx="72" cy="156" rx="28" ry="4" fill="#5c4a3a" opacity="0.12" />

          {/* —— feathery wings (behind body) —— */}
          <g filter="url(#sproutSoft)">
            <ellipse
              cx="30"
              cy="88"
              rx="22"
              ry="30"
              fill="url(#wingGrad)"
              stroke="#2a4030"
              strokeWidth="2.2"
              transform="rotate(-22 30 88)"
            />
            <ellipse
              cx="30"
              cy="88"
              rx="11"
              ry="16"
              fill="#fff5fa"
              opacity="0.75"
              transform="rotate(-22 30 88)"
            />
            {/* wing feather lines */}
            <path
              d="M22 78 Q18 90 24 102"
              stroke="#d090b0"
              strokeWidth="1.2"
              fill="none"
              opacity="0.55"
            />
            <path
              d="M28 74 Q26 92 32 106"
              stroke="#d090b0"
              strokeWidth="1.1"
              fill="none"
              opacity="0.45"
            />
            <ellipse
              cx="114"
              cy="88"
              rx="22"
              ry="30"
              fill="url(#wingGrad)"
              stroke="#2a4030"
              strokeWidth="2.2"
              transform="rotate(22 114 88)"
            />
            <ellipse
              cx="114"
              cy="88"
              rx="11"
              ry="16"
              fill="#fff5fa"
              opacity="0.75"
              transform="rotate(22 114 88)"
            />
            <path
              d="M122 78 Q126 90 120 102"
              stroke="#d090b0"
              strokeWidth="1.2"
              fill="none"
              opacity="0.55"
            />
          </g>

          {/* —— pear body —— */}
          <ellipse
            cx="72"
            cy="108"
            rx="40"
            ry="38"
            fill="url(#sproutBodyGrad)"
            stroke="#2a4030"
            strokeWidth="2.6"
          />
          {/* soft belly highlight */}
          <ellipse cx="72" cy="116" rx="24" ry="18" fill="#c49ad8" opacity="0.4" />
          <ellipse cx="62" cy="100" rx="10" ry="8" fill="#e0c0f0" opacity="0.35" />

          {/* stubby arms */}
          <ellipse cx="32" cy="112" rx="13" ry="11" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2.2" />
          <ellipse cx="112" cy="110" rx="13" ry="11" fill="#9b6fb8" stroke="#2a4030" strokeWidth="2.2" />
          {/* hand highlights */}
          <ellipse cx="30" cy="110" rx="5" ry="4" fill="#c49ad8" opacity="0.5" />
          <ellipse cx="110" cy="108" rx="5" ry="4" fill="#c49ad8" opacity="0.5" />

          {/* stubby feet */}
          <ellipse cx="54" cy="142" rx="13" ry="10" fill="#8d67b8" stroke="#2a4030" strokeWidth="2.2" />
          <ellipse cx="90" cy="142" rx="13" ry="10" fill="#8d67b8" stroke="#2a4030" strokeWidth="2.2" />

          {/* bushy little tail */}
          <path
            d="M108 128 Q128 132 124 148 Q112 154 102 142"
            fill="#8d67b8"
            stroke="#2a4030"
            strokeWidth="2.2"
          />
          <path
            d="M112 136 Q122 138 120 146"
            stroke="#b58dcc"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* —— round head —— */}
          <circle
            cx="72"
            cy="58"
            r="36"
            fill="url(#sproutHeadGrad)"
            stroke="#2a4030"
            strokeWidth="2.6"
          />
          {/* head soft highlight */}
          <ellipse cx="58" cy="46" rx="14" ry="10" fill="#e0c0f0" opacity="0.4" />

          {/* small rounded ears */}
          <circle cx="40" cy="42" r="9" fill="#a67bc4" stroke="#2a4030" strokeWidth="2.2" />
          <circle cx="104" cy="42" r="9" fill="#a67bc4" stroke="#2a4030" strokeWidth="2.2" />
          <circle cx="40" cy="42" r="4" fill="#c49ad8" opacity="0.55" />
          <circle cx="104" cy="42" r="4" fill="#c49ad8" opacity="0.55" />

          {/* head sprout — two rounded leaves */}
          <path
            d="M72 26 C72 16 72 8 72 2"
            stroke="#3d6b42"
            strokeWidth="3.6"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx="54"
            cy="8"
            rx="15"
            ry="9"
            fill="#7cb87c"
            stroke="#2a4030"
            strokeWidth="2"
            transform="rotate(-32 54 8)"
          />
          <ellipse
            cx="54"
            cy="8"
            rx="7"
            ry="3.5"
            fill="#a8e0a8"
            opacity="0.65"
            transform="rotate(-32 54 8)"
          />
          <ellipse
            cx="90"
            cy="6"
            rx="14"
            ry="8.5"
            fill="#8fbc8f"
            stroke="#2a4030"
            strokeWidth="2"
            transform="rotate(34 90 6)"
          />
          <ellipse
            cx="90"
            cy="6"
            rx="6.5"
            ry="3"
            fill="#b8e8b8"
            opacity="0.6"
            transform="rotate(34 90 6)"
          />
          {/* leaf vein */}
          <path d="M58 10 Q54 8 50 6" stroke="#3d6b42" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M86 8 Q90 6 94 4" stroke="#3d6b42" strokeWidth="1" fill="none" opacity="0.5" />

          {/* —— sparkly kawaii eyes —— */}
          <ellipse cx="56" cy="56" rx="11" ry="12.5" fill="#1a1a1a" />
          <ellipse cx="88" cy="56" rx="11" ry="12.5" fill="#1a1a1a" />
          {/* big highlight */}
          <circle cx="60" cy="51" r="4" fill="#fff" />
          <circle cx="92" cy="51" r="4" fill="#fff" />
          {/* small secondary sparkle */}
          <circle cx="52" cy="60" r="2" fill="#fff" opacity="0.9" />
          <circle cx="84" cy="60" r="2" fill="#fff" opacity="0.9" />

          {/* soft blush */}
          <ellipse cx="42" cy="68" rx="7" ry="5" fill="#e8a0b0" opacity="0.55" />
          <ellipse cx="102" cy="68" rx="7" ry="5" fill="#e8a0b0" opacity="0.55" />

          {/* tiny u-smile */}
          <path
            d="M64 72 Q72 80 80 72"
            stroke="#2a4030"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />

          {/* —— watering can —— */}
          {quiet || watering ? (
            <g
              transform={
                watering
                  ? 'translate(102 82) rotate(-32) scale(0.92)'
                  : 'translate(98 112) scale(0.55)'
              }
            >
              {/* can body */}
              <path
                d="M8 14 L46 14 L42 48 Q26 58 12 48 Z"
                fill="#6aaa6a"
                stroke="#2a4030"
                strokeWidth="2.6"
              />
              <path
                d="M14 22 L18 42"
                stroke="#9fd49f"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.45"
              />
              {/* rim */}
              <rect
                x="4"
                y="6"
                width="46"
                height="11"
                rx="2.5"
                fill="#7cb87c"
                stroke="#2a4030"
                strokeWidth="2.6"
              />
              {/* spout */}
              <path
                d="M46 12 C62 6 68 26 56 34"
                stroke="#2a4030"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M46 12 C62 6 68 26 56 34"
                stroke="#7cb87c"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M56 34 L66 46"
                stroke="#2a4030"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              {/* heart cutout */}
              <path
                d="M26 28 C24 26 20 26 20 30 C20 33 26 38 26 38 C26 38 32 33 32 30 C32 26 28 26 26 28 Z"
                fill="#e8a0b0"
                stroke="#2a4030"
                strokeWidth="1.4"
              />
              {watering ? (
                <g fill="#7eb8da" opacity="0.92">
                  <ellipse cx="72" cy="54" rx="2.6" ry="4.2" transform="rotate(28 72 54)" />
                  <ellipse cx="82" cy="64" rx="2.2" ry="3.6" transform="rotate(20 82 64)" />
                  <ellipse cx="64" cy="62" rx="2" ry="3.2" transform="rotate(32 64 62)" />
                  <ellipse cx="76" cy="74" rx="1.8" ry="2.8" transform="rotate(15 76 74)" />
                </g>
              ) : null}
            </g>
          ) : null}
        </svg>
  )
}
