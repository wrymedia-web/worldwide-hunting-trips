'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getOutfitterByUser } from '@/app/actions/outfitter'

const BUCKET = 'hunt-photos'
const MAX_PHOTOS_PER_LISTING = 12
const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

export interface HuntPhoto {
  id: string
  url: string
  is_primary: boolean
  sort_order: number
}

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'bin'
}

function randomKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

// Verifies the signed-in user owns the listing and returns the outfitter id.
async function requireListingOwner(
  listingId: string
): Promise<{ outfitterId: string; error: string | null }> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return { outfitterId: '', error: 'Not authenticated' }

  const outfitter = await getOutfitterByUser(user.id)
  if (!outfitter) return { outfitterId: '', error: 'Outfitter profile not found' }

  const { data: listing, error: lErr } = await supabase
    .from('hunt_listings')
    .select('id, outfitter_id')
    .eq('id', listingId)
    .single()

  if (lErr || !listing) return { outfitterId: '', error: 'Listing not found' }
  if (listing.outfitter_id !== outfitter.id) return { outfitterId: '', error: 'Unauthorized' }

  return { outfitterId: outfitter.id, error: null }
}

async function requirePhotoOwner(
  photoId: string
): Promise<{ photo: { id: string; hunt_id: string; url: string } | null; error: string | null }> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return { photo: null, error: 'Not authenticated' }

  const outfitter = await getOutfitterByUser(user.id)
  if (!outfitter) return { photo: null, error: 'Outfitter profile not found' }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('hunt_images')
    .select('id, url, hunt_id, hunt_listings!inner(outfitter_id)')
    .eq('id', photoId)
    .single()

  if (error || !data) return { photo: null, error: 'Photo not found' }
  const listing = data.hunt_listings as unknown as { outfitter_id: string }
  if (listing.outfitter_id !== outfitter.id) return { photo: null, error: 'Unauthorized' }

  return { photo: { id: data.id, hunt_id: data.hunt_id, url: data.url }, error: null }
}

// Storage paths are stored as the bucket-relative key, e.g. "{outfitter}/{hunt}/{file}.jpg".
// We expose them to the app as full public URLs but keep the relative key for delete calls.
function publicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`
}

function pathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

// ─── uploadHuntPhotos ─────────────────────────────────────────────────────────

export async function uploadHuntPhotos(
  listingId: string,
  formData: FormData
): Promise<{ uploaded: number; error: string | null }> {
  const { outfitterId, error: authErr } = await requireListingOwner(listingId)
  if (authErr) return { uploaded: 0, error: authErr }

  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length === 0) return { uploaded: 0, error: 'No files received.' }

  const admin = createAdminClient()

  const { count: existingCount } = await admin
    .from('hunt_images')
    .select('id', { count: 'exact', head: true })
    .eq('hunt_id', listingId)

  const current = existingCount ?? 0
  if (current + files.length > MAX_PHOTOS_PER_LISTING) {
    return {
      uploaded: 0,
      error: `Listing limit is ${MAX_PHOTOS_PER_LISTING} photos. You currently have ${current}.`,
    }
  }

  const { data: existing } = await admin
    .from('hunt_images')
    .select('id, sort_order, is_primary')
    .eq('hunt_id', listingId)
    .order('sort_order', { ascending: false })
    .limit(1)

  let nextSort = (existing?.[0]?.sort_order ?? -1) + 1
  const hasPrimary = (await admin
    .from('hunt_images')
    .select('id', { count: 'exact', head: true })
    .eq('hunt_id', listingId)
    .eq('is_primary', true)).count ?? 0

  let uploaded = 0

  for (const file of files) {
    if (!ALLOWED_MIME.has(file.type)) {
      return { uploaded, error: `Unsupported file type: ${file.type}. Use JPG, PNG, or WebP.` }
    }
    if (file.size > MAX_BYTES) {
      return { uploaded, error: `${file.name} is over the 8 MB limit.` }
    }

    const ext = extFromMime(file.type)
    const key = `${outfitterId}/${listingId}/${randomKey()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: upErr } = await admin.storage.from(BUCKET).upload(key, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (upErr) {
      return { uploaded, error: `Upload failed: ${upErr.message}` }
    }

    const isPrimary = hasPrimary === 0 && uploaded === 0
    const { error: rowErr } = await admin.from('hunt_images').insert({
      hunt_id: listingId,
      url: publicUrl(key),
      is_primary: isPrimary,
      sort_order: nextSort++,
    })

    if (rowErr) {
      // Best-effort: clean the orphan storage object.
      await admin.storage.from(BUCKET).remove([key])
      return { uploaded, error: `Save failed: ${rowErr.message}` }
    }

    uploaded += 1
  }

  revalidatePath(`/dashboard/outfitter/listings/${listingId}/edit`)
  return { uploaded, error: null }
}

