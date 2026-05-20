import Link from 'next/link'
import { Star, MapPin, Home, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface HuntCardProps {
  id: string
  title: string
  outfitterName: string
  species: string
  state: string
  pricePerPerson: number
  imageUrl?: string
  rating: number
  reviewCount: number
  weaponTypes: string[]
  lodgingIncluded: boolean
  guideType: 'fully_guided' | 'semi_guided' | 'self_guided'
  priceType?: 'per_person' | 'per_day' | 'flat'
  isExample?: boolean
}

function getGuideLabel(type: HuntCardProps['guideType']) {
  switch (type) {
    case 'fully_guided': return 'Fully Guided'
    case 'semi_guided': return 'Semi-Guided'
    case 'self_guided': return 'Self-Guided'
  }
}

function getWeaponBadgeColor(weapon: string) {
  switch (weapon.toLowerCase()) {
    case 'bow': return 'bg-emerald-100 text-emerald-800'
    case 'rifle': return 'bg-blue-100 text-blue-800'
    case 'muzzleloader': return 'bg-purple-100 text-purple-800'
    case 'shotgun': return 'bg-orange-100 text-orange-800'
    case 'crossbow': return 'bg-teal-100 text-teal-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export function HuntCard({
  id,
  title,
  outfitterName,
  species,
  state,
  pricePerPerson,
  rating,
  reviewCount,
  weaponTypes,
  lodgingIncluded,
  guideType,
  priceType = 'per_person',
  isExample = false,
}: HuntCardProps) {
  const priceLabel = priceType === 'per_day' ? '/day' : priceType === 'flat' ? ' flat' : '/person'

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-wht-bone-2 hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-wht-forest to-wht-ink overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-2 opacity-40">🦌</div>
            <span className="text-wht-bone/60 text-xs font-mono uppercase tracking-wider">
              {species}
            </span>
          </div>
        </div>
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant="default">{species}</Badge>
          {lodgingIncluded && (
            <Badge variant="secondary" className="bg-white/90 text-wht-forest">
              <Home className="h-3 w-3 mr-1" />
              Lodging
            </Badge>
          )}
        </div>
        {isExample && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-900 uppercase tracking-wide shadow">
              Example
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-wht-ink text-sm leading-tight group-hover:text-wht-forest transition-colors line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-xs text-wht-stone mb-2">
          <User className="h-3 w-3 text-wht-stone" />
          <span className="text-wht-stone font-mono">{outfitterName}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-wht-stone mb-3">
          <MapPin className="h-3 w-3" />
          <span>{state}</span>
          <span className="mx-1">·</span>
          <span>{getGuideLabel(guideType)}</span>
        </div>

        {/* Weapon types */}
        <div className="flex flex-wrap gap-1 mb-3">
          {weaponTypes.map((w) => (
            <span
              key={w}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getWeaponBadgeColor(w)}`}
            >
              {w}
            </span>
          ))}
        </div>

        {/* Price + Rating */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-display text-wht-blaze">
              ${pricePerPerson.toLocaleString()}
            </span>
            <span className="text-xs text-wht-stone">{priceLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-wht-blaze fill-wht-blaze" />
            <span className="text-sm font-semibold text-wht-ink">{rating.toFixed(1)}</span>
            <span className="text-xs text-wht-stone">({reviewCount})</span>
          </div>
        </div>

        <Link href={`/hunt/${id}`} className="block mt-3">
          <Button variant="default" size="sm" className="w-full">
            View Hunt
          </Button>
        </Link>
      </div>
    </div>
  )
}
