'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createOutfitterProfile } from '@/app/actions/outfitter'
import { US_STATES, SPECIES_LIST } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

// Group species by category
const speciesByCategory = SPECIES_LIST.reduce<Record<string, string[]>>((acc, s) => {
  if (!acc[s.category]) acc[s.category] = []
  acc[s.category].push(s.name)
  return acc
}, {})

export default function OutfitterSetupPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')

  // Pre-fill email from auth
  useState(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email)
    })
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const { error: actionError } = await createOutfitterProfile(formData)
      if (actionError) {
        setError(actionError)
        return
      }
      router.push('/dashboard/outfitter')
    })
  }

  return (
    <div className="min-h-screen bg-wht-paper flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-wht-forest p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-wht-blaze" />
            </div>
            <span className="font-extrabold text-wht-forest text-lg tracking-tight uppercase">
              Worldwide Hunting Trips
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-wht-bone-2 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-wht-forest/10 mb-4">
              <CheckCircle2 className="h-7 w-7 text-wht-forest" />
            </div>
            <h1 className="text-2xl font-bold text-wht-forest mb-2">
              Set Up Your Outfitter Profile
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Welcome to Worldwide Hunting Trips. Tell hunters about your operation — no booking commissions, just one low annual fee.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Info */}
            <div>
              <h2 className="text-xs font-bold text-wht-forest uppercase tracking-widest mb-4 pb-2 border-b border-wht-bone-2">
                Business Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Name <span className="text-wht-blaze">*</span>
                  </label>
                  <Input
                    name="business_name"
                    type="text"
                    placeholder="Big Sky Trophy Outfitters"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State <span className="text-wht-blaze">*</span>
                  </label>
                  <select
                    name="state"
                    required
                    className="flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a state</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Years in Business
                  </label>
                  <Input
                    name="years_in_business"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="(555) 555-0100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={userEmail}
                    placeholder="info@youroutfitter.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website
                  </label>
                  <Input
                    name="website"
                    type="url"
                    placeholder="https://youroutfitter.com"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold text-wht-forest uppercase tracking-widest mb-4 pb-2 border-b border-wht-bone-2">
                About Your Operation
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tell hunters about your operation
                </label>
                <textarea
                  name="description"
                  rows={5}
                  placeholder="Describe your operation, the land you hunt, your experience, and what makes your hunts special..."
                  className="flex w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
                />
              </div>
            </div>

            {/* Species */}
            <div>
              <h2 className="text-xs font-bold text-wht-forest uppercase tracking-widest mb-4 pb-2 border-b border-wht-bone-2">
                Species You Guide For
              </h2>
              <div className="space-y-4">
                {Object.entries(speciesByCategory).map(([category, speciesInCat]) => (
                  <div key={category}>
                    <div className="text-xs font-semibold text-wht-stone uppercase tracking-wider mb-2">
                      {category}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {speciesInCat.map((name) => (
                        <label
                          key={name}
                          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-wht-forest"
                        >
                          <input
                            type="checkbox"
                            name="species"
                            value={name}
                            className="rounded border-gray-300 text-wht-forest focus:ring-wht-forest"
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                variant="copper"
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? 'Setting up your profile...' : 'Create Outfitter Profile'}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 bg-wht-forest rounded-xl p-4 text-center">
          <p className="text-wht-bone text-sm">
            <span className="font-bold text-wht-blaze">No Booking Commissions</span> — just one low annual fee.
          </p>
        </div>
      </div>
    </div>
  )
}
