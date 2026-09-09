import { useCallback, useEffect, useRef, useState } from 'react'
import {
  addProgressPhoto,
  deleteProgressPhoto,
  getPhotoBlob,
  listPhotoMeta,
  type ProgressPhotoMeta,
} from '../photoStorage'
import './ProgressPhotosPanel.css'

interface ProgressPhotosPanelProps {
  hobbyId: string
  dense?: boolean
}

interface GalleryItem extends ProgressPhotoMeta {
  url?: string
}

function formatPhotoDate(iso: string): string {
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

export function ProgressPhotosPanel({ hobbyId, dense = false }: ProgressPhotosPanelProps) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const objectUrls = useRef<string[]>([])

  const revokeAll = useCallback(() => {
    for (const url of objectUrls.current) URL.revokeObjectURL(url)
    objectUrls.current = []
  }, [])

  const refresh = useCallback(async () => {
    const meta = listPhotoMeta(hobbyId)
    revokeAll()
    const loaded: GalleryItem[] = []
    for (const m of meta) {
      const blob = await getPhotoBlob(hobbyId, m.id)
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
    return () => revokeAll()
  }, [refresh, revokeAll])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      setError('Please pick an image file.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await addProgressPhoto(hobbyId, file)
      await refresh()
    } catch {
      setError('Could not save that photo on this device. Try a smaller image.')
    } finally {
      setBusy(false)
      if (cameraRef.current) cameraRef.current.value = ''
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(photoId: string) {
    setBusy(true)
    setError(null)
    try {
      await deleteProgressPhoto(hobbyId, photoId)
      setConfirmId(null)
      if (lightbox?.id === photoId) setLightbox(null)
      await refresh()
    } catch {
      setError('Could not delete that photo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`photo-panel${dense ? ' photo-panel--dense' : ''}`}>
      <div className="photo-panel__head">
        <p className="photo-panel__title">Progress photos</p>
        <p className="photo-panel__hint">
          Optional — a soft timeline of how things grew. Never required to tend.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="photo-panel__empty">No progress pics yet. Snap one whenever it feels nice.</p>
      ) : (
        <ul className="photo-panel__gallery" aria-label="Progress photo timeline">
          {items.map((item) => (
            <li key={item.id} className="photo-panel__tile">
              <button
                type="button"
                className="photo-panel__thumb-btn"
                onClick={() => item.url && setLightbox(item)}
                disabled={!item.url}
                aria-label={`Progress photo from ${formatPhotoDate(item.createdAt)}`}
              >
                {item.url ? (
                  <img src={item.url} alt="" className="photo-panel__thumb" loading="lazy" />
                ) : (
                  <span className="photo-panel__missing">?</span>
                )}
              </button>
              <p className="photo-panel__date">{formatPhotoDate(item.createdAt)}</p>
              {confirmId === item.id ? (
                <div className="photo-panel__confirm">
                  <p>Remove this photo?</p>
                  <button
                    type="button"
                    className="photo-panel__danger"
                    disabled={busy}
                    onClick={() => void handleDelete(item.id)}
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    className="photo-panel__ghost"
                    onClick={() => setConfirmId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="photo-panel__ghost"
                  disabled={busy}
                  onClick={() => setConfirmId(item.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="photo-panel__add-row">
        <button
          type="button"
          className="photo-panel__add"
          disabled={busy}
          onClick={() => cameraRef.current?.click()}
        >
          {busy ? 'Saving…' : '📷 Camera'}
        </button>
        <button
          type="button"
          className="photo-panel__add photo-panel__add--secondary"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          Choose photo
        </button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="photo-panel__file"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="photo-panel__file"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {error ? (
        <p className="photo-panel__error" role="alert">
          {error}
        </p>
      ) : null}

      {lightbox?.url ? (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Progress photo">
          <button
            type="button"
            className="photo-lightbox__scrim"
            aria-label="Close photo"
            onClick={() => setLightbox(null)}
          />
          <div className="photo-lightbox__card">
            <img src={lightbox.url} alt={`Progress from ${formatPhotoDate(lightbox.createdAt)}`} />
            <p>{formatPhotoDate(lightbox.createdAt)}</p>
            <button type="button" className="photo-panel__ghost" onClick={() => setLightbox(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
