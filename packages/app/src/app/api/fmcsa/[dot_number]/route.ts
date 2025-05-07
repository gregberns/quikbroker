import { NextRequest, NextResponse } from "next/server";
import { getFMCSACarrierByDotNumber } from "@/db/queries/fmcsa";
import {
  checkRateLimit,
  getRateLimitResponse,
  RATE_LIMIT,
} from "../../../lib/rateLimit";
import { withUsageTracking } from "../../../lib/usageTracking";
import { withCors, handleOptions } from "../../../lib/cors";

const GET_handler = async (
  req: NextRequest,
  { params }: { params: Promise<{ dot_number: string }> }
): Promise<NextResponse> => {
  try {
    // Properly await the params object
    const { dot_number } = await params;

    // Get client IP for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Check if this request is allowed by the rate limiter
    const rateLimitResult = checkRateLimit(ip);

    // If rate limit exceeded, return 429 Too Many Requests
    const rateLimitResponse = getRateLimitResponse(rateLimitResult);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    if (!dot_number) {
      return NextResponse.json(
        { message: "DOT/MC number is required" },
        {
          status: 400,
          headers: rateLimitResult.headers,
        }
      );
    }

    const carrier = await getFMCSACarrierByDotNumber(dot_number);

    if (!carrier) {
      return NextResponse.json(
        { message: `No carrier found with DOT/MC number: ${dot_number}` },
        {
          status: 404,
          headers: rateLimitResult.headers,
        }
      );
    }

    return NextResponse.json(
      {
        carrier,
        rateLimit: {
          remaining: rateLimitResult.remaining,
          limit: RATE_LIMIT.MAX_REQUESTS,
          resetTime: new Date(rateLimitResult.resetTime).toISOString(),
        },
      },
      { headers: rateLimitResult.headers }
    );
  } catch (error) {
    console.error(`Error fetching FMCSA carrier data:`, error);
    return NextResponse.json(
      { message: "An error occurred while fetching carrier data" },
      { status: 500 }
    );
  }
};

// Add OPTIONS handler for CORS preflight requests
export const OPTIONS = handleOptions;

// Export the handler with usage tracking and CORS support
export const GET = withCors(withUsageTracking(GET_handler));