// ─── deleteHuntPhoto ──────────────────────────────────────────────────────────

export async function deleteHuntPhoto(
  photoId: string
): Promise<{ error: string | null }> {
  const { photo, error } = await requirePhotoOwner(photoId)
  if (error || !photo) return { error: error ?? 'Photo not found' }

  const admin = createAdminClient()

  const path = pathFromUrl(photo.url)
  if (path) {
    await admin.storage.from(BUCKET).remove([path])
  }

  const { error: delErr } = await admin.from('hunt_images').delete().eq('id', photoId)
  if (delErr) return { error: delErr.message }

  // If the deleted photo was the primary, promote the lowest-sort remaining one.
  const { data: remaining } = await admin
    .from('hunt_images')
    .select('id, is_primary')
    .eq('hunt_id', photo.hunt_id)
    .order('sort_order', { ascending: true })

  const anyPrimary = remaining?.some((r) => r.is_primary) ?? false
  if (remaining && remaining.length > 0 && !anyPrimary) {
    await admin.from('hunt_images').update({ is_primary: true }).eq('id', remaining[0].id)
  }

  revalidatePath(`/dashboard/outfitter/listings/${photo.hunt_id}/edit`)
  return { error: null }
}

// ─── setPrimaryPhoto ──────────────────────────────────────────────────────────

export async function setPrimaryPhoto(
  photoId: string
): Promise<{ error: string | null }> {
  const { photo, error } = await requirePhotoOwner(photoId)
  if (error || !photo) return { error: error ?? 'Photo not found' }

  const admin = createAdminClient()

  // Clear current primary on this hunt, then set the new one.
  const { error: clearErr } = await admin
    .from('hunt_images')
    .update({ is_primary: false })
    .eq('hunt_id', photo.hunt_id)
    .eq('is_primary', true)
  if (clearErr) return { error: clearErr.message }

  const { error: setErr } = await admin
    .from('hunt_images')
    .update({ is_primary: true })
    .eq('id', photoId)
  if (setErr) return { error: setErr.message }

  revalidatePath(`/dashboard/outfitter/listings/${photo.hunt_id}/edit`)
  return { error: null }
}

// ─── reorderHuntPhotos ────────────────────────────────────────────────────────

export async function reorderHuntPhotos(
  listingId: string,
  orderedPhotoIds: string[]
): Promise<{ error: string | null }> {
  const { error: authErr } = await requireListingOwner(listingId)
  if (authErr) return { error: authErr }

  const admin = createAdminClient()

  const { data: photos } = await admin
    .from('hunt_images')
    .select('id')
    .eq('hunt_id', listingId)

  const validIds = new Set((photos ?? []).map((p) => p.id))
  if (orderedPhotoIds.some((id) => !validIds.has(id))) {
    return { error: 'Order list references photos not on this listing.' }
  }

  for (let i = 0; i < orderedPhotoIds.length; i++) {
    const { error } = await admin
      .from('hunt_images')
      .update({ sort_order: i })
      .eq('id', orderedPhotoIds[i])
    if (error) return { error: error.message }
  }

  revalidatePath(`/dashboard/outfitter/listings/${listingId}/edit`)
  return { error: null }
}

// ─── getHuntPhotos (read helper used by edit page) ────────────────────────────

export async function getHuntPhotos(listingId: string): Promise<HuntPhoto[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('hunt_images')
    .select('id, url, is_primary, sort_order')
    .eq('hunt_id', listingId)
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return data as HuntPhoto[]
}
