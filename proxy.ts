import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase isn't configured, allow access (dev/mock mode).
  if (
    !supabaseUrl ||
    supabaseUrl === 'your_supabase_url' ||
    !supabaseAnonKey ||
    supabaseAnonKey === 'your_supabase_anon_key'
  ) {
    return supabaseResponse
  }

  // Bind a Supabase server client to the request/response cookies so it reads the
  // real @supabase/ssr session cookies (sb-<ref>-auth-token, possibly chunked) and
  // refreshes the token. The previous check looked for legacy cookie names
  // (sb-access-token / supabase-auth-token) that this library never sets, so every
  // signed-in user was bounced to /login.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes — only redirect when there is genuinely no session.
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
