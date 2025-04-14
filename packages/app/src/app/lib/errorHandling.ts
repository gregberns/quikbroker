'use client';

/**
 * Utility to set up global error handlers for browser-side errors
 * This captures errors that happen outside of React components
 */
export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return; // Only run in browser

  // Handler for unhandled errors
  const handleError = (event: ErrorEvent) => {
    event.preventDefault(); // Prevent default browser error handling

    logErrorToServer({
      type: 'uncaught-error',
      message: event.message || 'Unknown error',
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    console.error('Uncaught error:', event.error);
  };

  // Handler for unhandled promise rejections
  const handleRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault(); // Prevent default browser error handling

    const reason = event.reason;
    let message = 'Promise rejected';
    let stack = '';

    if (reason instanceof Error) {
      message = reason.message;
      stack = reason.stack || '';
    } else if (typeof reason === 'string') {
      message = reason;
    } else if (reason && typeof reason === 'object') {
      message = JSON.stringify(reason);
    }

    logErrorToServer({
      type: 'unhandled-rejection',
      message,
      stack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    console.error('Unhandled promise rejection:', reason);
  };

  // Set up the event listeners
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);

  // Return a function to clean up the listeners if needed
  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };
}

// Helper function to log errors to the server
export async function logErrorToServer(errorData: Record<string, unknown>): Promise<void> {
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });
  } catch (err) {
    // If logging fails, we don't want to cause additional errors
    console.error('Failed to log error to server:', err);
  }
}

// Export a standalone function for manual error logging
export function logError(error: Error | string, context: Record<string, unknown> = {}): void {
  const errorObj = error instanceof Error ? error : new Error(error);

  logErrorToServer({
    type: 'manual-log',
    message: errorObj.message,
    stack: errorObj.stack,
    context,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    timestamp: new Date().toISOString(),
  });
}

export interface ApiError {
  message: string;
  status?: number;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}
