import Link from 'next/link'
import { Globe } from 'lucide-react'
import { getActiveCountries } from '@/lib/listings'

export const metadata = {
  title: 'Hunting Destinations Worldwide | Worldwide Hunting Trips',
  description: 'Browse guided hunts by destination — the United States, Canada, South Africa, Argentina, New Zealand, Spain and more.',
}

const CONTINENT_LABELS: Record<string, string> = {
  north_america: 'North America',
  africa: 'Africa',
  europe: 'Europe',
  oceania: 'Oceania',
  south_america: 'South & Central America',
  asia: 'Asia & Mountain',
}

export default async function DestinationsPage() {
  const countries = await getActiveCountries()

  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-wht-blaze" />
            <span className="text-wht-blaze text-sm font-semibold uppercase tracking-wider">Hunt Worldwide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heritage text-white tracking-tight">Hunting Destinations</h1>
          <p className="text-wht-bone mt-2 text-sm max-w-2xl">
            From whitetail in the Midwest to plains game in South Africa and red stag in Patagonia — connect
            directly with trusted outfitters around the world. No booking fees, ever.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {countries.map((c) => (
            <Link
              key={c.slug}
              href={`/destinations/${c.slug}`}
              className="group bg-white rounded-xl border border-wht-bone-2 p-6 hover:border-wht-blaze hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{c.emoji ?? '🌍'}</span>
                <div>
                  <h2 className="font-heritage text-lg text-wht-ink group-hover:text-wht-blaze transition-colors">{c.name}</h2>
                  {c.continent && (
                    <div className="text-xs text-wht-fog font-mono uppercase tracking-wider">
                      {CONTINENT_LABELS[c.continent] ?? c.continent}
                    </div>
                  )}
                </div>
              </div>
              {c.description && (
                <p className="text-sm text-wht-stone leading-relaxed line-clamp-3 font-body">{c.description}</p>
              )}
              <div className="mt-4 text-xs font-mono text-wht-stone">
                {c.listingCount > 0
                  ? `${c.listingCount} hunt${c.listingCount !== 1 ? 's' : ''} listed`
                  : 'Outfitters joining soon'}
              </div>
            </Link>
          ))}
        </div>

        {countries.length === 0 && (
          <div className="bg-white rounded-xl border border-wht-bone-2 p-10 text-center text-sm text-wht-stone">
            Destinations are being set up. Check back shortly.
          </div>
        )}
      </div>
    </div>
  )
}
