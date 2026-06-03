import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOutfitterByUser, getOutfitterListings } from '@/app/actions/outfitter'
import OutfitterDashboardClient from './dashboard-client'

export default async function OutfitterDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const outfitter = await getOutfitterByUser(user.id)
  if (!outfitter) {
    redirect('/dashboard/outfitter/setup')
  }

  const listings = await getOutfitterListings(outfitter.id)

  // Real stats: active listings + inquiries
  const activeListings = listings.filter((l) => l.is_active).length

  const listingIds = listings.map((l) => l.id)
  const inquiriesCount = listingIds.length === 0
    ? 0
    : ((await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .in('hunt_id', listingIds)
      ).count ?? 0)

  return (
    <OutfitterDashboardClient
      outfitter={outfitter}
      listings={listings}
      stats={{
        activeListings,
        totalInquiries: inquiriesCount ?? 0,
      }}
    />
  )
}
