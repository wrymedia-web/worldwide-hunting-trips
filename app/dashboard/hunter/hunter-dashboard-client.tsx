'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageSquare, Trophy, User, Compass, Inbox, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HuntCard, type HuntCardProps } from '@/components/hunt-card'
import { updateHunterProfile, type HunterInquiry } from '@/app/actions/hunter'

const navItems = [
  { id: 'saved', label: 'Saved Hunts', icon: Heart },
  { id: 'inquiries', label: 'My Inquiries', icon: Inbox },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'journal', label: 'Trophy Journal', icon: Trophy },
  { id: 'profile', label: 'My Profile', icon: User },
]

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-emerald-100 text-emerald-800',
  booked: 'bg-wht-forest text-white',
  declined: 'bg-red-100 text-red-700',
}

interface ProfileData {
  full_name: string | null
  phone: string | null
  state: string | null
  created_at: string | null
}

interface Props {
  email: string | null
  profile: ProfileData | null
  saved: HuntCardProps[]
  inquiries: HunterInquiry[]
}

export default function HunterDashboardClient({ email, profile, saved, inquiries }: Props) {
  const [activeSection, setActiveSection] = useState('saved')
  const [form, setForm] = useState({
    fullName: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    state: profile?.state ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)
  const [saveError, setSaveError] = useState('')

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : new Date().getFullYear()
  const initial = (profile?.full_name || email || 'H').charAt(0).toUpperCase()

  const handleSaveProfile = async () => {
    setSaving(true)
    setSavedOk(false)
    setSaveError('')
    const { error } = await updateHunterProfile(form)
    setSaving(false)
    if (error) {
      setSaveError(error)
      return
    }
    setSavedOk(true)
  }

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Header */}
      <div className="bg-wht-forest py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Hunter Dashboard</h1>
          <p className="text-wht-bone text-sm mt-1">Manage your saved hunts, inquiries, and profile</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-wht-bone-2 overflow-hidden">
              {navItems.map((item) => {
                const Icon = item.icon
                const count =
                  item.id === 'saved' ? saved.length : item.id === 'inquiries' ? inquiries.length : 0
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                      activeSection === item.id ? 'bg-wht-forest text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {count > 0 && (
                      <span className={`text-xs rounded-full px-2 py-0.5 ${activeSection === item.id ? 'bg-white/20' : 'bg-wht-bone-2 text-wht-forest'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {activeSection === 'saved' && (
              saved.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {saved.map((hunt) => <HuntCard key={hunt.id} {...hunt} />)}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center">
                  <Heart className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-wht-forest mb-2">No Saved Hunts Yet</h2>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                    Browse hunts and tap the heart to save your favorites here.
                  </p>
                  <Link href="/browse">
                    <Button variant="copper"><Compass className="h-4 w-4 mr-2" />Browse Hunts</Button>
                  </Link>
                </div>
              )
            )}

            {activeSection === 'inquiries' && (
              inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-white rounded-xl border border-wht-bone-2 p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          {inq.huntSlug ? (
                            <Link href={`/hunt/${inq.huntSlug}`} className="font-semibold text-wht-forest hover:text-wht-blaze transition-colors">
                              {inq.huntTitle}
                            </Link>
                          ) : (
                            <span className="font-semibold text-wht-forest">{inq.huntTitle}</span>
                          )}
                          <div className="text-xs text-gray-500 mt-0.5">{inq.outfitterName} · {inq.createdAt}</div>
                        </div>
                        <span className={`text-xs font-medium rounded-full px-2.5 py-1 capitalize ${STATUS_STYLES[inq.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{inq.message}</p>
                      {(inq.preferredDates || inq.partySize > 1) && (
                        <div className="flex gap-4 mt-3 text-xs text-gray-500">
                          {inq.preferredDates && <span>Preferred: {inq.preferredDates}</span>}
                          {inq.partySize > 1 && <span>Party of {inq.partySize}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center">
                  <Inbox className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-wht-forest mb-2">No Inquiries Yet</h2>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                    When you contact outfitters about hunts, your inquiries appear here so you can track responses.
                  </p>
                  <Link href="/browse"><Button variant="copper">Find a Hunt</Button></Link>
                </div>
              )
            )}

            {activeSection === 'messages' && (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center">
                <MessageSquare className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-wht-forest mb-2">No Messages</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Your conversations with outfitters will appear here.
                </p>
                <Link href="/browse"><Button variant="copper">Browse Hunts</Button></Link>
              </div>
            )}

            {activeSection === 'journal' && (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center">
                <Trophy className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-wht-forest mb-2">Trophy Journal</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Log your harvests, photos, and hunt memories. Your personal hunting record book.
                </p>
                <Button variant="default">Add Your First Entry</Button>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-6">
                <h2 className="text-xl font-bold text-wht-forest mb-6">My Profile</h2>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-wht-bone-2">
                  <div className="w-16 h-16 rounded-full bg-wht-forest flex items-center justify-center text-white text-2xl font-bold">
                    {initial}
                  </div>
                  <div>
                    <div className="font-bold text-wht-forest">{profile?.full_name || 'Hunter Account'}</div>
                    <div className="text-sm text-gray-500">{email ?? '—'}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <Input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                    <Input value={email ?? ''} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                    <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="(555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Home State</label>
                    <Input value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} placeholder="Missouri" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Button variant="default" onClick={handleSaveProfile} disabled={saving} className="gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                  {savedOk && (
                    <span className="flex items-center gap-1 text-sm text-emerald-700">
                      <CheckCircle className="h-4 w-4" /> Saved
                    </span>
                  )}
                  {saveError && <span className="text-sm text-red-600">{saveError}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
