'use client'; // Mark as a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/me');

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();

        // Redirect based on user role
        if (data.user) {
          switch (data.user.role) {
            case 'admin':
              router.push('/dashboard/admin' as Route);
              break;
            case 'broker':
              router.push(`/dashboard/brokers/${data.user.id}` as Route);
              break;
            case 'carrier':
              router.push('/dashboard/carriers' as Route);
              break;
            default:
              router.push('/login' as Route);
          }
        }
      } catch {
        router.push('/login' as Route);
      }
    };

    fetchUserData();
  }, [router]);

  return <div className="flex justify-center items-center min-h-screen">Redirecting...</div>;
}
