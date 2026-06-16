'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  US_STATES,
  WEAPON_TYPES,
  GUIDED_TYPES,
  PRICE_TYPES,
  LAND_TYPES,
  TROPHY_CLASSES,
  HUNTING_STYLES,
  DIFFICULTY_LEVELS,
  PRICE_INCLUDES_OPTIONS,
  PAYMENT_METHODS,
  QA_QUESTIONS,
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

interface QaDraftRow {
  question_key: string | null
  custom_question: string | null
  answer: string
  sort_order: number
}

interface HuntListingFormProps {
  mode: 'create' | 'edit'
  outfitterId: string
  listingId?: string
  speciesOptions: SpeciesOption[]
  countries: CountryOption[]
  regions: RegionOption[]
  extraSection?: React.ReactNode
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
    // Need-to-Know
    fenced: boolean | null
    hunting_styles: string[] | null
    baited: boolean | null
    difficulty: string | null
    property_size_acres: number | null
    season_dates_text: string | null
    // Price Includes/Excludes
    price_includes: string[] | null
    price_excludes: string[] | null
    // Payment & Cancellation
    deposit_terms: string | null
    final_payment_terms: string | null
    cancellation_terms: string | null
    payment_methods: string[] | null
    // Q&A
    qa_rows: QaDraftRow[]
  }>
}

function groupSpecies(species: SpeciesOption[]): Record<string, SpeciesOption[]> {
  return species.reduce<Record<string, SpeciesOption[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})
}

// "yes" | "no" | "" — radio for tri-state booleans
function triStateValue(v: boolean | null | undefined): string {
  if (v === true) return 'true'
  if (v === false) return 'false'
  return ''
}

