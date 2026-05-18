'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Supabase auth would go here
      // const { error } = await createClient().auth.signInWithPassword({ email, password })
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Redirect would happen here
      setError('Supabase not configured — add credentials to .env.local to enable auth.')
    } catch {
      setError('An unexpected error occurred. Please try again.')
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
          <h1 className="text-2xl font-bold text-wht-forest mb-1 text-center">Welcome back</h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Sign in to your account
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-wht-blaze hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-wht-blaze font-semibold hover:underline">
              Sign up free
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in you agree to our{' '}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
