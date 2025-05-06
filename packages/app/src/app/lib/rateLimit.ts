import { NextResponse } from 'next/server';

// In-memory storage for rate limiting
// In a production environment, this should be replaced with Redis or similar
const ipRequestCounts: Record<string, { count: number, firstRequestTime: number }> = {};

// Rate limit configuration
export const RATE_LIMIT = {
  MAX_REQUESTS: 5, // Maximum number of requests per time window
  TIME_WINDOW_MS: 60 * 60 * 1000, // 1 hour in milliseconds
};

// Result type for the rate limit check
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  headers: Headers;
}

/**
 * Checks if a request from a specific IP is within rate limits
 * @param ip - The IP address to check
 * @returns Rate limit result with allowed status, remaining requests, reset time, and headers
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  
  if (!ipRequestCounts[ip]) {
    // First request from this IP
    ipRequestCounts[ip] = { 
      count: 1, 
      firstRequestTime: now 
    };
    
    const headers = new Headers({
      'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
      'X-RateLimit-Remaining': (RATE_LIMIT.MAX_REQUESTS - 1).toString(),
      'X-RateLimit-Reset': new Date(now + RATE_LIMIT.TIME_WINDOW_MS).toISOString(),
    });
    
    return { 
      allowed: true, 
      remaining: RATE_LIMIT.MAX_REQUESTS - 1,
      resetTime: now + RATE_LIMIT.TIME_WINDOW_MS,
      headers
    };
  }
  
  const record = ipRequestCounts[ip];
  const headers = new Headers();
  
  // Check if the time window has expired
  if (now - record.firstRequestTime > RATE_LIMIT.TIME_WINDOW_MS) {
    // Reset the counter for a new time window
    record.count = 1;
    record.firstRequestTime = now;
    
    headers.set('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS.toString());
    headers.set('X-RateLimit-Remaining', (RATE_LIMIT.MAX_REQUESTS - 1).toString());
    headers.set('X-RateLimit-Reset', new Date(now + RATE_LIMIT.TIME_WINDOW_MS).toISOString());
    
    return { 
      allowed: true, 
      remaining: RATE_LIMIT.MAX_REQUESTS - 1,
      resetTime: now + RATE_LIMIT.TIME_WINDOW_MS,
      headers
    };
  }
  
  // Check if the IP has exceeded the rate limit
  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    const resetTime = record.firstRequestTime + RATE_LIMIT.TIME_WINDOW_MS;
    const resetTimeSeconds = Math.ceil((resetTime - now) / 1000);
    
    headers.set('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS.toString());
    headers.set('X-RateLimit-Remaining', '0');
    headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());
    headers.set('Retry-After', resetTimeSeconds.toString());
    
    return { 
      allowed: false, 
      remaining: 0,
      resetTime,
      headers
    };
  }
  
  // Increment the request count
  record.count++;
  const remaining = RATE_LIMIT.MAX_REQUESTS - record.count;
  
  headers.set('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', new Date(record.firstRequestTime + RATE_LIMIT.TIME_WINDOW_MS).toISOString());
  
  // If the remaining requests are low, add a warning header
  if (remaining <= 1) {
    headers.set('X-Rate-Limit-Warning', 'You are approaching your rate limit. Consider signing up for full access.');
  }
  
  return { 
    allowed: true, 
    remaining,
    resetTime: record.firstRequestTime + RATE_LIMIT.TIME_WINDOW_MS,
    headers
  };
}

/**
 * Creates a rate-limited response if the rate limit is exceeded
 * @param result - The rate limit check result
 * @returns A rate limit exceeded response, or null if not rate limited
 */
export function getRateLimitResponse(result: RateLimitResult): NextResponse | null {
  if (!result.allowed) {
    return NextResponse.json(
      { 
        message: "Rate limit exceeded. Please try again later or sign up for an account.", 
        remaining: result.remaining,
        resetTime: new Date(result.resetTime).toISOString()
      },
      { 
        status: 429,
        headers: result.headers
      }
    );
  }
  return null;
}