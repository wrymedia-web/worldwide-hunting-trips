'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Star, MapPin, Heart, Share2, CheckCircle, XCircle,
  Calendar, Trophy, Home, Utensils, FileText, Phone, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const mockHunt = {
  id: 'trophy-whitetail-missouri',
  title: 'Trophy Whitetail Deer Hunt',
  outfitterName: 'Heartland Trophy Outfitters',
  outfitterId: 'heartland-trophy',
  species: 'Whitetail Deer',
  state: 'Missouri',
  pricePerPerson: 1800,
  rating: 4.9,
  reviewCount: 47,
  weaponTypes: ['Rifle', 'Bow'],
  lodgingIncluded: true,
  mealsIncluded: true,
  guideType: 'Fully Guided',
  duration: 5,
  maxHunters: 4,
  successRate: 78,
  trophyClass: 'Trophy',
  seasonStart: 'November 1',
  seasonEnd: 'December 15',
  landType: 'Private',
  licenseRequired: true,
  isOTC: true,
  description: `Experience the finest whitetail deer hunting Missouri has to offer on our 3,200-acre private ranch nestled in the heart of the Ozark hills. Our carefully managed property produces consistent trophy-class bucks year after year, with multiple deer scoring above 150" harvested each season.

We've spent 18 years perfecting our habitat management program — strategic food plots, native cover enhancement, and a strict age-based harvest philosophy ensure you're hunting some of the most mature bucks in the state. Whether you prefer sitting in a ladder stand over a clover field at first light or stillhunting the thick timber midday, we have the setup to match your hunting style.`,
  included: [
    '5-day guided hunt on 3,200 acres of private land',
    'Comfortable lodge accommodations (private room)',
    'All meals — breakfast, lunch, and dinner',
    'Field care and processing assistance',
    'Trophy photos',
    '24/7 access to guide',
    'Stand placement and strategy consultation',
  ],
  notIncluded: [
    'Missouri non-resident deer license (~$175)',
    'Transportation to/from ranch',
    'Taxidermy',
    'Gratuity (customary)',
  ],
  packages: [
    { name: 'Rifle Hunt', days: 5, price: 1800, description: 'November 1–15 or December 1–15 rifle seasons' },
    { name: 'Archery Hunt', days: 7, price: 1500, description: 'October archery season — best rut activity' },
    { name: 'Muzzleloader Hunt', days: 5, price: 1650, description: 'Late October muzzleloader season' },
  ],
  reviews: [
    {
      reviewer: 'Mike D.',
      state: 'Illinois',
      rating: 5,
      date: 'November 2024',
      year: 2024,
      species: 'Whitetail Deer',
      text: 'Incredible experience from start to finish. Shot a 162" 10-pointer on day 3. The lodge is first-class, food was outstanding, and the guides knew every inch of the property. Already booked again for next year.',
    },
    {
      reviewer: 'Jason T.',
      state: 'Ohio',
      rating: 5,
      date: 'December 2024',
      year: 2024,
      species: 'Whitetail Deer',
      text: 'My third trip with Heartland and they just keep getting better. Saw 20+ bucks in 5 days. Passed on several 130-140" deer and connected on a giant on day 4. These guys are true professionals.',
    },
    {
      reviewer: 'Robert K.',
      state: 'Indiana',
      rating: 4,
      date: 'November 2023',
      year: 2023,
      species: 'Whitetail Deer',
      text: 'Awesome hunting property and great hospitality. Didn\'t connect on a shooter this time — that\'s hunting — but saw quality deer every single day. The guide was encouraging and never gave up. I\'ll be back.',
    },
  ],
}

const tabs = ['Overview', 'Pricing', 'Details', 'Reviews']

