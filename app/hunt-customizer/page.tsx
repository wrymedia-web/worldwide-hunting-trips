'use client'

import { useState } from 'react'
import { CheckCircle, Send, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SPECIES_LIST = [
  'Whitetail Deer', 'Mule Deer', 'Elk', 'Moose', 'Black Bear', 'Brown Bear',
  'Grizzly Bear', 'Mountain Lion', 'Bison', 'Pronghorn Antelope', 'Bighorn Sheep',
  'Dall Sheep', 'Rocky Mountain Goat', 'Wild Boar', 'Caribou', 'Coues Deer',
  'Axis Deer', 'Sika Deer', 'Nilgai', 'Aoudad Sheep', 'Blackbuck Antelope',
  'Red Stag', 'Turkey', 'Alligator', 'Wolf', 'Buffalo', 'Exotic Game', 'Predator',
]

const HUNT_STYLES = ['Spot & Stalk', 'Blind', 'Stand', 'Driven', 'Hounds']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const PRICE_INCLUDES_OPTIONS = [
  'Observer', 'Meals', 'Lodging', 'Snacks', 'Alcohol', 'Rifle Rental', 'Ammo',
  'Tags / Licenses', 'Airport Transfer', 'Airfare', 'Laundry', 'Taxes / VAT',
  'Insurance', 'Gratuities', 'Transportation During Hunt', 'Fully Guided',
  'Semi Guided', 'Self Guided', 'Trophy Prep', 'Delivery to Taxidermist',
  'Field Dressing', 'WiFi',
]

type FormData = {
  species: string[]
  location: string
  huntingDays: string
  hunters: string
  observers: string
  trophySize: string
  nonHuntingActivities: string
  difficulty: string
  huntingStyle: string[]
  preferredAreaSize: string
  freeRangeOrFenced: string
  includes: string[]
  other: string
  name: string
  email: string
  phone: string
}

const defaultForm: FormData = {
  species: [],
  location: '',
  huntingDays: '',
  hunters: '',
  observers: '',
  trophySize: '',
  nonHuntingActivities: '',
  difficulty: '',
  huntingStyle: [],
  preferredAreaSize: '',
  freeRangeOrFenced: '',
  includes: [],
  other: '',
  name: '',
  email: '',
  phone: '',
}

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

function CheckboxGrid({ options, selected, onChange, cols = 2 }: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  cols?: number
}) {
  return (
    <div className={`grid grid-cols-${cols} gap-2`}>
      {options.map((o) => (
        <label key={o} className={`flex items-center gap-2 cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
          selected.includes(o)
            ? 'border-wht-forest bg-wht-forest/5 text-wht-forest font-medium'
            : 'border-wht-bone-2 bg-white text-wht-ink hover:border-wht-forest/40'
        }`}>
          <input
            type="checkbox"
            checked={selected.includes(o)}
            onChange={() => onChange(toggleArr(selected, o))}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
            selected.includes(o) ? 'border-wht-forest bg-wht-forest' : 'border-wht-stone'
          }`}>
            {selected.includes(o) && <CheckCircle className="w-3 h-3 text-white" />}
          </div>
          <span className="font-body">{o}</span>
        </label>
      ))}
    </div>
  )
}

export default function HuntCustomizerPage() {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-wht-paper flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-wht-bone-2 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-wht-forest/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-9 w-9 text-wht-forest" />
          </div>
          <h2 className="text-2xl font-heritage text-wht-ink mb-3">Request Sent!</h2>
          <p className="text-wht-stone font-body leading-relaxed mb-6">
            Your custom hunt request has been sent to outfitters matching your species and location. Expect responses within 2–3 business days.
          </p>
          <Button variant="default" onClick={() => { setForm(defaultForm); setSubmitted(false) }}>
            Submit Another Request
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Header */}
      <div className="bg-wht-forest py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-wht-blaze/20 border border-wht-blaze/40 mb-5">
            <Wrench className="h-7 w-7 text-wht-blaze" />
          </div>
          <h1 className="text-4xl font-heritage text-white tracking-tight mb-3">Hunt Customizer</h1>
          <p className="text-wht-bone font-body text-base leading-relaxed max-w-xl mx-auto">
            Describe your ideal hunt and we&apos;ll send it to outfitters who match your species and location. They respond with a custom quote — no middlemen.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-wht-bone-2 p-6 shadow-sm">
          <h2 className="text-lg font-heritage text-wht-ink mb-4">Your Contact Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Species */}
        <div className="bg-white rounded-xl border border-wht-bone-2 p-6 shadow-sm">
          <h2 className="text-lg font-heritage text-wht-ink mb-1">What Species? *</h2>
          <p className="text-sm text-wht-stone font-body mb-4">Select all species you&apos;re interested in. Your request goes to outfitters who offer these.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SPECIES_LIST.map((s) => (
              <label key={s} className={`flex items-center gap-2 cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
                form.species.includes(s)
                  ? 'border-wht-forest bg-wht-forest/5 text-wht-forest font-medium'
                  : 'border-wht-bone-2 bg-white text-wht-ink hover:border-wht-forest/40'
              }`}>
                <input type="checkbox" checked={form.species.includes(s)} onChange={() => set('species', toggleArr(form.species, s))} className="sr-only" />
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${form.species.includes(s) ? 'border-wht-forest bg-wht-forest' : 'border-wht-stone'}`}>
                  {form.species.includes(s) && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="font-body">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location + Dates + Group */}
        <div className="bg-white rounded-xl border border-wht-bone-2 p-6 shadow-sm">
          <h2 className="text-lg font-heritage text-wht-ink mb-4">Location &amp; Trip Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Location (Country / State / Province) *</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                placeholder="e.g. Missouri, USA or Alberta, Canada"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">How Many Hunting Days?</label>
              <input
                type="number"
                min={1}
                value={form.huntingDays}
                onChange={(e) => set('huntingDays', e.target.value)}
                className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Preferred Area Size</label>
              <input
                type="text"
                value={form.preferredAreaSize}
                onChange={(e) => set('preferredAreaSize', e.target.value)}
                className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                placeholder="e.g. 2,000+ acres"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Number of Hunters</label>
              <input
                type="number"
                min={1}
                value={form.hunters}
                onChange={(e) => set('hunters', e.target.value)}
                className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                placeholder="e.g. 2"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Number of Observers</label>
              <input
                type="number"
                min={0}
                value={form.observers}
                onChange={(e) => set('observers', e.target.value)}
                className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
                placeholder="e.g. 1"
              />
            </div>
          </div>
        </div>

        {/* Trophy + Style + Difficulty */}
        <div className="bg-white rounded-xl border border-wht-bone-2 p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-heritage text-wht-ink">Hunt Preferences</h2>

          <div>
            <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Specific Trophy Size Desired</label>
            <input
              type="text"
              value={form.trophySize}
              onChange={(e) => set('trophySize', e.target.value)}
              className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
              placeholder="e.g. Whitetail 150&quot;+, 6x6 Bull Elk, etc."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-3">Hunting Style</label>
            <CheckboxGrid options={HUNT_STYLES} selected={form.huntingStyle} onChange={(v) => set('huntingStyle', v)} cols={3} />
          </div>

          <div>
            <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-2">Hunt Difficulty</label>
            <div className="flex gap-3">
              {DIFFICULTIES.map((d) => (
                <label key={d} className={`flex-1 text-center cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  form.difficulty === d
                    ? 'border-wht-forest bg-wht-forest text-white'
                    : 'border-wht-bone-2 bg-white text-wht-ink hover:border-wht-forest/40'
                }`}>
                  <input type="radio" name="difficulty" value={d} checked={form.difficulty === d} onChange={() => set('difficulty', d)} className="sr-only" />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-2">Free Range or High Fenced?</label>
            <div className="flex gap-3">
              {['Free Range', 'High Fenced', 'No Preference'].map((o) => (
                <label key={o} className={`flex-1 text-center cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  form.freeRangeOrFenced === o
                    ? 'border-wht-forest bg-wht-forest text-white'
                    : 'border-wht-bone-2 bg-white text-wht-ink hover:border-wht-forest/40'
                }`}>
                  <input type="radio" name="fenced" value={o} checked={form.freeRangeOrFenced === o} onChange={() => set('freeRangeOrFenced', o)} className="sr-only" />
                  {o}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-wht-stone uppercase tracking-wider mb-1.5">Non-Hunting Activities Desired</label>
            <input
              type="text"
              value={form.nonHuntingActivities}
              onChange={(e) => set('nonHuntingActivities', e.target.value)}
              className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest"
              placeholder="e.g. fishing, horseback riding, ATV, hiking…"
            />
          </div>
        </div>

        {/* Price Includes */}
        <div className="bg-white rounded-xl border border-wht-bone-2 p-6 shadow-sm">
          <h2 className="text-lg font-heritage text-wht-ink mb-1">What Should the Price Include?</h2>
          <p className="text-sm text-wht-stone font-body mb-4">Select everything you want included in the outfitter&apos;s quote.</p>
          <CheckboxGrid options={PRICE_INCLUDES_OPTIONS} selected={form.includes} onChange={(v) => set('includes', v)} cols={2} />
        </div>

        {/* Other */}
        <div className="bg-white rounded-xl border border-wht-bone-2 p-6 shadow-sm">
          <h2 className="text-lg font-heritage text-wht-ink mb-1">Anything Else?</h2>
          <p className="text-sm text-wht-stone font-body mb-3">Specific requirements, things you must avoid, questions for the outfitter, or any other details.</p>
          <textarea
            rows={4}
            value={form.other}
            onChange={(e) => set('other', e.target.value)}
            className="w-full border border-wht-bone-2 rounded-lg px-3 py-2.5 text-sm text-wht-ink focus:outline-none focus:ring-2 focus:ring-wht-forest resize-none"
            placeholder="e.g. Must be wheelchair accessible. No high fence. Prefer a camp-style setting over lodge…"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="default" size="lg" className="gap-2 px-8">
            <Send className="h-5 w-5" />
            Send to Matching Outfitters
          </Button>
        </div>

        <p className="text-xs text-wht-stone text-center font-body pb-4">
          Your request will be sent to outfitters who offer the species and operate in the location you selected. Outfitters respond directly to your email.
        </p>
      </form>
    </div>
  )
}
