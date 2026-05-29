import { getListingDetailView, HuntDetailView } from '@/lib/listings'
import { isHuntSaved } from '@/app/actions/hunter'
import { mockHunts } from '@/lib/mock-data'
import type { HuntCardProps } from '@/components/hunt-card'
import HuntDetailClient from './hunt-detail-client'

interface PageProps {
  params: Promise<{ id: string }>
}

function guideLabel(value: HuntCardProps['guideType']): string {
  switch (value) {
    case 'semi_guided': return 'Semi-Guided'
    case 'self_guided': return 'Self-Guided'
    default: return 'Fully Guided'
  }
}

function mockToDetailView(slug: string): HuntDetailView {
  const mock = mockHunts.find((h) => h.id === slug) ?? mockHunts[0]
  return {
    slug: mock.id,
    huntId: null,
    title: mock.title,
    outfitterName: mock.outfitterName,
    outfitterSlug: null,
    outfitterId: null,
    species: [mock.species],
    state: mock.state,
    country: 'USA',
    pricePerPerson: mock.pricePerPerson,
    priceType: mock.priceType,
    rating: mock.rating,
    reviewCount: mock.reviewCount,
    lodgingIncluded: mock.lodgingIncluded,
    mealsIncluded: false,
    guideType: guideLabel(mock.guideType),
    duration: null,
    maxHunters: null,
    successRate: null,
    seasonStart: null,
    seasonEnd: null,
    landType: null,
    weaponTypes: mock.weaponTypes,
    description: `${mock.title} offered by ${mock.outfitterName} in ${mock.state}. Contact the outfitter for full details on dates, accommodations, and availability.`,
    imageUrl: mock.imageUrl,
    priceIncludes: ['Fully Guided', 'Field Dressing'],
    priceExcludes: ['Tags / Licenses', 'Travel & Airfare', 'Gratuities'],
    reviews: [],
    dangerousGame: false,
    isExample: true,
  }
}

export default async function HuntDetailPage({ params }: PageProps) {
  const { id } = await params

  const view = await getListingDetailView(id)
  const hunt: HuntDetailView = view ?? mockToDetailView(id)

  const initiallySaved = hunt.huntId ? await isHuntSaved(hunt.huntId) : false

  return <HuntDetailClient hunt={hunt} initiallySaved={initiallySaved} />
}
