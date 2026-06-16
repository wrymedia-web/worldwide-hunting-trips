import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: {
    default: 'Worldwide Hunting Trips',
    template: '%s | Worldwide Hunting Trips',
  },
  description:
    'The largest hunting outfitter marketplace in America. Browse thousands of hunts by species, state, and budget.',
  keywords: ['hunting trips', 'hunting outfitters', 'elk hunting', 'deer hunting', 'guided hunts'],
  icons: {
    icon: '/logos/favicon.svg',
    apple: '/logos/app-icon.svg',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: 'hunter' | 'outfitter' | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    role = (profile?.role as 'hunter' | 'outfitter' | undefined) ?? null
  }

  const navUser = user
    ? {
        email: user.email ?? '',
        dashboardHref: role === 'outfitter' ? '/dashboard/outfitter' : '/dashboard/hunter',
      }
    : null

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-wht-paper">
        <Navbar user={navUser} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
