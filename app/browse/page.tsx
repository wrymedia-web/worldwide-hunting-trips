import { getActiveListings } from '@/lib/listings'
import { BrowseClient } from './browse-client'

export default async function BrowsePage() {
  const hunts = await getActiveListings()
  return <BrowseClient hunts={hunts} />
}
