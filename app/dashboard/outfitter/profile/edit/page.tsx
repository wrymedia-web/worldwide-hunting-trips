import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOutfitterByUser } from '@/app/actions/outfitter'
import EditOutfitterProfileClient from './edit-profile-client'

export default async function EditOutfitterProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) redirect('/login')

  const outfitter = await getOutfitterByUser(user.id)
  if (!outfitter) redirect('/dashboard/outfitter/setup')

  return <EditOutfitterProfileClient outfitter={outfitter} />
}
