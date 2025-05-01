'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { ArrowLeft, Plus, Loader2, AlertCircle, Mail, Eye, Edit, X, Truck, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/dashboard/data-table';
import { cn } from '@/lib/utils';

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
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger refresh of data
  const router = useRouter();

  // Fetch carriers from the API
  useEffect(() => {
    fetchCarriers();
  }, [refreshKey]);

  const fetchCarriers = async () => {
    try {
      setLoading(true);
      setError(null);
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

      // Close the modal and reset the form
      setShowAddCarrierModal(false);
      setNewCarrier({ name: '', email: '', company: '', phone: '', address: '' });
      
      // Trigger a refresh
      setRefreshKey(prev => prev + 1);
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

  // Define columns for data table
  const columns = [
    {
      key: 'name' as keyof Carrier,
      header: 'Contact Name',
      cell: (carrier: Carrier) => (
        <div className="font-medium">
          {carrier.name}
        </div>
      )
    },
    {
      key: 'company' as keyof Carrier,
      header: 'Company'
    },
    {
      key: 'email' as keyof Carrier,
      header: 'Email'
    },
    {
      key: 'phone' as keyof Carrier,
      header: 'Phone',
      cell: (carrier: Carrier) => carrier.phone || '—'
    },
    {
      key: 'actions' as keyof Carrier,
      header: 'Actions',
      className: 'text-right',
      cell: (carrier: Carrier) => (
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSendInvite(carrier.id)}
          >
            <Mail className="h-4 w-4 mr-1" />
            Invite
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/dashboard/admin/carriers/${carrier.id}` as Route)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert(`Edit carrier: ${carrier.id}`)}
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
          <h1 className="text-2xl font-bold">Carrier Management</h1>
        </div>
        <Button 
          onClick={() => setShowAddCarrierModal(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Carrier
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Carriers</h2>
              <p className="text-sm text-muted-foreground mt-1">
                A list of all carriers in the system.
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
              data={carriers}
              columns={columns}
              searchable
              searchPlaceholder="Search carriers..."
              pagination
              itemsPerPage={10}
              emptyMessage="No carriers found."
            />
          )}
        </div>
      </Card>

      {/* Add Carrier Modal */}
      {showAddCarrierModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-medium flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                Add New Carrier
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddCarrierModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleAddCarrier}>
              <div className="p-6 space-y-4">
                {addCarrierError && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{addCarrierError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Contact Name</Label>
                  <Input
                    id="name"
                    value={newCarrier.name}
                    onChange={(e) => setNewCarrier({ ...newCarrier, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={newCarrier.company}
                    onChange={(e) => setNewCarrier({ ...newCarrier, company: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCarrier.email}
                    onChange={(e) => setNewCarrier({ ...newCarrier, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newCarrier.phone}
                    onChange={(e) => setNewCarrier({ ...newCarrier, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <textarea
                    id="address"
                    value={newCarrier.address}
                    onChange={(e) => setNewCarrier({ ...newCarrier, address: e.target.value })}
                    rows={3}
                    className={cn(
                      "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t p-4 bg-muted/20">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddCarrierModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addingCarrier}
                >
                  {addingCarrier ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : 'Add Carrier'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
