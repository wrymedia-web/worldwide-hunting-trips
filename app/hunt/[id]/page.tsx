'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Star, MapPin, Heart, Share2, CheckCircle, XCircle,
  Calendar, Home, Utensils, Mail, ChevronDown, ChevronUp,
  Fence, Crosshair, Mountain, Users, Ruler, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const mockHunt = {
  id: 'trophy-whitetail-missouri',
  title: 'Trophy Whitetail Deer Hunt',
  outfitterName: 'Heartland Trophy Outfitters',
  outfitterId: 'heartland-trophy',
  species: ['Whitetail Deer'],
  state: 'Missouri',
  country: 'USA',
  pricePerPerson: 1800,
  rating: 4.9,
  reviewCount: 47,
  lodgingIncluded: true,
  mealsIncluded: true,
  guideType: 'Fully Guided',
  duration: 5,
  maxHunters: 4,
  successRate: 78,
  seasonStart: 'November 1',
  seasonEnd: 'December 15',
  propertySize: '3,200 acres',
  description: `Experience the finest whitetail deer hunting Missouri has to offer on our 3,200-acre private ranch nestled in the heart of the Ozark hills. Our carefully managed property produces consistent trophy-class bucks year after year, with multiple deer scoring above 150" harvested each season.

We've spent 18 years perfecting our habitat management program — strategic food plots, native cover enhancement, and a strict age-based harvest philosophy ensure you're hunting some of the most mature bucks in the state.`,
  needToKnow: {
    seasonDates: 'November 1 – December 15',
    fenced: false,
    weaponTypes: ['Rifle', 'Bow'],
    huntingStyles: ['Tree Stand', 'Spot & Stalk'],
    baited: false,
    difficulty: 'Moderate',
    landType: 'Private',
    propertySize: '3,200 acres',
  },
  priceIncludes: [
    'Lodging (private room)', 'Meals (breakfast, lunch, dinner)', 'Fully Guided',
    'Field Dressing', 'Trophy Prep', 'Transportation During Hunt',
  ],
  priceExcludes: [
    'Tags / Licenses (~$175)', 'Airfare', 'Airport Transfer',
    'Taxidermy', 'Gratuities', 'Ammo',
  ],
  paymentTerms: {
    deposit: '30% deposit required to reserve your dates.',
    finalPayment: 'Balance due 30 days prior to hunt.',
    methods: 'Check, bank transfer, or major credit cards accepted.',
    cancellation: 'Deposits are non-refundable unless your requested dates cannot be accommodated. Cancellations within 60 days of hunt forfeit the full balance unless the dates can be resold.',
    rescheduling: 'Deposits may be transferred to a future available date within the same season with 90 days notice.',
  },
  qna: [
    {
      question: 'What is the shot opportunity percentage on this hunt?',
      answer: 'We typically have a 78% success rate on mature bucks scoring 130" or better. Hunters who pass on younger deer generally see the best results.',
    },
    {
      question: 'What will the weather be like and how do I need to pack?',
      answer: 'Missouri November temps range from 20°F to 60°F. Layering is essential. Pack quality cold-weather base layers, a mid-layer, and a waterproof outer shell. Rubber boots are recommended for scent control.',
    },
    {
      question: 'How do I get to the lodge/hunting area?',
      answer: 'The ranch is located 45 minutes south of Springfield, MO off Highway 160. Detailed directions provided upon booking. Springfield-Branson Regional Airport (SGF) is the closest commercial airport.',
    },
    {
      question: 'What is the process for obtaining a tag or license?',
      answer: 'Missouri non-resident deer tags are over-the-counter and can be purchased online at mdc.mo.gov or at any Walmart. We recommend purchasing before you arrive. Cost is approximately $175.',
    },
    {
      question: 'What is the terrain like?',
      answer: 'Rolling Ozark hardwood timber interspersed with open hay fields and established food plots. Moderate physical demand — most stands are within a 10-minute walk from the vehicle.',
    },
    {
      question: 'Are additional animals available to hunt?',
      answer: 'Wild turkey and coyote may be available during your stay at no additional charge. Ask at booking.',
    },
    {
      question: 'What are the accommodations like?',
      answer: 'The lodge sleeps up to 8 guests in private rooms with shared bathrooms. Full kitchen, common area with TV, and covered porch overlooking a food plot.',
    },
    {
      question: 'What if I am unsuccessful in harvesting my animal?',
      answer: 'Hunting is never guaranteed. We work hard to put you in front of quality deer every day, but we do not offer refunds for unsuccessful hunts. We will always offer a return trip discount.',
    },
  ],
  reviews: [
    {
      reviewer: 'Mike D.',
      state: 'Illinois',
      rating: 5,
      date: 'November 2024',
      species: 'Whitetail Deer',
      text: 'Incredible experience from start to finish. Shot a 162" 10-pointer on day 3. The lodge is first-class, food was outstanding, and the guides knew every inch of the property. Already booked again for next year.',
    },
    {
      reviewer: 'Jason T.',
      state: 'Ohio',
      rating: 5,
      date: 'December 2024',
      species: 'Whitetail Deer',
      text: 'My third trip with Heartland and they just keep getting better. Saw 20+ bucks in 5 days. Passed on several 130-140" deer and connected on a giant on day 4. These guys are true professionals.',
    },
    {
      reviewer: 'Robert K.',
      state: 'Indiana',
      rating: 4,
      date: 'November 2023',
      species: 'Whitetail Deer',
      text: "Awesome hunting property and great hospitality. Didn't connect on a shooter this time — that's hunting — but saw quality deer every single day. The guide was encouraging and never gave up. I'll be back.",
    },
  ],
}

