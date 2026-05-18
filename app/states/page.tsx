import Link from 'next/link'
import { MapPin } from 'lucide-react'

const allStates = [
  { name: 'Alabama', slug: 'alabama', count: 34, emoji: '🌲' },
  { name: 'Alaska', slug: 'alaska', count: 98, emoji: '🌲' },
  { name: 'Arizona', slug: 'arizona', count: 76, emoji: '🌵' },
  { name: 'Arkansas', slug: 'arkansas', count: 45, emoji: '🌲' },
  { name: 'California', slug: 'california', count: 28, emoji: '🏔️' },
  { name: 'Colorado', slug: 'colorado', count: 201, emoji: '🏔️' },
  { name: 'Connecticut', slug: 'connecticut', count: 8, emoji: '🌲' },
  { name: 'Delaware', slug: 'delaware', count: 5, emoji: '🌿' },
  { name: 'Florida', slug: 'florida', count: 67, emoji: '🐊' },
  { name: 'Georgia', slug: 'georgia', count: 53, emoji: '🌲' },
  { name: 'Hawaii', slug: 'hawaii', count: 12, emoji: '🌺' },
  { name: 'Idaho', slug: 'idaho', count: 122, emoji: '🏔️' },
  { name: 'Illinois', slug: 'illinois', count: 89, emoji: '🌾' },
  { name: 'Indiana', slug: 'indiana', count: 62, emoji: '🌾' },
  { name: 'Iowa', slug: 'iowa', count: 95, emoji: '🌾' },
  { name: 'Kansas', slug: 'kansas', count: 143, emoji: '🌾' },
  { name: 'Kentucky', slug: 'kentucky', count: 74, emoji: '🌲' },
  { name: 'Louisiana', slug: 'louisiana', count: 58, emoji: '🐊' },
  { name: 'Maine', slug: 'maine', count: 67, emoji: '🦌' },
  { name: 'Maryland', slug: 'maryland', count: 22, emoji: '🌿' },
  { name: 'Massachusetts', slug: 'massachusetts', count: 14, emoji: '🌲' },
  { name: 'Michigan', slug: 'michigan', count: 108, emoji: '🌲' },
  { name: 'Minnesota', slug: 'minnesota', count: 87, emoji: '🌲' },
  { name: 'Mississippi', slug: 'mississippi', count: 49, emoji: '🌲' },
  { name: 'Missouri', slug: 'missouri', count: 167, emoji: '🌲' },
  { name: 'Montana', slug: 'montana', count: 187, emoji: '🏔️' },
  { name: 'Nebraska', slug: 'nebraska', count: 76, emoji: '🌾' },
  { name: 'Nevada', slug: 'nevada', count: 43, emoji: '🏜️' },
  { name: 'New Hampshire', slug: 'new-hampshire', count: 19, emoji: '🌲' },
  { name: 'New Jersey', slug: 'new-jersey', count: 11, emoji: '🌿' },
  { name: 'New Mexico', slug: 'new-mexico', count: 89, emoji: '🌵' },
  { name: 'New York', slug: 'new-york', count: 38, emoji: '🌲' },
  { name: 'North Carolina', slug: 'north-carolina', count: 44, emoji: '🌲' },
  { name: 'North Dakota', slug: 'north-dakota', count: 55, emoji: '🌾' },
  { name: 'Ohio', slug: 'ohio', count: 71, emoji: '🌾' },
  { name: 'Oklahoma', slug: 'oklahoma', count: 83, emoji: '🌾' },
  { name: 'Oregon', slug: 'oregon', count: 96, emoji: '🌲' },
  { name: 'Pennsylvania', slug: 'pennsylvania', count: 87, emoji: '🌲' },
  { name: 'Rhode Island', slug: 'rhode-island', count: 4, emoji: '🌿' },
  { name: 'South Carolina', slug: 'south-carolina', count: 38, emoji: '🌲' },
  { name: 'South Dakota', slug: 'south-dakota', count: 64, emoji: '🌾' },
  { name: 'Tennessee', slug: 'tennessee', count: 56, emoji: '🌲' },
  { name: 'Texas', slug: 'texas', count: 312, emoji: '⭐' },
  { name: 'Utah', slug: 'utah', count: 88, emoji: '🏔️' },
  { name: 'Vermont', slug: 'vermont', count: 18, emoji: '🌲' },
  { name: 'Virginia', slug: 'virginia', count: 47, emoji: '🌲' },
  { name: 'Washington', slug: 'washington', count: 74, emoji: '🌲' },
  { name: 'West Virginia', slug: 'west-virginia', count: 33, emoji: '🌲' },
  { name: 'Wisconsin', slug: 'wisconsin', count: 93, emoji: '🌲' },
  { name: 'Wyoming', slug: 'wyoming', count: 163, emoji: '🏔️' },
]

export default function StatesPage() {
  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-wht-blaze" />
            <span className="text-wht-blaze text-sm font-semibold uppercase tracking-wider">Browse by Location</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hunt by State</h1>
          <p className="text-wht-bone mt-1 text-sm">
            Explore hunting opportunities across <span className="font-semibold text-white">all 50 states</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allStates.map((state) => (
            <Link
              key={state.slug}
              href={`/states/${state.slug}`}
              className="group bg-white rounded-xl p-4 text-center border border-wht-bone-2 hover:border-wht-forest hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-1">{state.emoji}</div>
              <div className="font-bold text-sm text-wht-forest group-hover:text-wht-blaze transition-colors leading-tight">
                {state.name}
              </div>
              <div className="text-xs text-wht-stone mt-0.5">{state.count} hunts</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
