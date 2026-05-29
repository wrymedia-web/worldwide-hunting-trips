import { createClient } from '@/lib/supabase/server'
import type { HuntCardProps } from '@/components/hunt-card'
import type { OutfitterCardProps } from '@/components/outfitter-card'
import { mockHunts, mockOutfitters } from '@/lib/mock-data'

// Public read layer for hunt listings. Falls back to the example/mock data when the
// database has no active listings yet, so the live site never renders empty while
// real outfitter listings are still being added.

type ReviewRow = { rating: number | null }
type ImageRow = { url: string; is_primary: boolean | null; sort_order: number | null }

type ListingRow = {
  id: string
  slug: string
  title: string
  state: string
  price_per_person: number
  price_type: string | null
  weapon_types: string[] | null
  lodging_included: boolean | null
  guided_type: string | null
  is_active: boolean
  created_at: string
  outfitters: { business_name: string; slug: string } | null
  species: { name: string; category: string } | null
  hunt_images: ImageRow[] | null
  reviews: ReviewRow[] | null
}

const LISTING_SELECT =
  '*, outfitters(business_name, slug), species(name, category), hunt_images(url, is_primary, sort_order), reviews(rating)'

function guideType(value: string | null): HuntCardProps['guideType'] {
  return value === 'semi_guided' || value === 'self_guided' ? value : 'fully_guided'
}

function priceType(value: string | null): HuntCardProps['priceType'] {
  return value === 'per_day' || value === 'flat' ? value : 'per_person'
}

function primaryImage(images: ImageRow[] | null): string | undefined {
  if (!images || images.length === 0) return undefined
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (b.is_primary && !a.is_primary) return 1
    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })
  return sorted[0]?.url
}

function ratingStats(reviews: ReviewRow[] | null): { rating: number; reviewCount: number } {
  const vals = (reviews ?? []).map((r) => r.rating).filter((r): r is number => typeof r === 'number')
  if (vals.length === 0) return { rating: 0, reviewCount: 0 }
  const avg = vals.reduce((sum, r) => sum + r, 0) / vals.length
  return { rating: Math.round(avg * 10) / 10, reviewCount: vals.length }
}

export function mapListingToCard(row: ListingRow): HuntCardProps {
  const { rating, reviewCount } = ratingStats(row.reviews)
  return {
    id: row.slug, // routes are /hunt/[slug]
    title: row.title,
    outfitterName: row.outfitters?.business_name ?? 'Outfitter',
    species: row.species?.name ?? 'Various',
    state: row.state,
    pricePerPerson: row.price_per_person,
    imageUrl: primaryImage(row.hunt_images),
    rating,
    reviewCount,
    weaponTypes: row.weapon_types ?? [],
    lodgingIncluded: row.lodging_included ?? false,
    guideType: guideType(row.guided_type),
    priceType: priceType(row.price_type),
    isExample: false,
  }
}

/**
 * Active listings for public browse/discovery. Returns real listings when any exist,
 * otherwise the example data (flagged isExample) so the site stays populated.
 */
export async function getActiveListings(): Promise<HuntCardProps[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('hunt_listings')
      .select(LISTING_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return mockHunts
    }
    return (data as unknown as ListingRow[]).map(mapListingToCard)
  } catch {
    return mockHunts
  }
}

export type ListingDetail = ListingRow & {
  description: string | null
  duration_days: number | null
  max_hunters: number | null
  land_type: string | null
  meals_included: boolean | null
  success_rate: number | null
  trophy_class: string | null
  season_start: string | null
  season_end: string | null
  is_draw: boolean | null
  is_otc: boolean | null
  outfitter_id: string
}

/** Full listing for the hunt detail page, looked up by slug. Null if not found (caller falls back). */
export async function getListingBySlug(slug: string): Promise<ListingDetail | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('hunt_listings')
      .select(LISTING_SELECT)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) return null
    return data as unknown as ListingDetail
  } catch {
    return null
  }
}

