'use client'

import Link from 'next/link'
import { Star, MapPin, Phone, Mail, Globe, CheckCircle, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { HuntCard } from '@/components/hunt-card'
import { InquiryForm } from '@/components/inquiry-form'
import type { OutfitterDetail } from '@/lib/listings'

interface Props {
  outfitter: OutfitterDetail
  isExample: boolean
}

export default function OutfitterDetailClient({ outfitter, isExample }: Props) {
  const initial = outfitter.name.charAt(0).toUpperCase()

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
              {initial}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-wht-forest tracking-tight">
                  {outfitter.name}
                </h1>
                {isExample && (
                  <span className="inline-flex items-center rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-900 uppercase tracking-wide shadow">
                    Example
                  </span>
                )}
                {!isExample && outfitter.verified && <Badge variant="copper">Verified</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {outfitter.state && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {outfitter.state}
                  </span>
                )}
                {outfitter.yearsInBusiness ? (
                  <span>{outfitter.yearsInBusiness} years in business</span>
                ) : null}
                {outfitter.reviewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-wht-blaze fill-wht-blaze" />
                    <span className="font-bold text-wht-ink">{outfitter.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({outfitter.reviewCount})</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-16">
          {/* Main */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* About */}
            {outfitter.about && (
              <section>
                <h2 className="text-xl font-bold text-wht-forest mb-4">About</h2>
                <div className="bg-white rounded-xl p-6 border border-wht-bone-2">
                  {outfitter.about.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed text-sm mb-3 last:mb-0">{para}</p>
                  ))}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-wht-bone-2">
                    {outfitter.licensed && (
                      <span className="flex items-center gap-1 text-xs text-wht-stone font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Licensed
                      </span>
                    )}
                    {outfitter.bonded && (
                      <span className="flex items-center gap-1 text-xs text-wht-stone font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Bonded
                      </span>
                    )}
                    {outfitter.yearsInBusiness ? (
                      <span className="flex items-center gap-1 text-xs text-wht-stone font-medium">
                        <Calendar className="h-3.5 w-3.5" /> {outfitter.yearsInBusiness} Years Experience
                      </span>
                    ) : null}
                  </div>
                </div>
              </section>
            )}

            {/* Species */}
            {outfitter.species.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-wht-forest mb-4">Species We Guide For</h2>
                <div className="flex flex-wrap gap-2">
                  {outfitter.species.map((s) => (
                    <Link key={s} href={`/species/${s.toLowerCase().replace(/ /g, '-')}`}>
                      <Badge variant="warm" className="text-sm px-3 py-1 cursor-pointer hover:bg-wht-blaze hover:text-white transition-colors">
                        {s}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Hunt Listings */}
            <section>
              <h2 className="text-xl font-bold text-wht-forest mb-4">Hunt Packages</h2>
              {outfitter.hunts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {outfitter.hunts.map((hunt) => (
                    <HuntCard key={hunt.id} {...hunt} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center text-sm text-wht-stone">
                  This outfitter hasn&apos;t published any hunt packages yet.
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-xl font-bold text-wht-forest mb-4">
                Reviews
                {outfitter.reviewCount > 0 && (
                  <span className="text-base font-normal text-gray-500 ml-2">({outfitter.reviewCount})</span>
                )}
              </h2>
              {outfitter.reviews.length > 0 ? (
                <div className="space-y-4">
                  {outfitter.reviews.map((review, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-wht-bone-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-wht-forest">{review.reviewer}</div>
                          <div className="text-xs text-gray-500">
                            {review.fromState ? `${review.fromState} · ` : ''}{review.date}
                          </div>
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
              ) : (
                <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center text-sm text-wht-stone">
                  No reviews yet — be the first to hunt with {outfitter.name}.
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: Contact */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-wht-bone-2 p-6 sticky top-24 shadow-sm">
              <h3 className="font-bold text-wht-forest text-lg mb-4">Send an Inquiry</h3>

              <InquiryForm
                huntId={null}
                outfitterId={isExample ? null : outfitter.id}
                outfitterName={outfitter.name}
                isExample={isExample}
                submitLabel="Send Inquiry"
              />

              {(outfitter.phone || outfitter.email || outfitter.website) && (
                <div className="mt-5 pt-5 border-t border-wht-bone-2 space-y-2">
                  {outfitter.phone && (
                    <a href={`tel:${outfitter.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-wht-forest transition-colors">
                      <Phone className="h-4 w-4 text-wht-blaze" /> {outfitter.phone}
                    </a>
                  )}
                  {outfitter.email && (
                    <a href={`mailto:${outfitter.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-wht-forest transition-colors">
                      <Mail className="h-4 w-4 text-wht-blaze" /> {outfitter.email}
                    </a>
                  )}
                  {outfitter.website && (
                    <a href={outfitter.website.startsWith('http') ? outfitter.website : `https://${outfitter.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-wht-forest transition-colors">
                      <Globe className="h-4 w-4 text-wht-blaze" /> {outfitter.website}
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
