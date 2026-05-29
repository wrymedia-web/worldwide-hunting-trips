'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { OutfitterCard, type OutfitterCardProps } from '@/components/outfitter-card'
import { Select } from '@/components/ui/select'

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Idaho', 'Kansas', 'Missouri', 'Montana', 'New Mexico', 'Oregon',
  'Texas', 'Utah', 'Wyoming',
]

const SPECIES = [
  'Whitetail Deer', 'Elk', 'Mule Deer', 'Black Bear', 'Moose',
  'Pronghorn Antelope', 'Turkey', 'Wild Boar',
]

export function OutfittersClient({ outfitters }: { outfitters: OutfitterCardProps[] }) {
  const [stateFilter, setStateFilter] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')

  const filtered = useMemo(() => {
    return outfitters.filter((o) => {
      if (stateFilter && o.state !== stateFilter) return false
      if (speciesFilter && !o.species.includes(speciesFilter)) return false
      if (ratingFilter && o.rating < parseFloat(ratingFilter)) return false
      return true
    })
  }, [outfitters, stateFilter, speciesFilter, ratingFilter])

  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-heritage text-white tracking-tight">Browse Outfitters</h1>
          <p className="text-wht-bone mt-1 text-sm">
            Verified hunting outfitters across the United States and worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-wht-bone-2 p-5">
              <h2 className="font-heritage text-wht-forest text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filter
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-2 block">State</label>
                  <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} placeholder="All States">
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-2 block">Species</label>
                  <Select value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)} placeholder="All Species">
                    {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-2 block">Min Rating</label>
                  <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} placeholder="Any Rating">
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-wht-stone mb-4">
              Showing <span className="font-semibold text-wht-forest">{filtered.length}</span> outfitter{filtered.length !== 1 ? 's' : ''}
            </p>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-10 text-center text-sm text-wht-stone">
                No outfitters match those filters yet. Try widening your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((outfitter) => (
                  <OutfitterCard key={outfitter.id} {...outfitter} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
