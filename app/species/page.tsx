import Link from 'next/link'

const allSpecies = [
  // Big Game
  { name: 'Whitetail Deer', slug: 'whitetail-deer', category: 'Big Game', emoji: '🦌', count: 482 },
  { name: 'Mule Deer', slug: 'mule-deer', category: 'Big Game', emoji: '🦌', count: 198 },
  { name: 'Elk', slug: 'elk', category: 'Big Game', emoji: '🫎', count: 267 },
  { name: 'Moose', slug: 'moose', category: 'Big Game', emoji: '🫎', count: 54 },
  { name: 'Black Bear', slug: 'black-bear', category: 'Big Game', emoji: '🐻', count: 143 },
  { name: 'Brown Bear', slug: 'brown-bear', category: 'Big Game', emoji: '🐻', count: 38 },
  { name: 'Grizzly Bear', slug: 'grizzly-bear', category: 'Big Game', emoji: '🐻', count: 12 },
  { name: 'Bison', slug: 'bison', category: 'Big Game', emoji: '🦬', count: 27 },
  { name: 'Pronghorn Antelope', slug: 'pronghorn-antelope', category: 'Big Game', emoji: '🦌', count: 89 },
  { name: 'Bighorn Sheep', slug: 'bighorn-sheep', category: 'Big Game', emoji: '🐑', count: 31 },
  { name: 'Dall Sheep', slug: 'dall-sheep', category: 'Big Game', emoji: '🐑', count: 18 },
  { name: 'Rocky Mountain Goat', slug: 'rocky-mountain-goat', category: 'Big Game', emoji: '🐐', count: 14 },
  { name: 'Wild Boar', slug: 'wild-boar', category: 'Big Game', emoji: '🐗', count: 176 },
  { name: 'Caribou', slug: 'caribou', category: 'Big Game', emoji: '🦌', count: 42 },
  { name: 'Coues Deer', slug: 'coues-deer', category: 'Big Game', emoji: '🦌', count: 56 },
  { name: 'Alligator', slug: 'alligator', category: 'Big Game', emoji: '🐊', count: 23 },
  { name: 'Buffalo', slug: 'buffalo', category: 'Big Game', emoji: '🦬', count: 19 },
  // Predator
  { name: 'Mountain Lion', slug: 'mountain-lion', category: 'Predator', emoji: '🦁', count: 47 },
  { name: 'Wolf', slug: 'wolf', category: 'Predator', emoji: '🐺', count: 8 },
  { name: 'Predator', slug: 'predator', category: 'Predator', emoji: '🦊', count: 65 },
  // Exotic
  { name: 'Axis Deer', slug: 'axis-deer', category: 'Exotic', emoji: '🦌', count: 87 },
  { name: 'Sika Deer', slug: 'sika-deer', category: 'Exotic', emoji: '🦌', count: 34 },
  { name: 'Nilgai', slug: 'nilgai', category: 'Exotic', emoji: '🦌', count: 22 },
  { name: 'Aoudad Sheep', slug: 'aoudad-sheep', category: 'Exotic', emoji: '🐑', count: 29 },
  { name: 'Blackbuck Antelope', slug: 'blackbuck-antelope', category: 'Exotic', emoji: '🦌', count: 18 },
  { name: 'Red Stag', slug: 'red-stag', category: 'Exotic', emoji: '🦌', count: 43 },
  { name: 'Exotic Game', slug: 'exotic-game', category: 'Exotic', emoji: '🌍', count: 112 },
  // Birds
  { name: 'Turkey', slug: 'turkey', category: 'Bird', emoji: '🦃', count: 211 },
]

const categories = ['Big Game', 'Predator', 'Exotic', 'Bird']

export default function SpeciesPage() {
  const grouped = categories.map((cat) => ({
    category: cat,
    species: allSpecies.filter((s) => s.category === cat),
  }))

  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Browse by Species</h1>
          <p className="text-wht-bone mt-1 text-sm">
            <span className="font-semibold text-white">28 species</span> — find the perfect hunt for any game
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {grouped.map((group) => (
          <div key={group.category}>
            <h2 className="text-xl font-bold text-wht-forest mb-5 flex items-center gap-3">
              {group.category}
              <span className="text-sm font-normal text-wht-stone">{group.species.length} species</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {group.species.map((s) => (
                <Link
                  key={s.slug}
                  href={`/species/${s.slug}`}
                  className="group bg-white rounded-xl p-4 text-center border border-wht-bone-2 hover:border-wht-forest hover:shadow-md transition-all"
                >
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="text-sm font-semibold text-wht-forest group-hover:text-wht-blaze transition-colors leading-tight">
                    {s.name}
                  </div>
                  <div className="text-xs text-wht-stone mt-0.5">{s.count} hunts</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
