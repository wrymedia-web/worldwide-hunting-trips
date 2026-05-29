'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  US_STATES,
  WEAPON_TYPES,
  GUIDED_TYPES,
  PRICE_TYPES,
  LAND_TYPES,
  TROPHY_CLASSES,
} from '@/lib/constants'
import { createHuntListing, updateHuntListing, deleteHuntListing } from '@/app/actions/outfitter'

interface SpeciesOption {
  id: string
  name: string
  category: string
}

interface CountryOption {
  id: number
  name: string
  slug: string
}

interface RegionOption {
  id: number
  name: string
  country_id: number
}

interface HuntListingFormProps {
  mode: 'create' | 'edit'
  outfitterId: string
  listingId?: string
  speciesOptions: SpeciesOption[]
  countries: CountryOption[]
  regions: RegionOption[]
  defaultValues?: Partial<{
    title: string
    species_id: string
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
  }>
}

// Group species by category for the select
function groupSpecies(species: SpeciesOption[]): Record<string, SpeciesOption[]> {
  return species.reduce<Record<string, SpeciesOption[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})
}

export default function HuntListingForm({
  mode,
  outfitterId,
  listingId,
  speciesOptions,
  countries,
  regions,
  defaultValues = {},
}: HuntListingFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const dv = defaultValues
  const groupedSpecies = groupSpecies(speciesOptions)

  const usCountry = countries.find((c) => c.slug === 'united-states')
  const [countryId, setCountryId] = useState<string>(
    dv.country_id ? String(dv.country_id) : usCountry ? String(usCountry.id) : ''
  )
  const selectedCountry = countries.find((c) => String(c.id) === countryId)
  const isUS = selectedCountry?.slug === 'united-states'
  const countryRegions = regions.filter((r) => String(r.country_id) === countryId)

  const [lodging, setLodging] = useState(dv.lodging_included ?? false)
  const [meals, setMeals] = useState(dv.meals_included ?? false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    // Append toggle values (checkboxes not submitted when unchecked)
    formData.set('lodging_included', String(lodging))
    formData.set('meals_included', String(meals))

    startTransition(async () => {
      if (mode === 'create') {
        const { error: actionError } = await createHuntListing(formData, outfitterId)
        if (actionError) {
          setError(actionError)
          return
        }
      } else {
        if (!listingId) return
        const { error: actionError } = await updateHuntListing(listingId, formData)
        if (actionError) {
          setError(actionError)
          return
        }
      }
      router.push('/dashboard/outfitter')
    })
  }

  const handleDelete = () => {
    if (!listingId) return
    startDeleteTransition(async () => {
      const { error: delError } = await deleteHuntListing(listingId)
      if (delError) {
        setError(delError)
        setShowDeleteConfirm(false)
        return
      }
      router.push('/dashboard/outfitter')
    })
  }

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Page header */}
      <div className="bg-wht-forest py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/dashboard/outfitter"
            className="inline-flex items-center gap-1.5 text-wht-bone/70 hover:text-wht-bone text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Create New Hunt Listing' : 'Edit Hunt Listing'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Hunt Basics ───────────────────────────────── */}
          <div className="bg-white rounded-xl border border-wht-bone-2 p-6">
            <h2 className="text-sm font-bold text-wht-forest uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full bg-wht-forest" />
              Hunt Basics
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Listing Title <span className="text-wht-blaze">*</span>
                </label>
                <Input
                  name="title"
                  type="text"
                  placeholder='e.g. "Trophy Whitetail Deer Hunt - November Rifle Season"'
                  defaultValue={dv.title ?? ''}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Species
                  </label>
                  <select
                    name="species_id"
                    defaultValue={dv.species_id ?? ''}
                    className="flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                  >
                    <option value="">Select species</option>
                    {Object.entries(groupedSpecies).map(([cat, items]) => (
                      <optgroup key={cat} label={cat}>
                        {items.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country <span className="text-wht-blaze">*</span>
                  </label>
                  <select
                    name="country_id"
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                  >
                    <option value="" disabled>Select a country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {isUS ? 'State' : 'Region / Area'} <span className="text-wht-blaze">*</span>
                  </label>
                  {isUS ? (
                    <select
                      key="state-us"
                      name="state"
                      defaultValue={dv.state ?? ''}
                      required
                      className="flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                    >
                      <option value="" disabled>Select a state</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      key="state-intl"
                      name="state"
                      type="text"
                      required
                      defaultValue={dv.state ?? ''}
                      placeholder="e.g. Limpopo, Patagonia, South Island"
                    />
                  )}
                </div>

                {countryRegions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Region <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <select
                      name="region_id"
                      defaultValue={dv.region_id ? String(dv.region_id) : ''}
                      className="flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                    >
                      <option value="">Select a region</option>
                      {countryRegions.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-wht-blaze">*</span>
                  <span className="text-gray-400 font-normal ml-1">(min. 100 characters)</span>
                </label>
                <textarea
                  name="description"
                  rows={5}
                  required
                  minLength={100}
                  defaultValue={dv.description ?? ''}
                  placeholder="Describe the hunt, location, terrain, and the overall experience hunters can expect..."
                  className="flex w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Pricing & Duration ────────────────────────── */}
          <div className="bg-white rounded-xl border border-wht-bone-2 p-6">
            <h2 className="text-sm font-bold text-wht-forest uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full bg-wht-forest" />
              Pricing &amp; Duration
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price per person ($) <span className="text-wht-blaze">*</span>
                  </label>
                  <Input
                    name="price_per_person"
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="1800"
                    defaultValue={dv.price_per_person ?? ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Duration (days)
                  </label>
                  <Input
                    name="duration_days"
                    type="number"
                    min="1"
                    placeholder="5"
                    defaultValue={dv.duration_days ?? ''}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <div className="flex gap-4 flex-wrap">
                  {PRICE_TYPES.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="price_type"
                        value={value}
                        defaultChecked={(dv.price_type ?? 'per_person') === value}
                        className="text-wht-forest focus:ring-wht-forest"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Max hunters per trip
                </label>
                <Input
                  name="max_hunters"
                  type="number"
                  min="1"
                  placeholder="4"
                  defaultValue={dv.max_hunters ?? ''}
                  className="max-w-[200px]"
                />
              </div>
            </div>
          </div>

          {/* ── Hunt Type ─────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-wht-bone-2 p-6">
            <h2 className="text-sm font-bold text-wht-forest uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full bg-wht-forest" />
              Hunt Type
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guided Type
                </label>
                <div className="flex gap-4 flex-wrap">
                  {GUIDED_TYPES.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="guided_type"
                        value={value}
                        defaultChecked={(dv.guided_type ?? 'fully_guided') === value}
                        className="text-wht-forest focus:ring-wht-forest"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Land Type
                </label>
                <div className="flex gap-4 flex-wrap">
                  {LAND_TYPES.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="land_type"
                        value={value}
                        defaultChecked={(dv.land_type ?? 'private') === value}
                        className="text-wht-forest focus:ring-wht-forest"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weapon Types
                </label>
                <div className="flex gap-4 flex-wrap">
                  {WEAPON_TYPES.map((w) => (
                    <label key={w} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        name="weapon_types"
                        value={w}
                        defaultChecked={dv.weapon_types?.includes(w) ?? false}
                        className="rounded border-gray-300 text-wht-forest focus:ring-wht-forest"
                      />
                      {w}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    name="is_otc"
                    value="true"
                    defaultChecked={dv.is_otc ?? false}
                    className="rounded border-gray-300 text-wht-forest focus:ring-wht-forest"
                  />
                  Over-the-Counter (OTC) Hunt
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    name="is_draw"
                    value="true"
                    defaultChecked={dv.is_draw ?? false}
                    className="rounded border-gray-300 text-wht-forest focus:ring-wht-forest"
                  />
                  Draw Hunt
                </label>
              </div>
            </div>
          </div>

          {/* ── Inclusions ────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-wht-bone-2 p-6">
            <h2 className="text-sm font-bold text-wht-forest uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full bg-wht-forest" />
              Inclusions
            </h2>

            <div className="space-y-3">
              <ToggleField
                label="Lodging Included"
                description="Hunters will have a place to stay"
                checked={lodging}
                onChange={setLodging}
              />
              <ToggleField
                label="Meals Included"
                description="Meals are provided during the hunt"
                checked={meals}
                onChange={setMeals}
              />
            </div>
          </div>

          {/* ── Season & Success ──────────────────────────── */}
          <div className="bg-white rounded-xl border border-wht-bone-2 p-6">
            <h2 className="text-sm font-bold text-wht-forest uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full bg-wht-forest" />
              Season &amp; Success
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Season Start
                  </label>
                  <Input
                    name="season_start"
                    type="date"
                    defaultValue={dv.season_start ?? ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Season End
                  </label>
                  <Input
                    name="season_end"
                    type="date"
                    defaultValue={dv.season_end ?? ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Estimated Success Rate (%)
                  </label>
                  <Input
                    name="success_rate"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="75"
                    defaultValue={dv.success_rate ?? ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Trophy Class
                  </label>
                  <select
                    name="trophy_class"
                    defaultValue={dv.trophy_class ?? ''}
                    className="flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                  >
                    <option value="">Select class</option>
                    {TROPHY_CLASSES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="copper"
                size="lg"
                disabled={isPending || isDeleting}
                className="gap-2"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPending
                  ? mode === 'create'
                    ? 'Publishing...'
                    : 'Saving...'
                  : mode === 'create'
                    ? 'Publish Hunt Listing'
                    : 'Save Changes'}
              </Button>
              <Link href="/dashboard/outfitter">
                <Button type="button" variant="ghost" size="lg" disabled={isPending || isDeleting}>
                  Cancel
                </Button>
              </Link>
            </div>

            {mode === 'edit' && (
              <div>
                {!showDeleteConfirm ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isPending || isDeleting}
                  >
                    Delete Listing
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-600 font-medium">Are you sure?</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="gap-1.5"
                    >
                      {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
                      {isDeleting ? 'Deleting...' : 'Yes, delete'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// ── ToggleField ────────────────────────────────────────────────────────────────

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-wht-bone-2 last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-wht-forest focus:ring-offset-2 ${
          checked ? 'bg-wht-forest' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
