'use server'

import { createClient } from '@/lib/supabase/server'

export async function createProfile(
  userId: string,
  role: 'hunter' | 'outfitter',
  email: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()

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
