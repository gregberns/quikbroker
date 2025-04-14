'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Broker {
  id: number;
  name: string;
  primary_email: string;
  owner_user_id: number;
  created_at?: string;
  updated_at?: string;
  invitation_sent_at?: string;
}

export default function AdminBrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddBrokerModal, setShowAddBrokerModal] = useState(false);
  const [newBroker, setNewBroker] = useState({
    name: '',
    email: '',
    contactName: '',  // Add new field for primary contact name
  });
  const [addingBroker, setAddingBroker] = useState(false);
  const [addBrokerError, setAddBrokerError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch brokers from the API
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/brokers');

        if (!response.ok) {
          throw new Error('Failed to fetch brokers');
        }

        const data = await response.json();
        setBrokers(data.brokers);
      } catch (err: any) {
        console.error('Error fetching brokers:', err);
        setError('Failed to load brokers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  const handleAddBroker = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddBrokerError(null);
    setAddingBroker(true);

    try {
      const response = await fetch('/api/brokers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBroker),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add broker');
      }

      const data = await response.json();

      // Add the new broker to the list
      setBrokers([...brokers, data.broker]);

      // Close the modal and reset the form
      setShowAddBrokerModal(false);
      setNewBroker({ name: '', email: '', contactName: '' });
    } catch (err: any) {
      console.error('Error adding broker:', err);
      setAddBrokerError(err.message || 'Failed to add broker. Please try again.');
    } finally {
      setAddingBroker(false);
    }
  };

  const handleSendInvite = async (brokerId: number) => {
    try {
      const response = await fetch(`/api/brokers/${brokerId}/invite`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      const data = await response.json();
      alert(data.message || 'Invitation sent successfully');

      // Update the broker in the list to reflect the invitation was sent
      setBrokers(brokers.map(broker =>
        broker.id === brokerId
          ? { ...broker, invitation_sent_at: data.broker.invitation_sent_at }
          : broker
      ));
    } catch (err: any) {
      console.error('Error sending invitation:', err);
      alert('Failed to send invitation. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              &larr; Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 inline-block">
              Broker Management
            </h1>
          </div>
          <button
            onClick={() => setShowAddBrokerModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Broker
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading brokers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Brokers</h2>
              <p className="mt-1 text-sm text-gray-600">A list of all brokers in the system.</p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brokers.map((broker) => (
                  <tr key={broker.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        onClick={() => router.push(`/dashboard/admin/brokers/${broker.id}`)}
                        className="text-gray-900 hover:text-blue-600 hover:underline"
                      >
                        {broker.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{broker.primary_email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleSendInvite(broker.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Send Invite
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/admin/brokers/${broker.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => alert(`Edit broker: ${broker.id}`)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {brokers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No brokers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Broker Modal */}
      {showAddBrokerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Add New Broker</h3>
            </div>

            <form onSubmit={handleAddBroker}>
              <div className="px-6 py-4 space-y-4">
                {addBrokerError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
                    {addBrokerError}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Broker Company Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newBroker.name}
                    onChange={(e) => setNewBroker({ ...newBroker, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newBroker.email}
                    onChange={(e) => setNewBroker({ ...newBroker, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Primary Contact Name
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    value={newBroker.contactName}
                    onChange={(e) => setNewBroker({ ...newBroker, contactName: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowAddBrokerModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingBroker}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingBroker ? 'Adding...' : 'Add Broker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          &copy; 2025 QuikBroker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
