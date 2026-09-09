import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Hobby, HobbyStatus, NudgeCadence, PlantColor } from '../types'
import {
  CADENCE_LABELS,
  PLANT_COLORS,
  STATUS_LABELS,
  applyProgressBump,
  computeNextNudgeAt,
  hobbyItems,
  progressPercent,
} from '../types'
import { useTheme } from '../ThemeContext'
import { ThemeObjectArt } from './ThemeObjectArt'
import { NestItemsPanel } from './NestItemsPanel'
import { ProgressPhotosPanel } from './ProgressPhotosPanel'
import { ProgressAudioPanel } from './ProgressAudioPanel'
import './HobbyBench.css'

interface HobbyBenchProps {
  hobby: Hobby
  onClose: () => void
  onTend: (id: string, amountPercent: number) => void
  onUpdate: (hobby: Hobby) => void
  onDelete: (id: string) => void
  onEnterHyperfocus?: (id: string) => void
  justTended?: boolean
}

const MOVABLE_STATUSES: HobbyStatus[] = [
  'in-season',
  'resting',
  'proud-shelf',
  'archive',
]

export function HobbyBench({
  hobby,
  onClose,
  onTend,
  onUpdate,
  onDelete,
  onEnterHyperfocus,
  justTended = false,
}: HobbyBenchProps) {
  const { theme, copy } = useTheme()
  const presets = copy.presets
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(hobby.name)
  const [creating, setCreating] = useState(hobby.creating)
  const [cadence, setCadence] = useState<NudgeCadence>(hobby.cadence)
  const [petName, setPetName] = useState(hobby.petName ?? '')
  const [color, setColor] = useState<PlantColor>(hobby.color ?? 'sage')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [splash, setSplash] = useState(false)
  const [choosing, setChoosing] = useState(false)
  const [amount, setAmount] = useState(15)
  const [presetId, setPresetId] = useState<string | 'custom'>('some')

  useEffect(() => {
    setName(hobby.name)
    setCreating(hobby.creating)
    setCadence(hobby.cadence)
    setPetName(hobby.petName ?? '')
    setColor(hobby.color ?? 'sage')
    setEditing(false)
    setConfirmDelete(false)
    setChoosing(false)
    setAmount(15)
    setPresetId('some')
  }, [hobby])

  useEffect(() => {
    if (!justTended) return
    setSplash(true)
    const t = window.setTimeout(() => setSplash(false), 900)
    return () => window.clearTimeout(t)
  }, [justTended, hobby.progress])

  const pct = progressPercent(hobby.progress)
  const roomLeft = Math.max(0, 100 - pct)
  const appliedBump = Math.min(amount, roomLeft)
  const previewPct = applyProgressBump(pct, amount)

  const amountLabel = useMemo(() => {
    if (roomLeft === 0) return 'Already at 100% — still lovely to check in'
    if (appliedBump < amount) return `+${appliedBump}% (caps at 100%)`
    return copy.amountHint(amount)
  }, [amount, appliedBump, roomLeft, copy])

  function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !creating.trim()) return
    const cadenceChanged = cadence !== hobby.cadence
    const baseForNudge = hobby.lastTendedAt || new Date().toISOString()
    onUpdate({
      ...hobby,
      name: name.trim(),
      creating: creating.trim(),
      cadence,
      petName: petName.trim() || undefined,
      color,
      nextNudgeAt: cadenceChanged
        ? computeNextNudgeAt(baseForNudge, cadence)
        : hobby.nextNudgeAt,
    })
    setEditing(false)
  }

  function handleItemsChange(items: ReturnType<typeof hobbyItems>) {
    onUpdate({ ...hobby, items })
  }

  function setStatus(status: HobbyStatus) {
    onUpdate({ ...hobby, status })
  }

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

  return (
    <div className="bench-overlay" role="dialog" aria-modal="true" aria-labelledby="bench-title">
      <button type="button" className="bench-overlay__scrim" aria-label="Close bench" onClick={onClose} />
      <div className={`bench ${splash ? 'bench--splash' : ''}`}>
        <div className="bench__wood-top" aria-hidden="true" />
        <header className="bench__header">
          <div>
            <p className="bench__eyebrow">{copy.benchEyebrow}</p>
            <h2 id="bench-title">{hobby.name}</h2>
          </div>
          <button type="button" className="bench__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="bench__plant" aria-hidden="true">
          <ThemeObjectArt
            theme={theme}
            id={hobby.id}
            status={hobby.status}
            color={hobby.color ?? 'sage'}
            size={120}
            heart={hobby.status === 'proud-shelf'}
            className="bench__plant-art"
          />
          {splash ? <span className="bench__water-drop">{copy.splashEmoji}</span> : null}
          <svg className="bench__tools" viewBox="0 0 80 40" width="72" height="36" aria-hidden="true">
            {theme === 'Greenhouse' ? (
              <>
                <path d="M8 28 L28 28 L26 38 Q18 40 10 38 Z" fill="#6aaa6a" stroke="#2a4030" strokeWidth="1.5" />
                <rect x="6" y="24" width="24" height="5" rx="1" fill="#7cb87c" stroke="#2a4030" strokeWidth="1.5" />
                <rect x="52" y="8" width="5" height="16" rx="1" fill="#c4ad8c" stroke="#2a4030" strokeWidth="1.4" />
                <path d="M48 24 L62 24 L58 38 Q55 40 52 38 Z" fill="#8a9aa8" stroke="#2a4030" strokeWidth="1.4" />
              </>
            ) : theme === 'Closet' ? (
              <>
                <path d="M20 8 Q20 2 26 2 Q30 2 30 6" stroke="#8a7a68" strokeWidth="1.6" fill="none" />
                <path d="M8 14 Q20 8 32 14" stroke="#8a7a68" strokeWidth="1.8" fill="none" />
                <path d="M12 16 L28 16 L30 34 Q20 40 10 34 Z" fill="#b39bc8" stroke="#5a4060" strokeWidth="1.3" />
                <ellipse cx="58" cy="24" rx="14" ry="10" fill="#f2d6e4" stroke="#5a4060" strokeWidth="1.3" />
              </>
            ) : theme === 'Desktop' ? (
              <>
                <path d="M8 16 L18 16 L22 20 L40 20 L40 36 L8 36 Z" fill="#e6b84d" stroke="#2a3028" strokeWidth="1.4" />
                <path d="M8 20 L40 20 L40 16 L24 16 L20 12 L8 12 Z" fill="#f5d76e" stroke="#2a3028" strokeWidth="1.2" />
                <rect x="50" y="14" width="22" height="20" rx="2" fill="#7eb8da" stroke="#2a3028" strokeWidth="1.3" />
              </>
            ) : theme === 'Workshop' ? (
              <>
                <rect x="14" y="6" width="6" height="28" rx="1" fill="#8a7040" stroke="#2a3028" strokeWidth="1.3" />
                <rect x="6" y="6" width="22" height="10" rx="1" fill="#8a9aa8" stroke="#2a3028" strokeWidth="1.4" />
                <rect x="44" y="16" width="28" height="16" rx="2" fill="#c47a5a" stroke="#2a3028" strokeWidth="1.3" />
              </>
            ) : (
              <>
                <rect x="6" y="18" width="28" height="16" rx="2" fill="#8a7a68" stroke="#3d2e1f" strokeWidth="1.5" />
                <rect x="10" y="22" width="10" height="8" rx="1" fill="#c4ad8c" stroke="#3d2e1f" strokeWidth="1.1" />
                <rect x="48" y="12" width="18" height="10" rx="2" fill="#5a6a70" stroke="#3d2e1f" strokeWidth="1.4" />
                <circle cx="70" cy="17" r="5" fill="#ffe9a0" stroke="#c4a24e" strokeWidth="1.2" />
              </>
            )}
          </svg>
        </div>

        <p className="bench__creating">{hobby.creating}</p>
        {hobby.petName ? <p className="bench__pet">Pet name: {hobby.petName}</p> : null}

        <div className="bench__progress-block">
          <div className="bench__progress-labels">
            <span>{copy.progressLabel}</span>
            <span>{pct}%</span>
          </div>
          <div className="bench__progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="bench__progress-bar" style={{ width: `${pct}%` }} />
          </div>
          {hobby.lastTendedAt ? (
            <p className="bench__last">
              {copy.lastTendedPrefix}{' '}
              {new Date(hobby.lastTendedAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          ) : (
            <p className="bench__last">{copy.notTendedYet}</p>
          )}
        </div>

        {!choosing ? (
          <>
            <button type="button" className="bench__tend" onClick={openChooser}>
              {copy.tendButton}
            </button>
            {splash ? <p className="bench__feedback">Nice — progress saved on this device.</p> : null}
          </>
        ) : (
          <div className="bench__chooser" aria-label="Choose how much progress to log">
            <p className="bench__chooser-title">{copy.tendChooserTitle}</p>
            <p className="bench__chooser-copy">{copy.tendChooserCopy}</p>

            <div className="bench__presets" role="group" aria-label="Progress presets">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`bench__preset${presetId === preset.id ? ' bench__preset--active' : ''}`}
                  onClick={() => pickPreset(preset.id, preset.bump)}
                  aria-pressed={presetId === preset.id}
                >
                  <span className="bench__preset-label">{preset.label}</span>
                  <span className="bench__preset-bump">+{preset.bump}%</span>
                  <span className="bench__preset-hint">{preset.hint}</span>
                </button>
              ))}
            </div>

            <label className="bench__slider-label">
              <span>Or choose your own</span>
              <span className="bench__slider-value">{amount}%</span>
            </label>
            <input
              className="bench__slider"
              type="range"
              min={1}
              max={100}
              step={1}
              value={amount}
              onChange={(e) => onSliderChange(Number(e.target.value))}
              aria-valuemin={1}
              aria-valuemax={100}
              aria-valuenow={amount}
              aria-label="Custom progress percent"
            />
            <div className="bench__custom-row">
              <label className="bench__custom-input-wrap">
                Custom %
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={amount}
                  onChange={(e) => onSliderChange(Number(e.target.value) || 1)}
                  inputMode="numeric"
                />
              </label>
              <p className="bench__chooser-preview" aria-live="polite">
                {amountLabel}
                {roomLeft > 0 ? ` · grows to ${previewPct}%` : ''}
              </p>
            </div>

            <div className="bench__chooser-actions">
              <button type="button" className="bench__tend" onClick={confirmTend}>
                {copy.tendConfirm}
              </button>
              <button type="button" className="bench__secondary" onClick={() => setChoosing(false)}>
                Not now
              </button>
            </div>
          </div>
        )}

        {onEnterHyperfocus ? (
          <button
            type="button"
            className="bench__hyperfocus"
            onClick={() => onEnterHyperfocus(hobby.id)}
          >
            Enter hyperfocus
          </button>
        ) : null}

        <NestItemsPanel hobby={hobby} onChange={handleItemsChange} dense />

        <ProgressPhotosPanel hobbyId={hobby.id} dense />

        <ProgressAudioPanel hobbyId={hobby.id} dense />

        <div className="bench__status">
          <p className="bench__section-label">Move to</p>
          <div className="bench__status-row">
            {MOVABLE_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                className={`bench__status-btn${hobby.status === status ? ' bench__status-btn--active' : ''}`}
                onClick={() => setStatus(status)}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        {!editing ? (
          <div className="bench__actions">
            <button type="button" className="bench__secondary" onClick={() => setEditing(true)}>
              Edit hobby
            </button>
            {!confirmDelete ? (
              <button type="button" className="bench__danger" onClick={() => setConfirmDelete(true)}>
                Delete
              </button>
            ) : (
              <div className="bench__confirm">
                <p>Delete forever? This cannot be undone.</p>
                <button type="button" className="bench__danger" onClick={() => onDelete(hobby.id)}>
                  Yes, delete
                </button>
                <button type="button" className="bench__secondary" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <form className="bench__edit" onSubmit={handleSave}>
            <p className="bench__section-label">Edit</p>
            <label>
              Name
              <input required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              What are you creating or learning?
              <input required value={creating} onChange={(e) => setCreating(e.target.value)} />
            </label>
            <label>
              Nudge cadence
              <select value={cadence} onChange={(e) => setCadence(e.target.value as NudgeCadence)}>
                {(Object.keys(CADENCE_LABELS) as NudgeCadence[]).map((key) => (
                  <option key={key} value={key}>
                    {CADENCE_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Optional pet name
              <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="e.g. Fern" />
            </label>
            <fieldset className="bench__colors">
              <legend>{copy.recolorLegend}</legend>
              <div className="bench__swatches">
                {PLANT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`bench__swatch${color === c.id ? ' bench__swatch--active' : ''}`}
                    style={{ background: c.swatch }}
                    aria-label={c.label}
                    aria-pressed={color === c.id}
                    onClick={() => setColor(c.id)}
                  />
                ))}
              </div>
            </fieldset>
            <div className="bench__edit-actions">
              <button type="submit">Save</button>
              <button type="button" className="bench__secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
