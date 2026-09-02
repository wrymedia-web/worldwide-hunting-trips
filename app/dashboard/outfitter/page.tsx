import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOutfitterByUser, getOutfitterListings } from '@/app/actions/outfitter'
import { getOutfitterInquiries } from '@/app/actions/outfitter-inquiries'
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

  const [listings, inquiries] = await Promise.all([
    getOutfitterListings(outfitter.id),
    getOutfitterInquiries(),
  ])

  const activeListings = listings.filter((l) => l.is_active).length

  return (
    <OutfitterDashboardClient
      outfitter={outfitter}
      listings={listings}
      inquiries={inquiries}
      stats={{
        activeListings,
        totalInquiries: inquiries.length,
      }}
    />
  )
}
