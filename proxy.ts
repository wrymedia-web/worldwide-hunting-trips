import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If Supabase is not configured, allow access (dev mode)
    if (
      !supabaseUrl ||
      supabaseUrl === 'your_supabase_url' ||
      !supabaseAnonKey ||
      supabaseAnonKey === 'your_supabase_anon_key'
    ) {
      return NextResponse.next()
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get('sb-access-token') ||
      request.cookies.get('supabase-auth-token')

    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
