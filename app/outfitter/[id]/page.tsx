'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Phone, Mail, Globe, CheckCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { HuntCard } from '@/components/hunt-card'
import { mockHunts } from '@/lib/mock-data'

const mockOutfitter = {
  id: 'heartland-trophy',
  name: 'Heartland Trophy Outfitters',
  state: 'Missouri',
  yearsInBusiness: 18,
  rating: 4.9,
  reviewCount: 124,
  phone: '(573) 555-0182',
  email: 'info@heartlandtrophy.com',
  website: 'www.heartlandtrophy.com',
  verified: true,
  licensed: true,
  bonded: true,
  about: `Heartland Trophy Outfitters has been guiding hunters to world-class trophy whitetail deer in the Missouri Ozarks for over 18 years. Founded by lifelong hunter and conservationist Jake Brennan, our operation is built on a simple philosophy: manage the land right, build real relationships with our clients, and let the deer do the rest.

Our 3,200-acre private ranch features carefully managed habitat including strategically planted food plots, native timber, and creek bottoms that provide year-round nutrition and security for our deer herd. We take pride in our age-based harvest philosophy — we pass on deer under 4.5 years old, ensuring our hunters have genuine trophy opportunities every season.

We host a limited number of hunters each year to ensure quality experiences and maintain the hunting pressure our herd needs to thrive. You're not just buying a hunt — you're joining a small, tight-knit community of hunters who love the land as much as we do.`,
  species: ['Whitetail Deer', 'Turkey', 'Wild Boar'],
  responseTime: 'Within 24 hours',
}

const outfitterHunts = mockHunts.filter((h) =>
  h.outfitterName === 'Heartland Trophy Outfitters'
).slice(0, 4)

const fallbackHunts = mockHunts.slice(0, 4)

const reviews = [
  {
    reviewer: 'Mike D.',
    fromState: 'Illinois',
    rating: 5,
    date: 'November 2024',
    text: 'Heartland is the real deal. Third trip, third trophy buck. Jake and his crew treat you like family from the moment you arrive. The lodge is nicer than my house.',
  },
  {
    reviewer: 'Chris W.',
    fromState: 'Texas',
    rating: 5,
    date: 'October 2024',
    text: 'Booked on a recommendation and could not be more satisfied. Shot a 158" 12-pointer on morning of day 2. The property is absolutely loaded with quality deer.',
  },
  {
    reviewer: 'Dave L.',
    fromState: 'Indiana',
    rating: 4,
    date: 'December 2023',
    text: 'Great operation. Didn\'t fill my tag this trip but saw incredible deer every single day. The guide was patient, knowledgeable, and never pressured me to shoot anything I wasn\'t confident in.',
  },
]

