'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  List, Inbox, MessageSquare, BarChart2, User, Plus,
  Eye, TrendingUp, CheckCircle, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { OutfitterRecord, HuntListingRecord } from '@/app/actions/outfitter'

const navItems = [
  { id: 'listings', label: 'My Listings', icon: List },
  { id: 'inquiries', label: 'Inquiries', icon: Inbox },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'profile', label: 'Profile', icon: User },
]

const mockInquiries = [
  {
    id: 1,
    name: 'Mike Davidson',
    email: 'mike.davidson@email.com',
    hunt: 'Trophy Whitetail Deer Hunt',
    date: '2 hours ago',
    status: 'new',
    message: 'Interested in booking 2 spots for the November rifle season. Do you have availability the week of November 10th?',
  },
  {
    id: 2,
    name: 'Chris Thompson',
    email: 'cthompson@email.com',
    hunt: 'Trophy Whitetail Deer Hunt',
    date: '1 day ago',
    status: 'replied',
    message: "Looking for a solo archery hunt in October. What's your success rate for bowhunters?",
  },
  {
    id: 3,
    name: 'Robert Keller',
    email: 'r.keller@email.com',
    hunt: 'Spring Turkey Hunt',
    date: '3 days ago',
    status: 'read',
    message: "My son and I want to book a father-son turkey hunt. He's 14. Is that okay?",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'new': return <Badge variant="copper" className="text-xs">New</Badge>
    case 'read': return <Badge variant="secondary" className="text-xs">Read</Badge>
    case 'replied': return <Badge variant="default" className="text-xs">Replied</Badge>
    default: return null
  }
}

interface Props {
  outfitter: OutfitterRecord
  listings: HuntListingRecord[]
  stats: {
    activeListings: number
    totalInquiries: number
  }
}

export default function OutfitterDashboardClient({ outfitter, listings, stats }: Props) {
  const [activeSection, setActiveSection] = useState('listings')

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
                <h2 className="text-lg font-bold text-wht-forest mb-4">Recent Inquiries</h2>
                <div className="space-y-4">
                  {mockInquiries.map((inq) => (
                    <div key={inq.id} className="bg-white rounded-xl border border-wht-bone-2 p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="font-semibold text-wht-forest">{inq.name}</div>
                          <div className="text-xs text-gray-500">{inq.email}</div>
                          <div className="text-xs text-wht-stone font-medium mt-0.5">Re: {inq.hunt}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusBadge(inq.status)}
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {inq.date}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{inq.message}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="copper" size="sm">Reply</Button>
                        <Button variant="ghost" size="sm">Mark Read</Button>
                      </div>
                    </div>
                  ))}
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
                <h2 className="text-xl font-bold text-wht-forest mb-6">Outfitter Profile</h2>
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
