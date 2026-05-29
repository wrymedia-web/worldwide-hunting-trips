'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/browse', label: 'Browse Hunts' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/hunt-customizer', label: 'Hunt Customizer' },
  { href: '/outfitters', label: 'Outfitters' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-wht-forest text-wht-bone sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logos/logo-horizontal-bone.svg"
              alt="Worldwide Hunting Trips"
              width={220}
              height={44}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-wht-bone hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline-bone" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup?type=outfitter">
              <Button variant="default" size="sm">
                List Your Hunt
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-wht-bone hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-wht-forest border-t border-wht-bone/20">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-sm text-wht-bone hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-wht-bone/20 mt-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline-bone" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/signup?type=outfitter" onClick={() => setMobileOpen(false)}>
                <Button variant="default" size="sm" className="w-full">
                  List Your Hunt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
