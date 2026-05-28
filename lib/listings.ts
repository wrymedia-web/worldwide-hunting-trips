import { createClient } from '@/lib/supabase/server'
import type { HuntCardProps } from '@/components/hunt-card'
import { mockHunts } from '@/lib/mock-data'

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
