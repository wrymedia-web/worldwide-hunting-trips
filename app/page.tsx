import Link from 'next/link'
import { ArrowRight, CheckCircle, MessageSquare, DollarSign, Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HuntCard } from '@/components/hunt-card'
import { SearchBar } from '@/components/search-bar'
import { mockHunts } from '@/lib/mock-data'

const featuredHunts = mockHunts.slice(0, 6)

const featuredSpecies = [
  { name: 'Whitetail Deer', emoji: '🦌', slug: 'whitetail-deer', count: 482 },
  { name: 'Elk', emoji: '🫎', slug: 'elk', count: 267 },
  { name: 'Mule Deer', emoji: '🦌', slug: 'mule-deer', count: 198 },
  { name: 'Black Bear', emoji: '🐻', slug: 'black-bear', count: 143 },
  { name: 'Pronghorn', emoji: '🦌', slug: 'pronghorn-antelope', count: 89 },
  { name: 'Turkey', emoji: '🦃', slug: 'turkey', count: 211 },
  { name: 'Wild Boar', emoji: '🐗', slug: 'wild-boar', count: 176 },
  { name: 'Moose', emoji: '🫎', slug: 'moose', count: 54 },
]

const topStates = [
  { name: 'Montana', slug: 'montana', count: 187, emoji: '🏔️' },
  { name: 'Wyoming', slug: 'wyoming', count: 163, emoji: '🏔️' },
  { name: 'Colorado', slug: 'colorado', count: 201, emoji: '🏔️' },
  { name: 'Texas', slug: 'texas', count: 312, emoji: '⭐' },
  { name: 'Kansas', slug: 'kansas', count: 143, emoji: '🌾' },
  { name: 'Missouri', slug: 'missouri', count: 167, emoji: '🌲' },
  { name: 'Idaho', slug: 'idaho', count: 122, emoji: '🏔️' },
  { name: 'Alaska', slug: 'alaska', count: 98, emoji: '🌲' },
  { name: 'New Mexico', slug: 'new-mexico', count: 89, emoji: '🌵' },
  { name: 'Arizona', slug: 'arizona', count: 76, emoji: '🌵' },
]

const stats = [
  { label: 'Outfitters Listed', value: '500+' },
  { label: 'Hunt Packages', value: '2,400+' },
  { label: 'States Covered', value: '48' },
  { label: 'Booking Fees — Ever', value: '$0' },
]

