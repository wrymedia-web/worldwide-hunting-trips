import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'
import { HuntCard } from '@/components/hunt-card'
import { getListingsByState } from '@/lib/listings'

interface StatePageProps {
  params: Promise<{ state: string }>
}

function formatStateName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const stateInfo: Record<string, { description: string; topSpecies: string[]; season: string }> = {
  montana: {
    description: 'Montana is one of the premier hunting destinations in North America, offering vast public land access, world-class elk and mule deer hunting, and opportunities for bears, wolves, bison, and more. The Big Sky State has it all.',
    topSpecies: ['Elk', 'Mule Deer', 'Black Bear', 'Pronghorn Antelope', 'Bison'],
    season: 'September – December',
  },
  wyoming: {
    description: 'Wyoming consistently ranks among the top hunting states for trophy mule deer and pronghorn antelope. With 49% of the state in public land, access is excellent and the quality of big game is exceptional.',
    topSpecies: ['Mule Deer', 'Pronghorn Antelope', 'Elk', 'Black Bear'],
    season: 'September – November',
  },
  colorado: {
    description: 'Colorado offers some of the finest elk hunting on the planet, with an estimated 280,000 elk calling the state home. World-class mule deer, black bear, pronghorn, and mountain lion hunting round out an incredible destination.',
    topSpecies: ['Elk', 'Mule Deer', 'Black Bear', 'Pronghorn Antelope'],
    season: 'September – December',
  },
  texas: {
    description: 'Texas is the whitetail capital of the world with over 4 million deer. The Lone Star State also offers unique opportunities for axis deer, nilgai, wild boar, exotic game, and more — year-round on private ranches.',
    topSpecies: ['Whitetail Deer', 'Wild Boar', 'Axis Deer', 'Nilgai', 'Exotic Game'],
    season: 'Year-round (varies by species)',
  },
  missouri: {
    description: 'Missouri has earned a reputation as one of the top whitetail deer states in the country, regularly producing Boone & Crockett-class bucks. The Ozarks provide diverse habitat and excellent turkey hunting as well.',
    topSpecies: ['Whitetail Deer', 'Turkey', 'Wild Boar'],
    season: 'October – December',
  },
}

export default async function StateHuntsPage({ params }: StatePageProps) {
  const { state } = await params
  const stateName = formatStateName(state)
  const info = stateInfo[state]

  const displayHunts = await getListingsByState(stateName)

  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/states"
            className="inline-flex items-center gap-1 text-wht-bone hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All States
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-wht-blaze" />
            <span className="text-wht-blaze text-sm font-semibold uppercase tracking-wider">Hunting in</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {stateName} Hunting
          </h1>
          <p className="text-wht-bone mt-1 text-sm">
            <span className="font-semibold text-white">{displayHunts.length}+ hunt packages</span> available in {stateName}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* State info */}
        {info && (
          <div className="bg-white rounded-xl border border-wht-bone-2 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-wht-forest mb-2">Hunting in {stateName}</h2>
                <p className="text-wht-stone text-sm leading-relaxed">{info.description}</p>
              </div>
              <div className="md:w-56 flex-shrink-0 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-1">Top Species</div>
                  <div className="flex flex-wrap gap-1">
                    {info.topSpecies.map((s) => (
                      <Link
                        key={s}
                        href={`/species/${s.toLowerCase().replace(/ /g, '-')}`}
                        className="text-xs bg-wht-bone-2 text-wht-forest rounded-full px-2.5 py-1 font-medium hover:bg-wht-blaze hover:text-white transition-colors"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-1">Primary Season</div>
                  <div className="text-sm font-semibold text-wht-forest">{info.season}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hunt grid */}
        <h2 className="text-xl font-bold text-wht-forest mb-5">
          Available Hunts in {stateName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayHunts.map((hunt) => (
            <HuntCard key={hunt.id} {...hunt} />
          ))}
        </div>
      </div>
    </div>
  )
}
