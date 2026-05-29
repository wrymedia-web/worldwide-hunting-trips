import { createClient } from '@/lib/supabase/server'
import { getSavedHunts, getMyInquiries } from '@/app/actions/hunter'
import HunterDashboardClient from './hunter-dashboard-client'

export default async function HunterDashboard() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()

  const [saved, inquiries] = await Promise.all([getSavedHunts(), getMyInquiries()])

  let profile = null
  if (auth.user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone, state, created_at')
      .eq('id', auth.user.id)
      .single()
    profile = data
  }

  return (
    <HunterDashboardClient
      email={auth.user?.email ?? null}
      profile={profile}
      saved={saved}
      inquiries={inquiries}
    />
  )
}
