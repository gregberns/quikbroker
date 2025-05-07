import { NextRequest, NextResponse } from "next/server";

// Define which routes should be protected
const protectedRoutes = ['/dashboard', '/admin'];

// Name of the auth cookie - must match what's used in lib/auth.ts
const AUTH_COOKIE_NAME = 'auth_token';

// Allowed origins for CORS
const allowedOrigins = [
  // Local development origins
  "http://localhost:3000",   // Default Next.js port
  "http://localhost:3001",   // Alternate port for MCLookup
  "http://localhost:3002",   // Another possible port
  
  // Production origins - add your actual domains here
  "https://mclookup.quikbroker.com", 
  "https://app.quikbroker.com",
  "https://quikbroker.com"
];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return handleCors(request, new NextResponse(null, { status: 204 }));
    }
    
    // Add CORS headers to all API responses
    return handleCors(request, response);
  }

  // Check if the route should be protected (for non-API routes)
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

  return response;
}

/**
 * Add CORS headers to the response
 */
function handleCors(req: NextRequest, res: NextResponse): NextResponse {
  // Get request origin
  const origin = req.headers.get("origin") || "";
  
  // Check if the origin is allowed
  if (allowedOrigins.includes(origin)) {
    // Set specific origin for trusted sites
    res.headers.set('Access-Control-Allow-Origin', origin);
    // Allow credentials (cookies, auth headers)
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    // For other origins, allow the request but without credentials
    res.headers.set('Access-Control-Allow-Origin', '*');
  }
  
  // Set standard CORS headers
  res.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
  
  return res;
}

// Configure paths the middleware applies to
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to protected routes
    '/dashboard/:path*',
    '/admin/:path*'
  ],
};