/** True when at least one real active listing exists (used to decide example-mode banners). */
export async function hasRealListings(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from('hunt_listings')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
    if (error) return false
    return (count ?? 0) > 0
  } catch {
    return false
  }
}

/** Active listings for a single species slug. Real data when present, else example fallback. */
export async function getListingsBySpecies(speciesSlug: string): Promise<HuntCardProps[]> {
  try {
    const supabase = await createClient()
    const { data: species } = await supabase
      .from('species')
      .select('id, name')
      .eq('slug', speciesSlug)
      .single()

    if (species) {
      const { data } = await supabase
        .from('hunt_listings')
        .select(LISTING_SELECT)
        .eq('is_active', true)
        .eq('species_id', species.id)
        .order('created_at', { ascending: false })
      if (data && data.length > 0) {
        return (data as unknown as ListingRow[]).map(mapListingToCard)
      }
    }
  } catch {
    // fall through to mock
  }
  const name = speciesSlug.replace(/-/g, ' ')
  const matches = mockHunts.filter((h) => h.species.toLowerCase() === name.toLowerCase())
  return matches.length > 0 ? matches : mockHunts.slice(0, 6)
}

/** Active listings for a single state (matched by display name). Real data, else example fallback. */
export async function getListingsByState(stateName: string): Promise<HuntCardProps[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('hunt_listings')
      .select(LISTING_SELECT)
      .eq('is_active', true)
      .ilike('state', stateName)
      .order('created_at', { ascending: false })
    if (data && data.length > 0) {
      return (data as unknown as ListingRow[]).map(mapListingToCard)
    }
  } catch {
    // fall through to mock
  }
  const matches = mockHunts.filter((h) => h.state.toLowerCase() === stateName.toLowerCase())
  return matches.length > 0 ? matches : mockHunts.slice(0, 6)
}

// ─── Outfitter directory ────────────────────────────────────────────────────

type OutfitterRow = {
  id: string
  business_name: string
  slug: string
  state: string | null
  years_in_business: number | null
  rating: number | null
  review_count: number | null
  verified: boolean | null
  hunt_listings: { species: { name: string } | null; is_active: boolean }[] | null
}

function mapOutfitterToCard(row: OutfitterRow): OutfitterCardProps {
  const active = (row.hunt_listings ?? []).filter((l) => l.is_active)
  const species = Array.from(
    new Set(active.map((l) => l.species?.name).filter((n): n is string => !!n))
  )
  return {
    id: row.slug,
    name: row.business_name,
    state: row.state ?? '',
    species,
    totalListings: active.length,
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    yearsInBusiness: row.years_in_business ?? undefined,
    verified: row.verified ?? false,
    isExample: false,
  }
}

/** Outfitters for the public directory. Real data when present, else example fallback. */
export async function getActiveOutfitters(): Promise<OutfitterCardProps[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('outfitters')
      .select('id, business_name, slug, state, years_in_business, rating, review_count, verified, hunt_listings(species(name), is_active)')
      .order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return mockOutfitters
    return (data as unknown as OutfitterRow[]).map(mapOutfitterToCard)
  } catch {
    return mockOutfitters
  }
}

// ─── Outfitter detail ───────────────────────────────────────────────────────

export interface OutfitterDetail {
  id: string
  slug: string
  name: string
  state: string | null
  yearsInBusiness: number | null
  rating: number
  reviewCount: number
  phone: string | null
  email: string | null
  website: string | null
  verified: boolean
  licensed: boolean
  bonded: boolean
  about: string | null
  species: string[]
  hunts: HuntCardProps[]
  reviews: OutfitterReview[]
}

export interface OutfitterReview {
  reviewer: string
  fromState: string
  rating: number
  date: string
  text: string
}