const tabs = ['Overview', 'Need to Know', 'Pricing', 'Q&A', 'Reviews']

function QnaItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-wht-bone-2 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-wht-paper transition-colors"
      >
        <span className="text-sm font-semibold text-wht-ink font-body">{question}</span>
        {open ? <ChevronUp className="h-4 w-4 text-wht-stone flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-wht-stone flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-wht-paper border-t border-wht-bone-2">
          <p className="text-sm text-wht-stone leading-relaxed font-body">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function HuntDetailPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [saved, setSaved] = useState(false)

  const handleContact = () => {
    const subject = encodeURIComponent(`Inquiry: ${mockHunt.title}`)
    const body = encodeURIComponent(
      `Hi,\n\nI'm interested in the following hunt listing on Worldwide Hunting Trips:\n\n` +
      `Hunt: ${mockHunt.title}\n` +
      `Outfitter: ${mockHunt.outfitterName}\n` +
      `Location: ${mockHunt.state}, ${mockHunt.country}\n` +
      `Price: $${mockHunt.pricePerPerson.toLocaleString()} per person\n\n` +
      `Please send me more information about availability and next steps.\n\nThank you.`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Hero */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[520px] bg-gradient-to-br from-wht-forest to-wht-ink overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[14rem]">🦌</div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {[1,2,3,4].map((i) => (
            <div key={i} className="w-16 h-12 rounded-md bg-white/20 border-2 border-white/40 cursor-pointer hover:border-white transition-colors" />
          ))}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setSaved(!saved)} className="bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors">
            <Heart className={`h-5 w-5 ${saved ? 'fill-red-500 text-red-500' : 'text-wht-stone'}`} />
          </button>
          <button className="bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors">
            <Share2 className="h-5 w-5 text-wht-stone" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {mockHunt.species.map((s) => <Badge key={s} variant="default">{s}</Badge>)}
                <Badge variant="state">{mockHunt.state}</Badge>
                <Badge variant="secondary">{mockHunt.guideType}</Badge>
                {mockHunt.lodgingIncluded && <Badge variant="secondary">Lodging Included</Badge>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-heritage text-wht-ink tracking-tight mb-2">{mockHunt.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-wht-stone">
                <Link href={`/outfitter/${mockHunt.outfitterId}`} className="font-semibold text-wht-forest hover:text-wht-blaze transition-colors">
                  {mockHunt.outfitterName}
                </Link>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{mockHunt.state}, {mockHunt.country}</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-wht-blaze fill-wht-blaze" />
                  <span className="font-semibold text-wht-ink">{mockHunt.rating}</span>
                  <span>({mockHunt.reviewCount} reviews)</span>
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
                      activeTab === tab ? 'border-wht-blaze text-wht-blaze' : 'border-transparent text-wht-stone hover:text-wht-ink'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-heritage text-wht-ink mb-3">About This Hunt</h2>
                  {mockHunt.description.split('\n\n').map((p, i) => (
                    <p key={i} className="text-wht-stone leading-relaxed mb-3 text-sm font-body">{p}</p>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: <Calendar className="h-4 w-4 text-wht-blaze" />, label: 'Duration', value: `${mockHunt.duration} days` },
                    { icon: <Users className="h-4 w-4 text-wht-blaze" />, label: 'Max Hunters', value: `${mockHunt.maxHunters} people` },
                    { icon: <Crosshair className="h-4 w-4 text-wht-blaze" />, label: 'Success Rate', value: `${mockHunt.successRate}%` },
                    { icon: <Ruler className="h-4 w-4 text-wht-blaze" />, label: 'Property', value: mockHunt.propertySize },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-wht-bone-2 text-center">
                      <div className="flex justify-center mb-1">{item.icon}</div>
                      <div className="text-xs text-wht-fog font-mono uppercase tracking-wider">{item.label}</div>
                      <div className="text-sm font-semibold text-wht-ink mt-1 font-body">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-wht-paper rounded-xl border border-wht-bone-2 p-5">
                  <h3 className="text-base font-heritage text-wht-ink mb-3">About the Outfitter</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-wht-forest flex items-center justify-center text-wht-bone font-bold text-lg font-display">H</div>
                    <div>
                      <div className="font-semibold text-wht-ink text-sm font-body">{mockHunt.outfitterName}</div>
                      <div className="text-xs text-wht-stone font-mono">{mockHunt.state} · 18 years in business</div>
                    </div>
                  </div>
                  <p className="text-sm text-wht-stone font-body leading-relaxed mb-3">
                    Heartland Trophy Outfitters has operated in the Missouri Ozarks for 18 years with a conservative harvest program focused on mature deer and repeat clients.
                  </p>
                  <Link href={`/outfitter/${mockHunt.outfitterId}`}>
                    <Button variant="outline" size="sm">View Outfitter Profile</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Need to Know */}
            {activeTab === 'Need to Know' && (
              <div className="space-y-4">
                <p className="text-sm text-wht-stone font-body">Key operational details about this hunt.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Calendar className="h-5 w-5 text-wht-blaze" />, label: 'Season Dates', value: mockHunt.needToKnow.seasonDates },
                    { icon: <Fence className="h-5 w-5 text-wht-blaze" />, label: 'High Fenced', value: mockHunt.needToKnow.fenced ? 'Yes' : 'No — Free Range' },
                    { icon: <Crosshair className="h-5 w-5 text-wht-blaze" />, label: 'Weapon Types', value: mockHunt.needToKnow.weaponTypes.join(', ') },
                    { icon: <Mountain className="h-5 w-5 text-wht-blaze" />, label: 'Hunting Style', value: mockHunt.needToKnow.huntingStyles.join(', ') },
                    { icon: <CheckCircle className="h-5 w-5 text-wht-blaze" />, label: 'Baited', value: mockHunt.needToKnow.baited ? 'Yes' : 'No' },
                    { icon: <Mountain className="h-5 w-5 text-wht-blaze" />, label: 'Difficulty', value: mockHunt.needToKnow.difficulty },
                    { icon: <Lock className="h-5 w-5 text-wht-blaze" />, label: 'Land Type', value: mockHunt.needToKnow.landType },
                    { icon: <Ruler className="h-5 w-5 text-wht-blaze" />, label: 'Property Size', value: mockHunt.needToKnow.propertySize },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-wht-bone-2 flex gap-3 items-start">
                      <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                      <div>
                        <div className="text-xs text-wht-fog font-mono uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm font-semibold text-wht-ink mt-0.5 font-body">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            {activeTab === 'Pricing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-heritage text-wht-ink mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-wht-blaze" /> Price Includes
                    </h3>
                    <ul className="space-y-2">
                      {mockHunt.priceIncludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-wht-stone font-body">
                          <CheckCircle className="h-4 w-4 text-wht-blaze flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-base font-heritage text-wht-ink mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-400" /> Price Excludes
                    </h3>
                    <ul className="space-y-2">
                      {mockHunt.priceExcludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-wht-stone font-body">
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-wht-paper rounded-xl border border-wht-bone-2 p-5 space-y-4">
                  <h3 className="text-base font-heritage text-wht-ink">Payment &amp; Cancellation Terms</h3>
                  {[
                    { label: 'Deposit', value: mockHunt.paymentTerms.deposit },
                    { label: 'Final Payment', value: mockHunt.paymentTerms.finalPayment },
                    { label: 'Payment Methods', value: mockHunt.paymentTerms.methods },
                    { label: 'Cancellation Policy', value: mockHunt.paymentTerms.cancellation },
                    { label: 'Rescheduling', value: mockHunt.paymentTerms.rescheduling },
                  ].map((t, i) => (
                    <div key={i}>
                      <div className="text-xs font-mono text-wht-fog uppercase tracking-wider mb-0.5">{t.label}</div>
                      <p className="text-sm text-wht-stone font-body leading-relaxed">{t.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Q&A */}
            {activeTab === 'Q&A' && (
              <div className="space-y-3">
                <p className="text-sm text-wht-stone font-body mb-4">
                  Answered directly by {mockHunt.outfitterName}.{' '}
                  <button onClick={handleContact} className="text-wht-blaze hover:underline font-medium">
                    Have another question? Contact the outfitter.
                  </button>
                </p>
                {mockHunt.qna.map((item, i) => (
                  <QnaItem key={i} question={item.question} answer={item.answer} />
                ))}
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'Reviews' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-display text-wht-ink">{mockHunt.rating}</div>
                    <div className="flex gap-0.5 justify-center my-1">
                      {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 text-wht-blaze fill-wht-blaze" />)}
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
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'text-wht-blaze fill-wht-blaze' : 'text-wht-bone-2'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-wht-stone leading-relaxed font-body">{review.text}</p>
                      {review.species && (
                        <div className="mt-2"><Badge variant="state" className="text-xs">Harvested: {review.species}</Badge></div>
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
                <div className="text-4xl font-display text-wht-blaze">${mockHunt.pricePerPerson.toLocaleString()}</div>
                <div className="text-sm text-wht-stone font-mono">per person</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-4 w-4 text-wht-blaze fill-wht-blaze" />
                  <span className="font-bold text-wht-ink">{mockHunt.rating}</span>
                  <span className="text-wht-stone text-sm font-mono">({mockHunt.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="mb-5 pb-5 border-b border-wht-bone-2 space-y-2 text-xs">
                {[
                  { label: 'Duration', value: `${mockHunt.duration} days` },
                  { label: 'Guide Type', value: mockHunt.guideType },
                  { label: 'Lodging', value: mockHunt.lodgingIncluded ? 'Included' : 'Not Included' },
                  { label: 'Meals', value: mockHunt.mealsIncluded ? 'Included' : 'Not Included' },
                  { label: 'Season', value: `${mockHunt.seasonStart} – ${mockHunt.seasonEnd}` },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-wht-fog font-mono">{item.label}</span>
                    <span className="font-semibold text-wht-ink font-body">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-5 pb-5 border-b border-wht-bone-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-wht-forest flex items-center justify-center text-wht-bone font-bold font-display">H</div>
                  <div>
                    <div className="font-semibold text-wht-ink text-sm font-body">{mockHunt.outfitterName}</div>
                    <div className="text-xs text-wht-stone font-mono">Responds within 24 hours</div>
                  </div>
                </div>
              </div>

              <Button variant="default" className="w-full mb-3 gap-2" onClick={handleContact}>
                <Mail className="h-4 w-4" />
                Email This Listing to Outfitter
              </Button>
              <Link href={`/outfitter/${mockHunt.outfitterId}`}>
                <Button variant="outline" className="w-full">View Outfitter Profile</Button>
              </Link>
              <p className="text-center text-xs text-wht-fog mt-4 font-mono">No booking fees. You pay the outfitter directly.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
