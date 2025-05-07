// Interface for usage tracking data
export interface UsageTrackingData {
  ip: string;
  user_agent: string;
  endpoint: string;
  query_params?: Record<string, string>;
  dot_number?: string;
  response_status: number;
  response_time: number;
  timestamp: Date;
}

/**
 * Track API usage in the database
 * In a production environment, this could be implemented as a middleware
 * or with background processing for better performance
 */
export async function trackApiUsage(data: UsageTrackingData): Promise<void> {
  try {
    // Log to console for development
    console.log(
      `API Usage: ${data.endpoint} from ${data.ip} - Status: ${data.response_status}, Time: ${data.response_time}ms`
    );

    // In a production environment, you would insert this into a database table
    // For now, we'll just return without actually inserting to avoid errors
    // since the table doesn't exist yet

    /* Example of how it would be implemented with a real table:
    
    await db.insert("app.api_usage_logs", {
      ip: data.ip,
      user_agent: data.user_agent,
      endpoint: data.endpoint,
      query_params: data.query_params ? JSON.stringify(data.query_params) : null,
      dot_number: data.dot_number || null,
      response_status: data.response_status,
      response_time: data.response_time,
      created_at: new Date(),
    }).run(sql);
    
    */
  } catch (error) {
    // Log errors but don't fail the request
    console.error("Error tracking API usage:", error);
  }
}

/**
 * Create a tracking middleware to wrap API handlers
 * @param handler - The API handler function
 * @returns A wrapped handler function that tracks usage
 */
export function withUsageTracking<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
): (...args: T) => Promise<Response> {
  return async (...args: T): Promise<Response> => {
    const startTime = Date.now();
    const req = args[0] as Request;
    const url = new URL(req.url);

    // Extract dot_number from URL path if present
    const pathParts = url.pathname.split("/");
    const dotNumberIndex = pathParts.findIndex((part) => part === "fmcsa") + 1;
    const dotNumber =
      dotNumberIndex > 0 && dotNumberIndex < pathParts.length
        ? pathParts[dotNumberIndex]
        : undefined;

    // Convert query params to record
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    try {
      const response = await handler(...args);

      // Track successful requests
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      await trackApiUsage({
        ip: req.headers.get("x-forwarded-for") || "unknown",
        user_agent: req.headers.get("user-agent") || "unknown",
        endpoint: url.pathname,
        query_params:
          Object.keys(queryParams).length > 0 ? queryParams : undefined,
        dot_number:
          dotNumber || url.searchParams.get("dot_number") || undefined,
        response_status: response.status,
        response_time: responseTime,
        timestamp: new Date(),
      });

      return response;
    } catch (error) {
      // Track failed requests
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      await trackApiUsage({
        ip: req.headers.get("x-forwarded-for") || "unknown",
        user_agent: req.headers.get("user-agent") || "unknown",
        endpoint: url.pathname,
        query_params:
          Object.keys(queryParams).length > 0 ? queryParams : undefined,
        dot_number:
          dotNumber || url.searchParams.get("dot_number") || undefined,
        response_status: 500,
        response_time: responseTime,
        timestamp: new Date(),
      });

      throw error;
    }
  };
}
