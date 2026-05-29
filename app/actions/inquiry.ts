'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface InquiryInput {
  huntId: string | null
  outfitterId: string | null
  name: string
  email: string
  phone?: string
  message: string
  preferredDates?: string
  partySize?: number
}

export async function submitInquiry(
  input: InquiryInput
): Promise<{ error: string | null }> {
  const name = input.name?.trim()
  const email = input.email?.trim()
  const message = input.message?.trim()

  if (!name || !email || !message) {
    return { error: 'Name, email, and a message are required.' }
  }
  if (!input.outfitterId) {
    return { error: 'This is an example listing — inquiries open once real outfitters are live.' }
  }

  // Attach the hunter's profile id when they're signed in (inquiries are also allowed
  // from logged-out visitors, so this is optional).
  let hunterProfileId: string | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    hunterProfileId = data.user?.id ?? null
  } catch {
    hunterProfileId = null
  }

  const admin = createAdminClient()
  const { error } = await admin.from('inquiries').insert({
    hunt_id: input.huntId,
    outfitter_id: input.outfitterId,
    hunter_profile_id: hunterProfileId,
    hunter_name: name,
    hunter_email: email,
    hunter_phone: input.phone?.trim() || null,
    message,
    preferred_dates: input.preferredDates?.trim() || null,
    party_size: input.partySize && input.partySize > 0 ? input.partySize : 1,
  })

  if (error) return { error: error.message }
  return { error: null }
}
