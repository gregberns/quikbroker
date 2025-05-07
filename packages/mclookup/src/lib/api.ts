import { CarrierInfo } from "../components/CarrierInfoCard";

// Read from environment variable, with fallback for local development
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://quikbroker-production.up.railway.app/api";

// Log development API URL for debugging
if (process.env.NODE_ENV !== "production") {
  console.log("MCLookup API URL:", API_BASE_URL);
}

/**
 * Interface for API responses when fetching carrier info
 */
interface CarrierResponse {
  // The carrier can be either a single object or an array of objects
  carrier: CarrierInfo | CarrierInfo[];
  rateLimit?: {
    remaining: number;
    limit: number;
    resetTime: string;
  };
}

/**
 * Interface for error responses from the API
 */
interface ApiError {
  message: string;
  status: number;
}

/**
 * Interface for rate limit information
 */
export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetTime: string;
}

/**
 * Fetches carrier information by DOT/MC number
 */
export async function fetchCarrierByDotNumber(dotNumber: string): Promise<{
  data: CarrierInfo | null;
  error: ApiError | null;
  rateLimited: boolean;
  rateLimit?: RateLimitInfo;
}> {
  try {
    // Configure fetch with CORS credentials
    const response = await fetch(`${API_BASE_URL}/fmcsa/${dotNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Enable credentials for cross-origin requests only in production
      // This avoids CORS issues when the origin isn't explicitly allowed
      // credentials: process.env.NODE_ENV === "production" ? "include" : "same-origin",
      //
      // HACK
      //
      credentials: "same-origin",
    });

    // Check for rate limiting
    if (response.status === 429) {
      // Try to extract rate limit information if available
      let rateLimit: RateLimitInfo | undefined;
      try {
        const errorJson = await response.json();
        if (errorJson.rateLimit) {
          rateLimit = errorJson.rateLimit;
        }
      } catch {
        // Ignore parsing errors
      }

      return {
        data: null,
        error: {
          message:
            "You've reached the maximum number of lookups. Please try again later or create an account for unlimited access.",
          status: 429,
        },
        rateLimited: true,
        rateLimit,
      };
    }

    // Handle CORS errors (network errors won't have status)
    if (response.type === "opaque" || response.type === "error") {
      return {
        data: null,
        error: {
          message:
            "Cross-origin request blocked. This is likely a CORS configuration issue.",
          status: 0,
        },
        rateLimited: false,
      };
    }

    // Handle other error responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Error fetching carrier information: ${response.statusText}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // If not JSON, use the text as is
      }

      return {
        data: null,
        error: { message: errorMessage, status: response.status },
        rateLimited: false,
      };
    }

    // Parse successful response
    const data = (await response.json()) as CarrierResponse;

    // Handle case where carrier is an array - take the first item
    const carrierData = Array.isArray(data.carrier)
      ? data.carrier[0]
      : data.carrier;

    return {
      data: carrierData,
      error: null,
      rateLimited: false,
      rateLimit: data.rateLimit,
    };
  } catch (error) {
    console.error("Error fetching carrier information:", error);

    // Check if it's likely a CORS error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("CORS") ||
      errorMessage.includes("cross-origin")
    ) {
      return {
        data: null,
        error: {
          message:
            "Unable to connect to the API due to cross-origin restrictions. Please check your CORS configuration.",
          status: 0,
        },
        rateLimited: false,
      };
    }

    return {
      data: null,
      error: {
        message: "Failed to fetch carrier information. Please try again.",
        status: 500,
      },
      rateLimited: false,
    };
  }
}
