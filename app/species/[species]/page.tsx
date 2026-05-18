import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { HuntCard } from '@/components/hunt-card'
import { mockHunts } from '@/lib/mock-data'

interface SpeciesPageProps {
  params: Promise<{ species: string }>
}

function formatSpeciesName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const speciesInfo: Record<string, {
  description: string
  bestStates: string[]
  season: string
  emoji: string
  difficulty: string
}> = {
  elk: {
    emoji: '🫎',
    description: 'Elk hunting is the ultimate North American big game experience. These magnificent animals can weigh up to 700 lbs and produce screaming bugles during the September rut that will raise the hair on your neck. Elk are challenging, rewarding, and unforgettable.',
    bestStates: ['Colorado', 'Montana', 'Wyoming', 'Idaho', 'New Mexico'],
    season: 'August – December (varies)',
    difficulty: 'Moderate–Difficult',
  },
  'whitetail-deer': {
    emoji: '🦌',
    description: 'Whitetail deer is the most popular big game animal in North America, with millions of hunters pursuing them each fall. From the brushy river bottoms of Missouri to the agricultural fields of the Midwest, trophy whitetails can be found coast to coast.',
    bestStates: ['Missouri', 'Kansas', 'Iowa', 'Illinois', 'Kentucky'],
    season: 'October – January (varies)',
    difficulty: 'Beginner–Moderate',
  },
  'mule-deer': {
    emoji: '🦌',
    description: 'Mule deer hunting in the mountain West is a pursuit of wide, forked-tined bucks in big country. Whether glassing high alpine basins in Wyoming or hunting the breaks of eastern Montana, mule deer hunting is a test of legs, lungs, and patience.',
    bestStates: ['Wyoming', 'Colorado', 'Montana', 'Nevada', 'Utah'],
    season: 'October – November',
    difficulty: 'Moderate',
  },
  'black-bear': {
    emoji: '🐻',
    description: 'Black bear hunting offers a unique challenge across much of North America. Spring bear hunts over bait are exciting close-range encounters, while fall spot-and-stalk hunts in the mountains test your patience and woodsmanship.',
    bestStates: ['Montana', 'Idaho', 'Oregon', 'Alaska', 'Maine'],
    season: 'Spring (April–June) & Fall (September–November)',
    difficulty: 'Moderate',
  },
  turkey: {
    emoji: '🦃',
    description: 'Turkey hunting in the spring is a rite of passage for millions of American hunters. Calling in a fired-up longbeard at first light ranks among the most exciting experiences in hunting. Turkey hunting is accessible, affordable, and phenomenally fun.',
    bestStates: ['Kansas', 'Missouri', 'Alabama', 'Iowa', 'Oklahoma'],
    season: 'March – May (Spring) / Fall',
    difficulty: 'Beginner–Moderate',
  },
  'pronghorn-antelope': {
    emoji: '🦌',
    description: 'Pronghorn antelope are North America\'s speed champions, capable of sustaining speeds over 55 mph. Hunting these wary animals on the open plains requires long-range precision and careful approach strategies. Wyoming has the largest pronghorn population on earth.',
    bestStates: ['Wyoming', 'Montana', 'Colorado', 'New Mexico', 'Nevada'],
    season: 'August – October',
    difficulty: 'Moderate',
  },
  moose: {
    emoji: '🫎',
    description: 'Moose are the largest member of the deer family and one of the most sought-after trophies in North America. Alaska, Canada, and parts of the Northern Rockies offer incredible moose hunting opportunities for the adventurous hunter willing to pack into remote wilderness.',
    bestStates: ['Alaska', 'Montana', 'Wyoming', 'Idaho', 'Maine'],
    season: 'September – October',
    difficulty: 'Difficult',
  },
  'wild-boar': {
    emoji: '🐗',
    description: 'Wild hog hunting is one of the most action-packed and accessible hunts available. Texas alone has an estimated 3 million feral hogs, making for year-round hunting opportunities. Night hunts over feeders are especially exciting and productive.',
    bestStates: ['Texas', 'Florida', 'Georgia', 'Louisiana', 'California'],
    season: 'Year-round',
    difficulty: 'Beginner–Moderate',
  },
}

export default async function SpeciesHuntsPage({ params }: SpeciesPageProps) {
  const { species } = await params
  const speciesName = formatSpeciesName(species)
  const info = speciesInfo[species]

  const speciesHunts = mockHunts.filter(
    (h) => h.species.toLowerCase() === speciesName.toLowerCase()
  )
  const displayHunts = speciesHunts.length > 0 ? speciesHunts : mockHunts.slice(0, 6)

  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/species"
            className="inline-flex items-center gap-1 text-wht-bone hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All Species
          </Link>
          <div className="flex items-center gap-3">
            {info && <span className="text-4xl">{info.emoji}</span>}
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {speciesName} Hunts
              </h1>
              <p className="text-wht-bone mt-1 text-sm">
                <span className="font-semibold text-white">{displayHunts.length}+ packages</span> available nationwide
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {info && (
          <div className="bg-white rounded-xl border border-wht-bone-2 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-wht-forest mb-2">About {speciesName} Hunting</h2>
                <p className="text-wht-stone text-sm leading-relaxed">{info.description}</p>
              </div>
              <div className="md:w-56 flex-shrink-0 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-1">Best States</div>
                  <div className="flex flex-wrap gap-1">
                    {info.bestStates.map((s) => (
                      <Link
                        key={s}
                        href={`/states/${s.toLowerCase().replace(/ /g, '-')}`}
                        className="text-xs bg-wht-bone-2 text-wht-forest rounded-full px-2.5 py-1 font-medium hover:bg-wht-blaze hover:text-white transition-colors"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-1">Typical Season</div>
                  <div className="text-sm font-semibold text-wht-forest">{info.season}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-1">Difficulty</div>
                  <div className="text-sm font-semibold text-wht-forest">{info.difficulty}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-wht-forest mb-5">
          Available {speciesName} Hunts
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
