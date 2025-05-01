'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Loader2, AlertCircle, Mail, Eye, Edit, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/dashboard/data-table';
import { cn } from '@/lib/utils';

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
    contactName: '',
  });
  const [addingBroker, setAddingBroker] = useState(false);
  const [addBrokerError, setAddBrokerError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger refresh of data
  const router = useRouter();

  // Fetch brokers from the API
  useEffect(() => {
    fetchBrokers();
  }, [refreshKey]);

  const fetchBrokers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/brokers');

      if (!response.ok) {
        throw new Error('Failed to fetch brokers');
      }

      const data = await response.json();
      setBrokers(data.brokers);
    } catch (err) {
      console.error('Error fetching brokers:', err);
      setError('Failed to load brokers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

      // Close the modal and reset the form
      setShowAddBrokerModal(false);
      setNewBroker({ name: '', email: '', contactName: '' });
      
      // Trigger a refresh
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Error adding broker:', err);
      setAddBrokerError(err instanceof Error ? err.message : 'Failed to add broker. Please try again.');
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
    } catch (err) {
      console.error('Error sending invitation:', err);
      alert('Failed to send invitation. Please try again.');
    }
  };

  // Define columns for data table
  const columns = [
    {
      key: 'name' as keyof Broker,
      header: 'Company Name',
      cell: (broker: Broker) => (
        <Button
          variant="link"
          onClick={() => router.push(`/dashboard/admin/brokers/${broker.id}`)}
          className="p-0 h-auto font-medium text-left justify-start hover:underline"
        >
          {broker.name}
        </Button>
      )
    },
    {
      key: 'primary_email' as keyof Broker,
      header: 'Email'
    },
    {
      key: 'actions' as keyof Broker,
      header: 'Actions',
      className: 'text-right',
      cell: (broker: Broker) => (
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSendInvite(broker.id)}
          >
            <Mail className="h-4 w-4 mr-1" />
            Invite
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/dashboard/admin/brokers/${broker.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert(`Edit broker: ${broker.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/admin')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Broker Management</h1>
        </div>
        <Button 
          onClick={() => setShowAddBrokerModal(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Broker
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Brokers</h2>
              <p className="text-sm text-muted-foreground mt-1">
                A list of all brokers in the system.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setRefreshKey(prev => prev + 1)} 
                variant="outline"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start" role="alert">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          ) : (
            <DataTable 
              data={brokers}
              columns={columns}
              searchable
              searchPlaceholder="Search brokers..."
              pagination
              itemsPerPage={10}
              emptyMessage="No brokers found."
            />
          )}
        </div>
      </Card>

      {/* Add Broker Modal */}
      {showAddBrokerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-medium flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                Add New Broker
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddBrokerModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleAddBroker}>
              <div className="p-6 space-y-4">
                {addBrokerError && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{addBrokerError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Broker Company Name</Label>
                  <Input
                    id="name"
                    value={newBroker.name}
                    onChange={(e) => setNewBroker({ ...newBroker, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newBroker.email}
                    onChange={(e) => setNewBroker({ ...newBroker, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Primary Contact Name</Label>
                  <Input
                    id="contactName"
                    value={newBroker.contactName}
                    onChange={(e) => setNewBroker({ ...newBroker, contactName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t p-4 bg-muted/20">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddBrokerModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addingBroker}
                >
                  {addingBroker ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : 'Add Broker'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
