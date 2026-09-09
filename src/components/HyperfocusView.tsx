import { useEffect, useMemo, useRef, useState } from 'react'
import type { Hobby } from '../types'
import { applyProgressBump, progressPercent } from '../types'
import { useTheme } from '../ThemeContext'
import {
  loadHyperfocusNote,
  saveHyperfocusNote,
  saveLastHyperfocusId,
} from '../storage'
import { ThemeBuddy } from './ThemeBuddy'
import { ThemeObjectArt } from './ThemeObjectArt'
import './HyperfocusView.css'

const TIMER_PRESETS = [
  { minutes: 5, label: '5 min' },
  { minutes: 10, label: '10 min' },
  { minutes: 15, label: '15 min' },
  { minutes: 25, label: '25 min' },
] as const

const EXIT_LINES = [
  'Nice sip.',
  'That was enough.',
  'Soft landing.',
  "Back when you're ready.",
  'Just right for now.',
] as const

function pickGentleExitLine(): string {
  return EXIT_LINES[Math.floor(Math.random() * EXIT_LINES.length)]!
}

interface HyperfocusViewProps {
  hobby: Hobby
  onTend: (id: string, amountPercent: number) => void
  onExit: (message: string) => void
  justTended?: boolean
}

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function HyperfocusView({
  hobby,
  onTend,
  onExit,
  justTended = false,
}: HyperfocusViewProps) {
  const { theme, copy } = useTheme()
  const presets = copy.presets
  const [choosing, setChoosing] = useState(false)
  const [amount, setAmount] = useState(15)
  const [presetId, setPresetId] = useState<string | 'custom'>('some')
  const [splash, setSplash] = useState(false)
  const [note, setNote] = useState(() => loadHyperfocusNote(hobby.id))
  const noteSaveTimer = useRef<number | null>(null)

  // Timer is OFF by default — opt-in only, never guilt.
  const [timerOn, setTimerOn] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(15)
  const [remaining, setRemaining] = useState(15 * 60)
  const [running, setRunning] = useState(false)
  const [timerRested, setTimerRested] = useState(false)

  useEffect(() => {
    saveLastHyperfocusId(hobby.id)
  }, [hobby.id])

  useEffect(() => {
    setNote(loadHyperfocusNote(hobby.id))
    setChoosing(false)
    setAmount(15)
    setPresetId('some')
    setTimerOn(false)
    setRunning(false)
    setTimerRested(false)
    setRemaining(15 * 60)
    setTimerMinutes(15)
  }, [hobby.id])

  useEffect(() => {
    if (!justTended) return
    setSplash(true)
    const t = window.setTimeout(() => setSplash(false), 900)
    return () => window.clearTimeout(t)
  }, [justTended, hobby.progress])

  useEffect(() => {
    if (!timerOn || !running) return
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false)
          setTimerRested(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [timerOn, running])

  const pct = progressPercent(hobby.progress)
  const roomLeft = Math.max(0, 100 - pct)
  const appliedBump = Math.min(amount, roomLeft)
  const previewPct = applyProgressBump(pct, amount)

  const amountLabel = useMemo(() => {
    if (roomLeft === 0) return 'Already at 100% — still lovely to check in'
    if (appliedBump < amount) return `+${appliedBump}% (caps at 100%)`
    return copy.amountHint(amount)
  }, [amount, appliedBump, roomLeft, copy])

  function openChooser() {
    setChoosing(true)
    setAmount(15)
    setPresetId('some')
  }

  function pickPreset(id: string, bump: number) {
    setPresetId(id)
    setAmount(bump)
  }

  function onSliderChange(value: number) {
    const next = Math.min(100, Math.max(1, Math.round(value)))
    setAmount(next)
    const match = presets.find((p) => p.bump === next)
    setPresetId(match ? match.id : 'custom')
  }

  function confirmTend() {
    onTend(hobby.id, amount)
    setChoosing(false)
  }

  function handleNoteChange(value: string) {
    setNote(value)
    if (noteSaveTimer.current) window.clearTimeout(noteSaveTimer.current)
    noteSaveTimer.current = window.setTimeout(() => {
      saveHyperfocusNote(hobby.id, value)
    }, 400)
  }

  function enableTimer(minutes: number) {
    setTimerMinutes(minutes)
    setRemaining(minutes * 60)
    setTimerOn(true)
    setRunning(false)
    setTimerRested(false)
  }

  function turnTimerOff() {
    setTimerOn(false)
    setRunning(false)
    setTimerRested(false)
  }

  function handleExit() {
    saveHyperfocusNote(hobby.id, note)
    onExit(pickGentleExitLine())
  }

  return (
    <div
      className={`hyperfocus${splash ? ' hyperfocus--splash' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hyperfocus-title"
    >
      <div className="hyperfocus__dim" aria-hidden="true" />

      <div className="hyperfocus__panel">
        <header className="hyperfocus__header">
          <div>
            <p className="hyperfocus__eyebrow">Hyperfocus</p>
            <h2 id="hyperfocus-title">{hobby.name}</h2>
            <p className="hyperfocus__creating">{hobby.creating}</p>
          </div>
          <button
            type="button"
            className="hyperfocus__exit"
            onClick={handleExit}
            aria-label="Leave hyperfocus"
          >
            Done
          </button>
        </header>

        <div className="hyperfocus__stage">
          <div className="hyperfocus__buddy">
            <ThemeBuddy
              theme={theme}
              scene
              tending={splash || justTended}
              message={`${copy.buddyName} is here with you. Just this one.`}
            />
          </div>
          <div className="hyperfocus__object" aria-hidden="true">
            <ThemeObjectArt
              theme={theme}
              id={hobby.id}
              status={hobby.status}
              color={hobby.color ?? 'sage'}
              size={140}
              heart={hobby.status === 'proud-shelf'}
            />
            {splash ? (
              <span className="hyperfocus__splash-emoji">{copy.splashEmoji}</span>
            ) : null}
          </div>
        </div>

        <div className="hyperfocus__progress-block">
          <div className="hyperfocus__progress-labels">
            <span>{copy.progressLabel}</span>
            <span>{pct}%</span>
          </div>
          <div
            className="hyperfocus__progress"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="hyperfocus__progress-bar" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {!choosing ? (
          <button type="button" className="hyperfocus__tend" onClick={openChooser}>
            {copy.tendButton}
          </button>
        ) : (
          <div className="hyperfocus__chooser" aria-label="Choose how much progress to log">
            <p className="hyperfocus__chooser-title">{copy.tendChooserTitle}</p>
            <p className="hyperfocus__chooser-copy">{copy.tendChooserCopy}</p>

            <div className="hyperfocus__presets" role="group" aria-label="Progress presets">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`hyperfocus__preset${presetId === preset.id ? ' hyperfocus__preset--active' : ''}`}
                  onClick={() => pickPreset(preset.id, preset.bump)}
                  aria-pressed={presetId === preset.id}
                >
                  <span className="hyperfocus__preset-label">{preset.label}</span>
                  <span className="hyperfocus__preset-bump">+{preset.bump}%</span>
                  <span className="hyperfocus__preset-hint">{preset.hint}</span>
                </button>
              ))}
            </div>

            <label className="hyperfocus__slider-label">
              <span>Or choose your own</span>
              <span className="hyperfocus__slider-value">{amount}%</span>
            </label>
            <input
              className="hyperfocus__slider"
              type="range"
              min={1}
              max={100}
              step={1}
              value={amount}
              onChange={(e) => onSliderChange(Number(e.target.value))}
              aria-label="Custom progress percent"
            />
            <p className="hyperfocus__chooser-preview" aria-live="polite">
              {amountLabel}
              {roomLeft > 0 ? ` · grows to ${previewPct}%` : ''}
            </p>

            <div className="hyperfocus__chooser-actions">
              <button type="button" className="hyperfocus__tend" onClick={confirmTend}>
                {copy.tendConfirm}
              </button>
              <button
                type="button"
                className="hyperfocus__secondary"
                onClick={() => setChoosing(false)}
              >
                Not now
              </button>
            </div>
          </div>
        )}

        <label className="hyperfocus__notes">
          <span className="hyperfocus__notes-label">Notes (optional)</span>
          <textarea
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="A thought for later — no pressure."
            rows={2}
            maxLength={500}
          />
        </label>

        <section className="hyperfocus__timer" aria-label="Optional timer">
          {!timerOn ? (
            <div className="hyperfocus__timer-off">
              <p className="hyperfocus__timer-copy">
                Optional timer — off. Turn it on only if you want a soft countdown.
              </p>
              <div className="hyperfocus__timer-presets">
                {TIMER_PRESETS.map((p) => (
                  <button
                    key={p.minutes}
                    type="button"
                    className="hyperfocus__secondary"
                    onClick={() => enableTimer(p.minutes)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="hyperfocus__timer-on">
              <div className="hyperfocus__timer-display" aria-live="polite">
                <span className="hyperfocus__timer-digits">{formatCountdown(remaining)}</span>
                <span className="hyperfocus__timer-hint">
                  {timerRested
                    ? 'Timer rested. Stay as long as you like.'
                    : running
                      ? 'Soft countdown — leave anytime.'
                      : `${timerMinutes} min ready when you are.`}
                </span>
              </div>
              <div className="hyperfocus__timer-actions">
                {!timerRested ? (
                  <button
                    type="button"
                    className="hyperfocus__secondary"
                    onClick={() => setRunning((r) => !r)}
                  >
                    {running ? 'Pause' : remaining < timerMinutes * 60 ? 'Resume' : 'Start'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="hyperfocus__secondary"
                    onClick={() => enableTimer(timerMinutes)}
                  >
                    Reset
                  </button>
                )}
                <button type="button" className="hyperfocus__secondary" onClick={turnTimerOff}>
                  Turn timer off
                </button>
              </div>
            </div>
          )}
        </section>

        <p className="hyperfocus__footer-hint">
          No streaks. No guilt. Leave whenever — the room will wait.
        </p>

        <button type="button" className="hyperfocus__leave" onClick={handleExit}>
          Leave gently
        </button>
      </div>
    </div>
  )
}
