import { CarrierInfo } from '../components/CarrierInfoCard';

// Read from environment variable, with fallback for local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// Log development API URL for debugging
if (process.env.NODE_ENV !== 'production') {
  console.log('MCLookup API URL:', API_BASE_URL);
}

/**
 * Interface for API responses when fetching carrier info
 */
interface CarrierResponse {
  carrier: CarrierInfo;
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
 * Fetches carrier information by DOT/MC number
 */
export async function fetchCarrierByDotNumber(dotNumber: string): Promise<{ data: CarrierInfo | null; error: ApiError | null; rateLimited: boolean }> {
  try {
    // Configure fetch with CORS credentials
    const response = await fetch(`${API_BASE_URL}/fmcsa/${dotNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Enable credentials for cross-origin requests
      credentials: 'include'
    });
    
    // Check for rate limiting
    if (response.status === 429) {
      return {
        data: null,
        error: { 
          message: "You've reached the maximum number of lookups. Please try again later or create an account for unlimited access.", 
          status: 429 
        },
        rateLimited: true
      };
    }
    
    // Handle CORS errors (network errors won't have status)
    if (response.type === 'opaque' || response.type === 'error') {
      return {
        data: null,
        error: { 
          message: 'Cross-origin request blocked. This is likely a CORS configuration issue.', 
          status: 0 
        },
        rateLimited: false
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
        rateLimited: false
      };
    }
    
    // Parse successful response
    const data = await response.json() as CarrierResponse;
    
    return {
      data: data.carrier,
      error: null,
      rateLimited: false
    };
  } catch (error) {
    console.error('Error fetching carrier information:', error);
    
    // Check if it's likely a CORS error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
      return {
        data: null,
        error: { 
          message: 'Unable to connect to the API due to cross-origin restrictions. Please check your CORS configuration.', 
          status: 0 
        },
        rateLimited: false
      };
    }
    
    return {
      data: null,
      error: { 
        message: 'Failed to fetch carrier information. Please try again.', 
        status: 500 
      },
      rateLimited: false
    };
  }
}