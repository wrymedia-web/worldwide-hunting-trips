import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOutfitterByUser } from '@/app/actions/outfitter'
import HuntListingForm from '@/components/hunt-listing-form'

interface SpeciesRow {
  id: string
  name: string
  category: string
}

export default async function NewHuntListingPage() {
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

  const { data: speciesRows } = await supabase
    .from('species')
    .select('id, name, category')
    .order('category')
    .order('name')

  const speciesOptions: SpeciesRow[] = (speciesRows ?? []) as SpeciesRow[]

  return (
    <HuntListingForm
      mode="create"
      outfitterId={outfitter.id}
      speciesOptions={speciesOptions}
    />
  )
}
