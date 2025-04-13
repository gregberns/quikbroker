import { NextRequest, NextResponse } from 'next/server';

// Define which routes should be protected
const protectedRoutes = ['/dashboard', '/admin'];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if the route should be protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // Get session cookie (this should be set during login)
    const session = request.cookies.get('session')?.value;

    // If no session exists, redirect to login
    if (!session) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // Here you could also validate the session token
    // For a complete solution, you'd verify the JWT or session token
    // against your backend/database
  }

  return NextResponse.next();
}
