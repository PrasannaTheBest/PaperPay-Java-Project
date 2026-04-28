import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/admin'];
const AUTH_PATHS = ['/login', '/register'];
const PUBLIC_PATHS = ['/', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if route needs protection
  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isAuthRoute = AUTH_PATHS.some(path => pathname.startsWith(path));

  // Read token from cookies
  const token = request.cookies.get('pp_token')?.value;

  // Redirect to login if accessing protected route without token
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow request to proceed
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
