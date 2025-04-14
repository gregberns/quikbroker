'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';

interface Carrier {
  id: number;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  invitation_sent_at?: string;
}

export default function AdminCarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCarrierModal, setShowAddCarrierModal] = useState(false);
  const [newCarrier, setNewCarrier] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
  });
  const [addingCarrier, setAddingCarrier] = useState(false);
  const [addCarrierError, setAddCarrierError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch carriers from the API
  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/carriers');

        if (!response.ok) {
          throw new Error('Failed to fetch carriers');
        }

        const data = await response.json();
        setCarriers(data.carriers);
      } catch (err) {
        console.error('Error fetching carriers:', err);
        setError('Failed to load carriers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarriers();
  }, []);

  const handleAddCarrier = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCarrierError(null);
    setAddingCarrier(true);

    try {
      const response = await fetch('/api/carriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCarrier),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add carrier');
      }

      const data = await response.json();

      // Add the new carrier to the list
      setCarriers([...carriers, data.carrier]);

      // Close the modal and reset the form
      setShowAddCarrierModal(false);
      setNewCarrier({ name: '', email: '', company: '', phone: '', address: '' });
    } catch (err) {
      if (err instanceof Error) {
        setAddCarrierError(err.message || 'Failed to add carrier. Please try again.');
      } else {
        setAddCarrierError('Failed to add carrier. Please try again.');
      }
    } finally {
      setAddingCarrier(false);
    }
  };

  const handleSendInvite = async (carrierId: number) => {
    try {
      const response = await fetch(`/api/carriers/${carrierId}/invite`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      const data = await response.json();
      alert(data.message || 'Invitation sent successfully');

      // Update the carrier in the list to reflect the invitation was sent
      setCarriers(carriers.map(carrier =>
        carrier.id === carrierId
          ? { ...carrier, invitation_sent_at: data.carrier.invitation_sent_at }
          : carrier
      ));
    } catch (err) {
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
              Carrier Management
            </h1>
          </div>
          <button
            onClick={() => setShowAddCarrierModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Carrier
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading carriers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Carriers</h2>
              <p className="mt-1 text-sm text-gray-600">A list of all carriers in the system.</p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carriers.map((carrier) => (
                  <tr key={carrier.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{carrier.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{carrier.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{carrier.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{carrier.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleSendInvite(carrier.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Send Invite
                      </button>
                      <button
                        onClick={() => router.push(`/admin/carriers/${carrier.id}` as Route)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => alert(`Edit carrier: ${carrier.id}`)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {carriers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No carriers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Carrier Modal */}
      {showAddCarrierModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Add New Carrier</h3>
            </div>

            <form onSubmit={handleAddCarrier}>
              <div className="px-6 py-4 space-y-4">
                {addCarrierError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
                    {addCarrierError}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newCarrier.name}
                    onChange={(e) => setNewCarrier({ ...newCarrier, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    value={newCarrier.email}
                    onChange={(e) => setNewCarrier({ ...newCarrier, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={newCarrier.company}
                    onChange={(e) => setNewCarrier({ ...newCarrier, company: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={newCarrier.phone}
                    onChange={(e) => setNewCarrier({ ...newCarrier, phone: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={newCarrier.address}
                    onChange={(e) => setNewCarrier({ ...newCarrier, address: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowAddCarrierModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCarrier}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingCarrier ? 'Adding...' : 'Add Carrier'}
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
