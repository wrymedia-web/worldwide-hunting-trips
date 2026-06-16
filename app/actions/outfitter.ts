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
  // Need-to-Know
  fenced: boolean | null
  hunting_styles: string[] | null
  baited: boolean | null
  difficulty: string | null
  property_size_acres: number | null
  season_dates_text: string | null
  // Price Includes/Excludes
  price_includes: string[] | null
  price_excludes: string[] | null
  // Payment & Cancellation
  deposit_terms: string | null
  final_payment_terms: string | null
  cancellation_terms: string | null
  payment_methods: string[] | null
}

export interface ListingQaRow {
  question_key: string | null
  custom_question: string | null
  answer: string
  sort_order: number
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

function intOrNull(raw: FormDataEntryValue | null): number | null {
  if (raw === null) return null
  const s = String(raw).trim()
  if (!s) return null
  const n = parseInt(s, 10)
  return Number.isFinite(n) ? n : null
}

function strOrNull(raw: FormDataEntryValue | null): string | null {
  if (raw === null) return null
  const s = String(raw).trim()
  return s ? s : null
}

function boolTriState(raw: FormDataEntryValue | null): boolean | null {
  if (raw === null) return null
  const s = String(raw).trim()
  if (s === 'true') return true
  if (s === 'false') return false
  return null
}

function extractListingPayload(formData: FormData) {
  const weaponTypes = formData.getAll('weapon_types') as string[]
  const huntingStyles = formData.getAll('hunting_styles') as string[]
  const priceIncludes = formData.getAll('price_includes') as string[]
  const priceExcludes = formData.getAll('price_excludes') as string[]
  const paymentMethods = formData.getAll('payment_methods') as string[]

  return {
    title: strOrNull(formData.get('title')) ?? '',
    species_id: strOrNull(formData.get('species_id')),
    country_id: intOrNull(formData.get('country_id')),
    region_id: intOrNull(formData.get('region_id')),
    state: strOrNull(formData.get('state')) ?? '',
    description: strOrNull(formData.get('description')) ?? '',
    price_per_person: (() => {
      const raw = formData.get('price_per_person')
      if (raw === null) return 0
      const n = parseFloat(String(raw))
      return Number.isFinite(n) ? n : 0
    })(),
    price_type: strOrNull(formData.get('price_type')) ?? 'per_person',
    duration_days: intOrNull(formData.get('duration_days')),
    max_hunters: intOrNull(formData.get('max_hunters')),
    guided_type: strOrNull(formData.get('guided_type')) ?? 'fully_guided',
    weapon_types: weaponTypes,
    land_type: strOrNull(formData.get('land_type')) ?? 'private',
    lodging_included: formData.get('lodging_included') === 'true',
    meals_included: formData.get('meals_included') === 'true',
    success_rate: intOrNull(formData.get('success_rate')),
    trophy_class: strOrNull(formData.get('trophy_class')),
    season_start: strOrNull(formData.get('season_start')),
    season_end: strOrNull(formData.get('season_end')),
    is_draw: formData.get('is_draw') === 'true',
    is_otc: formData.get('is_otc') === 'true',
    // Need-to-Know
    fenced: boolTriState(formData.get('fenced')),
    hunting_styles: huntingStyles.length ? huntingStyles : null,
    baited: boolTriState(formData.get('baited')),
    difficulty: strOrNull(formData.get('difficulty')),
    property_size_acres: intOrNull(formData.get('property_size_acres')),
    season_dates_text: strOrNull(formData.get('season_dates_text')),
    // Price Includes/Excludes
    price_includes: priceIncludes.length ? priceIncludes : null,
    price_excludes: priceExcludes.length ? priceExcludes : null,
    // Payment & Cancellation
    deposit_terms: strOrNull(formData.get('deposit_terms')),
    final_payment_terms: strOrNull(formData.get('final_payment_terms')),
    cancellation_terms: strOrNull(formData.get('cancellation_terms')),
    payment_methods: paymentMethods.length ? paymentMethods : null,
  }
}

// Q&A rows are serialized into a single hidden JSON field `qa_rows_json`
// from the form. Replace-all semantics on update.
function extractQaRows(formData: FormData): ListingQaRow[] {
  const raw = formData.get('qa_rows_json')
  if (!raw) return []
  try {
    const parsed = JSON.parse(String(raw))
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((r) => r && typeof r === 'object' && typeof r.answer === 'string' && r.answer.trim())
      .map((r, idx) => ({
        question_key: typeof r.question_key === 'string' && r.question_key ? r.question_key : null,
        custom_question:
          typeof r.custom_question === 'string' && r.custom_question.trim()
            ? r.custom_question.trim()
            : null,
        answer: String(r.answer).trim(),
        sort_order: typeof r.sort_order === 'number' ? r.sort_order : idx,
      }))
  } catch {
    return []
  }
}

async function syncListingQa(huntId: string, rows: ListingQaRow[]) {
  const supabase = await createClient()
  await supabase.from('listing_qa').delete().eq('hunt_id', huntId)
  if (!rows.length) return
  await supabase
    .from('listing_qa')
    .insert(rows.map((r) => ({ ...r, hunt_id: huntId })))
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

  const fields = extractListingPayload(formData)
  if (!fields.title) return { listing: null, error: 'Title is required.' }

  const slug = `${toSlug(fields.title)}-${randomSuffix()}`

  const { data, error } = await supabase
    .from('hunt_listings')
    .insert({
      ...fields,
      outfitter_id: outfitterId,
      slug,
      is_active: true,
    })
    .select()
    .single()

  if (error) return { listing: null, error: error.message }

  const qaRows = extractQaRows(formData)
  if (qaRows.length) {
    await syncListingQa(data.id, qaRows)
  }

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

  const payload = extractListingPayload(formData)

  const { data, error } = await supabase
    .from('hunt_listings')
    .update(payload)
    .eq('id', listingId)
    .select()
    .single()

  if (error) return { listing: null, error: error.message }

  // Q&A: only replace if the form supplied the qa_rows_json field at all.
  // Edit pages that don't render the Q&A section won't wipe existing rows.
  if (formData.has('qa_rows_json')) {
    const qaRows = extractQaRows(formData)
    await syncListingQa(listingId, qaRows)
  }

  return { listing: data as HuntListingRecord, error: null }
}

// ─── getListingQa ─────────────────────────────────────────────────────────────

export async function getListingQa(huntId: string): Promise<ListingQaRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listing_qa')
    .select('question_key, custom_question, answer, sort_order')
    .eq('hunt_id', huntId)
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return data as ListingQaRow[]
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
