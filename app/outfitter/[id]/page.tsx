import { getOutfitterBySlug, type OutfitterDetail } from '@/lib/listings'
import { mockOutfitters, mockHunts } from '@/lib/mock-data'
import OutfitterDetailClient from './outfitter-detail-client'

interface PageProps {
  params: Promise<{ id: string }>
}

function mockToOutfitterDetail(slug: string): OutfitterDetail {
  const mock = mockOutfitters.find((o) => o.id === slug) ?? mockOutfitters[0]
  const hunts = mockHunts.filter((h) => h.outfitterName === mock.name)
  return {
    id: mock.id,
    slug: mock.id,
    name: mock.name,
    state: mock.state,
    yearsInBusiness: mock.yearsInBusiness ?? null,
    rating: mock.rating,
    reviewCount: mock.reviewCount,
    phone: null,
    email: null,
    website: null,
    verified: mock.verified ?? false,
    licensed: true,
    bonded: false,
    about: `${mock.name} is a hunting outfitter based in ${mock.state}. This is an example profile — real outfitter profiles appear here once they join the platform.`,
    species: mock.species,
    hunts: hunts.length > 0 ? hunts : mockHunts.slice(0, 4),
    reviews: [],
  }
}

export default async function OutfitterProfilePage({ params }: PageProps) {
  const { id } = await params

  const detail = await getOutfitterBySlug(id)
  const outfitter = detail ?? mockToOutfitterDetail(id)

  return <OutfitterDetailClient outfitter={outfitter} isExample={!detail} />
}
