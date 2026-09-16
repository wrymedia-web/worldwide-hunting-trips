'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        return
      }
      setDone(true)

      // Route to the right dashboard, same as login.
      const { data: auth } = await supabase.auth.getUser()
      let target = '/dashboard/hunter'
      if (auth.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', auth.user.id)
          .single()
        if (profile?.role === 'outfitter') target = '/dashboard/outfitter'
      }
      setTimeout(() => window.location.assign(target), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-wht-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logos/logo-stacked-ink.svg"
              alt="Worldwide Hunting Trips"
              width={160}
              height={80}
              className="mx-auto"
            />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-wht-bone-2 p-8">
          {done ? (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-wht-forest mb-2">Password updated</h1>
              <p className="text-gray-500 text-sm">Taking you to your dashboard...</p>
            </div>
          ) : hasSession === false ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-wht-forest mb-2">Link expired</h1>
              <p className="text-gray-500 text-sm mb-6">
                This password reset link is invalid or has expired. Request a new one to continue.
              </p>
              <Link href="/forgot-password">
                <Button className="w-full">Request New Link</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-wht-forest mb-1 text-center">Set a new password</h1>
              <p className="text-gray-500 text-sm text-center mb-6">
                Choose a new password for your account
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                      autoComplete="new-password"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat your new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={loading || hasSession === null}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
