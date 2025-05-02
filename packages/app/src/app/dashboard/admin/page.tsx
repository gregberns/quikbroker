'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Building2, Truck, AlertCircle, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatsCard } from '@/components/ui/dashboard/stats-card';

export default function AdminHome() {
  // State for user data when needed
  const [, setUser] = useState<{ id: number; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBrokers: 0,
    totalCarriers: 0,
    totalUsers: 0
  });
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
        
        // In a real app, you'd fetch these stats from an API
        setStats({
          totalBrokers: 12,
          totalCarriers: 87,
          totalUsers: 25
        });
      } catch {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add broker');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the administrative dashboard. From here you can manage brokers, carriers, and users.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Brokers" 
          value={stats.totalBrokers} 
          icon={<Building2 className="h-5 w-5" />} 
          trend="up" 
          trendValue="2 new this month"
        />
        <StatsCard 
          title="Total Carriers" 
          value={stats.totalCarriers}
          icon={<Truck className="h-5 w-5" />} 
          trend="up" 
          trendValue="14 new this month"
        />
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers}
          icon={<Users className="h-5 w-5" />} 
          trend="up" 
          trendValue="3 new this month"
        />
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Management Card */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-2">User Management</h3>
          <p className="text-muted-foreground mb-6">
            Manage system users, reset passwords, and control access permissions.
          </p>
          <Button asChild className="w-full">
            <Link href="/dashboard/admin/users">
              <Users className="mr-2 h-4 w-4" />
              View All Users
            </Link>
          </Button>
        </Card>

        {/* Broker Management Card */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-2">Broker Management</h3>
          <p className="text-muted-foreground mb-6">
            Add new brokers to the system and manage existing broker relationships.
          </p>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/dashboard/admin/brokers">
              <Building2 className="mr-2 h-4 w-4" />
              View All Brokers
            </Link>
          </Button>
        </Card>

        {/* Carrier Management Card */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-2">Carrier Management</h3>
          <p className="text-muted-foreground mb-6">
            Add new carriers to the system and manage existing transportation providers.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/admin/carriers">
              <Truck className="mr-2 h-4 w-4" />
              View All Carriers
            </Link>
          </Button>
        </Card>
      </div>

      {/* Add New Broker Form */}
      <div className="flex justify-center">
        <Card className="p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Add a New Broker
          </h3>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start" role="alert">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact&apos;s Name</Label>
              <Input
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : 'Add Broker'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