export default function HuntDetailPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [saved, setSaved] = useState(false)

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Hero Image */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[560px] bg-gradient-to-br from-wht-forest to-wht-ink overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center opacity-30">
            <div className="text-[12rem] leading-none">🦌</div>
          </div>
        </div>
        {/* Thumbnail strip */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-16 h-12 rounded-md bg-white/20 border-2 border-white/40 cursor-pointer hover:border-white transition-colors"
            />
          ))}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className="bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors"
          >
            <Heart className={`h-5 w-5 ${saved ? 'fill-red-500 text-red-500' : 'text-wht-stone'}`} />
          </button>
          <button className="bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors">
            <Share2 className="h-5 w-5 text-wht-stone" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="default">{mockHunt.species}</Badge>
                <Badge variant="state">{mockHunt.state}</Badge>
                <Badge variant="secondary">{mockHunt.guideType}</Badge>
                {mockHunt.lodgingIncluded && <Badge variant="secondary">Lodging Included</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-heritage text-wht-ink tracking-tight mb-2">
                {mockHunt.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-wht-stone">
                <Link href={`/outfitter/${mockHunt.outfitterId}`} className="font-semibold text-wht-forest hover:text-wht-blaze transition-colors">
                  {mockHunt.outfitterName}
                </Link>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {mockHunt.state}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-wht-blaze fill-wht-blaze" />
                  <span className="font-semibold text-wht-ink">{mockHunt.rating}</span>
                  <span className="text-wht-stone">({mockHunt.reviewCount} reviews)</span>
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-wht-bone-2 mb-6">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-wht-blaze text-wht-blaze'
                        : 'border-transparent text-wht-stone hover:text-wht-ink'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-heritage text-wht-ink mb-3">About This Hunt</h2>
                  {mockHunt.description.split('\n\n').map((para, i) => (
                    <p key={i} className="text-wht-stone leading-relaxed mb-3 text-sm font-body">{para}</p>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-heritage text-wht-ink mb-3">What&apos;s Included</h3>
                    <ul className="space-y-2">
                      {mockHunt.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-wht-stone font-body">
                          <CheckCircle className="h-4 w-4 text-wht-blaze flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-base font-heritage text-wht-ink mb-3">Not Included</h3>
                    <ul className="space-y-2">
                      {mockHunt.notIncluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-wht-stone font-body">
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Pricing' && (
              <div>
                <h2 className="text-lg font-heritage text-wht-ink mb-4">Hunt Packages</h2>
                <div className="space-y-4">
                  {mockHunt.packages.map((pkg, i) => (
                    <div key={i} className={`rounded-xl border-2 p-5 ${i === 0 ? 'border-wht-blaze bg-wht-blaze/5' : 'border-wht-bone-2 bg-white'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heritage text-wht-ink">{pkg.name}</h3>
                            {i === 0 && <Badge variant="default" className="text-xs">Most Popular</Badge>}
                          </div>
                          <p className="text-sm text-wht-stone mb-1 font-body">{pkg.description}</p>
                          <p className="text-xs text-wht-fog font-mono">{pkg.days} days / person</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-display text-wht-blaze">${pkg.price.toLocaleString()}</div>
                          <div className="text-xs text-wht-stone font-mono">per person</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Details' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Calendar className="h-5 w-5 text-wht-blaze" />, label: 'Season', value: `${mockHunt.seasonStart} – ${mockHunt.seasonEnd}` },
                  { icon: <Trophy className="h-5 w-5 text-wht-blaze" />, label: 'Trophy Class', value: mockHunt.trophyClass },
                  { icon: <CheckCircle className="h-5 w-5 text-wht-blaze" />, label: 'Success Rate', value: `${mockHunt.successRate}%` },
                  { icon: <Home className="h-5 w-5 text-wht-blaze" />, label: 'Lodging', value: mockHunt.lodgingIncluded ? 'Included' : 'Not Included' },
                  { icon: <Utensils className="h-5 w-5 text-wht-blaze" />, label: 'Meals', value: mockHunt.mealsIncluded ? 'Included' : 'Not Included' },
                  { icon: <FileText className="h-5 w-5 text-wht-blaze" />, label: 'License', value: mockHunt.isOTC ? 'OTC Available' : 'Draw Required' },
                  { icon: <MapPin className="h-5 w-5 text-wht-blaze" />, label: 'Land Type', value: mockHunt.landType },
                  { icon: <Star className="h-5 w-5 text-wht-blaze" />, label: 'Guide Type', value: mockHunt.guideType },
                  { icon: <CheckCircle className="h-5 w-5 text-wht-blaze" />, label: 'Max Hunters', value: `${mockHunt.maxHunters} per group` },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-wht-bone-2">
                    <div className="mb-2">{item.icon}</div>
                    <div className="text-xs text-wht-fog font-mono uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-semibold text-wht-ink mt-1 font-body">{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-display text-wht-ink">{mockHunt.rating}</div>
                    <div className="flex gap-0.5 justify-center my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 text-wht-blaze fill-wht-blaze" />
                      ))}
                    </div>
                    <div className="text-sm text-wht-stone font-mono">{mockHunt.reviewCount} reviews</div>
                  </div>
                </div>

                <div className="space-y-5">
                  {mockHunt.reviews.map((review, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-wht-bone-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-wht-ink font-body">{review.reviewer}</div>
                          <div className="text-xs text-wht-stone font-mono">{review.state} · {review.date}</div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${s <= review.rating ? 'text-wht-blaze fill-wht-blaze' : 'text-wht-bone-2'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-wht-stone leading-relaxed font-body">{review.text}</p>
                      {review.species && (
                        <div className="mt-2">
                          <Badge variant="state" className="text-xs">Harvested: {review.species}</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-wht-bone-2 p-6 sticky top-24 shadow-sm">
              <div className="text-center mb-5 pb-5 border-b border-wht-bone-2">
                <div className="text-4xl font-display text-wht-blaze">
                  ${mockHunt.pricePerPerson.toLocaleString()}
                </div>
                <div className="text-sm text-wht-stone font-mono">per person</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-4 w-4 text-wht-blaze fill-wht-blaze" />
                  <span className="font-bold text-wht-ink">{mockHunt.rating}</span>
                  <span className="text-wht-stone text-sm font-mono">({mockHunt.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Outfitter info */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-wht-forest flex items-center justify-center text-wht-bone font-bold text-lg font-display">
                    H
                  </div>
                  <div>
                    <div className="font-semibold text-wht-ink text-sm font-body">{mockHunt.outfitterName}</div>
                    <div className="text-xs text-wht-stone font-mono">Responds within 24 hours</div>
                  </div>
                </div>
                <div className="text-xs text-wht-stone space-y-1 font-body">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-wht-blaze" />
                    Licensed &amp; Insured
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-wht-blaze" />
                    18 years in business
                  </div>
                </div>
              </div>

              <Link href={`/outfitter/${mockHunt.outfitterId}?contact=true`}>
                <Button variant="default" className="w-full mb-3 gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Outfitter
                </Button>
              </Link>
              <Link href={`/outfitter/${mockHunt.outfitterId}?contact=true`}>
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Send Inquiry
                </Button>
              </Link>

              <p className="text-center text-xs text-wht-fog mt-4 font-mono">
                No booking fees. You pay the outfitter directly.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
