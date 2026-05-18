'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Heart, MessageSquare, Trophy, User, Compass, Inbox
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { id: 'saved', label: 'Saved Hunts', icon: Heart },
  { id: 'inquiries', label: 'My Inquiries', icon: Inbox },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'journal', label: 'Trophy Journal', icon: Trophy },
  { id: 'profile', label: 'My Profile', icon: User },
]

export default function HunterDashboard() {
  const [activeSection, setActiveSection] = useState('saved')

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
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {activeSection === 'saved' && (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center">
                <Heart className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-wht-forest mb-2">No Saved Hunts Yet</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Browse hunts and save your favorites to come back to them later.
                </p>
                <Link href="/browse">
                  <Button variant="copper">
                    <Compass className="h-4 w-4 mr-2" />
                    Browse Hunts
                  </Button>
                </Link>
              </div>
            )}

            {activeSection === 'inquiries' && (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center">
                <Inbox className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-wht-forest mb-2">No Inquiries Yet</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  When you contact outfitters about hunts, your inquiries will appear here so you can track responses.
                </p>
                <Link href="/browse">
                  <Button variant="copper">Find a Hunt</Button>
                </Link>
              </div>
            )}

            {activeSection === 'messages' && (
              <div className="bg-white rounded-xl border border-wht-bone-2 p-8 text-center">
                <MessageSquare className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-wht-forest mb-2">No Messages</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Your conversations with outfitters will appear here.
                </p>
                <Link href="/browse">
                  <Button variant="copper">Browse Hunts</Button>
                </Link>
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
                    H
                  </div>
                  <div>
                    <div className="font-bold text-wht-forest">Hunter Account</div>
                    <div className="text-sm text-gray-500">hunter@example.com</div>
                    <div className="text-xs text-gray-400 mt-0.5">Member since 2025</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', placeholder: 'John Smith' },
                    { label: 'Email', placeholder: 'john@email.com' },
                    { label: 'Phone', placeholder: '(555) 000-0000' },
                    { label: 'Home State', placeholder: 'Select state...' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        {field.label}
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="default">Save Profile</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
