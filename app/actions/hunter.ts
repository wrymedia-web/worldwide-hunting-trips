'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { mapListingToCard } from '@/lib/listings'
import type { HuntCardProps } from '@/components/hunt-card'

const LISTING_SELECT =
  '*, outfitters(business_name, slug), species(name, category), hunt_images(url, is_primary, sort_order), reviews(rating)'

type ListingRowParam = Parameters<typeof mapListingToCard>[0]

export interface HunterInquiry {
  id: string
  huntTitle: string
  huntSlug: string | null
  outfitterName: string
  message: string
  preferredDates: string | null
  partySize: number
  status: string
  createdAt: string
}

/** Toggle a hunt in the signed-in hunter's favorites. Returns the new saved state. */
export async function toggleSaveHunt(
  huntId: string
): Promise<{ saved: boolean; error: string | null }> {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return { saved: false, error: 'Sign in to save hunts.' }

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('profile_id', user.id)
    .eq('hunt_id', huntId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from('favorites').delete().eq('id', existing.id)
    if (error) return { saved: true, error: error.message }
    return { saved: false, error: null }
  }

  const { error } = await supabase
    .from('favorites')
    .insert({ profile_id: user.id, hunt_id: huntId })
  if (error) return { saved: false, error: error.message }
  return { saved: true, error: null }
}

/** Whether the signed-in hunter has saved a given hunt. False when logged out. */
export async function isHuntSaved(huntId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return false
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('profile_id', auth.user.id)
      .eq('hunt_id', huntId)
      .maybeSingle()
    return !!data
  } catch {
    return false
  }
}

/** The signed-in hunter's saved hunts as cards. Empty when logged out. */
export async function getSavedHunts(): Promise<HuntCardProps[]> {
  try {
    const supabase = await createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return []

    const { data, error } = await supabase
      .from('favorites')
      .select(`hunt_id, hunt_listings(${LISTING_SELECT})`)
      .eq('profile_id', auth.user.id)
      .order('created_at', { ascending: false })

    if (error || !data) return []

    return data
      .map((row) => (row as unknown as { hunt_listings: ListingRowParam | null }).hunt_listings)
      .filter((l): l is ListingRowParam => !!l && (l as { is_active?: boolean }).is_active !== false)
      .map(mapListingToCard)
  } catch {
    return []
  }
}

/** Update the signed-in hunter's own profile fields. */
export async function updateHunterProfile(input: {
  fullName: string
  phone: string
  state: string
}): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName.trim() || null,
      phone: input.phone.trim() || null,
      state: input.state.trim() || null,
    })
    .eq('id', auth.user.id)

  return { error: error?.message ?? null }
}

/** The signed-in hunter's submitted inquiries. RLS blocks hunter reads, so this runs
 *  server-side with the admin client, scoped strictly to the authenticated user's id. */
export async function getMyInquiries(): Promise<HunterInquiry[]> {
  try {
    const supabase = await createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return []

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('inquiries')
      .select('id, message, preferred_dates, party_size, status, created_at, hunt_listings(title, slug), outfitters(business_name)')
      .eq('hunter_profile_id', auth.user.id)
      .order('created_at', { ascending: false })

    if (error || !data) return []

    return data.map((r: Record<string, unknown>) => {
      const hunt = r.hunt_listings as { title: string | null; slug: string | null } | null
      const outfitter = r.outfitters as { business_name: string | null } | null
      return {
        id: r.id as string,
        huntTitle: hunt?.title ?? 'Hunt listing',
        huntSlug: hunt?.slug ?? null,
        outfitterName: outfitter?.business_name ?? 'Outfitter',
        message: (r.message as string) ?? '',
        preferredDates: (r.preferred_dates as string) ?? null,
        partySize: (r.party_size as number) ?? 1,
        status: (r.status as string) ?? 'new',
        createdAt: r.created_at
          ? new Date(r.created_at as string).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })
          : '',
      }
    })
  } catch {
    return []
  }
}