const howItWorks = [
  {
    step: '01',
    icon: <Search className="h-7 w-7 text-wht-blaze" />,
    title: 'Search & Discover',
    description: 'Browse thousands of hunts by species, state, weapon type, and budget. Filter to find exactly what you\'re looking for.',
  },
  {
    step: '02',
    icon: <MessageSquare className="h-7 w-7 text-wht-blaze" />,
    title: 'Connect Directly',
    description: 'Message outfitters directly — zero middlemen, zero booking fees. Get real answers from the people who know the land.',
  },
  {
    step: '03',
    icon: <DollarSign className="h-7 w-7 text-wht-blaze" />,
    title: 'Book Your Hunt',
    description: 'Work directly with your outfitter. 100% of your money goes to them — no platform fees, no hidden charges.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-wht-forest overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-wht-ink via-wht-forest to-wht-forest opacity-90" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-wht-blaze/20 border border-wht-blaze/40 rounded-full px-4 py-1.5 mb-6">
              <Star className="h-3.5 w-3.5 text-wht-blaze fill-wht-blaze" />
              <span className="text-wht-bone text-xs font-semibold tracking-wide uppercase font-mono">
                Trusted by 500+ Outfitters Nationwide
              </span>
            </div>

            <h1 className="text-7xl md:text-9xl font-display text-wht-bone tracking-tight mb-6 leading-none uppercase">
              Find Your{' '}
              <span className="text-wht-blaze">Next Hunt.</span>
            </h1>

            <p className="text-lg sm:text-xl text-wht-fog max-w-2xl mx-auto mb-10 leading-relaxed font-body">
              Connect directly with trusted hunting outfitters across the United States.
              No booking fees. No middlemen. Just you and the hunt.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/browse">
                <Button variant="default" size="xl" className="w-full sm:w-auto">
                  Browse Hunts
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup?type=outfitter">
                <Button variant="outline-bone" size="xl" className="w-full sm:w-auto">
                  List Your Outfitter
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-wht-ink py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-display text-wht-blaze">{stat.value}</div>
                <div className="text-xs sm:text-sm text-wht-fog mt-1 font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hunts */}
      <section className="py-16 bg-wht-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heritage text-wht-ink tracking-tight">Featured Hunts</h2>
              <p className="text-wht-stone mt-1 font-body">Hand-picked top-rated hunting opportunities</p>
            </div>
            <Link href="/browse" className="hidden sm:flex items-center gap-1 text-wht-blaze font-semibold hover:underline text-sm">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHunts.map((hunt) => (
              <HuntCard key={hunt.id} {...hunt} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/browse">
              <Button variant="outline">View All Hunts</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heritage text-wht-ink tracking-tight">How It Works</h2>
            <p className="text-wht-stone mt-2 font-body">Book your dream hunt in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-wht-paper border-2 border-wht-bone-2 mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-mono text-wht-blaze tracking-widest uppercase mb-2">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-heritage text-wht-ink mb-3">{step.title}</h3>
                <p className="text-wht-stone leading-relaxed text-sm font-body">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Species */}
      <section className="py-16 bg-wht-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heritage text-wht-ink tracking-tight">Browse by Species</h2>
              <p className="text-wht-stone mt-1 font-body">Find hunts for the game you&apos;re after</p>
            </div>
            <Link href="/species" className="hidden sm:flex items-center gap-1 text-wht-blaze font-semibold hover:underline text-sm">
              All species <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {featuredSpecies.map((s) => (
              <Link
                key={s.slug}
                href={`/species/${s.slug}`}
                className="group bg-white rounded-xl p-4 text-center border border-wht-bone-2 hover:border-wht-blaze hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="text-xs font-semibold text-wht-ink group-hover:text-wht-blaze transition-colors leading-tight font-body">
                  {s.name}
                </div>
                <div className="text-xs text-wht-stone mt-0.5 font-mono">{s.count} hunts</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heritage text-wht-ink tracking-tight">Top Hunting States</h2>
              <p className="text-wht-stone mt-1 font-body">Explore hunts by location</p>
            </div>
            <Link href="/states" className="hidden sm:flex items-center gap-1 text-wht-blaze font-semibold hover:underline text-sm">
              All states <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {topStates.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="group bg-wht-paper rounded-xl p-4 text-center border border-wht-bone-2 hover:border-wht-blaze hover:bg-white hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-1">{state.emoji}</div>
                <div className="text-sm font-heritage text-wht-ink group-hover:text-wht-blaze transition-colors">
                  {state.name}
                </div>
                <div className="text-xs text-wht-stone mt-0.5 font-mono">{state.count} hunts</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Outfitters CTA */}
      <section className="py-20 bg-wht-forest">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-wht-blaze/20 border border-wht-blaze/40 rounded-full px-4 py-1.5 mb-6">
            <CheckCircle className="h-3.5 w-3.5 text-wht-blaze" />
            <span className="text-wht-bone text-xs font-mono font-semibold tracking-wide uppercase">
              Free Forever for Outfitters
            </span>
          </div>

          <h2 className="text-4xl font-heritage text-white tracking-tight mb-4">
            List Your Hunts for Free
          </h2>
          <p className="text-wht-bone text-lg leading-relaxed mb-4 max-w-2xl mx-auto font-body">
            Reach thousands of hunters nationwide. Create your outfitter profile, list your hunts,
            and connect directly with clients — completely free, with zero commissions.
          </p>
          <p className="text-wht-fog text-sm mb-8 font-body">
            No monthly fees. No booking commissions. No platform cuts. Ever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup?type=outfitter">
              <Button variant="default" size="xl">
                Get Listed Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/outfitters">
              <Button variant="outline-bone" size="xl">
                Browse Outfitters
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
