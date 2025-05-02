import { NextRequest, NextResponse } from 'next/server';

// Define which routes should be protected
const protectedRoutes = ['/dashboard', '/admin'];

// Name of the auth cookie - must match what's used in lib/auth.ts
const AUTH_COOKIE_NAME = 'auth_token';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if the route should be protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // Get auth token cookie (set during login)
    const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    
    console.log(`Middleware checking ${pathname}: auth_token present:`, !!authToken);

    // If no auth token exists, redirect to login
    if (!authToken) {
      console.log(`Middleware redirecting ${pathname} to login (no auth token)`);
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // Here you could also validate the JWT token
    // For a complete solution, you'd verify the JWT token
    // but we're letting the API handle that for simplicity
  }

  return NextResponse.next();
}
