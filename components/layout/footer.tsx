import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-wht-ink text-wht-fog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <Image
                src="/logos/logo-stacked-bone.svg"
                alt="Worldwide Hunting Trips"
                width={140}
                height={80}
                className="w-32 h-auto"
              />
            </div>
            <p className="text-sm text-wht-fog leading-relaxed">
              The largest hunting outfitter marketplace in America.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-wht-bone font-semibold text-sm mb-4 uppercase tracking-wider font-mono">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse" className="hover:text-wht-blaze transition-colors">Browse Hunts</Link></li>
              <li><Link href="/outfitters" className="hover:text-wht-blaze transition-colors">Browse Outfitters</Link></li>
              <li><Link href="/states" className="hover:text-wht-blaze transition-colors">Browse by State</Link></li>
              <li><Link href="/species" className="hover:text-wht-blaze transition-colors">Browse by Species</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-wht-bone font-semibold text-sm mb-4 uppercase tracking-wider font-mono">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-wht-blaze transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-wht-blaze transition-colors">Contact</Link></li>
              <li><Link href="/signup?type=outfitter" className="hover:text-wht-blaze transition-colors">List Your Outfitter</Link></li>
            </ul>
          </div>

          {/* Outfitters */}
          <div>
            <h4 className="text-wht-bone font-semibold text-sm mb-4 uppercase tracking-wider font-mono">Outfitters</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/signup?type=outfitter" className="hover:text-wht-blaze transition-colors">Get Listed Free</Link></li>
              <li><Link href="/dashboard/outfitter" className="hover:text-wht-blaze transition-colors">Outfitter Dashboard</Link></li>
            </ul>
            <div className="mt-6 p-3 bg-wht-ink-2 rounded-lg border border-wht-forest">
              <p className="text-xs text-wht-blaze font-semibold mb-1">$0 Booking Fees — Ever</p>
              <p className="text-xs text-wht-fog">Keep 100% of your booking revenue.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-wht-ink-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wht-stone">
          <p>&copy; {new Date().getFullYear()} Worldwide Hunting Trips. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-wht-fog transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-wht-fog transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
