'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateOutfitterProfile, type OutfitterRecord } from '@/app/actions/outfitter'
import { US_STATES } from '@/lib/constants'

const SELECT_CLS =
  'flex h-10 w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest'

interface Props {
  outfitter: OutfitterRecord
}

export default function EditOutfitterProfileClient({ outfitter }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const { error: actionError } = await updateOutfitterProfile(formData)
      if (actionError) {
        setError(actionError)
        return
      }
      router.push('/dashboard/outfitter')
      router.refresh()
    })
  }

  return (
    <div className="min-h-screen bg-wht-paper">
      <div className="bg-wht-forest py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/dashboard/outfitter"
            className="inline-flex items-center gap-1.5 text-wht-bone/70 hover:text-wht-bone text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Outfitter Profile</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-wht-bone-2 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Name <span className="text-wht-blaze">*</span>
              </label>
              <Input
                name="business_name"
                type="text"
                defaultValue={outfitter.business_name}
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
                className={SELECT_CLS}
                defaultValue={outfitter.state ?? ''}
              >
                <option value="" disabled>Select a state</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Years in Business</label>
              <Input
                name="years_in_business"
                type="number"
                min="0"
                max="100"
                defaultValue={outfitter.years_in_business ?? ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <Input name="phone" type="tel" defaultValue={outfitter.phone ?? ''} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <Input name="email" type="email" defaultValue={outfitter.email ?? ''} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
              <Input
                name="website"
                type="url"
                defaultValue={outfitter.website ?? ''}
                placeholder="https://youroutfitter.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">About</label>
            <textarea
              name="description"
              rows={5}
              defaultValue={outfitter.description ?? ''}
              placeholder="Describe your operation, the land you hunt, and what makes your hunts special..."
              className="flex w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="copper" size="lg" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/dashboard/outfitter">
              <Button type="button" variant="ghost" size="lg" disabled={isPending}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
