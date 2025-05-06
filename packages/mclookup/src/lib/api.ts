import { CarrierInfo } from '../components/CarrierInfoCard';

const API_BASE_URL = '/api/fmcsa';

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
    const response = await fetch(`${API_BASE_URL}/${dotNumber}`);
    
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