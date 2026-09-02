'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { HuntCard, type HuntCardProps } from '@/components/hunt-card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { US_STATES } from '@/lib/constants'

const SPECIES = [
  'Whitetail Deer', 'Mule Deer', 'Elk', 'Moose', 'Black Bear', 'Brown Bear',
  'Grizzly Bear', 'Mountain Lion', 'Bison', 'Pronghorn Antelope', 'Bighorn Sheep',
  'Dall Sheep', 'Rocky Mountain Goat', 'Wild Boar', 'Caribou', 'Coues Deer',
  'Axis Deer', 'Sika Deer', 'Nilgai', 'Aoudad Sheep', 'Blackbuck Antelope',
  'Red Stag', 'Turkey', 'Alligator', 'Wolf', 'Buffalo', 'Exotic Game', 'Predator',
]

const STATES = [...US_STATES]

const WEAPON_TYPES = ['Rifle', 'Muzzleloader', 'Bow', 'Crossbow', 'Shotgun']
const HUNTING_STYLES = ['Spot & Stalk', 'Blind', 'Tree Stand', 'Driven', 'Hounds']
const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard']
const GUIDE_OPTIONS = ['Fully Guided', 'Semi-Guided', 'Self-Guided']

// Browse UI hunting-style labels → the value stored on a hunt (from constants).
const HUNTING_STYLE_VALUE: Record<string, string> = {
  'Spot & Stalk': 'spot_and_stalk',
  'Blind': 'blind',
  'Tree Stand': 'tree_stand',
  'Driven': 'driven',
  'Hounds': 'hounds',
}

// Difficulty label → stored value
const DIFFICULTY_VALUE: Record<string, string> = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
}

// Map the homepage search bar's price-range keys to an upper bound (per person).
const PRICE_RANGE_MAX: Record<string, number> = {
  'under-1k': 1000,
  '1k-3k': 3000,
  '3k-5k': 5000,
}

// Browse UI guide labels → the value stored on a hunt.
const GUIDE_TYPE_VALUE: Record<string, string> = {
  'Fully Guided': 'fully_guided',
  'Semi-Guided': 'semi_guided',
  'Self-Guided': 'self_guided',
}

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
]

type Filters = {
  species: string
  state: string
  weapons: string[]
  maxPrice: string
  daysMin: string
  daysMax: string
  styles: string[]
  difficulty: string[]
  guideType: string[]
  lodging: boolean
  meals: boolean
  baited: boolean
  fenced: boolean
  guaranteedTags: boolean
  nonHunting: boolean
  propertySizeMin: string
  propertySizeMax: string
}

const defaultFilters: Filters = {
  species: '',
  state: '',
  weapons: [],
  maxPrice: '',
  daysMin: '',
  daysMax: '',
  styles: [],
  difficulty: [],
  guideType: [],
  lodging: false,
  meals: false,
  baited: false,
  fenced: false,
  guaranteedTags: false,
  nonHunting: false,
  propertySizeMin: '',
  propertySizeMax: '',
}

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

function FilterCheckboxGroup({ label, options, selected, onChange }: {
  label: string
  options: string[]
  selected: string[]
  onChange: (val: string[]) => void
}) {
  return (
    <div>
      <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">{label}</label>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(o)}
              onChange={() => onChange(toggleArr(selected, o))}
              className="rounded border-wht-bone-2 text-wht-ink focus:ring-wht-forest"
            />
            <span className="text-sm text-wht-ink font-body">{o}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function YesNoFilter({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-wht-bone-2 text-wht-ink focus:ring-wht-forest"
      />
      <span className="text-sm font-medium text-wht-ink font-body">{label}</span>
    </label>
  )
}

function sortHunts(hunts: HuntCardProps[], sort: string): HuntCardProps[] {
  const copy = [...hunts]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.pricePerPerson - b.pricePerPerson)
    case 'price-desc':
      return copy.sort((a, b) => b.pricePerPerson - a.pricePerPerson)
    case 'rating':
      return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    default:
      return copy
  }
}

