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

const WEAPON_TYPES = ['Rifle', 'Bow', 'Muzzleloader', 'Shotgun', 'Crossbow']

const PRICE_RANGES = [
  { label: 'Under $1,000', value: 'under-1k' },
  { label: '$1,000 – $3,000', value: '1k-3k' },
  { label: '$3,000 – $5,000', value: '3k-5k' },
  { label: '$5,000+', value: '5k-plus' },
]

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
]

export default function BrowsePage() {
  const [filters, setFilters] = useState<{
    species: string
    state: string
    weapon: string
    price: string
    lodging: boolean
    guideType: string
  }>({
    species: '',
    state: '',
    weapon: '',
    price: '',
    lodging: false,
    guideType: '',
  })
  const [sort, setSort] = useState('featured')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeFilters = Object.entries(filters)
    .filter(([, v]) => Boolean(v))
    .map(([k, v]) => ({ key: k, value: String(v) }))

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: key === 'lodging' ? false : '' }))
  }

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
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
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
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => removeFilter(f.key)}
                className="inline-flex items-center gap-1 bg-wht-ink text-wht-bone rounded-full px-3 py-1 text-xs font-mono font-medium"
              >
                {f.value === 'true' ? 'Lodging Included' : f.value}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              onClick={() => setFilters({ species: '', state: '', weapon: '', price: '', lodging: false, guideType: '' })}
              className="text-xs text-wht-blaze font-medium hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`w-64 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-xl border-r border-wht-bone-2 p-5 sticky top-24">
              <h2 className="font-mono text-wht-ink text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h2>

              <div className="space-y-5">
                {/* Species */}
                <div>
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">Species</label>
                  <Select value={filters.species} onChange={(e) => setFilters(p => ({ ...p, species: e.target.value }))} placeholder="All Species">
                    {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>

                {/* State */}
                <div>
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">State</label>
                  <Select value={filters.state} onChange={(e) => setFilters(p => ({ ...p, state: e.target.value }))} placeholder="All States">
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>

                {/* Weapon */}
                <div>
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">Weapon Type</label>
                  <div className="space-y-2">
                    {WEAPON_TYPES.map((w) => (
                      <label key={w} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.weapon === w}
                          onChange={() => setFilters(p => ({ ...p, weapon: p.weapon === w ? '' : w }))}
                          className="rounded border-wht-bone-2 text-wht-ink focus:ring-wht-forest"
                        />
                        <span className="text-sm text-wht-ink font-body">{w}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">Budget</label>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((p) => (
                      <label key={p.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={filters.price === p.value}
                          onChange={() => setFilters(prev => ({ ...prev, price: p.value }))}
                          className="border-wht-bone-2 text-wht-ink focus:ring-wht-forest"
                        />
                        <span className="text-sm text-wht-ink font-body">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lodging */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.lodging}
                      onChange={(e) => setFilters(p => ({ ...p, lodging: e.target.checked }))}
                      className="rounded border-wht-bone-2 text-wht-ink focus:ring-wht-forest"
                    />
                    <span className="text-sm font-medium text-wht-ink font-body">Lodging Included</span>
                  </label>
                </div>

                {/* Guide Type */}
                <div>
                  <label className="text-xs font-mono text-wht-stone uppercase tracking-wider mb-2 block">Guide Type</label>
                  <div className="space-y-2">
                    {['Fully Guided', 'Semi-Guided', 'Self-Guided'].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="guide"
                          checked={filters.guideType === g}
                          onChange={() => setFilters(p => ({ ...p, guideType: g }))}
                          className="border-wht-bone-2 text-wht-ink focus:ring-wht-forest"
                        />
                        <span className="text-sm text-wht-ink font-body">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setFilters({ species: '', state: '', weapon: '', price: '', lodging: false, guideType: '' })}
                >
                  Clear Filters
                </Button>
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