/** Full outfitter profile (with hunts + reviews) by slug. Null if not found (caller falls back). */
export async function getOutfitterBySlug(slug: string): Promise<OutfitterDetail | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('outfitters')
      .select(
        'id, business_name, slug, state, description, phone, email, website, years_in_business, rating, review_count, verified, licensed, bonded'
      )
      .eq('slug', slug)
      .single()

    if (error || !data) return null

    const { data: listingRows } = await supabase
      .from('hunt_listings')
      .select(LISTING_SELECT)
      .eq('outfitter_id', data.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    const hunts = ((listingRows ?? []) as unknown as ListingRow[]).map(mapListingToCard)

    const { data: reviewRows } = await supabase
      .from('reviews')
      .select('rating, body, species_harvested, created_at, profiles(full_name, state)')
      .eq('outfitter_id', data.id)
      .order('created_at', { ascending: false })
      .limit(20)

    const reviews: OutfitterReview[] = (reviewRows ?? []).map((r: Record<string, unknown>) => {
      const profile = r.profiles as { full_name: string | null; state: string | null } | null
      return {
        reviewer: profile?.full_name ?? 'Verified Hunter',
        fromState: profile?.state ?? '',
        rating: typeof r.rating === 'number' ? r.rating : 0,
        date: r.created_at
          ? new Date(r.created_at as string).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : '',
        text: (r.body as string) ?? '',
      }
    })

    const species = Array.from(new Set(hunts.map((h) => h.species).filter(Boolean)))

    return {
      id: data.id,
      slug: data.slug,
      name: data.business_name,
      state: data.state,
      yearsInBusiness: data.years_in_business,
      rating: data.rating ?? 0,
      reviewCount: data.review_count ?? 0,
      phone: data.phone,
      email: data.email,
      website: data.website,
      verified: data.verified ?? false,
      licensed: data.licensed ?? true,
      bonded: data.bonded ?? false,
      about: data.description,
      species,
      hunts,
      reviews,
    }
  } catch {
    return null
  }
}

// ─── Hunt detail view ───────────────────────────────────────────────────────

export interface HuntReview {
  reviewer: string
  state: string
  rating: number
  date: string
  species?: string
  text: string
}

export interface HuntDetailView {
  slug: string
  huntId: string | null
  title: string
  outfitterName: string
  outfitterSlug: string | null
  outfitterId: string | null
  species: string[]
  state: string
  country: string
  pricePerPerson: number
  priceType: HuntCardProps['priceType']
  rating: number
  reviewCount: number
  lodgingIncluded: boolean
  mealsIncluded: boolean
  guideType: string
  duration: number | null
  maxHunters: number | null
  successRate: number | null
  seasonStart: string | null
  seasonEnd: string | null
  landType: string | null
  weaponTypes: string[]
  description: string
  imageUrl?: string
  priceIncludes: string[]
  priceExcludes: string[]
  reviews: HuntReview[]
  dangerousGame: boolean
  isExample: boolean
}

function guideLabel(value: string): string {
  switch (value) {
    case 'semi_guided': return 'Semi-Guided'
    case 'self_guided': return 'Self-Guided'
    default: return 'Fully Guided'
  }
}

function landTypeLabel(value: string | null): string | null {
  if (!value) return null
  switch (value) {
    case 'public': return 'Public Land'
    case 'both': return 'Public & Private'
    default: return 'Private Land'
  }
}

