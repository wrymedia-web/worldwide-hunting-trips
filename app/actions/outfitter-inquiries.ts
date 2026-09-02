'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getOutfitterByUser } from './outfitter'

export interface OutfitterInquiry {
  id: string
  hunt_id: string | null
  outfitter_id: string
  hunter_name: string | null
  hunter_email: string | null
  hunter_phone: string | null
  message: string
  preferred_dates: string | null
  party_size: number | null
  status: 'new' | 'read' | 'replied' | 'booked' | 'declined'
  created_at: string
  read_at: string | null
  replied_at: string | null
  reply_message: string | null
  hunt_title: string | null
}

// Fetch every inquiry addressed to the signed-in outfitter, newest first.
export async function getOutfitterInquiries(): Promise<OutfitterInquiry[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const outfitter = await getOutfitterByUser(user.id)
  if (!outfitter) return []

  // Use the admin client so RLS doesn't hide inquiries created by logged-out
  // hunters when the outfitter reads them.
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('inquiries')
    .select(
      'id, hunt_id, outfitter_id, hunter_name, hunter_email, hunter_phone, message, preferred_dates, party_size, status, created_at, read_at, replied_at, reply_message, hunt_listings(title)'
    )
    .eq('outfitter_id', outfitter.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map((row: Record<string, unknown>) => {
    const listing = row.hunt_listings as { title: string } | null
    return {
      id: row.id as string,
      hunt_id: (row.hunt_id as string | null) ?? null,
      outfitter_id: row.outfitter_id as string,
      hunter_name: (row.hunter_name as string | null) ?? null,
      hunter_email: (row.hunter_email as string | null) ?? null,
      hunter_phone: (row.hunter_phone as string | null) ?? null,
      message: (row.message as string) ?? '',
      preferred_dates: (row.preferred_dates as string | null) ?? null,
      party_size: (row.party_size as number | null) ?? null,
      status: (row.status as OutfitterInquiry['status']) ?? 'new',
      created_at: row.created_at as string,
      read_at: (row.read_at as string | null) ?? null,
      replied_at: (row.replied_at as string | null) ?? null,
      reply_message: (row.reply_message as string | null) ?? null,
      hunt_title: listing?.title ?? null,
    }
  })
}

async function requireInquiryOwner(inquiryId: string): Promise<{ outfitterId: string; error: string | null }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { outfitterId: '', error: 'Not authenticated' }
  const outfitter = await getOutfitterByUser(user.id)
  if (!outfitter) return { outfitterId: '', error: 'Outfitter profile not found' }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('inquiries')
    .select('outfitter_id')
    .eq('id', inquiryId)
    .single()
  if (error || !data) return { outfitterId: '', error: 'Inquiry not found' }
  if (data.outfitter_id !== outfitter.id) return { outfitterId: '', error: 'Unauthorized' }
  return { outfitterId: outfitter.id, error: null }
}

export async function markInquiryRead(inquiryId: string): Promise<{ error: string | null }> {
  const { error: authErr } = await requireInquiryOwner(inquiryId)
  if (authErr) return { error: authErr }

  const admin = createAdminClient()
  // Only elevate 'new' → 'read'. Don't downgrade replied/booked/declined.
  const { data: current } = await admin
    .from('inquiries')
    .select('status')
    .eq('id', inquiryId)
    .single()
  const patch: Record<string, unknown> = { read_at: new Date().toISOString() }
  if (current?.status === 'new') patch.status = 'read'

  const { error } = await admin.from('inquiries').update(patch).eq('id', inquiryId)
  if (error) return { error: error.message }
  return { error: null }
}

export async function replyToInquiry(
  inquiryId: string,
  message: string
): Promise<{ error: string | null }> {
  const trimmed = message.trim()
  if (!trimmed) return { error: 'Reply cannot be empty.' }

  const { error: authErr } = await requireInquiryOwner(inquiryId)
  if (authErr) return { error: authErr }

  const admin = createAdminClient()
  const now = new Date().toISOString()
  const { error } = await admin
    .from('inquiries')
    .update({
      reply_message: trimmed,
      replied_at: now,
      read_at: now,
      status: 'replied',
    })
    .eq('id', inquiryId)

  if (error) return { error: error.message }
  return { error: null }
}
