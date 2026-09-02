'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  List, Inbox, MessageSquare, BarChart2, User, Plus,
  Eye, TrendingUp, CheckCircle, Clock, X, Loader2, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { OutfitterRecord, HuntListingRecord } from '@/app/actions/outfitter'
import type { OutfitterInquiry } from '@/app/actions/outfitter-inquiries'
import { markInquiryRead, replyToInquiry } from '@/app/actions/outfitter-inquiries'

const navItems = [
  { id: 'listings', label: 'My Listings', icon: List },
  { id: 'inquiries', label: 'Inquiries', icon: Inbox },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'profile', label: 'Profile', icon: User },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'new': return <Badge variant="copper" className="text-xs">New</Badge>
    case 'read': return <Badge variant="secondary" className="text-xs">Read</Badge>
    case 'replied': return <Badge variant="default" className="text-xs">Replied</Badge>
    case 'booked': return <Badge variant="sage" className="text-xs">Booked</Badge>
    case 'declined': return <Badge variant="secondary" className="text-xs">Declined</Badge>
    default: return null
  }
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ''
  const secs = Math.floor((Date.now() - then) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface Props {
  outfitter: OutfitterRecord
  listings: HuntListingRecord[]
  inquiries: OutfitterInquiry[]
  stats: {
    activeListings: number
    totalInquiries: number
  }
}

export default function OutfitterDashboardClient({ outfitter, listings, inquiries, stats }: Props) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('listings')
  const [openInquiryId, setOpenInquiryId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [rowError, setRowError] = useState<string | null>(null)
  const [pendingRowId, setPendingRowId] = useState<string | null>(null)
  const [isReplying, startReplyTransition] = useTransition()

  const openInquiry = inquiries.find((i) => i.id === openInquiryId) ?? null

  const openDetail = (inquiry: OutfitterInquiry) => {
    setRowError(null)
    setReplyText(inquiry.reply_message ?? '')
    setOpenInquiryId(inquiry.id)
    if (inquiry.status === 'new') {
      // Fire-and-forget; the server refreshes on close.
      markInquiryRead(inquiry.id).then(({ error }) => {
        if (!error) router.refresh()
      })
    }
  }

  const closeDetail = () => {
    setOpenInquiryId(null)
    setReplyText('')
    setRowError(null)
  }

  const handleMarkRead = (inquiry: OutfitterInquiry) => {
    if (inquiry.status !== 'new') return
    setPendingRowId(inquiry.id)
    markInquiryRead(inquiry.id).then(({ error }) => {
      setPendingRowId(null)
      if (error) setRowError(error)
      else router.refresh()
    })
  }

  const handleSendReply = () => {
    if (!openInquiry) return
    setRowError(null)
    startReplyTransition(async () => {
      const { error } = await replyToInquiry(openInquiry.id, replyText)
      if (error) {
        setRowError(error)
        return
      }
      closeDetail()
      router.refresh()
    })
  }

  const statCards = [
    { label: 'Active Listings', value: String(stats.activeListings), icon: List, color: 'text-wht-forest' },
    { label: 'Total Inquiries', value: String(stats.totalInquiries), icon: Inbox, color: 'text-wht-blaze' },
    { label: 'Profile Views', value: '—', icon: Eye, color: 'text-wht-stone' },
    { label: 'Response Rate', value: '—', icon: TrendingUp, color: 'text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Outfitter Dashboard</h1>
            <p className="text-wht-bone text-sm mt-1">{outfitter.business_name}</p>
          </div>
          <Link href="/dashboard/outfitter/listings/new">
            <Button variant="copper" className="hidden sm:flex gap-2">
              <Plus className="h-4 w-4" />
              Add New Hunt
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-wht-bone-2 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-wht-bone-2 overflow-hidden">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                      activeSection === item.id
                        ? 'bg-wht-forest text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="mt-4">
              <Link href="/dashboard/outfitter/listings/new" className="block">
                <Button variant="copper" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Hunt
                </Button>
              </Link>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {activeSection === 'listings' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-wht-forest">My Hunt Listings</h2>
                </div>

                {listings.length === 0 ? (
                  <div className="bg-white rounded-xl border border-wht-bone-2 p-10 text-center">
                    <List className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-wht-forest mb-2">No listings yet</h3>
                    <p className="text-gray-500 text-sm mb-5">
                      Create your first hunt listing to start receiving inquiries from hunters.
                    </p>
                    <Link href="/dashboard/outfitter/listings/new">
                      <Button variant="copper" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Your First Listing
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="bg-white rounded-xl border border-wht-bone-2 p-4 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg bg-wht-paper flex items-center justify-center text-xl flex-shrink-0">
                          🦌
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-wht-forest text-sm">{listing.title}</div>
                          <div className="text-xs text-gray-500">
                            {listing.species
                              ? listing.species.name
                              : listing.species_id
                                ? 'Unknown species'
                                : 'No species set'}
                            {' · '}
                            ${listing.price_per_person.toLocaleString()}/
                            {listing.price_type === 'per_person'
                              ? 'person'
                              : listing.price_type === 'per_day'
                                ? 'day'
                                : 'flat'}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{listing.state}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={listing.is_active ? 'sage' : 'secondary'} className="text-xs">
                            {listing.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Link href={`/dashboard/outfitter/listings/${listing.id}/edit`}>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'inquiries' && (
              <div>
                <h2 className="text-lg font-bold text-wht-forest mb-4">Inquiries</h2>
                {rowError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 text-sm text-red-700">
                    {rowError}
                  </div>
                )}
                {inquiries.length === 0 ? (
                  <div className="bg-white rounded-xl border border-wht-bone-2 p-10 text-center">
                    <Inbox className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-wht-forest mb-2">No inquiries yet</h3>
                    <p className="text-gray-500 text-sm">
                      When a hunter contacts you about one of your listings, it will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="bg-white rounded-xl border border-wht-bone-2 p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="font-semibold text-wht-forest">{inq.hunter_name ?? '(no name)'}</div>
                            <div className="text-xs text-gray-500">{inq.hunter_email ?? '—'}</div>
                            {inq.hunt_title && (
                              <div className="text-xs text-wht-stone font-medium mt-0.5">Re: {inq.hunt_title}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusBadge(inq.status)}
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              {timeAgo(inq.created_at)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{inq.message}</p>
                        {inq.reply_message && (
                          <div className="mt-3 pl-3 border-l-2 border-wht-blaze/40 text-xs text-wht-stone">
                            <span className="font-mono uppercase tracking-wider text-[10px] text-wht-blaze">Your reply</span>
                            <p className="mt-0.5 text-gray-700 line-clamp-2 whitespace-pre-line">{inq.reply_message}</p>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button variant="copper" size="sm" onClick={() => openDetail(inq)}>
                            Open
                          </Button>
                          {inq.status === 'new' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={pendingRowId === inq.id}
                              onClick={() => handleMarkRead(inq)}
                            >
                              {pendingRowId === inq.id ? 'Marking...' : 'Mark Read'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {openInquiry && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                onClick={(e) => { if (e.target === e.currentTarget) closeDetail() }}
              >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-wht-bone-2">
                    <div>
                      <h2 className="text-base font-heritage text-wht-ink">Inquiry from {openInquiry.hunter_name ?? '(no name)'}</h2>
                      {openInquiry.hunt_title && (
                        <p className="text-xs text-wht-stone font-mono mt-0.5">Re: {openInquiry.hunt_title}</p>
                      )}
                    </div>
                    <button
                      onClick={closeDetail}
                      className="rounded-full p-1.5 hover:bg-wht-bone-2 transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5 text-wht-stone" />
                    </button>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-wht-fog font-mono uppercase tracking-wider">Email</div>
                        <div className="text-wht-ink font-body break-all">{openInquiry.hunter_email ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-wht-fog font-mono uppercase tracking-wider">Phone</div>
                        <div className="text-wht-ink font-body">{openInquiry.hunter_phone ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-wht-fog font-mono uppercase tracking-wider">Preferred Dates</div>
                        <div className="text-wht-ink font-body">{openInquiry.preferred_dates ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-wht-fog font-mono uppercase tracking-wider">Party Size</div>
                        <div className="text-wht-ink font-body">{openInquiry.party_size ?? '—'}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-wht-fog font-mono uppercase tracking-wider mb-1">Message</div>
                      <p className="text-sm text-wht-ink font-body whitespace-pre-line leading-relaxed">{openInquiry.message}</p>
                    </div>

                    {openInquiry.reply_message && (
                      <div className="bg-wht-paper rounded-lg p-3 border border-wht-bone-2">
                        <div className="text-xs text-wht-blaze font-mono uppercase tracking-wider mb-1">
                          Your reply{openInquiry.replied_at ? ` — ${timeAgo(openInquiry.replied_at)}` : ''}
                        </div>
                        <p className="text-sm text-wht-ink font-body whitespace-pre-line">{openInquiry.reply_message}</p>
                      </div>
                    )}

                    <div>
                      <div className="text-xs text-wht-fog font-mono uppercase tracking-wider mb-1">
                        {openInquiry.reply_message ? 'Update Your Reply' : 'Reply to Hunter'}
                      </div>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={5}
                        placeholder="Type your reply..."
                        className="flex w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
                      />
                      <p className="text-xs text-wht-stone font-body mt-1">
                        Replies are saved on the inquiry. Email delivery to the hunter isn&apos;t hooked up yet — reach out via the email address above until then.
                      </p>
                    </div>

                    {rowError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                        {rowError}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-wht-bone-2">
                    <Button variant="ghost" onClick={closeDetail} disabled={isReplying}>Cancel</Button>
                    {openInquiry.hunter_email && (
                      <a
                        href={`mailto:${openInquiry.hunter_email}?subject=${encodeURIComponent(`Re: ${openInquiry.hunt_title ?? 'your hunt inquiry'}`)}`}
                        className="inline-flex items-center gap-1.5 text-sm text-wht-forest hover:underline mr-auto"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Reply via email
                      </a>
                    )}
                    <Button
                      variant="copper"
                      onClick={handleSendReply}
                      disabled={isReplying || !replyText.trim()}
                      className="gap-2"
                    >
                      {isReplying && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isReplying ? 'Saving...' : openInquiry.reply_message ? 'Save Reply' : 'Send Reply'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'messages' && (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center">
                <MessageSquare className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-wht-forest mb-2">No Messages</h2>
                <p className="text-gray-500 text-sm">Your direct message conversations will appear here.</p>
              </div>
            )}

            {activeSection === 'analytics' && (
              <div>
                <h2 className="text-lg font-bold text-wht-forest mb-4">Analytics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "This Month's Views", value: '—', change: '', positive: true },
                    { label: 'Inquiry Conversion', value: '—', change: '', positive: true },
                    { label: 'Avg Response Time', value: '—', change: '', positive: true },
                    { label: 'Profile Completeness', value: '—', change: '', positive: true },
                  ].map((metric, i) => (
                    <div key={i} className="bg-white rounded-xl border border-wht-bone-2 p-5">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{metric.label}</div>
                      <div className="text-3xl font-extrabold text-wht-forest">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-wht-forest">Outfitter Profile</h2>
                  <Link href="/dashboard/outfitter/profile/edit">
                    <Button variant="copper" size="sm">Edit Profile</Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-wht-bone-2">
                  <div className="w-16 h-16 rounded-2xl bg-wht-forest flex items-center justify-center text-white text-2xl font-bold">
                    {outfitter.business_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-wht-forest">{outfitter.business_name}</div>
                    <div className="text-sm text-gray-500">
                      {outfitter.state}
                      {outfitter.years_in_business ? ` · ${outfitter.years_in_business} years in business` : ''}
                    </div>
                    {outfitter.is_verified && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-wht-stone" />
                        <span className="text-xs text-wht-stone font-medium">Verified Outfitter</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Business Name', value: outfitter.business_name },
                    { label: 'State', value: outfitter.state },
                    { label: 'Phone', value: outfitter.phone ?? '—' },
                    { label: 'Email', value: outfitter.email ?? '—' },
                    { label: 'Website', value: outfitter.website ?? '—' },
                    { label: 'Years in Business', value: outfitter.years_in_business ? String(outfitter.years_in_business) : '—' },
                  ].map((field) => (
                    <div key={field.label}>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{field.label}</div>
                      <div className="text-gray-900">{field.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
