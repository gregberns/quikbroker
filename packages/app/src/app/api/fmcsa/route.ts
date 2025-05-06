import { NextRequest, NextResponse } from "next/server";
import {
  getFMCSACarrierByDotNumber,
  searchFMCSACarriers,
  fmcsaLookupSchema,
  FMCSALookupInput
} from "@/db/queries/fmcsa";
import { checkRateLimit, getRateLimitResponse, RATE_LIMIT } from "../../lib/rateLimit";
import { withUsageTracking } from "../../lib/usageTracking";

// Wrap the handler with usage tracking
const GET_handler = async (req: NextRequest) => {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check if this request is allowed by the rate limiter
    const rateLimitResult = checkRateLimit(ip);
    
    // If rate limit exceeded, return 429 Too Many Requests
    const rateLimitResponse = getRateLimitResponse(rateLimitResult);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    // Get query parameters
    const url = new URL(req.url);
    
    // Parse parameters from query string
    const input: FMCSALookupInput = {
      dot_number: url.searchParams.get('dot_number') || undefined,
      legal_name: url.searchParams.get('legal_name') || undefined,
      dba_name: url.searchParams.get('dba_name') || undefined,
      state: url.searchParams.get('state') || undefined,
      limit: parseInt(url.searchParams.get('limit') || '10'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
    };

    // Validate input
    try {
      fmcsaLookupSchema.parse(input);
    } catch (validationError) {
      return NextResponse.json(
        { message: "Invalid input parameters", error: validationError },
        { 
          status: 400,
          headers: rateLimitResult.headers
        }
      );
    }

    // If dot_number is provided, perform direct lookup
    if (input.dot_number) {
      const carrier = await getFMCSACarrierByDotNumber(input.dot_number);
      
      if (!carrier) {
        return NextResponse.json(
          { message: `No carrier found with DOT/MC number: ${input.dot_number}` },
          { 
            status: 404,
            headers: rateLimitResult.headers
          }
        );
      }
      
      return NextResponse.json(
        { 
          carrier,
          rateLimit: {
            remaining: rateLimitResult.remaining,
            limit: RATE_LIMIT.MAX_REQUESTS,
            resetTime: new Date(rateLimitResult.resetTime).toISOString()
          }
        },
        { headers: rateLimitResult.headers }
      );
    }
    
    // Otherwise, perform search based on provided parameters
    const { carriers, total } = await searchFMCSACarriers(input);
    
    return NextResponse.json({
      carriers,
      pagination: {
        total,
        limit: input.limit,
        offset: input.offset,
      },
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: RATE_LIMIT.MAX_REQUESTS,
        resetTime: new Date(rateLimitResult.resetTime).toISOString()
      }
    }, 
    { headers: rateLimitResult.headers });
  } catch (error) {
    console.error("Error fetching FMCSA carrier data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching carrier data" },
      { status: 500 }
    );
  }
};

// Export the handler with usage tracking
export const GET = withUsageTracking(GET_handler);