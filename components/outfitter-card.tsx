import Link from 'next/link'
import { Star, MapPin, List } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface OutfitterCardProps {
  id: string
  name: string
  state: string
  species: string[]
  totalListings: number
  rating: number
  reviewCount: number
  yearsInBusiness?: number
  verified?: boolean
}

export function OutfitterCard({
  id,
  name,
  state,
  species,
  totalListings,
  rating,
  reviewCount,
  yearsInBusiness,
  verified = false,
}: OutfitterCardProps) {
  const topSpecies = species.slice(0, 3)

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-wht-bone-2 hover:shadow-md transition-shadow group">
      {/* Cover photo */}
      <div className="relative h-36 bg-gradient-to-br from-wht-ink to-wht-forest overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="grid grid-cols-3 gap-4">
            {['🦌', '🐻', '🦃'].map((emoji, i) => (
              <span key={i} className="text-3xl">{emoji}</span>
            ))}
          </div>
        </div>
        {verified && (
          <div className="absolute top-3 right-3">
            <Badge variant="copper" className="text-xs">Verified</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#1C1C1C] text-base mb-1 group-hover:text-wht-forest transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-wht-stone mb-3">
          <MapPin className="h-3 w-3 text-wht-stone" />
          <span>{state}</span>
          {yearsInBusiness && (
            <>
              <span className="mx-1">·</span>
              <span>{yearsInBusiness} yrs in business</span>
            </>
          )}
        </div>

        {/* Species */}
        <div className="flex flex-wrap gap-1 mb-3">
          {topSpecies.map((s) => (
            <Badge key={s} variant="warm" className="text-xs">
              {s}
            </Badge>
          ))}
          {species.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{species.length - 3} more
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-xs text-wht-stone">
            <List className="h-3.5 w-3.5" />
            <span>{totalListings} hunt{totalListings !== 1 ? 's' : ''} listed</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-wht-blaze fill-wht-blaze" />
            <span className="text-sm font-semibold text-[#1C1C1C]">{rating.toFixed(1)}</span>
            <span className="text-xs text-wht-stone">({reviewCount})</span>
          </div>
        </div>

        <Link href={`/outfitter/${id}`}>
          <Button variant="outline" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  )
}
