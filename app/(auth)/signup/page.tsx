'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Eye, EyeOff, Crosshair, Mountain, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { createProfile } from '@/app/actions/auth'

type AccountType = 'hunter' | 'outfitter'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [accountType, setAccountType] = useState<AccountType>('hunter')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName, role: accountType } },
      })

      if (signUpError) { setError(signUpError.message); return }

      const user = data.user
      if (!user) { setError('Signup failed. Please try again.'); return }

      const { error: profileError } = await createProfile(user.id, accountType, formData.email)
      if (profileError) { setError(profileError); return }

      router.push(accountType === 'outfitter' ? '/dashboard/outfitter/setup' : '/dashboard/hunter')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-wht-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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
          <h1 className="text-2xl font-bold text-wht-forest mb-1 text-center">Create your account</h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Join thousands of hunters and outfitters
          </p>

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAccountType('hunter')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'hunter'
                  ? 'border-wht-forest bg-wht-forest/5'
                  : 'border-wht-bone-2 hover:border-gray-300'
              }`}
            >
              <Crosshair className={`h-7 w-7 ${accountType === 'hunter' ? 'text-wht-forest' : 'text-gray-400'}`} />
              <div className="text-center">
                <div className={`font-semibold text-sm ${accountType === 'hunter' ? 'text-wht-forest' : 'text-gray-600'}`}>
                  I&apos;m a Hunter
                </div>
                <div className="text-xs text-gray-400">Find &amp; book hunts</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('outfitter')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'outfitter'
                  ? 'border-wht-blaze bg-wht-blaze/5'
                  : 'border-wht-bone-2 hover:border-gray-300'
              }`}
            >
              <Mountain className={`h-7 w-7 ${accountType === 'outfitter' ? 'text-wht-blaze' : 'text-gray-400'}`} />
              <div className="text-center">
                <div className={`font-semibold text-sm ${accountType === 'outfitter' ? 'text-wht-blaze' : 'text-gray-600'}`}>
                  I&apos;m an Outfitter
                </div>
                <div className="text-xs text-gray-400">List your hunts</div>
              </div>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {accountType === 'outfitter' ? 'Business Name' : 'Full Name'}
              </label>
              <Input
                type="text"
                placeholder={accountType === 'outfitter' ? 'Big Sky Outfitters' : 'John Smith'}
                value={formData.fullName}
                onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <Input
                type="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                required
              />
            </div>

            <Button
              type="submit"
              variant={accountType === 'outfitter' ? 'copper' : 'default'}
              className="w-full gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading
                ? 'Creating account...'
                : `Create ${accountType === 'outfitter' ? 'Outfitter' : 'Hunter'} Account`}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-wht-blaze font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {accountType === 'outfitter' && (
          <div className="mt-4 bg-wht-forest rounded-xl p-4 text-center">
            <p className="text-wht-bone text-sm">
              <span className="font-bold text-wht-blaze">No Booking Commissions</span> — just one low annual fee.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
