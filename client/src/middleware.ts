import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Landing Page - redirect to dashboard if already logged in
  if (request.nextUrl.pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protected Routes Handling
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if no token found
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // Auth Page Handling (prevent access if already logged in)
  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (token) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/auth'
  ],
}