export default function OutfitterProfilePage() {
  const [inquiryForm, setInquiryForm] = useState({
    name: '', email: '', phone: '', message: '', dates: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const displayHunts = outfitterHunts.length > 0 ? outfitterHunts : fallbackHunts

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Hero Cover */}
      <div className="relative h-52 sm:h-72 bg-gradient-to-br from-wht-ink to-wht-forest overflow-hidden">
        <div className="absolute inset-0 opacity-20 flex items-center justify-center gap-16">
          <span className="text-[10rem]">🦌</span>
          <span className="text-[8rem]">🌲</span>
          <span className="text-[10rem]">🦃</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="relative -mt-12 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-wht-forest border-4 border-white shadow-lg flex items-center justify-center text-white font-extrabold text-3xl flex-shrink-0">
              H
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-wht-forest tracking-tight">
                  {mockOutfitter.name}
                </h1>
                {mockOutfitter.verified && (
                  <Badge variant="copper">Verified</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {mockOutfitter.state}
                </span>
                <span>{mockOutfitter.yearsInBusiness} years in business</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-wht-blaze fill-wht-blaze" />
                  <span className="font-bold text-wht-ink">{mockOutfitter.rating}</span>
                  <span className="text-gray-400">({mockOutfitter.reviewCount})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-16">
          {/* Main */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-xl font-bold text-wht-forest mb-4">About</h2>
              <div className="bg-white rounded-xl p-6 border border-wht-bone-2">
                {mockOutfitter.about.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed text-sm mb-3 last:mb-0">{para}</p>
                ))}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-wht-bone-2">
                  {mockOutfitter.licensed && (
                    <span className="flex items-center gap-1 text-xs text-wht-stone font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> Licensed
                    </span>
                  )}
                  {mockOutfitter.bonded && (
                    <span className="flex items-center gap-1 text-xs text-wht-stone font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> Bonded
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-wht-stone font-medium">
                    <Calendar className="h-3.5 w-3.5" /> {mockOutfitter.yearsInBusiness} Years Experience
                  </span>
                </div>
              </div>
            </section>

            {/* Species */}
            <section>
              <h2 className="text-xl font-bold text-wht-forest mb-4">Species We Guide For</h2>
              <div className="flex flex-wrap gap-2">
                {mockOutfitter.species.map((s) => (
                  <Link key={s} href={`/species/${s.toLowerCase().replace(/ /g, '-')}`}>
                    <Badge variant="warm" className="text-sm px-3 py-1 cursor-pointer hover:bg-wht-blaze hover:text-white transition-colors">
                      {s}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>

            {/* Hunt Listings */}
            <section>
              <h2 className="text-xl font-bold text-wht-forest mb-4">Hunt Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {displayHunts.map((hunt) => (
                  <HuntCard key={hunt.id} {...hunt} />
                ))}
              </div>
            </section>

            {/* Photo Gallery */}
            <section>
              <h2 className="text-xl font-bold text-wht-forest mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gradient-to-br from-wht-forest to-wht-stone flex items-center justify-center opacity-60"
                  >
                    <span className="text-2xl">🦌</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-xl font-bold text-wht-forest mb-4">
                Reviews
                <span className="text-base font-normal text-gray-500 ml-2">({mockOutfitter.reviewCount})</span>
              </h2>
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-wht-bone-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-wht-forest">{review.reviewer}</div>
                        <div className="text-xs text-gray-500">{review.fromState} · {review.date}</div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${s <= review.rating ? 'text-wht-blaze fill-wht-blaze' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Contact */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-wht-bone-2 p-6 sticky top-24 shadow-sm">
              <h3 className="font-bold text-wht-forest text-lg mb-4">Send an Inquiry</h3>

              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-wht-stone mx-auto mb-3" />
                  <h4 className="font-bold text-wht-forest mb-2">Inquiry Sent!</h4>
                  <p className="text-sm text-gray-600">
                    {mockOutfitter.name} will respond within {mockOutfitter.responseTime.toLowerCase()}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Your Name</label>
                    <Input
                      placeholder="John Smith"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                    <Input
                      type="email"
                      placeholder="you@email.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Phone</label>
                    <Input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Preferred Dates</label>
                    <Input
                      placeholder="e.g. November 2025"
                      value={inquiryForm.dates}
                      onChange={(e) => setInquiryForm(p => ({ ...p, dates: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Message</label>
                    <textarea
                      className="flex min-h-[90px] w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest focus:border-transparent"
                      placeholder="Tell the outfitter about your hunt goals, party size, weapon preference..."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm(p => ({ ...p, message: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" variant="copper" className="w-full">
                    Send Inquiry
                  </Button>
                </form>
              )}

              <div className="mt-5 pt-5 border-t border-wht-bone-2 space-y-2">
                <a href={`tel:${mockOutfitter.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-wht-forest transition-colors">
                  <Phone className="h-4 w-4 text-wht-blaze" /> {mockOutfitter.phone}
                </a>
                <a href={`mailto:${mockOutfitter.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-wht-forest transition-colors">
                  <Mail className="h-4 w-4 text-wht-blaze" /> {mockOutfitter.email}
                </a>
                <a href={`https://${mockOutfitter.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-wht-forest transition-colors">
                  <Globe className="h-4 w-4 text-wht-blaze" /> {mockOutfitter.website}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
