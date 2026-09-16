'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateOutfitterProfile, type OutfitterRecord } from '@/app/actions/outfitter'
import { uploadOutfitterLogo, removeOutfitterLogo } from '@/app/actions/photos'
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
  const [saved, setSaved] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(outfitter.logo_url ?? null)
  const [logoBusy, setLogoBusy] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setLogoError(null)
    setLogoBusy(true)
    const fd = new FormData()
    fd.append('file', file)
    const { logoUrl: newUrl, error: upErr } = await uploadOutfitterLogo(fd)
    setLogoBusy(false)
    if (upErr) {
      setLogoError(upErr)
      return
    }
    setLogoUrl(newUrl)
    router.refresh()
  }

  const handleLogoRemove = async () => {
    setLogoError(null)
    setLogoBusy(true)
    const { error: rmErr } = await removeOutfitterLogo()
    setLogoBusy(false)
    if (rmErr) {
      setLogoError(rmErr)
      return
    }
    setLogoUrl(null)
    router.refresh()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSaved(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const { error: actionError } = await updateOutfitterProfile(formData)
      if (actionError) {
        setError(actionError)
        return
      }
      // Show explicit confirmation before returning to the dashboard.
      setSaved(true)
      router.refresh()
      setTimeout(() => router.push('/dashboard/outfitter'), 1200)
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

        {/* Logo — uploads immediately, separate from the Save Changes form */}
        <div className="bg-white rounded-xl border border-wht-bone-2 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Logo / Photo</label>
          <p className="text-xs text-gray-500 mb-4">
            Shown on your public outfitter profile. JPG, PNG, or WebP up to 8 MB.
          </p>
          {logoError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 text-sm text-red-700">
              {logoError}
            </div>
          )}
          <div className="flex items-center gap-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Business logo"
                className="w-20 h-20 rounded-2xl object-cover border border-wht-bone-2 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-wht-forest flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {outfitter.business_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleLogoSelect}
              />
              <Button
                type="button"
                variant="copper"
                size="sm"
                disabled={logoBusy}
                onClick={() => logoInputRef.current?.click()}
                className="gap-2"
              >
                {logoBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {logoBusy ? 'Uploading...' : logoUrl ? 'Replace Logo' : 'Upload Logo'}
              </Button>
              {logoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={logoBusy}
                  onClick={handleLogoRemove}
                  className="gap-1.5 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

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

          <div className="flex items-center gap-3">
            <Button type="submit" variant="copper" size="lg" disabled={isPending || saved} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {saved ? 'Saved!' : isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/dashboard/outfitter">
              <Button type="button" variant="ghost" size="lg" disabled={isPending}>
                Cancel
              </Button>
            </Link>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle className="h-4 w-4" /> Changes saved
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
