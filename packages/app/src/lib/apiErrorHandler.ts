import { NextRequest } from 'next/server';
import { internalServerError } from '../app/api/error';

/**
 * Global error handler for API routes
 */
export async function apiErrorHandler(req: NextRequest, handler: Function) {
  try {
    return await handler(req);
  } catch (error) {
    console.error(`Unhandled API error [${req.method} ${req.nextUrl.pathname}]:`, error);
    return internalServerError(req, error instanceof Error ? error : new Error(String(error)));
  }
}