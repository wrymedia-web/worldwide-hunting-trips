'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function createProfile(
  userId: string,
  role: 'hunter' | 'outfitter',
  email: string
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()

  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email,
      role,
    },
    { onConflict: 'id' }
  )

  if (error) return { error: error.message }
  return { error: null }
}
