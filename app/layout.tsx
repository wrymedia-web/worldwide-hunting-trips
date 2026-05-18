import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-wht-paper">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
