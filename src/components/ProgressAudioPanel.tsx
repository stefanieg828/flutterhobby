import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AUDIO_WARN_DURATION_MS,
  MAX_AUDIO_DURATION_MS,
  addProgressAudio,
  deleteProgressAudio,
  formatAudioDuration,
  getAudioBlob,
  listAudioMeta,
  pickRecorderMimeType,
  type ProgressAudioMeta,
} from '../audioStorage'
import './ProgressAudioPanel.css'

interface ProgressAudioPanelProps {
  hobbyId: string
  dense?: boolean
}

interface ClipItem extends ProgressAudioMeta {
  url?: string
}

function formatClipDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Sometime'
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function ProgressAudioPanel({ hobbyId, dense = false }: ProgressAudioPanelProps) {
  const [items, setItems] = useState<ClipItem[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [softWarn, setSoftWarn] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const objectUrls = useRef<string[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startedAtRef = useRef<number>(0)
  const tickRef = useRef<number | null>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  const stopReasonRef = useRef<'user' | 'limit'>('user')

  const revokeAll = useCallback(() => {
    for (const url of objectUrls.current) URL.revokeObjectURL(url)
    objectUrls.current = []
  }, [])

  const clearTick = useCallback(() => {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [])

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const refresh = useCallback(async () => {
    const meta = listAudioMeta(hobbyId)
    revokeAll()
    const loaded: ClipItem[] = []
    for (const m of meta) {
      const blob = await getAudioBlob(hobbyId, m.id)
      if (!blob) {
        loaded.push(m)
        continue
      }
      const url = URL.createObjectURL(blob)
      objectUrls.current.push(url)
      loaded.push({ ...m, url })
    }
    setItems(loaded)
  }, [hobbyId, revokeAll])

  useEffect(() => {
    void refresh()
    return () => {
      revokeAll()
      clearTick()
      stopStream()
      mediaRecorderRef.current = null
      if (audioElRef.current) {
        audioElRef.current.pause()
        audioElRef.current = null
      }
    }
  }, [refresh, revokeAll, clearTick, stopStream])

  async function saveBlob(blob: Blob, durationMs?: number) {
    setBusy(true)
    setError(null)
    try {
      await addProgressAudio(hobbyId, blob, {
        durationMs,
        mimeType: blob.type || undefined,
      })
      await refresh()
    } catch {
      setError('Could not save that clip on this device. Try a shorter recording.')
    } finally {
      setBusy(false)
    }
  }

  function finishRecording(blob: Blob) {
    const durationMs = Math.max(0, Date.now() - startedAtRef.current)
    setRecording(false)
    setElapsedMs(durationMs)
    clearTick()
    stopStream()
    mediaRecorderRef.current = null

    if (blob.size === 0 || durationMs < 400) {
      setError('That clip was a bit too short — try again when you are ready.')
      setSoftWarn(false)
      return
    }

    if (stopReasonRef.current === 'limit') {
      setSoftWarn(true)
      setError(null)
    } else {
      setSoftWarn(false)
    }

    void saveBlob(blob, Math.min(durationMs, MAX_AUDIO_DURATION_MS))
  }

  async function startRecording() {
    if (recording || busy) return
    setError(null)
    setSoftWarn(false)
    setElapsedMs(0)
    stopReasonRef.current = 'user'

    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Recording is not available in this browser. You can still upload an audio file.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mimeType = pickRecorderMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      chunksRef.current = []
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const type = recorder.mimeType || mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type })
        chunksRef.current = []
        finishRecording(blob)
      }

      recorder.onerror = () => {
        setError('Recording hiccuped. You can try again or upload a file instead.')
        setRecording(false)
        clearTick()
        stopStream()
        mediaRecorderRef.current = null
      }

      startedAtRef.current = Date.now()
      recorder.start(250)
      setRecording(true)

      tickRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startedAtRef.current
        setElapsedMs(elapsed)
        if (elapsed >= AUDIO_WARN_DURATION_MS) setSoftWarn(true)
        if (elapsed >= MAX_AUDIO_DURATION_MS) {
          stopReasonRef.current = 'limit'
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop()
          }
        }
      }, 200)
    } catch {
      stopStream()
      setError('Microphone access was declined. You can still upload an audio file.')
    }
  }

  function stopRecording() {
    stopReasonRef.current = 'user'
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state === 'recording') {
      recorder.stop()
    } else {
      setRecording(false)
      clearTick()
      stopStream()
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('audio/') && !/\.(webm|mp3|m4a|ogg|wav|aac|flac)$/i.test(file.name)) {
      setError('Please pick an audio file.')
      return
    }

    // Soft duration check via HTMLAudioElement when possible.
    let durationMs: number | undefined
    try {
      durationMs = await new Promise<number | undefined>((resolve) => {
        const url = URL.createObjectURL(file)
        const el = new Audio()
        const done = (ms?: number) => {
          URL.revokeObjectURL(url)
          resolve(ms)
        }
        el.preload = 'metadata'
        el.onloadedmetadata = () => {
          const d = el.duration
          if (Number.isFinite(d) && d > 0) done(d * 1000)
          else done(undefined)
        }
        el.onerror = () => done(undefined)
        el.src = url
      })
    } catch {
      durationMs = undefined
    }

    if (durationMs != null && durationMs > MAX_AUDIO_DURATION_MS) {
      setSoftWarn(true)
      setError(
        `That clip is a bit long (over ~3 minutes). Trim it gently if you can — shorter keeps the journal light.`,
      )
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    if (durationMs != null && durationMs >= AUDIO_WARN_DURATION_MS) {
      setSoftWarn(true)
    } else {
      setSoftWarn(false)
    }

    setBusy(true)
    setError(null)
    try {
      await addProgressAudio(hobbyId, file, {
        durationMs,
        mimeType: file.type || undefined,
      })
      await refresh()
    } catch {
      setError('Could not save that clip on this device. Try a smaller file.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function stopPlayback() {
    if (audioElRef.current) {
      audioElRef.current.pause()
      audioElRef.current = null
    }
    setPlayingId(null)
  }

  function togglePlay(item: ClipItem) {
    if (!item.url) {
      setError('That clip could not be loaded from this device.')
      return
    }
    if (playingId === item.id) {
      stopPlayback()
      return
    }
    stopPlayback()
    const el = new Audio(item.url)
    audioElRef.current = el
    el.onended = () => setPlayingId(null)
    el.onerror = () => {
      setPlayingId(null)
      setError('Could not play that clip.')
    }
    void el.play().then(
      () => setPlayingId(item.id),
      () => {
        setPlayingId(null)
        setError('Playback was blocked — tap play again.')
      },
    )
  }

  async function handleDelete(audioId: string) {
    setBusy(true)
    setError(null)
    try {
      if (playingId === audioId) stopPlayback()
      await deleteProgressAudio(hobbyId, audioId)
      setConfirmId(null)
      await refresh()
    } catch {
      setError('Could not delete that clip.')
    } finally {
      setBusy(false)
    }
  }

  const canRecord =
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia

  return (
    <div className={`audio-panel${dense ? ' audio-panel--dense' : ''}`}>
      <div className="audio-panel__head">
        <p className="audio-panel__title">Progress audio</p>
        <p className="audio-panel__hint">
          Optional — a soft sound journal (practice, notes, little hums). Never required to tend.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="audio-panel__empty">
          No clips yet. Record a short moment whenever it feels nice.
        </p>
      ) : (
        <ul className="audio-panel__list" aria-label="Progress audio timeline">
          {items.map((item) => (
            <li key={item.id} className="audio-panel__row">
              <div className="audio-panel__meta">
                <p className="audio-panel__date">{formatClipDate(item.createdAt)}</p>
                {item.durationMs != null ? (
                  <p className="audio-panel__dur">{formatAudioDuration(item.durationMs)}</p>
                ) : null}
              </div>
              <div className="audio-panel__actions">
                <button
                  type="button"
                  className="audio-panel__play"
                  disabled={busy || !item.url}
                  onClick={() => togglePlay(item)}
                  aria-label={
                    playingId === item.id
                      ? `Stop clip from ${formatClipDate(item.createdAt)}`
                      : `Play clip from ${formatClipDate(item.createdAt)}`
                  }
                >
                  {playingId === item.id ? '⏹ Stop' : '▶ Play'}
                </button>
                {confirmId === item.id ? (
                  <div className="audio-panel__confirm">
                    <p>Remove this clip?</p>
                    <button
                      type="button"
                      className="audio-panel__danger"
                      disabled={busy}
                      onClick={() => void handleDelete(item.id)}
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      className="audio-panel__ghost"
                      onClick={() => setConfirmId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="audio-panel__ghost"
                    disabled={busy}
                    onClick={() => setConfirmId(item.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {recording ? (
        <div className="audio-panel__rec" aria-live="polite">
          <p className="audio-panel__rec-status">
            Recording… {formatAudioDuration(elapsedMs)}
            <span className="audio-panel__pulse" aria-hidden="true" />
          </p>
          {softWarn ? (
            <p className="audio-panel__warn">
              Soft heads-up: clips feel nicest under ~3 minutes. Stopping soon is totally fine.
            </p>
          ) : (
            <p className="audio-panel__rec-hint">Up to about 3 minutes — stop anytime.</p>
          )}
          <button type="button" className="audio-panel__stop" onClick={stopRecording}>
            Stop &amp; save
          </button>
        </div>
      ) : (
        <div className="audio-panel__add-row">
          <button
            type="button"
            className="audio-panel__add"
            disabled={busy || !canRecord}
            onClick={() => void startRecording()}
            title={canRecord ? undefined : 'Recording unavailable — upload instead'}
          >
            {busy ? 'Saving…' : '🎙 Record'}
          </button>
          <button
            type="button"
            className="audio-panel__add audio-panel__add--secondary"
            disabled={busy || recording}
            onClick={() => fileRef.current?.click()}
          >
            Upload audio
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.ogg,.wav,.webm,.aac"
        className="audio-panel__file"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {softWarn && !recording ? (
        <p className="audio-panel__warn">
          Soft note: keeping clips under ~3 minutes helps this stay light on your device.
        </p>
      ) : null}

      {error ? (
        <p className="audio-panel__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
