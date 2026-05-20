'use client'

import { useState } from 'react'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { HuntCard } from '@/components/hunt-card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { mockHunts } from '@/lib/mock-data'

const SPECIES = [
  'Whitetail Deer', 'Mule Deer', 'Elk', 'Moose', 'Black Bear', 'Brown Bear',
  'Grizzly Bear', 'Mountain Lion', 'Bison', 'Pronghorn Antelope', 'Bighorn Sheep',
  'Dall Sheep', 'Rocky Mountain Goat', 'Wild Boar', 'Caribou', 'Coues Deer',
  'Axis Deer', 'Sika Deer', 'Nilgai', 'Aoudad Sheep', 'Blackbuck Antelope',
  'Red Stag', 'Turkey', 'Alligator', 'Wolf', 'Buffalo', 'Exotic Game', 'Predator',
]

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Idaho', 'Kansas', 'Missouri', 'Montana', 'New Mexico', 'Oregon',
  'Texas', 'Utah', 'Wyoming',
]

const WEAPON_TYPES = ['Rifle', 'Muzzleloader', 'Bow', 'Crossbow', 'Shotgun']
const HUNTING_STYLES = ['Spot & Stalk', 'Blind', 'Tree Stand', 'Driven', 'Hounds']
const DIFFICULTY_OPTIONS = ['Easy', 'Moderate', 'Hard']
const GUIDE_OPTIONS = ['Fully Guided', 'Semi-Guided', 'Self-Guided']

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

export default function BrowsePage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [sort, setSort] = useState('featured')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeFilterCount = [
    filters.species, filters.state, filters.maxPrice, filters.daysMin, filters.daysMax,
    filters.propertySizeMin, filters.propertySizeMax,
  ].filter(Boolean).length
  + filters.weapons.length + filters.styles.length + filters.difficulty.length + filters.guideType.length
  + [filters.lodging, filters.meals, filters.baited, filters.fenced, filters.guaranteedTags, filters.nonHunting].filter(Boolean).length

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Page Header */}
      <div className="bg-wht-forest py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-heritage text-white tracking-tight">Browse Hunts</h1>
          <p className="text-wht-bone mt-1 text-sm font-body">
            Showing <span className="font-semibold text-white">247 hunts</span> across the United States
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
                Showing <span className="font-semibold text-wht-ink">247</span> hunts
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

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {mockHunts.map((hunt) => (
                <HuntCard key={hunt.id} {...hunt} />
              ))}
            </div>

            {/* Load more */}
            <div className="text-center mt-10">
              <Button variant="outline" className="gap-2">
                Load More Hunts <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
