import { auth } from '@/lib/auth'
import { withAxiom } from 'next-axiom'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['super_admin', 'admin'],
  '/dashboard': ['user', 'admin', 'super_admin'],
  '/settings': ['user', 'admin', 'super_admin'],
  '/organizations': ['user', 'admin', 'super_admin'],
} as const

const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/pricing',
  '/about',
  '/contact',
] as const

export default withAxiom(async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin':
          process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || '*' : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // Security headers for all responses
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
  }

  // Check if the path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isPublicRoute) {
    // Add security headers to public routes
    const response = NextResponse.next()
    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value)
    }
    return response
  }

  // Get session for protected routes
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access for protected routes
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      const userRole = (session.user as any).role || 'user'
      if (!allowedRoles.includes(userRole)) {
        // Redirect to dashboard if insufficient permissions
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      break
    }
  }

  // Add security headers and user info to protected routes
  const response = NextResponse.next()
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  // Add user info for client-side access
  response.headers.set('X-User-ID', session.user.id)
  response.headers.set('X-User-Role', (session.user as any).role || 'user')
  response.headers.set('X-User-Email', session.user.email)

  return response
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
