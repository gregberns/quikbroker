"use client";

import { NextRequest, NextResponse } from "next/server";
import { serverLogger } from "../../lib/serverLogger";
import { handleApiError } from "../../lib/errorHandling";

/**
 * Wraps an API route handler to ensure all responses including errors are returned as JSON
 *
 * @param handler The API route handler function
 * @returns A wrapped handler that guarantees JSON responses
 */
export function withApiErrorHandler<T>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Call the original handler
      return await handler(req);
    } catch (error) {
      // Log the error using the existing server logger
      serverLogger.apiError(req, error);

      console.error(`API Error in ${req.nextUrl.pathname}:`, error);

      // Use the existing handleApiError function to format the error
      const formattedError = handleApiError(error);

      // Create a standardized error response
      const errorResponse = {
        status: "error",
        message: formattedError.message,
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : String(error)
            : undefined,
        path: req.nextUrl.pathname,
      };

      return NextResponse.json(errorResponse, {
        status: formattedError.status || 500,
      });
    }
  };
}
