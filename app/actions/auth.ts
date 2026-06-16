'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
