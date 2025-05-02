'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call the logout API
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to logout');
        }

        // Success - redirect to home page
        router.push('/');
      } catch (err) {
        console.error('Logout error:', err);
        setError('An error occurred while logging out. Please try again.');
        
        // Even if there's an error, attempt to redirect after a delay
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center max-w-md text-center p-6 bg-white rounded-lg shadow-md">
        {error ? (
          <>
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold mt-4">Logout Error</h2>
              <p className="mt-2">{error}</p>
              <p className="text-sm mt-4">Redirecting you to the home page...</p>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="text-xl font-semibold mt-4">Logging Out</h2>
            <p className="text-gray-500 mt-2">Please wait while we log you out...</p>
          </>
        )}
      </div>
    </div>
  );
}