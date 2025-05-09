'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { Loader2, Shield, Building2, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/authClient';

export default function DashboardPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Checking authentication...');
  
  // Use our auth hook for centralized auth management
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // Only run this effect if auth status is determined (not loading)
    if (isLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      setError('Authentication required. Redirecting to login...');
      setTimeout(() => {
        router.push('/login' as Route);
      }, 1000);
      return;
    }
    
    // User is authenticated, redirect based on role
    if (user) {
      try {
        switch (user.role) {
          case 'admin':
            setStatus('Admin authenticated, redirecting to admin dashboard...');
            router.push('/dashboard/admin' as Route);
            break;
          case 'broker':
            setStatus('Broker authenticated, redirecting to broker dashboard...');
            // If the user is a broker, we need to find which broker they're associated with
            // For now, we're assuming the broker ID is the same as the user ID
            router.push(`/dashboard/brokers/${user.id}` as Route);
            break;
          case 'carrier':
            setStatus('Carrier authenticated, redirecting to carrier dashboard...');
            router.push('/dashboard/carriers' as Route);
            break;
          default:
            setError('Unknown user role. Please contact support.');
            setTimeout(() => {
              router.push('/login' as Route);
            }, 2000);
        }
      } catch (error) {
        console.error('Redirection error:', error);
        setError('Error during redirection. Please try again.');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center max-w-md text-center p-6 bg-white rounded-lg shadow-md">
        {error ? (
          <>
            <div className="flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </>
        ) : (
          <>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-green-100">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-amber-100">
                <Truck className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">QuikBroker Dashboard</h2>
            <p className="text-muted-foreground mb-4">{status}</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </>
        )}
      </div>
    </div>
  );
}