/** Build the rich detail view for a real listing (looked up by slug). Null if not found. */
export async function getListingDetailView(slug: string): Promise<HuntDetailView | null> {
  const row = await getListingBySlug(slug)
  if (!row) return null

  const { rating, reviewCount } = ratingStats(row.reviews)
  const guided = guideLabel(row.guided_type ?? 'fully_guided')

  const priceIncludes: string[] = [guided]
  if (row.lodging_included) priceIncludes.push('Lodging')
  if (row.meals_included) priceIncludes.push('Meals')
  priceIncludes.push('Field Dressing')

  let reviews: HuntReview[] = []
  try {
    const supabase = await createClient()
    const { data: reviewRows } = await supabase
      .from('reviews')
      .select('rating, body, species_harvested, created_at, profiles(full_name, state)')
      .eq('hunt_id', row.id)
      .order('created_at', { ascending: false })
      .limit(20)
    reviews = (reviewRows ?? []).map((r: Record<string, unknown>) => {
      const profile = r.profiles as { full_name: string | null; state: string | null } | null
      return {
        reviewer: profile?.full_name ?? 'Verified Hunter',
        state: profile?.state ?? '',
        rating: typeof r.rating === 'number' ? r.rating : 0,
        date: r.created_at
          ? new Date(r.created_at as string).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : '',
        species: (r.species_harvested as string) ?? undefined,
        text: (r.body as string) ?? '',
      }
    })
  } catch {
    reviews = []
  }

  return {
    slug: row.slug,
    huntId: row.id,
    title: row.title,
    outfitterName: row.outfitters?.business_name ?? 'Outfitter',
    outfitterSlug: row.outfitters?.slug ?? null,
    outfitterId: row.outfitter_id ?? null,
    species: row.species?.name ? [row.species.name] : ['Various'],
    state: row.state,
    country: 'USA',
    pricePerPerson: row.price_per_person,
    priceType: priceType(row.price_type),
    rating,
    reviewCount,
    lodgingIncluded: row.lodging_included ?? false,
    mealsIncluded: row.meals_included ?? false,
    guideType: guided,
    duration: row.duration_days,
    maxHunters: row.max_hunters,
    successRate: row.success_rate,
    seasonStart: row.season_start,
    seasonEnd: row.season_end,
    landType: landTypeLabel(row.land_type),
    weaponTypes: row.weapon_types ?? [],
    description: row.description ?? '',
    imageUrl: primaryImage(row.hunt_images),
    priceIncludes,
    priceExcludes: ['Tags / Licenses', 'Travel & Airfare', 'Gratuities', 'Taxidermy'],
    reviews,
    dangerousGame: row.species?.category === 'dangerous_game',
    isExample: false,
  }
}

// ─── Countries / destinations ───────────────────────────────────────────────

export interface CountryCard {
  slug: string
  name: string
  emoji: string | null
  continent: string | null
  description: string | null
  listingCount: number
}

type CountryRow = {
  slug: string
  name: string
  emoji: string | null
  continent: string | null
  description: string | null
  hunt_listings: { is_active: boolean }[] | null
}

/** All seeded destination countries with their live active-listing counts. */
export async function getActiveCountries(): Promise<CountryCard[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('countries')
      .select('slug, name, emoji, continent, description, hunt_listings(is_active)')
      .order('sort_order', { ascending: true })
    if (error || !data) return []
    return (data as unknown as CountryRow[]).map((c) => ({
      slug: c.slug,
      name: c.name,
      emoji: c.emoji,
      continent: c.continent,
      description: c.description,
      listingCount: (c.hunt_listings ?? []).filter((l) => l.is_active).length,
    }))
  } catch {
    return []
  }
}

/** A single destination country by slug (with live listing count). Null if not seeded. */
export async function getCountryBySlug(slug: string): Promise<CountryCard | null> {
  const all = await getActiveCountries()
  return all.find((c) => c.slug === slug) ?? null
}

/** Active listings for a destination country. US includes legacy NULL-country rows.
 *  Returns only real listings (no mock fallback — international should not show US examples). */
export async function getListingsByCountry(slug: string): Promise<HuntCardProps[]> {
  try {
    const supabase = await createClient()
    const { data: country } = await supabase
      .from('countries')
      .select('id, slug')
      .eq('slug', slug)
      .single()
    if (!country) return []

    let query = supabase
      .from('hunt_listings')
      .select(LISTING_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    query =
      country.slug === 'united-states'
        ? query.or(`country_id.eq.${country.id},country_id.is.null`)
        : query.eq('country_id', country.id)

    const { data } = await query
    if (!data) return []
    return (data as unknown as ListingRow[]).map(mapListingToCard)
  } catch {
    return []
  }
}
