'use server'

import { createClient } from '@/lib/supabase/server'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OutfitterRecord {
  id: string
  profile_id: string
  business_name: string
  slug: string
  state: string
  description: string | null
  phone: string | null
  email: string | null
  website: string | null
  years_in_business: number | null
  is_verified: boolean
  created_at: string
}

export interface HuntListingRecord {
  id: string
  outfitter_id: string
  title: string
  slug: string
  species_id: string | null
  species?: { name: string; category: string } | null
  state: string
  description: string
  price_per_person: number
  price_type: string
  duration_days: number | null
  max_hunters: number | null
  guided_type: string
  weapon_types: string[]
  land_type: string
  lodging_included: boolean
  meals_included: boolean
  success_rate: number | null
  trophy_class: string | null
  season_start: string | null
  season_end: string | null
  is_draw: boolean
  is_otc: boolean
  is_active: boolean
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

// ─── createOutfitterProfile ───────────────────────────────────────────────────

export async function createOutfitterProfile(formData: FormData): Promise<{
  outfitter: OutfitterRecord | null
  error: string | null
}> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { outfitter: null, error: 'Not authenticated' }
  }

  const businessName = (formData.get('business_name') as string | null)?.trim() ?? ''
  const state = (formData.get('state') as string | null)?.trim() ?? ''
  const description = (formData.get('description') as string | null)?.trim() ?? null
  const phone = (formData.get('phone') as string | null)?.trim() ?? null
  const email = (formData.get('email') as string | null)?.trim() ?? null
  const website = (formData.get('website') as string | null)?.trim() ?? null
  const yearsRaw = formData.get('years_in_business')
  const years_in_business = yearsRaw ? parseInt(yearsRaw as string, 10) : null

  if (!businessName || !state) {
    return { outfitter: null, error: 'Business name and state are required.' }
  }

  const slug = `${toSlug(businessName)}-${randomSuffix()}`

  const { data, error } = await supabase
    .from('outfitters')
    .insert({
      profile_id: user.id,
      business_name: businessName,
      slug,
      state,
      description,
      phone,
      email,
      website,
      years_in_business,
    })
    .select()
    .single()

  if (error) {
    return { outfitter: null, error: error.message }
  }

  return { outfitter: data as OutfitterRecord, error: null }
}

// ─── getOutfitterByUser ───────────────────────────────────────────────────────

export async function getOutfitterByUser(
  userId: string
): Promise<OutfitterRecord | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('outfitters')
    .select('*')
    .eq('profile_id', userId)
    .single()

  if (error || !data) return null
  return data as OutfitterRecord
}

// ─── createHuntListing ────────────────────────────────────────────────────────

export async function createHuntListing(
  formData: FormData,
  outfitterId: string
): Promise<{ listing: HuntListingRecord | null; error: string | null }> {
  const supabase = await createClient()

  const title = (formData.get('title') as string | null)?.trim() ?? ''
  if (!title) return { listing: null, error: 'Title is required.' }

  const slug = `${toSlug(title)}-${randomSuffix()}`

  const weaponTypesRaw = formData.getAll('weapon_types') as string[]

  const priceRaw = formData.get('price_per_person')
  const price_per_person = priceRaw ? parseFloat(priceRaw as string) : 0

  const durationRaw = formData.get('duration_days')
  const duration_days = durationRaw ? parseInt(durationRaw as string, 10) : null

  const maxRaw = formData.get('max_hunters')
  const max_hunters = maxRaw ? parseInt(maxRaw as string, 10) : null

  const successRaw = formData.get('success_rate')
  const success_rate = successRaw ? parseInt(successRaw as string, 10) : null

  const speciesRaw = formData.get('species_id')
  const species_id = speciesRaw && (speciesRaw as string).trim() ? (speciesRaw as string).trim() : null

  const payload = {
    outfitter_id: outfitterId,
    title,
    slug,
    species_id,
    state: (formData.get('state') as string | null)?.trim() ?? '',
    description: (formData.get('description') as string | null)?.trim() ?? '',
    price_per_person,
    price_type: (formData.get('price_type') as string | null) ?? 'per_person',
    duration_days,
    max_hunters,
    guided_type: (formData.get('guided_type') as string | null) ?? 'fully_guided',
    weapon_types: weaponTypesRaw,
    land_type: (formData.get('land_type') as string | null) ?? 'private',
    lodging_included: formData.get('lodging_included') === 'true',
    meals_included: formData.get('meals_included') === 'true',
    success_rate,
    trophy_class: (formData.get('trophy_class') as string | null) ?? null,
    season_start: (formData.get('season_start') as string | null) ?? null,
    season_end: (formData.get('season_end') as string | null) ?? null,
    is_draw: formData.get('is_draw') === 'true',
    is_otc: formData.get('is_otc') === 'true',
    is_active: true,
  }

  const { data, error } = await supabase
    .from('hunt_listings')
    .insert(payload)
    .select()
    .single()

  if (error) return { listing: null, error: error.message }
  return { listing: data as HuntListingRecord, error: null }
}

