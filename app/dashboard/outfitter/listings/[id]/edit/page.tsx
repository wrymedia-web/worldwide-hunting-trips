import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOutfitterByUser } from '@/app/actions/outfitter'
import { getHuntPhotos } from '@/app/actions/photos'
import HuntListingForm from '@/components/hunt-listing-form'
import HuntPhotoUploader from '@/components/hunt-photo-uploader'

interface SpeciesRow {
  id: string
  name: string
  category: string
}

interface HuntListingRow {
  id: string
  outfitter_id: string
  title: string
  species_id: string | null
  country_id: number | null
  region_id: number | null
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
  fenced: boolean | null
  hunting_styles: string[] | null
  baited: boolean | null
  difficulty: string | null
  property_size_acres: number | null
  season_dates_text: string | null
  price_includes: string[] | null
  price_excludes: string[] | null
  deposit_terms: string | null
  final_payment_terms: string | null
  cancellation_terms: string | null
  payment_methods: string[] | null
}

interface QaRow {
  question_key: string | null
  custom_question: string | null
  answer: string
  sort_order: number
}

export default async function EditHuntListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const { data: listingData, error: listingError } = await supabase
    .from('hunt_listings')
    .select('*')
    .eq('id', id)
    .single()

  if (listingError || !listingData) {
    notFound()
  }

  const listing = listingData as HuntListingRow

  // Verify ownership
  if (listing.outfitter_id !== outfitter.id) {
    notFound()
  }

  const { data: speciesRows } = await supabase
    .from('species')
    .select('id, name, category')
    .order('category')
    .order('name')

  const speciesOptions: SpeciesRow[] = (speciesRows ?? []) as SpeciesRow[]

  const { data: countryRows } = await supabase
    .from('countries')
    .select('id, name, slug')
    .order('sort_order')
  const { data: regionRows } = await supabase
    .from('regions')
    .select('id, name, country_id')
    .order('name')

  const photos = await getHuntPhotos(id)

  const { data: qaRowsData } = await supabase
    .from('listing_qa')
    .select('question_key, custom_question, answer, sort_order')
    .eq('listing_id', id)
    .order('sort_order')

  const qaRows = (qaRowsData ?? []) as QaRow[]

  return (
    <HuntListingForm
      mode="edit"
      outfitterId={outfitter.id}
      listingId={id}
      speciesOptions={speciesOptions}
      countries={countryRows ?? []}
      regions={regionRows ?? []}
      extraSection={<HuntPhotoUploader listingId={id} initialPhotos={photos} />}
      defaultValues={{
        title: listing.title,
        species_id: listing.species_id ?? undefined,
        country_id: listing.country_id,
        region_id: listing.region_id,
        state: listing.state,
        description: listing.description,
        price_per_person: listing.price_per_person,
        price_type: listing.price_type,
        duration_days: listing.duration_days,
        max_hunters: listing.max_hunters,
        guided_type: listing.guided_type,
        weapon_types: listing.weapon_types,
        land_type: listing.land_type,
        lodging_included: listing.lodging_included,
        meals_included: listing.meals_included,
        success_rate: listing.success_rate,
        trophy_class: listing.trophy_class,
        season_start: listing.season_start,
        season_end: listing.season_end,
        is_draw: listing.is_draw,
        is_otc: listing.is_otc,
        fenced: listing.fenced,
        hunting_styles: listing.hunting_styles ?? [],
        baited: listing.baited,
        difficulty: listing.difficulty,
        property_size_acres: listing.property_size_acres,
        season_dates_text: listing.season_dates_text,
        price_includes: listing.price_includes ?? [],
        price_excludes: listing.price_excludes ?? [],
        deposit_terms: listing.deposit_terms,
        final_payment_terms: listing.final_payment_terms,
        cancellation_terms: listing.cancellation_terms,
        payment_methods: listing.payment_methods ?? [],
        qa_rows: qaRows,
      }}
    />
  )
}
