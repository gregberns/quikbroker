'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

// Component to handle search params access (needs Suspense boundary)
function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState({});

  // Extract UTM params on component mount
  useEffect(() => {
    const params: { [key: string]: string } = {};
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmKeys.forEach(key => {
      const value = searchParams.get(key);
      if (value) {
        params[key] = value;
      }
    });
    setUtmParams(params);
  }, [searchParams]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, ...utmParams }), // Include UTM params
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit email.');
      }

      // Redirect on success, keep existing UTM params if present
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('email', email);
      router.push(`/signup?${currentParams.toString()}` as Route);

    } catch (err: any) {
      console.error("Signup submission error:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to QuikBroker</h1>
      <p className="text-xl mb-8">
        Streamlining logistics and trucking operations for brokers and carriers with our powerful platform.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button>Get Started</Button>
        <Button variant="outline">Login</Button>
      </div>
    </div>
  );
}

// Removed feature card

// Wrap the main export in Suspense because useSearchParams needs it
export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