// ─── getOutfitterListings ─────────────────────────────────────────────────────

export async function getOutfitterListings(
  outfitterId: string
): Promise<HuntListingRecord[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('hunt_listings')
    .select('*, species(name, category)')
    .eq('outfitter_id', outfitterId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as HuntListingRecord[]
}

// ─── updateHuntListing ────────────────────────────────────────────────────────

export async function updateHuntListing(
  listingId: string,
  formData: FormData
): Promise<{ listing: HuntListingRecord | null; error: string | null }> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return { listing: null, error: 'Not authenticated' }

  // Verify ownership
  const outfitter = await getOutfitterByUser(user.id)
  if (!outfitter) return { listing: null, error: 'Outfitter profile not found' }

  const { data: existing, error: fetchErr } = await supabase
    .from('hunt_listings')
    .select('id, outfitter_id')
    .eq('id', listingId)
    .single()

  if (fetchErr || !existing) return { listing: null, error: 'Listing not found' }
  if (existing.outfitter_id !== outfitter.id) return { listing: null, error: 'Unauthorized' }

  const weaponTypesRaw = formData.getAll('weapon_types') as string[]

  const priceRaw = formData.get('price_per_person')
  const price_per_person = priceRaw ? parseFloat(priceRaw as string) : 0

  const durationRaw = formData.get('duration_days')
  const duration_days = durationRaw ? parseInt(durationRaw as string, 10) : null

  const maxRaw = formData.get('max_hunters')
  const max_hunters = maxRaw ? parseInt(maxRaw as string, 10) : null

  const successRaw = formData.get('success_rate')
  const success_rate = successRaw ? parseInt(successRaw as string, 10) : null

  const speciesRaw = formData.get('species_id')
  const species_id = speciesRaw && (speciesRaw as string).trim() ? (speciesRaw as string).trim() : null

  const payload = {
    title: (formData.get('title') as string | null)?.trim() ?? '',
    species_id,
    state: (formData.get('state') as string | null)?.trim() ?? '',
    description: (formData.get('description') as string | null)?.trim() ?? '',
    price_per_person,
    price_type: (formData.get('price_type') as string | null) ?? 'per_person',
    duration_days,
    max_hunters,
    guided_type: (formData.get('guided_type') as string | null) ?? 'fully_guided',
    weapon_types: weaponTypesRaw,
    land_type: (formData.get('land_type') as string | null) ?? 'private',
    lodging_included: formData.get('lodging_included') === 'true',
    meals_included: formData.get('meals_included') === 'true',
    success_rate,
    trophy_class: (formData.get('trophy_class') as string | null) ?? null,
    season_start: (formData.get('season_start') as string | null) ?? null,
    season_end: (formData.get('season_end') as string | null) ?? null,
    is_draw: formData.get('is_draw') === 'true',
    is_otc: formData.get('is_otc') === 'true',
  }

  const { data, error } = await supabase
    .from('hunt_listings')
    .update(payload)
    .eq('id', listingId)
    .select()
    .single()

  if (error) return { listing: null, error: error.message }
  return { listing: data as HuntListingRecord, error: null }
}

// ─── deleteHuntListing ────────────────────────────────────────────────────────

export async function deleteHuntListing(
  listingId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return { error: 'Not authenticated' }

  const outfitter = await getOutfitterByUser(user.id)
  if (!outfitter) return { error: 'Outfitter profile not found' }

  // Verify ownership
  const { data: existing, error: fetchErr } = await supabase
    .from('hunt_listings')
    .select('id, outfitter_id')
    .eq('id', listingId)
    .single()

  if (fetchErr || !existing) return { error: 'Listing not found' }
  if (existing.outfitter_id !== outfitter.id) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('hunt_listings')
    .update({ is_active: false })
    .eq('id', listingId)

  if (error) return { error: error.message }
  return { error: null }
}
