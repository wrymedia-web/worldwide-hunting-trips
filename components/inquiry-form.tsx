'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitInquiry } from '@/app/actions/inquiry'

interface InquiryFormProps {
  huntId: string | null
  outfitterId: string | null
  outfitterName: string
  isExample?: boolean
  submitLabel?: string
}

export function InquiryForm({
  huntId,
  outfitterId,
  outfitterName,
  isExample = false,
  submitLabel = 'Send Inquiry',
}: InquiryFormProps) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dates: '', partySize: '', message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (isExample || !outfitterId) {
    return (
      <div className="rounded-xl border border-wht-bone-2 bg-wht-paper p-5 text-center">
        <p className="text-sm text-wht-stone font-body">
          This is an example listing. Inquiries open once real outfitters are live on the platform.
        </p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-wht-forest mx-auto mb-3" />
        <h4 className="font-bold text-wht-forest mb-2">Inquiry Sent!</h4>
        <p className="text-sm text-gray-600">
          {outfitterName} will be in touch with you directly. A copy of your inquiry is saved to your dashboard.
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: submitError } = await submitInquiry({
      huntId,
      outfitterId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      preferredDates: form.dates,
      partySize: form.partySize ? parseInt(form.partySize, 10) : undefined,
    })
    setLoading(false)
    if (submitError) {
      setError(submitError)
      return
    }
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Your Name</label>
        <Input
          placeholder="John Smith"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
        <Input
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Phone</label>
          <Input
            type="tel"
            placeholder="(555) 000-0000"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Party Size</label>
          <Input
            type="number"
            min="1"
            placeholder="1"
            value={form.partySize}
            onChange={(e) => setForm((p) => ({ ...p, partySize: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Preferred Dates</label>
        <Input
          placeholder="e.g. November 2026"
          value={form.dates}
          onChange={(e) => setForm((p) => ({ ...p, dates: e.target.value }))}
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Message</label>
        <textarea
          className="flex min-h-[90px] w-full rounded-md border border-[#d4cfc6] bg-white px-3 py-2 text-sm text-wht-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wht-forest focus:border-transparent"
          placeholder="Tell the outfitter about your hunt goals, party size, weapon preference..."
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          required
        />
      </div>
      <Button type="submit" variant="copper" className="w-full gap-2" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? 'Sending...' : submitLabel}
      </Button>
    </form>
  )
}
