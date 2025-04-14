'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHome() {
  // Add state for user data
  const [user, setUser] = useState<{ id: number; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/me');

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        // Redirect to login if not authenticated
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call server-side logout endpoint to invalidate the session
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Logout failed on server');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear the session cookie on the client side
      document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Redirect to login
      router.push('/login');
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/brokers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: companyName,
          email: email,
          contactName: contactName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add broker');
      }

      const newBrokerData = await response.json();

      // Redirect to the broker's admin page
      router.push(`/dashboard/admin/brokers/${newBrokerData.broker.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* New header bar */}
      <header className="bg-white shadow mb-6">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-3xl mb-8">
          <p className="text-lg font-medium text-gray-900">Welcome to the administrative dashboard. From here you can manage brokers, carriers, and users.</p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Management Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">User Management</h2>
            <p className="mb-6 text-gray-800">Manage system users, reset passwords, and control access permissions.</p>
            <div className="flex flex-col space-y-3">
              <Link href="/dashboard/admin/users" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center">
                View All Users
              </Link>
            </div>
          </div>

          {/* Broker Management Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Broker Management</h2>
            <p className="mb-6 text-gray-800">Add new brokers to the system and manage existing broker relationships.</p>
            <div className="flex flex-col space-y-3">
              <Link href="/dashboard/admin/brokers" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center">
                View All Brokers
              </Link>
            </div>
          </div>

          {/* Carrier Management Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Carrier Management</h2>
            <p className="mb-6 text-gray-800">Add new carriers to the system and manage existing transportation providers.</p>
            <div className="flex flex-col space-y-3">
              <Link href="/dashboard/admin/carriers" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center">
                View All Carriers
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mb-8 flex justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Add a New Broker</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-800 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-800 mb-1">
                  Contact's Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Broker'}
              </button>
            </form>
          </div>
        </div>

        <footer className="mt-8 mb-6 text-sm text-gray-700">
          &copy; 2025 QuikBroker. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
