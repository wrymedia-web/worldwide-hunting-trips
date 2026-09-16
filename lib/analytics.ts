import { createAdminClient } from '@/lib/supabase/admin'
import type { OutfitterRecord } from '@/app/actions/outfitter'
import type { OutfitterInquiry } from '@/app/actions/outfitter-inquiries'

/** Record a public page view for an outfitter profile or hunt listing.
 *  Never throws — analytics must not break page rendering. Also degrades
 *  silently while the page_views migration hasn't been applied yet. */
export async function recordPageView(
  outfitterId: string,
  huntId?: string | null
): Promise<void> {
  try {
    const admin = createAdminClient()
    await admin.from('page_views').insert({ outfitter_id: outfitterId, hunt_id: huntId ?? null })
  } catch {
    // ignore
  }
}

export interface OutfitterAnalytics {
  totalViews: string
  monthViews: string
  responseRate: string
  conversion: string
  avgResponse: string
  completeness: string
}

const DASH = '—'

/** Display-ready analytics for the outfitter dashboard. View counts show a
 *  dash until the page_views table exists and has data flowing. */
export async function getOutfitterAnalytics(
  outfitter: OutfitterRecord,
  inquiries: OutfitterInquiry[]
): Promise<OutfitterAnalytics> {
  let totalViews: number | null = null
  let monthViews: number | null = null

  try {
    const admin = createAdminClient()
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const [totalRes, monthRes] = await Promise.all([
      admin
        .from('page_views')
        .select('id', { count: 'exact', head: true })
        .eq('outfitter_id', outfitter.id),
      admin
        .from('page_views')
        .select('id', { count: 'exact', head: true })
        .eq('outfitter_id', outfitter.id)
        .gte('viewed_at', monthStart.toISOString()),
    ])

    if (!totalRes.error) totalViews = totalRes.count ?? 0
    if (!monthRes.error) monthViews = monthRes.count ?? 0
  } catch {
    // table not there yet — leave nulls
  }

  // Response rate: share of inquiries that have been replied to (or moved past new/read).
  const responded = inquiries.filter(
    (i) => i.replied_at || i.status === 'replied' || i.status === 'booked' || i.status === 'declined'
  ).length
  const responseRate =
    inquiries.length > 0 ? `${Math.round((responded / inquiries.length) * 100)}%` : DASH

  // Conversion: inquiries per view.
  const conversion =
    totalViews && totalViews > 0
      ? `${((inquiries.length / totalViews) * 100).toFixed(1)}%`
      : DASH

  // Average time from inquiry to reply.
  const responseTimes = inquiries
    .filter((i) => i.replied_at)
    .map((i) => new Date(i.replied_at as string).getTime() - new Date(i.created_at).getTime())
    .filter((ms) => Number.isFinite(ms) && ms > 0)
  let avgResponse = DASH
  if (responseTimes.length > 0) {
    const avgMs = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const hours = avgMs / 3_600_000
    avgResponse = hours < 1 ? '<1h' : hours < 48 ? `${Math.round(hours)}h` : `${(hours / 24).toFixed(1)}d`
  }

  // Profile completeness across the fields shown on the public profile.
  const fields = [
    outfitter.description,
    outfitter.phone,
    outfitter.email,
    outfitter.website,
    outfitter.years_in_business,
    outfitter.logo_url,
  ]
  const filled = fields.filter((f) => f !== null && f !== undefined && String(f).trim() !== '').length
  const completeness = `${Math.round((filled / fields.length) * 100)}%`

  return {
    totalViews: totalViews === null ? DASH : String(totalViews),
    monthViews: monthViews === null ? DASH : String(monthViews),
    responseRate,
    conversion,
    avgResponse,
    completeness,
  }
}
