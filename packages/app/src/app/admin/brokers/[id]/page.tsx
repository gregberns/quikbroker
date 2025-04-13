'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logError } from '../../../lib/errorHandling';
import { use } from 'react';

interface Broker {
  id: number;
  name: string;
  primary_email: string;
  owner_user_id: number;
  created_at?: string;
  updated_at?: string;
  invitation_sent_at?: string;
}

export default function BrokerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const brokerId = unwrappedParams.id;

  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch broker details from the API
  useEffect(() => {
    const fetchBrokerDetails = async () => {
      try {
        setLoading(true);

        // For now, we'll just fetch from the brokers list API and filter
        // In a real implementation, you would have a specific endpoint for one broker
        const response = await fetch('/api/brokers');

        if (!response.ok) {
          throw new Error('Failed to fetch broker details');
        }

        const data = await response.json();
        const foundBroker = data.brokers.find((b: Broker) => b.id === parseInt(brokerId));

        if (!foundBroker) {
          throw new Error('Broker not found');
        }

        setBroker(foundBroker);
      } catch (err) {
        console.error('Error fetching broker details:', err);
        setError('Failed to load broker details. Please try again later.');

        // Log the error to our error logging system
        logError(err instanceof Error ? err : new Error('Failed to fetch broker details'), {
          page: 'admin/brokers/[id]',
          brokerId,
          action: 'fetchBrokerDetails'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerDetails();
  }, [brokerId]);

  const handleSendInvite = async () => {
    if (!broker) return;

    try {
      const response = await fetch(`/api/brokers/${brokerId}/invite`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      const data = await response.json();
      alert(data.message || 'Invitation sent successfully');

      // Update the broker to reflect the invitation was sent
      setBroker({
        ...broker,
        invitation_sent_at: data.broker.invitation_sent_at
      });
    } catch (err) {
      console.error('Error sending invitation:', err);
      alert('Failed to send invitation. Please try again.');

      // Log the error to our error logging system
      logError(err instanceof Error ? err : new Error('Failed to send invitation'), {
        page: 'admin/brokers/[id]',
        brokerId,
        action: 'sendInvite',
        broker: broker ? { id: broker.id, name: broker.name } : null
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/admin/brokers')}
            className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            &larr; Back to Brokers
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Broker Details
          </h1>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading broker details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : broker ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{broker.name}</h2>
                <p className="mt-1 text-sm text-gray-600">Broker ID: {broker.id}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSendInvite}
                  disabled={!broker.owner_user_id}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invite
                </button>
                <button
                  onClick={() => alert('Edit functionality coming soon')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{broker.name}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{broker.primary_email}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {broker.owner_user_id || 'Not assigned'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {formatDate(broker.created_at)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {formatDate(broker.updated_at)}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Invitation Sent At</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {formatDate(broker.invitation_sent_at)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Not Found: </strong>
            <span className="block sm:inline">The specified broker could not be found.</span>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          &copy; 2025 QuikBroker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
