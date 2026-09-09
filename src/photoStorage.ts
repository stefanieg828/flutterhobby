import { get, set, del, keys } from 'idb-keyval'

/** Metadata only — blobs live in IndexedDB. */
export interface ProgressPhotoMeta {
  id: string
  hobbyId: string
  createdAt: string
  /** Optional soft caption later; unused for now. */
  note?: string
}

const META_KEY = 'flutterhobby-progress-photos'
const IDB_PREFIX = 'fh-photo:'

function photoKey(hobbyId: string, photoId: string): string {
  return `${IDB_PREFIX}${hobbyId}:${photoId}`
}

export function createPhotoId(): string {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function loadAllMeta(): Record<string, ProgressPhotoMeta[]> {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, ProgressPhotoMeta[]>
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

function saveAllMeta(map: Record<string, ProgressPhotoMeta[]>): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(map))
  } catch {
    /* ignore quota / private mode */
  }
}

/** Newest first. */
export function listPhotoMeta(hobbyId: string): ProgressPhotoMeta[] {
  const list = loadAllMeta()[hobbyId] ?? []
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function getPhotoBlob(hobbyId: string, photoId: string): Promise<Blob | undefined> {
  try {
    const blob = await get<Blob>(photoKey(hobbyId, photoId))
    return blob instanceof Blob ? blob : undefined
  } catch {
    return undefined
  }
}

/**
 * Downscale + JPEG-compress large images before IndexedDB write.
 * Keeps gallery snappy and avoids huge blobs on mobile.
 */
export async function compressImageFile(file: File, maxEdge = 1280, quality = 0.72): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Not an image')
  }

  // Prefer createImageBitmap when available (mobile-friendly).
  let bitmap: ImageBitmap | null = null
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    bitmap = null
  }

  const drawFromBitmap = (bmp: ImageBitmap): Blob | Promise<Blob> => {
    const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height))
    const w = Math.max(1, Math.round(bmp.width * scale))
    const h = Math.max(1, Math.round(bmp.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable')
    ctx.drawImage(bmp, 0, 0, w, h)
    bmp.close()
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Compress failed'))),
        'image/jpeg',
        quality,
      )
    })
  }

  if (bitmap) {
    return drawFromBitmap(bitmap)
  }

  // Fallback: HTMLImageElement
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Image load failed'))
      el.src = url
    })
    const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.max(1, Math.round(img.naturalWidth * scale))
    const h = Math.max(1, Math.round(img.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable')
    ctx.drawImage(img, 0, 0, w, h)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Compress failed'))),
        'image/jpeg',
        quality,
      )
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function addProgressPhoto(
  hobbyId: string,
  file: File,
): Promise<ProgressPhotoMeta> {
  const id = createPhotoId()
  const createdAt = new Date().toISOString()
  const blob = await compressImageFile(file)
  await set(photoKey(hobbyId, id), blob)

  const map = loadAllMeta()
  const entry: ProgressPhotoMeta = { id, hobbyId, createdAt }
  map[hobbyId] = [entry, ...(map[hobbyId] ?? [])]
  saveAllMeta(map)
  return entry
}

export async function deleteProgressPhoto(hobbyId: string, photoId: string): Promise<void> {
  try {
    await del(photoKey(hobbyId, photoId))
  } catch {
    /* ignore */
  }
  const map = loadAllMeta()
  const next = (map[hobbyId] ?? []).filter((p) => p.id !== photoId)
  if (next.length === 0) delete map[hobbyId]
  else map[hobbyId] = next
  saveAllMeta(map)
}

/** Drop all photos for a hobby (call when the hobby itself is deleted). */
export async function deleteAllPhotosForHobby(hobbyId: string): Promise<void> {
  const map = loadAllMeta()
  const list = map[hobbyId] ?? []
  await Promise.all(
    list.map(async (p) => {
      try {
        await del(photoKey(hobbyId, p.id))
      } catch {
        /* ignore */
      }
    }),
  )
  delete map[hobbyId]
  saveAllMeta(map)

  // Best-effort sweep for orphaned keys for this hobby.
  try {
    const all = await keys()
    const prefix = `${IDB_PREFIX}${hobbyId}:`
    await Promise.all(
      all
        .filter((k) => typeof k === 'string' && k.startsWith(prefix))
        .map((k) => del(k)),
    )
  } catch {
    /* ignore */
  }
}
