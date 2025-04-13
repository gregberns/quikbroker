'use client';

import { useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { setupGlobalErrorHandlers } from '../lib/errorHandling';

export default function ClientErrorBoundary({
  children
}: {
  children: React.ReactNode
}) {
  // Set up global error handlers when the component mounts
  useEffect(() => {
    const cleanup = setupGlobalErrorHandlers();

    // Clean up when the component unmounts
    return cleanup;
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