function BrowseContent({ hunts }: { hunts: HuntCardProps[] }) {
  const searchParams = useSearchParams()

  // Seed filters from the homepage search bar (?species=&state=&weapon=&price=).
  const [filters, setFilters] = useState<Filters>(() => {
    const price = searchParams.get('price')
    const weapon = searchParams.get('weapon')
    return {
      ...defaultFilters,
      species: searchParams.get('species') || '',
      state: searchParams.get('state') || '',
      weapons: weapon ? [weapon] : [],
      maxPrice: price && PRICE_RANGE_MAX[price] ? String(PRICE_RANGE_MAX[price]) : '',
    }
  })
  const [sort, setSort] = useState('featured')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeFilterCount = [
    filters.species, filters.state, filters.maxPrice, filters.daysMin, filters.daysMax,
    filters.propertySizeMin, filters.propertySizeMax,
  ].filter(Boolean).length
  + filters.weapons.length + filters.styles.length + filters.difficulty.length + filters.guideType.length
  + [filters.lodging, filters.meals, filters.baited, filters.fenced, filters.guaranteedTags, filters.nonHunting].filter(Boolean).length

  // A hunt is skipped by a specific filter if that filter is engaged AND the
  // hunt either mismatches or lacks the data. Filters against fields the hunt
  // record doesn't carry (undefined) treat "unknown" as "does not match" — we
  // don't want to surface data we can't confirm.
  const results = useMemo(() => {
    const daysMin = filters.daysMin ? Number(filters.daysMin) : null
    const daysMax = filters.daysMax ? Number(filters.daysMax) : null
    const acresMin = filters.propertySizeMin ? Number(filters.propertySizeMin) : null
    const acresMax = filters.propertySizeMax ? Number(filters.propertySizeMax) : null

    const filtered = hunts.filter((h) => {
      if (filters.species && h.species !== filters.species) return false
      if (filters.state && h.state !== filters.state) return false
      if (filters.maxPrice && h.pricePerPerson > Number(filters.maxPrice)) return false
      if (filters.weapons.length && !filters.weapons.some((w) => h.weaponTypes?.includes(w))) return false
      if (filters.guideType.length && !filters.guideType.some((g) => GUIDE_TYPE_VALUE[g] === h.guideType)) return false

      if (daysMin != null) {
        if (h.durationDays == null || h.durationDays < daysMin) return false
      }
      if (daysMax != null) {
        if (h.durationDays == null || h.durationDays > daysMax) return false
      }
      if (acresMin != null) {
        if (h.propertySizeAcres == null || h.propertySizeAcres < acresMin) return false
      }
      if (acresMax != null) {
        if (h.propertySizeAcres == null || h.propertySizeAcres > acresMax) return false
      }
      if (filters.styles.length) {
        const wanted = filters.styles.map((s) => HUNTING_STYLE_VALUE[s] ?? s)
        if (!wanted.some((v) => h.huntingStyles?.includes(v))) return false
      }
      if (filters.difficulty.length) {
        const wanted = filters.difficulty.map((d) => DIFFICULTY_VALUE[d] ?? d)
        if (!h.difficulty || !wanted.includes(h.difficulty)) return false
      }

      if (filters.lodging && !h.lodgingIncluded) return false
      if (filters.meals && !h.mealsIncluded) return false
      if (filters.baited && h.baited !== true) return false
      if (filters.fenced && h.fenced !== true) return false
      // "Guaranteed Tags" ≈ Over-The-Counter (no draw required).
      if (filters.guaranteedTags && h.isOtc !== true) return false
      // "Non-Hunting Activities" has no dedicated field yet; leave as a no-op
      // rather than silently drop every hunt while we wait for that data.
      return true
    })
    return sortHunts(filtered, sort)
  }, [hunts, filters, sort])

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Page Header */}
      <div className="bg-wht-forest py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-heritage text-white tracking-tight">Browse Hunts</h1>
          <p className="text-wht-bone mt-1 text-sm font-body">
            Showing <span className="font-semibold text-white">{results.length}</span> {results.length === 1 ? 'hunt' : 'hunts'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            className="flex items-center gap-2 bg-white border border-wht-bone-2 rounded-lg px-4 py-2 text-sm font-medium text-wht-ink"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          <div className="w-48">
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {[filters.species, filters.state].filter(Boolean).map((v) => (
              <span key={v} className="inline-flex items-center gap-1 bg-wht-ink text-wht-bone rounded-full px-3 py-1 text-xs font-mono font-medium">
                {v}
              </span>
            ))}
            {[...filters.weapons, ...filters.styles, ...filters.difficulty, ...filters.guideType].map((v) => (
              <span key={v} className="inline-flex items-center gap-1 bg-wht-ink text-wht-bone rounded-full px-3 py-1 text-xs font-mono font-medium">{v}</span>
            ))}
            <button onClick={() => setFilters(defaultFilters)} className="text-xs text-wht-blaze font-medium hover:underline">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`w-64 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-xl border border-wht-bone-2 p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h2 className="font-mono text-wht-ink text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h2>

              <div className="space-y-5 divide-y divide-wht-bone-2">
                {/* Species */}
                <div className="pt-0">
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">Species</label>
                  <Select value={filters.species} onChange={(e) => setFilters(p => ({ ...p, species: e.target.value }))} placeholder="All Species">
                    {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>

                {/* Location */}
                <div className="pt-4">
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">State / Province</label>
                  <Select value={filters.state} onChange={(e) => setFilters(p => ({ ...p, state: e.target.value }))} placeholder="All Locations">
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>

                {/* Days */}
                <div className="pt-4">
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">Number of Days</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      min={1}
                      value={filters.daysMin}
                      onChange={(e) => setFilters(p => ({ ...p, daysMin: e.target.value }))}
                      className="w-full border border-wht-bone-2 rounded-lg px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min={1}
                      value={filters.daysMax}
                      onChange={(e) => setFilters(p => ({ ...p, daysMax: e.target.value }))}
                      className="w-full border border-wht-bone-2 rounded-lg px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                    />
                  </div>
                </div>

                {/* Max Price */}
                <div className="pt-4">
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">Max Price (per person)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    min={0}
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
                    className="w-full border border-wht-bone-2 rounded-lg px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                  />
                </div>

                {/* Weapon */}
                <div className="pt-4">
                  <FilterCheckboxGroup
                    label="Weapon"
                    options={WEAPON_TYPES}
                    selected={filters.weapons}
                    onChange={(v) => setFilters(p => ({ ...p, weapons: v }))}
                  />
                </div>

                {/* Style */}
                <div className="pt-4">
                  <FilterCheckboxGroup
                    label="Hunting Style"
                    options={HUNTING_STYLES}
                    selected={filters.styles}
                    onChange={(v) => setFilters(p => ({ ...p, styles: v }))}
                  />
                </div>

                {/* Difficulty */}
                <div className="pt-4">
                  <FilterCheckboxGroup
                    label="Difficulty"
                    options={DIFFICULTY_OPTIONS}
                    selected={filters.difficulty}
                    onChange={(v) => setFilters(p => ({ ...p, difficulty: v }))}
                  />
                </div>

                {/* Guide Type */}
                <div className="pt-4">
                  <FilterCheckboxGroup
                    label="Guide Type"
                    options={GUIDE_OPTIONS}
                    selected={filters.guideType}
                    onChange={(v) => setFilters(p => ({ ...p, guideType: v }))}
                  />
                </div>

                {/* Property Size */}
                <div className="pt-4">
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">Property Size (acres)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      min={0}
                      value={filters.propertySizeMin}
                      onChange={(e) => setFilters(p => ({ ...p, propertySizeMin: e.target.value }))}
                      className="w-full border border-wht-bone-2 rounded-lg px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min={0}
                      value={filters.propertySizeMax}
                      onChange={(e) => setFilters(p => ({ ...p, propertySizeMax: e.target.value }))}
                      className="w-full border border-wht-bone-2 rounded-lg px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                    />
                  </div>
                </div>

                {/* Yes/No toggles */}
                <div className="pt-4 space-y-2.5">
                  <YesNoFilter label="Lodging Included" value={filters.lodging} onChange={(v) => setFilters(p => ({ ...p, lodging: v }))} />
                  <YesNoFilter label="Meals Included" value={filters.meals} onChange={(v) => setFilters(p => ({ ...p, meals: v }))} />
                  <YesNoFilter label="Guaranteed Tags" value={filters.guaranteedTags} onChange={(v) => setFilters(p => ({ ...p, guaranteedTags: v }))} />
                  <YesNoFilter label="Baited" value={filters.baited} onChange={(v) => setFilters(p => ({ ...p, baited: v }))} />
                  <YesNoFilter label="High Fenced / Estate" value={filters.fenced} onChange={(v) => setFilters(p => ({ ...p, fenced: v }))} />
                  <YesNoFilter label="Non-Hunting Activities" value={filters.nonHunting} onChange={(v) => setFilters(p => ({ ...p, nonHunting: v }))} />
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setFilters(defaultFilters)}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <p className="text-sm text-wht-stone font-body">
                Showing <span className="font-semibold text-wht-ink">{results.length}</span> {results.length === 1 ? 'hunt' : 'hunts'}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-wht-stone font-mono">Sort by:</span>
                <div className="w-52">
                  <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((hunt) => (
                  <HuntCard key={hunt.id} {...hunt} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-wht-ink font-heritage text-xl mb-2">No hunts match your filters</p>
                <p className="text-wht-stone text-sm font-body mb-6">Try widening your search or clearing a filter or two.</p>
                <Button variant="outline" onClick={() => setFilters(defaultFilters)}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function BrowseClient({ hunts }: { hunts: HuntCardProps[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-wht-paper" />}>
      <BrowseContent hunts={hunts} />
    </Suspense>
  )
}
