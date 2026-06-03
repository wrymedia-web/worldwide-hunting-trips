'use client'

import { useCallback, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Loader2, Star, Trash2, UploadCloud, GripVertical, Image as ImageIcon } from 'lucide-react'
import {
  uploadHuntPhotos,
  deleteHuntPhoto,
  setPrimaryPhoto,
  reorderHuntPhotos,
  type HuntPhoto,
} from '@/app/actions/photos'

const MAX_PHOTOS = 12
const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

interface HuntPhotoUploaderProps {
  listingId: string
  initialPhotos: HuntPhoto[]
}

export default function HuntPhotoUploader({
  listingId,
  initialPhotos,
}: HuntPhotoUploaderProps) {
  const [photos, setPhotos] = useState<HuntPhoto[]>(initialPhotos)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, startUploadTransition] = useTransition()
  const [pendingRowAction, setPendingRowAction] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragFromIndex = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const remaining = MAX_PHOTOS - photos.length

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null)
      const list = Array.from(files)
      if (list.length === 0) return

      if (list.length > remaining) {
        setError(`You can only add ${remaining} more photo${remaining === 1 ? '' : 's'}.`)
        return
      }

      for (const f of list) {
        if (!ALLOWED.includes(f.type)) {
          setError(`${f.name}: unsupported format. Use JPG, PNG, or WebP.`)
          return
        }
        if (f.size > MAX_BYTES) {
          setError(`${f.name} is over the 8 MB limit.`)
          return
        }
      }

      const fd = new FormData()
      for (const f of list) fd.append('files', f)

      startUploadTransition(async () => {
        const { uploaded, error: actionErr } = await uploadHuntPhotos(listingId, fd)
        if (actionErr) {
          setError(`${actionErr}${uploaded > 0 ? ` (${uploaded} uploaded before the failure)` : ''}`)
        }
        // Server revalidates; force a refresh by reloading photos via router action.
        // Simpler: reload page section by re-fetching via a hard navigation reload.
        window.location.reload()
      })
    },
    [listingId, remaining]
  )

  const handleDelete = (photoId: string) => {
    setPendingRowAction(photoId)
    setError(null)
    deleteHuntPhoto(photoId).then(({ error: actionErr }) => {
      setPendingRowAction(null)
      if (actionErr) {
        setError(actionErr)
        return
      }
      setPhotos((p) => p.filter((x) => x.id !== photoId))
    })
  }

  const handleSetPrimary = (photoId: string) => {
    setPendingRowAction(photoId)
    setError(null)
    setPrimaryPhoto(photoId).then(({ error: actionErr }) => {
      setPendingRowAction(null)
      if (actionErr) {
        setError(actionErr)
        return
      }
      setPhotos((p) =>
        p.map((x) => ({ ...x, is_primary: x.id === photoId }))
      )
    })
  }

  // ─── Drag-to-reorder ────────────────────────────────────────────────────────

  const onTileDragStart = (i: number) => () => {
    dragFromIndex.current = i
  }
  const onTileDragOver = (i: number) => (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverIndex(i)
  }
  const onTileDrop = (i: number) => (e: React.DragEvent) => {
    e.preventDefault()
    const from = dragFromIndex.current
    dragFromIndex.current = null
    setDragOverIndex(null)
    if (from === null || from === i) return

    const next = [...photos]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    setPhotos(next.map((p, idx) => ({ ...p, sort_order: idx })))

    reorderHuntPhotos(
      listingId,
      next.map((p) => p.id)
    ).then(({ error: actionErr }) => {
      if (actionErr) setError(actionErr)
    })
  }

  // ─── Drop zone ──────────────────────────────────────────────────────────────

  const onZoneDragOver = (e: React.DragEvent) => {
    if (dragFromIndex.current !== null) return // tile reorder in progress
    e.preventDefault()
    setIsDragging(true)
  }
  const onZoneDragLeave = () => setIsDragging(false)
  const onZoneDrop = (e: React.DragEvent) => {
    if (dragFromIndex.current !== null) return
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-wht-bone-2 p-6" id="photos-panel">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-sm font-bold text-wht-forest uppercase tracking-widest flex items-center gap-2">
          <span className="inline-block w-1.5 h-4 rounded-full bg-wht-forest" />
          Hunt Photos
        </h2>
        <span className="text-xs text-gray-500">
          {photos.length} / {MAX_PHOTOS}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Drop zone */}
      {remaining > 0 && (
        <div
          onDragOver={onZoneDragOver}
          onDragLeave={onZoneDragLeave}
          onDrop={onZoneDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-5 rounded-lg border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-wht-forest bg-wht-forest/5'
              : 'border-wht-bone-2 hover:border-wht-forest/50 hover:bg-wht-paper/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-wht-forest">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm font-medium">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <UploadCloud className="h-7 w-7" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drop photos here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  JPG, PNG, or WebP · up to 8 MB each · {remaining} slot{remaining === 1 ? '' : 's'} left
                </p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files)
              e.target.value = '' // allow re-selecting the same file
            }}
          />
        </div>
      )}

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No photos yet. Add at least one to make the listing pop.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, i) => {
            const isPending = pendingRowAction === photo.id
            const isDropTarget = dragOverIndex === i
            return (
              <div
                key={photo.id}
                draggable
                onDragStart={onTileDragStart(i)}
                onDragOver={onTileDragOver(i)}
                onDrop={onTileDrop(i)}
                onDragEnd={() => {
                  dragFromIndex.current = null
                  setDragOverIndex(null)
                }}
                className={`relative group aspect-[4/3] rounded-lg overflow-hidden border bg-gray-100 ${
                  isDropTarget
                    ? 'border-wht-forest ring-2 ring-wht-forest/30'
                    : 'border-wht-bone-2'
                } ${isPending ? 'opacity-50' : ''}`}
              >
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                  unoptimized
                />

                {photo.is_primary && (
                  <div className="absolute top-2 left-2 bg-wht-forest text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Primary
                  </div>
                )}

                {/* Drag handle (visual cue) */}
                <div className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Hover actions */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-2">
                  {!photo.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(photo.id)}
                      disabled={isPending}
                      className="text-xs font-semibold text-white hover:text-wht-blaze bg-black/40 hover:bg-black/60 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" /> Make primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(photo.id)}
                    disabled={isPending}
                    className="ml-auto text-xs font-semibold text-white hover:text-red-300 bg-black/40 hover:bg-red-600/80 px-2 py-1 rounded flex items-center gap-1"
                    aria-label="Delete photo"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>

                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {photos.length > 1 && (
        <p className="text-xs text-gray-500 mt-3">
          Drag photos to reorder. The primary photo is shown first on browse cards.
        </p>
      )}
    </div>
  )
}
