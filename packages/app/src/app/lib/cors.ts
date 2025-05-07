import { NextRequest, NextResponse } from "next/server";

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

/**
 * Helper function to add CORS headers to a response
 * 
 * @param req - The incoming request to check origin
 * @param res - The response to add headers to
 * @returns NextResponse with appropriate CORS headers
 */
export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400", // 24 hours
  };

  // Check if the origin is in our allowed list
  if (allowedOrigins.includes(origin)) {
    // Reflect the requesting origin (not '*'), for credentials to work
    headers["Access-Control-Allow-Origin"] = origin;
    // Allow credentials (cookies, authorization headers)
    headers["Access-Control-Allow-Credentials"] = "true";
  } else {
    // For unrecognized origins, we'll still allow the request but without credentials
    headers["Access-Control-Allow-Origin"] = "*";
  }

  return headers;
}

/**
 * Handler for OPTIONS requests (preflight)
 */
export function handleOptions(req: NextRequest): NextResponse {
  const headers = corsHeaders(req);
  
  return new NextResponse(null, { 
    status: 204, // No content
    headers 
  });
}

/**
 * Add CORS headers to a NextResponse
 */
export function addCorsHeaders(req: NextRequest, res: NextResponse): NextResponse {
  const headers = corsHeaders(req);
  
  // Add CORS headers to the response
  Object.entries(headers).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
  
  return res;
}

/**
 * Wrap response with CORS headers
 */
export function withCors<T>(handler: (req: NextRequest, context: T) => Promise<NextResponse>) {
  return async (req: NextRequest, context: T): Promise<NextResponse> => {
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return handleOptions(req);
    }
    
    // Process the request with the original handler
    const response = await handler(req, context);
    
    // Add CORS headers to the response
    return addCorsHeaders(req, response);
  };
}