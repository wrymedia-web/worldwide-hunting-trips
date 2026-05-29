import { getActiveOutfitters } from '@/lib/listings'
import { OutfittersClient } from './outfitters-client'

export default async function OutfittersPage() {
  const outfitters = await getActiveOutfitters()
  return <OutfittersClient outfitters={outfitters} />
}
