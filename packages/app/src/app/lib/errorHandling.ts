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

    clientLogger.error('uncaught-error', event.message || 'Unknown error', {
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
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

    clientLogger.error('unhandled-rejection', message, { stack });

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

/**
 * Client-side logger - sends logs to the server
 */
export const clientLogger = {
  /**
   * Log an error
   */
  error(type: string, message: string, metadata?: Record<string, any>): void {
    logToServer({
      level: 'ERROR',
      type,
      message,
      metadata,
    });
  },

  /**
   * Log a warning
   */
  warn(type: string, message: string, metadata?: Record<string, any>): void {
    logToServer({
      level: 'WARN',
      type,
      message,
      metadata,
    });
  },

  /**
   * Log an informational message
   */
  info(type: string, message: string, metadata?: Record<string, any>): void {
    logToServer({
      level: 'INFO',
      type,
      message,
      metadata,
    });
  },

  /**
   * Log a debug message
   */
  debug(type: string, message: string, metadata?: Record<string, any>): void {
    // Only log debug messages in development
    if (process.env.NODE_ENV !== 'production') {
      logToServer({
        level: 'DEBUG',
        type,
        message,
        metadata,
      });
    }
  },
};

/**
 * Helper function to log errors to the server
 */
async function logToServer(logData: {
  level: string;
  type: string;
  message: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...logData,
        url: window.location.href,
        userAgent: window.navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    // If logging fails, we don't want to cause additional errors
    console.error('Failed to log to server:', err);
  }
}

// For backward compatibility and ease of use in client components
export function logErrorToServer(errorData: Record<string, unknown>): Promise<void> {
  return logToServer({
    level: 'ERROR',
    type: errorData.type as string || 'client-error',
    message: errorData.message as string || 'Unknown error',
    metadata: errorData,
  });
}

// Export a standalone function for manual error logging
export function logError(error: Error | string, context: Record<string, unknown> = {}): void {
  const errorObj = error instanceof Error ? error : new Error(error);

  clientLogger.error('manual-log', errorObj.message, {
    ...context,
    stack: errorObj.stack,
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
