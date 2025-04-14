'use client'; // Mark as a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: number; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/me');

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        setUser(data.user);

        // Redirect based on user role
        if (data.user) {
          switch (data.user.role) {
            case 'admin':
              router.push('/dashboard/admin');
              return;
            case 'broker':
              router.push('/dashboard/brokers');
              return;
            case 'carrier':
              // Future implementation for carriers
              // For now, they'll see the default dashboard
              break;
          }
        }
      } catch (err) {
        // Redirect to login if not authenticated
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Role-specific dashboard content
  // This is only shown if the redirect doesn't happen for some reason
  const renderRoleSpecificContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
              <p className="mb-4">Welcome to the administrative dashboard. From here you can manage brokers and carriers.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <h3 className="text-lg font-medium mb-2">Manage Brokers</h3>
                  <p className="text-gray-600 mb-3">Add, edit, or remove brokers from the system.</p>
                  <button
                    onClick={() => router.push('/admin/brokers')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Broker Management
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <h3 className="text-lg font-medium mb-2">Manage Carriers</h3>
                  <p className="text-gray-600 mb-3">View and manage carriers in the system.</p>
                  <button
                    onClick={() => router.push('/admin/carriers')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Carrier Management
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-500 italic">No recent activities to display.</p>
            </div>
          </div>
        );

      case 'broker':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Broker Dashboard</h2>
              <p className="mb-4">Welcome to your broker dashboard. Manage your carriers and transportation requests here.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <h3 className="text-lg font-medium mb-2">Your Carriers</h3>
                  <p className="text-gray-600 mb-3">View and manage your associated carriers.</p>
                  <button
                    onClick={() => router.push('/broker/carriers')}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Manage Carriers
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <h3 className="text-lg font-medium mb-2">Add New Carrier</h3>
                  <p className="text-gray-600 mb-3">Add a new carrier to your network.</p>
                  <button
                    onClick={() => router.push('/broker/carriers/new')}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Carrier
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-500 italic">No recent activities to display.</p>
            </div>
          </div>
        );

      case 'carrier':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Carrier Dashboard</h2>
              <p className="mb-4">Welcome to your carrier dashboard. View and respond to requests from brokers here.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <h3 className="text-lg font-medium mb-2">Broker Requests</h3>
                  <p className="text-gray-600 mb-3">View and respond to pending broker requests.</p>
                  <button
                    onClick={() => router.push('/carrier/requests')}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Requests
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <h3 className="text-lg font-medium mb-2">Your Brokers</h3>
                  <p className="text-gray-600 mb-3">View brokers you're working with.</p>
                  <button
                    onClick={() => router.push('/carrier/brokers')}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Brokers
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-500 italic">No recent activities to display.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Welcome</h2>
            <p>Your account role ({user?.role}) is not properly configured. Please contact an administrator.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {user?.role === 'admin' ? 'Admin Dashboard' :
              user?.role === 'broker' ? 'Broker Dashboard' :
                user?.role === 'carrier' ? 'Carrier Dashboard' : 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={() => {
                // Simple logout - in a real app, call an API to invalidate the session
                document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                router.push('/login');
              }}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
        {renderRoleSpecificContent()}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          &copy; 2025 QuikBroker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
