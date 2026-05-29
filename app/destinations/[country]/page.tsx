import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Globe, ArrowLeft, Compass } from 'lucide-react'
import { HuntCard } from '@/components/hunt-card'
import { Button } from '@/components/ui/button'
import { getCountryBySlug, getListingsByCountry } from '@/lib/listings'

interface PageProps {
  params: Promise<{ country: string }>
}

export default async function DestinationCountryPage({ params }: PageProps) {
  const { country: slug } = await params
  const country = await getCountryBySlug(slug)
  if (!country) notFound()

  const hunts = await getListingsByCountry(slug)

  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1 text-wht-bone hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All Destinations
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{country.emoji ?? '🌍'}</span>
            <div>
              <h1 className="text-3xl font-heritage text-white tracking-tight">Hunting in {country.name}</h1>
              <p className="text-wht-bone mt-1 text-sm">
                {hunts.length > 0
                  ? `${hunts.length} hunt package${hunts.length !== 1 ? 's' : ''} available`
                  : 'Outfitters joining soon'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {country.description && (
          <div className="bg-white rounded-xl border border-wht-bone-2 p-6 mb-8">
            <h2 className="text-lg font-bold text-wht-forest mb-2">About Hunting in {country.name}</h2>
            <p className="text-wht-stone text-sm leading-relaxed">{country.description}</p>
          </div>
        )}

        {hunts.length > 0 ? (
          <>
            <h2 className="text-xl font-bold text-wht-forest mb-5">Available Hunts in {country.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hunts.map((hunt) => (
                <HuntCard key={hunt.id} {...hunt} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-wht-bone-2 p-10 text-center">
            <Globe className="h-14 w-14 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-wht-forest mb-2">No {country.name} Hunts Listed Yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              We&apos;re adding outfitters in {country.name} now. Are you an outfitter here? List your hunts
              and reach hunters worldwide — no booking commissions, just one low annual fee.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup?type=outfitter">
                <Button variant="copper">List Your Hunts</Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline"><Compass className="h-4 w-4 mr-2" />Browse All Hunts</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
