import { useEffect, useMemo, useRef, useState } from 'react'
import type { Hobby } from '../types'
import { applyProgressBump, progressPercent } from '../types'
import { useTheme } from '../ThemeContext'
import {
  clearHyperfocusSession,
  formatFocusRemaining,
  fromDatetimeLocalValue,
  loadHyperfocusNote,
  loadHyperfocusSession,
  saveHyperfocusNote,
  saveHyperfocusSession,
  saveLastHyperfocusId,
  toDatetimeLocalValue,
  type HyperfocusSession,
} from '../storage'
import { ThemeBuddy } from './ThemeBuddy'
import { ThemeObjectArt } from './ThemeObjectArt'
import './HyperfocusView.css'

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

function ensureSession(hobbyId: string): HyperfocusSession {
  const existing = loadHyperfocusSession()
  if (existing && existing.hobbyId === hobbyId) return existing
  const session: HyperfocusSession = {
    hobbyId,
    startedAt: new Date().toISOString(),
  }
  saveHyperfocusSession(session)
  return session
}

function formatStartedAt(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Recently'
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
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

  const [session, setSession] = useState<HyperfocusSession>(() => ensureSession(hobby.id))
  const [untilLocal, setUntilLocal] = useState(() =>
    session.until ? toDatetimeLocalValue(session.until) : '',
  )
  const [nowTick, setNowTick] = useState(() => Date.now())

  useEffect(() => {
    saveLastHyperfocusId(hobby.id)
  }, [hobby.id])

  useEffect(() => {
    const next = ensureSession(hobby.id)
    setSession(next)
    setUntilLocal(next.until ? toDatetimeLocalValue(next.until) : '')
    setNote(loadHyperfocusNote(hobby.id))
    setChoosing(false)
    setAmount(15)
    setPresetId('some')
  }, [hobby.id])

  useEffect(() => {
    if (!justTended) return
    setSplash(true)
    const t = window.setTimeout(() => setSplash(false), 900)
    return () => window.clearTimeout(t)
  }, [justTended, hobby.progress])

  // Soft refresh of remaining-time copy while a focus-until is set.
  useEffect(() => {
    if (!session.until) return
    const id = window.setInterval(() => setNowTick(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [session.until])

  const pct = progressPercent(hobby.progress)
  const roomLeft = Math.max(0, 100 - pct)
  const appliedBump = Math.min(amount, roomLeft)
  const previewPct = applyProgressBump(pct, amount)

  const amountLabel = useMemo(() => {
    if (roomLeft === 0) return 'Already at 100% — still lovely to check in'
    if (appliedBump < amount) return `+${appliedBump}% (caps at 100%)`
    return copy.amountHint(amount)
  }, [amount, appliedBump, roomLeft, copy])

  const remainingCopy = useMemo(() => {
    if (!session.until) return 'Open-ended — stay as long as this season feels good.'
    return formatFocusRemaining(session.until, new Date(nowTick))
  }, [session.until, nowTick])

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

  function persistSession(next: HyperfocusSession) {
    setSession(next)
    saveHyperfocusSession(next)
  }

  function applyUntilFromInput(value: string) {
    setUntilLocal(value)
    const until = fromDatetimeLocalValue(value)
    persistSession({
      hobbyId: hobby.id,
      startedAt: session.startedAt,
      until,
    })
  }

  function clearUntil() {
    setUntilLocal('')
    persistSession({
      hobbyId: hobby.id,
      startedAt: session.startedAt,
    })
  }

  function handleExit() {
    saveHyperfocusNote(hobby.id, note)
    clearHyperfocusSession()
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

        <section className="hyperfocus__season" aria-label="Optional focus season">
          <p className="hyperfocus__timer-copy">
            Focus seasons can last days or weeks — optional end date, never a streak.
          </p>
          <p className="hyperfocus__season-started">
            Soft start: {formatStartedAt(session.startedAt)}
          </p>

          <label className="hyperfocus__until-label">
            <span>Focus until (optional)</span>
            <input
              type="datetime-local"
              className="hyperfocus__until-input"
              value={untilLocal}
              onChange={(e) => applyUntilFromInput(e.target.value)}
              aria-describedby="hyperfocus-remaining"
            />
          </label>

          <p id="hyperfocus-remaining" className="hyperfocus__season-remaining" aria-live="polite">
            {remainingCopy}
          </p>

          <div className="hyperfocus__timer-actions">
            {session.until ? (
              <button type="button" className="hyperfocus__secondary" onClick={clearUntil}>
                Make open-ended
              </button>
            ) : (
              <span className="hyperfocus__season-open">Open-ended hyperfocus</span>
            )}
          </div>
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
