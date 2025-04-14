'use client'; // Mark as a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
              router.push('/dashboard/admin');
              break;
            case 'broker':
              router.push(`/dashboard/brokers/${data.user.id}`);
              break;
            case 'carrier':
              router.push('/dashboard/carriers');
              break;
            default:
              router.push('/login');
          }
        }
      } catch {
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  return <div className="flex justify-center items-center min-h-screen">Redirecting...</div>;
}
