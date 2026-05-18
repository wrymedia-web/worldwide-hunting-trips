'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const SPECIES = [
  'Whitetail Deer', 'Mule Deer', 'Elk', 'Moose', 'Black Bear', 'Brown Bear',
  'Grizzly Bear', 'Mountain Lion', 'Bison', 'Pronghorn Antelope', 'Bighorn Sheep',
  'Dall Sheep', 'Rocky Mountain Goat', 'Wild Boar', 'Caribou', 'Coues Deer',
  'Axis Deer', 'Sika Deer', 'Nilgai', 'Aoudad Sheep', 'Blackbuck Antelope',
  'Red Stag', 'Turkey', 'Alligator', 'Wolf', 'Buffalo', 'Exotic Game', 'Predator',
]

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
]

const WEAPON_TYPES = ['Rifle', 'Bow', 'Muzzleloader', 'Shotgun', 'Crossbow']

const PRICE_RANGES = [
  { label: 'Under $1,000', value: 'under-1k' },
  { label: '$1,000 – $3,000', value: '1k-3k' },
  { label: '$3,000 – $5,000', value: '3k-5k' },
  { label: '$5,000+', value: '5k-plus' },
]

interface SearchBarProps {
  className?: string
  compact?: boolean
}

export function SearchBar({ className = '', compact = false }: SearchBarProps) {
  const router = useRouter()
  const [species, setSpecies] = useState('')
  const [state, setState] = useState('')
  const [weapon, setWeapon] = useState('')
  const [price, setPrice] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (species) params.set('species', species)
    if (state) params.set('state', state)
    if (weapon) params.set('weapon', weapon)
    if (price) params.set('price', price)
    router.push(`/browse?${params.toString()}`)
  }

  return (
    <div className={`bg-wht-bone rounded-xl shadow-lg border border-wht-bone-2 p-4 ${className}`}>
      <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'}`}>
        <div className="lg:col-span-1">
          <label className="block text-xs font-semibold text-wht-forest mb-1.5 uppercase tracking-wider font-body">Species</label>
          <Select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="All Species"
          >
            {SPECIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>

        <div className="lg:col-span-1">
          <label className="block text-xs font-semibold text-wht-forest mb-1.5 uppercase tracking-wider font-body">State</label>
          <Select
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="All States"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>

        <div className="lg:col-span-1">
          <label className="block text-xs font-semibold text-wht-forest mb-1.5 uppercase tracking-wider font-body">Weapon</label>
          <Select
            value={weapon}
            onChange={(e) => setWeapon(e.target.value)}
            placeholder="All Weapons"
          >
            {WEAPON_TYPES.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </Select>
        </div>

        <div className="lg:col-span-1">
          <label className="block text-xs font-semibold text-wht-forest mb-1.5 uppercase tracking-wider font-body">Budget</label>
          <Select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Any Budget"
          >
            {PRICE_RANGES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </Select>
        </div>

        <div className="lg:col-span-1 flex items-end">
          <Button
            variant="default"
            onClick={handleSearch}
            className="w-full gap-2"
          >
            <Search className="h-4 w-4" />
            Search Hunts
          </Button>
        </div>
      </div>
    </div>
  )
}
