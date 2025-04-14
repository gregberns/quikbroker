'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface BrokerData {
  id: number;
  email: string;
  company_name: string;
  role: string;
}

export default function BrokerDashboard() {
  const { brokerId } = useParams();
  const [broker, setBroker] = useState<BrokerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrokerData = async () => {
      try {
        const response = await fetch('/api/me');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        setBroker(data.user);
      } catch (_err) {
        console.error('Error fetching broker data:', _err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!broker) {
    return <div className="flex justify-center items-center min-h-screen">Error loading broker data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {broker.company_name || broker.email}
          </h1>
          <p className="text-gray-600 mb-6">
            Manage your carriers and transportation requests from your personalized dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Your Carriers</h2>
              <p className="text-blue-700 mb-4">View and manage your network of carriers</p>
              <button
                onClick={() => window.location.href = `/dashboard/brokers/${brokerId}/carriers`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Carriers
              </button>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-2">Transportation Requests</h2>
              <p className="text-green-700 mb-4">Manage your active transportation requests</p>
              <button
                onClick={() => window.location.href = `/dashboard/brokers/${brokerId}/requests`}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                View Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
