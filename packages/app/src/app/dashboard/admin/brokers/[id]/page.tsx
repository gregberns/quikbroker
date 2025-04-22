'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { logError } from '../../../../lib/errorHandling';
import { use } from 'react';

// Notification component
function Notification({ type, message, onDismiss }: { type: 'success' | 'error', message: string, onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`fixed top-4 right-4 z-50 rounded-md ${bgColor} p-4 ${borderColor} border shadow-lg max-w-md`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <svg className={`h-5 w-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className={`h-5 w-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 ${iconColor} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Broker {
  id: number;
  name: string;
  primary_email: string;
  owner_user_id: number;
  created_at?: string;
  updated_at?: string;
  invitation_sent_at?: string;
}

interface ActiveInvite {
  inviteUrl: string;
  expiresAt: string;
}

export default function BrokerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const brokerId = unwrappedParams.id;

  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeInvite, setActiveInvite] = useState<ActiveInvite | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showNoInviteWarning, setShowNoInviteWarning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{ name: string; primary_email: string }>({ name: '', primary_email: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const fetchActiveInvite = useCallback(async (showWarning = true) => {
    if (!broker?.owner_user_id) return;

    try {
      setInviteLoading(true);
      setInviteError(null);
      // Only show the warning when explicitly refreshing
      setShowNoInviteWarning(showWarning);

      const response = await fetch(`/api/brokers/${brokerId}/active-invite`);

      if (response.status === 404) {
        // No active invite found - this is not an error
        setActiveInvite(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch active invite');
      }

      const data = await response.json();
      setActiveInvite(data);
    } catch (err) {
      console.error('Error fetching active invite:', err);
      setInviteError('Failed to load active invite link.');

      // Log the error to our error logging system
      logError(err instanceof Error ? err : new Error('Failed to fetch active invite'), {
        page: 'admin/brokers/[id]',
        brokerId,
        action: 'fetchActiveInvite'
      });
    } finally {
      setInviteLoading(false);
    }
  }, [broker?.owner_user_id, brokerId]);

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
        setEditForm({
          name: foundBroker.name,
          primary_email: foundBroker.primary_email
        });

        // If the broker has an invitation sent, try to fetch the active invite link
        if (foundBroker.invitation_sent_at) {
          fetchActiveInvite(false);
        }
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
  }, [brokerId, fetchActiveInvite]);

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

      // After sending a new invite, fetch the active invite link
      fetchActiveInvite();
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

  const copyInviteLink = () => {
    if (!activeInvite?.inviteUrl) return;

    navigator.clipboard.writeText(activeInvite.inviteUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy invite link:', err);
      });
  };

  const handleEditClick = () => {
    if (!broker) return;
    setIsEditing(true);
    setEditForm({
      name: broker.name,
      primary_email: broker.primary_email
    });
    setUpdateError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateBroker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broker) return;

    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      const response = await fetch(`/api/brokers/${brokerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update broker details');
      }

      const data = await response.json();

      // Update the local broker state with the updated data
      setBroker({
        ...broker,
        ...editForm,
        updated_at: data.broker?.updated_at || new Date().toISOString()
      });

      setUpdateSuccess(true);
      setNotification({
        type: 'success',
        message: 'Broker details updated successfully!'
      });

      // Switch back to view mode after a short delay to show success message
      setTimeout(() => {
        setIsEditing(false);
        setUpdateSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error updating broker:', err);
      setUpdateError(err instanceof Error ? err.message : 'Failed to update broker details');
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update broker details'
      });

      logError(err instanceof Error ? err : new Error('Failed to update broker details'), {
        page: 'admin/brokers/[id]',
        brokerId,
        action: 'updateBroker',
        formData: editForm
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onDismiss={() => setNotification(null)}
        />
      )}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/admin/brokers' as Route)}
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
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Broker Details</h3>
                {updateError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{updateError}</span>
                  </div>
                )}
                {updateSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Success: </strong>
                    <span className="block sm:inline">Broker details updated successfully!</span>
                  </div>
                )}
                <form onSubmit={handleUpdateBroker}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="primary_email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="primary_email"
                        name="primary_email"
                        value={editForm.primary_email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {updateLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
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

                  {/* Active Invite Link Section */}
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Active Invite Link</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {inviteLoading ? (
                        <p className="text-gray-500">Loading invite link...</p>
                      ) : inviteError ? (
                        <div className="text-red-500">{inviteError}</div>
                      ) : activeInvite ? (
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <input
                              type="text"
                              readOnly
                              value={activeInvite.inviteUrl}
                              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                            />
                            <button
                              onClick={copyInviteLink}
                              className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Expires: {formatDate(activeInvite.expiresAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            This link can be sent to the broker to verify their email and gain access to the platform.
                          </p>
                        </div>
                      ) : broker.invitation_sent_at ? (
                        <div className="flex flex-col space-y-2">
                          {showNoInviteWarning && (
                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-md">
                              <p className="font-medium">No active invite found for this broker.</p>
                              <p className="text-xs mt-1">The invitation may have expired. Click &quot;Send Invite&quot; to generate a new invitation.</p>
                            </div>
                          )}
                          <button
                            onClick={() => fetchActiveInvite(true)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 text-sm w-fit"
                          >
                            Refresh Invite Status
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-500">No invitation has been sent yet. Use the &quot;Send Invite&quot; button to create an invitation.</p>
                      )}
                    </dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {formatDate(broker.created_at)}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {formatDate(broker.updated_at)}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Invitation Sent At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {formatDate(broker.invitation_sent_at)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
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
