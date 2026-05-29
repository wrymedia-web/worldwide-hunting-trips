'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Star, MapPin, Heart, Share2, CheckCircle, XCircle,
  Calendar, Utensils, Mail, Home, Crosshair, Users, Mountain, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InquiryForm } from '@/components/inquiry-form'
import { LiabilityNotice } from '@/components/liability-notice'
import { toggleSaveHunt } from '@/app/actions/hunter'
import type { HuntDetailView } from '@/lib/listings'

const TABS = ['Overview', 'Need to Know', 'Pricing', 'Reviews'] as const
type Tab = (typeof TABS)[number]

interface Props {
  hunt: HuntDetailView
  initiallySaved: boolean
}

export default function HuntDetailClient({ hunt, initiallySaved }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [saved, setSaved] = useState(initiallySaved)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [inquiryOpen, setInquiryOpen] = useState(false)

  const canSave = !!hunt.huntId && !hunt.isExample

  async function handleSave() {
    if (!canSave || !hunt.huntId) return
    const prev = saved
    setSaved(!prev)
    setSaveError(null)
    const { saved: newSaved, error } = await toggleSaveHunt(hunt.huntId)
    if (error) {
      setSaved(prev)
      setSaveError(error)
    } else {
      setSaved(newSaved)
    }
  }

  const outfitterInitial = hunt.outfitterName.charAt(0).toUpperCase()

  const sidebarSeasonValue =
    hunt.seasonStart && hunt.seasonEnd
      ? `${hunt.seasonStart} – ${hunt.seasonEnd}`
      : 'Contact outfitter'

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Hero */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[520px] bg-gradient-to-br from-wht-forest to-wht-ink overflow-hidden">
        {hunt.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hunt.imageUrl} alt={hunt.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[14rem]">🦌</div>
        )}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-12 rounded-md bg-white/20 border-2 border-white/40 cursor-pointer hover:border-white transition-colors" />
          ))}
        </div>
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!canSave}
              title={canSave ? (saved ? 'Remove from saved' : 'Save this hunt') : 'Sign in to save'}
              className="bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors disabled:opacity-60"
            >
              <Heart className={`h-5 w-5 ${saved ? 'fill-red-500 text-red-500' : 'text-wht-stone'}`} />
            </button>
            <button className="bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors">
              <Share2 className="h-5 w-5 text-wht-stone" />
            </button>
          </div>
          {saveError && (
            <div className="bg-white/95 text-wht-ink text-xs rounded-lg px-3 py-1.5 shadow font-body max-w-[200px] text-right">
              {saveError}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {hunt.species.map((s) => <Badge key={s} variant="default">{s}</Badge>)}
                <Badge variant="state">{hunt.state}</Badge>
                <Badge variant="secondary">{hunt.guideType}</Badge>
                {hunt.lodgingIncluded && <Badge variant="secondary">Lodging Included</Badge>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-heritage text-wht-ink tracking-tight mb-2">{hunt.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-wht-stone">
                {hunt.outfitterSlug ? (
                  <Link href={`/outfitter/${hunt.outfitterSlug}`} className="font-semibold text-wht-forest hover:text-wht-blaze transition-colors">
                    {hunt.outfitterName}
                  </Link>
                ) : (
                  <span className="font-semibold text-wht-forest">{hunt.outfitterName}</span>
                )}
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{hunt.state}, {hunt.country}</span>
                {hunt.reviewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-wht-blaze fill-wht-blaze" />
                    <span className="font-semibold text-wht-ink">{hunt.rating}</span>
                    <span>({hunt.reviewCount} reviews)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-wht-bone-2 mb-6">
              <div className="flex gap-6 overflow-x-auto">
                {TABS.map((tab) => (
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
                  {hunt.description.split('\n\n').map((p, i) => (
                    <p key={i} className="text-wht-stone leading-relaxed mb-3 text-sm font-body">{p}</p>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: <Calendar className="h-4 w-4 text-wht-blaze" />, label: 'Duration', value: hunt.duration != null ? `${hunt.duration} days` : '—' },
                    { icon: <Users className="h-4 w-4 text-wht-blaze" />, label: 'Max Hunters', value: hunt.maxHunters != null ? `${hunt.maxHunters} people` : '—' },
                    { icon: <Crosshair className="h-4 w-4 text-wht-blaze" />, label: 'Success Rate', value: hunt.successRate != null ? `${hunt.successRate}%` : '—' },
                    { icon: <Mountain className="h-4 w-4 text-wht-blaze" />, label: 'Land Type', value: hunt.landType ?? '—' },
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
                    <div className="w-12 h-12 rounded-full bg-wht-forest flex items-center justify-center text-wht-bone font-bold text-lg font-display">
                      {outfitterInitial}
                    </div>
                    <div>
                      <div className="font-semibold text-wht-ink text-sm font-body">{hunt.outfitterName}</div>
                      <div className="text-xs text-wht-stone font-mono">{hunt.state}</div>
                    </div>
                  </div>
                  {hunt.outfitterSlug ? (
                    <Link href={`/outfitter/${hunt.outfitterSlug}`}>
                      <Button variant="outline" size="sm">View Outfitter Profile</Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled>View Outfitter Profile</Button>
                  )}
                </div>
              </div>
            )}

            {/* Need to Know */}
            {activeTab === 'Need to Know' && (
              <div className="space-y-4">
                <p className="text-sm text-wht-stone font-body">Key operational details about this hunt.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Calendar className="h-5 w-5 text-wht-blaze" />,
                      label: 'Season Dates',
                      value: hunt.seasonStart && hunt.seasonEnd
                        ? `${hunt.seasonStart} – ${hunt.seasonEnd}`
                        : 'Contact outfitter',
                    },
                    {
                      icon: <Crosshair className="h-5 w-5 text-wht-blaze" />,
                      label: 'Weapon Types',
                      value: hunt.weaponTypes.length > 0 ? hunt.weaponTypes.join(', ') : '—',
                    },
                    {
                      icon: <Mountain className="h-5 w-5 text-wht-blaze" />,
                      label: 'Land Type',
                      value: hunt.landType ?? '—',
                    },
                    {
                      icon: <Users className="h-5 w-5 text-wht-blaze" />,
                      label: 'Guide Type',
                      value: hunt.guideType,
                    },
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
                      {hunt.priceIncludes.map((item, i) => (
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
                      {hunt.priceExcludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-wht-stone font-body">
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-wht-paper rounded-xl border border-wht-bone-2 p-5">
                  <h3 className="text-base font-heritage text-wht-ink mb-2">Payment &amp; Cancellation</h3>
                  <p className="text-sm text-wht-stone font-body leading-relaxed">
                    Payment terms, deposits, and cancellation policies are arranged directly with the outfitter.
                  </p>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'Reviews' && (
              <div>
                {hunt.reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-10 w-10 text-wht-bone-2 mx-auto mb-3" />
                    <p className="text-wht-stone font-body text-sm">
                      No reviews yet — be the first to hunt with {hunt.outfitterName}.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-5xl font-display text-wht-ink">{hunt.rating}</div>
                        <div className="flex gap-0.5 justify-center my-1">
                          {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 text-wht-blaze fill-wht-blaze" />)}
                        </div>
                        <div className="text-sm text-wht-stone font-mono">{hunt.reviewCount} reviews</div>
                      </div>
                    </div>
                    <div className="space-y-5">
                      {hunt.reviews.map((review, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-wht-bone-2">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold text-wht-ink font-body">{review.reviewer}</div>
                              <div className="text-xs text-wht-stone font-mono">{review.state} · {review.date}</div>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
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
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-wht-bone-2 p-6 sticky top-24 shadow-sm">
              <div className="text-center mb-5 pb-5 border-b border-wht-bone-2">
                <div className="text-4xl font-display text-wht-blaze">${hunt.pricePerPerson.toLocaleString()}</div>
                <div className="text-sm text-wht-stone font-mono">per person</div>
                {hunt.reviewCount > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-wht-blaze fill-wht-blaze" />
                    <span className="font-bold text-wht-ink">{hunt.rating}</span>
                    <span className="text-wht-stone text-sm font-mono">({hunt.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              <div className="mb-5 pb-5 border-b border-wht-bone-2 space-y-2 text-xs">
                {[
                  { label: 'Duration', value: hunt.duration != null ? `${hunt.duration} days` : '—' },
                  { label: 'Guide Type', value: hunt.guideType },
                  { label: 'Lodging', value: hunt.lodgingIncluded ? 'Included' : 'Not Included' },
                  { label: 'Meals', value: hunt.mealsIncluded ? 'Included' : 'Not Included' },
                  { label: 'Season', value: sidebarSeasonValue },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-wht-fog font-mono">{item.label}</span>
                    <span className="font-semibold text-wht-ink font-body">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-5 pb-5 border-b border-wht-bone-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-wht-forest flex items-center justify-center text-wht-bone font-bold font-display">
                    {outfitterInitial}
                  </div>
                  <div>
                    <div className="font-semibold text-wht-ink text-sm font-body">{hunt.outfitterName}</div>
                    <div className="text-xs text-wht-stone font-mono">Responds within 24 hours</div>
                  </div>
                </div>
              </div>

              <Button variant="default" className="w-full mb-3 gap-2" onClick={() => setInquiryOpen(true)}>
                <Mail className="h-4 w-4" />
                Contact Outfitter
              </Button>
              {hunt.outfitterSlug ? (
                <Link href={`/outfitter/${hunt.outfitterSlug}`}>
                  <Button variant="outline" className="w-full">View Outfitter Profile</Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full" disabled>View Outfitter Profile</Button>
              )}
              <p className="text-center text-xs text-wht-fog mt-4 font-mono">No booking fees. You pay the outfitter directly.</p>
            </div>
            <div className="mt-4">
              <LiabilityNotice dangerousGame={hunt.dangerousGame} />
            </div>
          </aside>
        </div>
      </div>

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setInquiryOpen(false) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-wht-bone-2">
              <div>
                <h2 className="text-base font-heritage text-wht-ink">Contact Outfitter</h2>
                <p className="text-xs text-wht-stone font-mono mt-0.5">{hunt.outfitterName}</p>
              </div>
              <button
                onClick={() => setInquiryOpen(false)}
                className="rounded-full p-1.5 hover:bg-wht-bone-2 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-wht-stone" />
              </button>
            </div>
            <div className="px-6 py-5">
              <InquiryForm
                huntId={hunt.huntId}
                outfitterId={hunt.outfitterId}
                outfitterName={hunt.outfitterName}
                isExample={hunt.isExample}
                submitLabel="Send Inquiry"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