export default function HuntListingForm({
  mode,
  outfitterId,
  listingId,
  speciesOptions,
  countries,
  regions,
  extraSection,
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

  // ── Price Includes / Excludes: track choice per option ────────────────
  // Each option key maps to '' | 'includes' | 'excludes'
  const initialIncExc = (() => {
    const map: Record<string, 'includes' | 'excludes' | ''> = {}
    for (const opt of PRICE_INCLUDES_OPTIONS) map[opt.value] = ''
    for (const v of dv.price_includes ?? []) if (map[v] !== undefined) map[v] = 'includes'
    for (const v of dv.price_excludes ?? []) if (map[v] !== undefined) map[v] = 'excludes'
    return map
  })()
  const [incExc, setIncExc] = useState<Record<string, 'includes' | 'excludes' | ''>>(initialIncExc)

  // ── Q&A: list of rows the outfitter has added ────────────────────────
  const [qaRows, setQaRows] = useState<QaDraftRow[]>(dv.qa_rows ?? [])
  const [qaPickerOpen, setQaPickerOpen] = useState(false)

  // ── Draft autosave: preserve form state on accidental navigation ─────
  const draftKey = listingId ? `wwht-listing-draft-${listingId}` : 'wwht-listing-draft-new'

  useEffect(() => {
    // Restore Q&A + inc/exc only — text inputs autosave too brittle
    if (mode !== 'create') return
    try {
      const stored = localStorage.getItem(draftKey)
      if (!stored) return
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed.qa_rows)) setQaRows(parsed.qa_rows)
      if (parsed.inc_exc && typeof parsed.inc_exc === 'object') {
        setIncExc((prev) => ({ ...prev, ...parsed.inc_exc }))
      }
    } catch {
      /* corrupt draft — ignore */
    }
  }, [draftKey, mode])

  useEffect(() => {
    try {
      localStorage.setItem(
        draftKey,
        JSON.stringify({ qa_rows: qaRows, inc_exc: incExc })
      )
    } catch {
      /* quota or disabled storage — ignore */
    }
  }, [draftKey, qaRows, incExc])

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey)
    } catch {
      /* ignore */
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Price Includes / Excludes — serialize from state
    for (const [key, choice] of Object.entries(incExc)) {
      if (choice === 'includes') formData.append('price_includes', key)
      else if (choice === 'excludes') formData.append('price_excludes', key)
    }

    // Q&A — serialize rows as JSON; drop empty answers
    const cleanQa = qaRows
      .filter((r) => r.answer.trim())
      .map((r, idx) => ({ ...r, sort_order: idx }))
    formData.set('qa_rows_json', JSON.stringify(cleanQa))

    // Legacy backward-compat: keep lodging_included / meals_included in sync
    // with the new includes selector so old listing-page code keeps working.
    formData.set('lodging_included', String(incExc.lodging === 'includes'))
    formData.set('meals_included', String(incExc.meals === 'includes'))

    startTransition(async () => {
      if (mode === 'create') {
        const { listing, error: actionError } = await createHuntListing(formData, outfitterId)
        if (actionError) {
          setError(actionError)
          return
        }
        clearDraft()
        router.push(
          listing
            ? `/dashboard/outfitter/listings/${listing.id}/edit?new=1`
            : '/dashboard/outfitter'
        )
        return
      }
      if (!listingId) return
      const { error: actionError } = await updateHuntListing(listingId, formData)
      if (actionError) {
        setError(actionError)
        return
      }
      clearDraft()
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

  // Q&A helpers ─────────────────────────────────────────────────────────
  const usedQuestionKeys = new Set(qaRows.map((r) => r.question_key).filter(Boolean))

  const addPresetQuestion = (key: string) => {
    setQaRows((rows) => [
      ...rows,
      { question_key: key, custom_question: null, answer: '', sort_order: rows.length },
    ])
    setQaPickerOpen(false)
  }

  const addCustomQuestion = () => {
    setQaRows((rows) => [
      ...rows,
      { question_key: null, custom_question: '', answer: '', sort_order: rows.length },
    ])
  }

  const updateQaRow = (idx: number, patch: Partial<QaDraftRow>) => {
    setQaRows((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }

  const removeQaRow = (idx: number) => {
    setQaRows((rows) => rows.filter((_, i) => i !== idx))
  }

  return (
    <div className="min-h-screen bg-wht-paper">
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
          {mode === 'create' && (
            <p className="text-wht-bone/80 text-sm mt-2">
              You&rsquo;ll be able to add photos after the listing is created.
            </p>
          )}
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
          <Section title="Hunt Basics">
            <div>
              <Label required>Listing Title</Label>
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
                <Label>Species</Label>
                <select
                  name="species_id"
                  defaultValue={dv.species_id ?? ''}
                  className={SELECT_CLS}
                >
                  <option value="">Select species</option>
                  {Object.entries(groupedSpecies).map(([cat, items]) => (
                    <optgroup key={cat} label={cat}>
                      {items.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <Label required>Country</Label>
                <select
                  name="country_id"
                  value={countryId}
                  onChange={(e) => setCountryId(e.target.value)}
                  required
                  className={SELECT_CLS}
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
                <Label required>{isUS ? 'State' : 'Region / Area'}</Label>
                {isUS ? (
                  <select
                    key="state-us"
                    name="state"
                    defaultValue={dv.state ?? ''}
                    required
                    className={SELECT_CLS}
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
                  <Label optional>Region</Label>
                  <select
                    name="region_id"
                    defaultValue={dv.region_id ? String(dv.region_id) : ''}
                    className={SELECT_CLS}
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
              <Label required>Description <span className="text-gray-400 font-normal">(min. 100 characters)</span></Label>
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
          </Section>

          {/* ── Pricing & Duration ────────────────────────── */}
          <Section title="Pricing & Duration">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label required>Price per person ($)</Label>
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
                <Label>Duration (days)</Label>
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
              <Label>Price Type</Label>
              <RadioRow
                name="price_type"
                options={PRICE_TYPES}
                defaultValue={dv.price_type ?? 'per_person'}
              />
            </div>

            <div>
              <Label>Max hunters per trip</Label>
              <Input
                name="max_hunters"
                type="number"
                min="1"
                placeholder="4"
                defaultValue={dv.max_hunters ?? ''}
                className="max-w-[200px]"
              />
            </div>
          </Section>

          {/* ── Need to Know ──────────────────────────────── */}
          <Section title="Need to Know">
            <div>
              <Label>Season Dates <span className="text-gray-400 font-normal">(text description)</span></Label>
              <Input
                name="season_dates_text"
                type="text"
                placeholder='e.g. "Nov 1 – Dec 15 (rifle), Sept (archery)"'
                defaultValue={dv.season_dates_text ?? ''}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Fenced</Label>
                <RadioRow
                  name="fenced"
                  options={[
                    { value: 'false', label: 'Free Range' },
                    { value: 'true', label: 'High Fence' },
                  ]}
                  defaultValue={triStateValue(dv.fenced)}
                  includeNone
                />
              </div>
              <div>
                <Label>Baited</Label>
                <RadioRow
                  name="baited"
                  options={[
                    { value: 'true', label: 'Yes' },
                    { value: 'false', label: 'No' },
                  ]}
                  defaultValue={triStateValue(dv.baited)}
                  includeNone
                />
              </div>
            </div>

            <div>
              <Label>Hunting Style <span className="text-gray-400 font-normal">(select all that apply)</span></Label>
              <CheckboxGroup
                name="hunting_styles"
                options={HUNTING_STYLES}
                defaultValue={dv.hunting_styles ?? []}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Difficulty</Label>
                <RadioRow
                  name="difficulty"
                  options={DIFFICULTY_LEVELS}
                  defaultValue={dv.difficulty ?? ''}
                  includeNone
                />
              </div>
              <div>
                <Label>Property Size (acres)</Label>
                <Input
                  name="property_size_acres"
                  type="number"
                  min="0"
                  placeholder="2500"
                  defaultValue={dv.property_size_acres ?? ''}
                />
              </div>
            </div>

            <div>
              <Label>Public or Private Land</Label>
              <RadioRow
                name="land_type"
                options={LAND_TYPES}
                defaultValue={dv.land_type ?? 'private'}
              />
            </div>

            <div>
              <Label>Weapon Types</Label>
              <CheckboxGroup
                name="weapon_types"
                options={WEAPON_TYPES.map((w) => ({ value: w, label: w }))}
                defaultValue={dv.weapon_types ?? []}
              />
            </div>

            <div className="flex gap-6 flex-wrap pt-2 border-t border-wht-bone-2/60">
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
          </Section>

          {/* ── Guided Type ─────────────────────────────── */}
          <Section title="Guided Type">
            <RadioRow
              name="guided_type"
              options={GUIDED_TYPES}
              defaultValue={dv.guided_type ?? 'fully_guided'}
            />
          </Section>

          {/* ── Price Includes / Excludes ────────────────── */}
          <Section title="Price Includes / Excludes">
            <p className="text-sm text-gray-600 mb-2">
              For each item, mark whether it&rsquo;s included in the price, excluded
              (hunter pays extra), or leave blank if it doesn&rsquo;t apply.
            </p>
            <div className="rounded-lg border border-wht-bone-2 overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_120px_120px] text-xs uppercase tracking-wider bg-wht-bone-2/50 px-3 py-2 font-semibold text-wht-forest">
                <div>Item</div>
                <div className="text-center px-2">Included</div>
                <div className="text-center px-2">Excluded</div>
              </div>
              {PRICE_INCLUDES_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_120px_120px] items-center px-3 py-2 border-t border-wht-bone-2/60 text-sm"
                >
                  <div className="text-gray-800">{opt.label}</div>
                  <label className="flex items-center justify-center cursor-pointer px-2">
                    <input
                      type="radio"
                      name={`incexc_${opt.value}`}
                      checked={incExc[opt.value] === 'includes'}
                      onChange={() => setIncExc((m) => ({ ...m, [opt.value]: 'includes' }))}
                      className="text-wht-forest focus:ring-wht-forest"
                    />
                  </label>
                  <label className="flex items-center justify-center cursor-pointer px-2">
                    <input
                      type="radio"
                      name={`incexc_${opt.value}`}
                      checked={incExc[opt.value] === 'excludes'}
                      onChange={() => setIncExc((m) => ({ ...m, [opt.value]: 'excludes' }))}
                      className="text-wht-blaze focus:ring-wht-blaze"
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => {
                  const cleared: Record<string, ''> = {}
                  for (const opt of PRICE_INCLUDES_OPTIONS) cleared[opt.value] = ''
                  setIncExc(cleared as typeof incExc)
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          </Section>

          {/* ── Payment & Cancellation ──────────────────── */}
          <Section title="Payment & Cancellation">
            <div>
              <Label>Payment methods accepted <span className="text-gray-400 font-normal">(select all that apply)</span></Label>
              <CheckboxGroup
                name="payment_methods"
                options={PAYMENT_METHODS}
                defaultValue={dv.payment_methods ?? []}
              />
            </div>

            <div>
              <Label>Deposit terms</Label>
              <textarea
                name="deposit_terms"
                rows={3}
                placeholder="e.g. 50% non-refundable deposit due at booking."
                defaultValue={dv.deposit_terms ?? ''}
                className="flex w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
              />
            </div>

            <div>
              <Label>Final payment terms</Label>
              <textarea
                name="final_payment_terms"
                rows={3}
                placeholder="e.g. Balance due 30 days before the hunt."
                defaultValue={dv.final_payment_terms ?? ''}
                className="flex w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
              />
            </div>

            <div>
              <Label>Cancellation & rescheduling terms</Label>
              <textarea
                name="cancellation_terms"
                rows={3}
                placeholder="e.g. Cancellations more than 60 days out receive 50% refund. Rescheduling allowed once at no charge."
                defaultValue={dv.cancellation_terms ?? ''}
                className="flex w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
              />
            </div>
          </Section>

          {/* ── Season exact dates & Success ────────────── */}
          <Section title="Season Dates & Success Rate">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Season Start <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  name="season_start"
                  type="date"
                  defaultValue={dv.season_start ?? ''}
                />
              </div>
              <div>
                <Label>Season End <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  name="season_end"
                  type="date"
                  defaultValue={dv.season_end ?? ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Estimated Success Rate (%)</Label>
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
                <Label>Trophy Class</Label>
                <select
                  name="trophy_class"
                  defaultValue={dv.trophy_class ?? ''}
                  className={SELECT_CLS}
                >
                  <option value="">Select class</option>
                  {TROPHY_CLASSES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Section>

          {/* ── Q&A ─────────────────────────────────────── */}
          <Section title="Q & A">
            <p className="text-sm text-gray-600 mb-2">
              Pick from common questions hunters ask, write your own answer.
              You can also add custom questions of your own.
            </p>

            <div className="space-y-3">
              {qaRows.map((row, idx) => {
                const preset = row.question_key
                  ? QA_QUESTIONS.find((q) => q.key === row.question_key)
                  : null
                return (
                  <div key={idx} className="border border-wht-bone-2 rounded-lg p-3 bg-wht-paper/40">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        {preset ? (
                          <div className="text-sm font-medium text-gray-900">{preset.question}</div>
                        ) : (
                          <input
                            type="text"
                            value={row.custom_question ?? ''}
                            onChange={(e) =>
                              updateQaRow(idx, { custom_question: e.target.value })
                            }
                            placeholder="Your custom question..."
                            className="w-full text-sm font-medium text-gray-900 bg-transparent border-b border-wht-bone-2 focus:outline-none focus:border-wht-forest pb-1"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQaRow(idx)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      value={row.answer}
                      onChange={(e) => updateQaRow(idx, { answer: e.target.value })}
                      rows={2}
                      placeholder="Your answer..."
                      className="mt-2 flex w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
                    />
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={() => setQaPickerOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-wht-forest hover:text-wht-forest/80 border border-wht-forest/40 hover:border-wht-forest rounded-md px-3 py-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add a question
              </button>
              <button
                type="button"
                onClick={addCustomQuestion}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-500 rounded-md px-3 py-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add custom question
              </button>
            </div>

            {qaPickerOpen && (
              <div className="mt-3 border border-wht-bone-2 rounded-lg max-h-72 overflow-y-auto bg-white">
                {QA_QUESTIONS.map((q) => {
                  const taken = usedQuestionKeys.has(q.key)
                  return (
                    <button
                      key={q.key}
                      type="button"
                      disabled={taken}
                      onClick={() => addPresetQuestion(q.key)}
                      className={`w-full text-left px-3 py-2 text-sm border-b border-wht-bone-2/60 last:border-b-0 transition-colors ${
                        taken
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'text-gray-800 hover:bg-wht-bone-2/40 cursor-pointer'
                      }`}
                    >
                      {q.question}
                      {taken && <span className="ml-2 text-xs text-gray-400">(already added)</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </Section>

          {extraSection}

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
                    ? 'Saving...'
                    : 'Saving...'
                  : mode === 'create'
                    ? 'Save & Add Photos'
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

// ── Small UI helpers ───────────────────────────────────────────────────

const SELECT_CLS =
  'flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-wht-bone-2 p-6">
      <h2 className="text-sm font-bold text-wht-forest uppercase tracking-widest mb-5 flex items-center gap-2">
        <span className="inline-block w-1.5 h-4 rounded-full bg-wht-forest" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Label({
  children,
  required,
  optional,
}: {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-wht-blaze"> *</span>}
      {optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
    </label>
  )
}

function RadioRow({
  name,
  options,
  defaultValue,
  includeNone = false,
}: {
  name: string
  options: ReadonlyArray<{ value: string; label: string }>
  defaultValue?: string
  includeNone?: boolean
}) {
  const [value, setValue] = useState(defaultValue ?? '')
  return (
    <div className="flex gap-4 flex-wrap">
      {options.map(({ value: v, label }) => (
        <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="radio"
            name={name}
            value={v}
            checked={value === v}
            onChange={() => setValue(v)}
            className="text-wht-forest focus:ring-wht-forest"
          />
          {label}
        </label>
      ))}
      {includeNone && value !== '' && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="text-xs text-gray-400 hover:text-gray-600 underline self-center"
        >
          clear
        </button>
      )}
    </div>
  )
}

function CheckboxGroup({
  name,
  options,
  defaultValue,
}: {
  name: string
  options: ReadonlyArray<{ value: string; label: string }>
  defaultValue: string[]
}) {
  return (
    <div className="flex gap-4 flex-wrap">
      {options.map(({ value, label }) => (
        <label key={value} className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            name={name}
            value={value}
            defaultChecked={defaultValue.includes(value)}
            className="rounded border-gray-300 text-wht-forest focus:ring-wht-forest"
          />
          {label}
        </label>
      ))}
    </div>
  )
}
