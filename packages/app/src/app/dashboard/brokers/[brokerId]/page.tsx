'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Truck, 
  FileText, 
  Users, 
  PlusCircle, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  BarChart, 
  Loader2 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/dashboard/stats-card';

interface BrokerData {
  id: number;
  email: string;
  company_name: string;
  role: string;
}

interface DashboardStats {
  totalCarriers: number;
  activeCarriers: number;
  pendingInvitations: number;
  expiringDocuments: number;
  complianceRate: number;
}

export default function BrokerDashboard() {
  const { brokerId } = useParams();
  const router = useRouter();
  const [broker, setBroker] = useState<BrokerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCarriers: 0,
    activeCarriers: 0,
    pendingInvitations: 0,
    expiringDocuments: 0,
    complianceRate: 0
  });

  useEffect(() => {
    const fetchBrokerData = async () => {
      try {
        const response = await fetch('/api/me');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        setBroker(data.user);
        
        // In a real app, you'd fetch these stats from an API
        // For now we'll use placeholder data
        setStats({
          totalCarriers: 12,
          activeCarriers: 10,
          pendingInvitations: 3,
          expiringDocuments: 2,
          complianceRate: 92
        });
      } catch (_err) {
        console.error('Error fetching broker data:', _err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerData();
  }, []);

  const handleInviteCarrier = () => {
    router.push(`/dashboard/brokers/${brokerId}/carriers/invite`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
        <h2 className="text-xl font-semibold mb-2">Error loading broker data</h2>
        <p className="text-muted-foreground">Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Broker Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {broker.company_name || broker.email}
          </p>
        </div>
        <Button onClick={handleInviteCarrier}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Invite Carrier
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Carriers" 
          value={stats.totalCarriers} 
          icon={<Truck className="h-5 w-5" />} 
        />
        <StatsCard 
          title="Pending Invitations" 
          value={stats.pendingInvitations}
          icon={<Clock className="h-5 w-5" />} 
          trend="up" 
          trendValue={`${stats.pendingInvitations} awaiting response`}
        />
        <StatsCard 
          title="Compliance Rate" 
          value={`${stats.complianceRate}%`}
          icon={<CheckCircle className="h-5 w-5" />} 
          trend={stats.complianceRate >= 90 ? "up" : "down"} 
          trendValue={stats.complianceRate >= 90 ? "Good standing" : "Needs attention"}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <Link 
            href={`/dashboard/brokers/${brokerId}/carriers`} 
            className="flex flex-col items-center text-center"
          >
            <Truck className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Manage Carriers</h3>
            <p className="text-sm text-muted-foreground">View and manage your carrier network</p>
          </Link>
        </Card>
        
        <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <Link 
            href={{pathname: `/dashboard/brokers/${brokerId}/documents`}}
            className="flex flex-col items-center text-center"
          >
            <FileText className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Documents</h3>
            <p className="text-sm text-muted-foreground">Manage carrier documentation</p>
          </Link>
        </Card>
        
        <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <Link 
            href={{pathname: `/dashboard/brokers/${brokerId}/team`}}
            className="flex flex-col items-center text-center"
          >
            <Users className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Team</h3>
            <p className="text-sm text-muted-foreground">Manage your team members</p>
          </Link>
        </Card>
        
        <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <Link 
            href={{pathname: `/dashboard/brokers/${brokerId}/reports`}}
            className="flex flex-col items-center text-center"
          >
            <BarChart className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Reports</h3>
            <p className="text-sm text-muted-foreground">View analytics and reports</p>
          </Link>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Important Alerts</h2>
        </div>
        <div className="p-6">
          {stats.expiringDocuments > 0 ? (
            <div className="flex items-start p-4 bg-amber-50 rounded-md border border-amber-200 text-amber-800">
              <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Expiring Documents</h3>
                <p className="text-sm">
                  {stats.expiringDocuments} carrier{stats.expiringDocuments > 1 ? 's have' : ' has'} documents expiring within 30 days.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  View Details
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start p-4 bg-green-50 rounded-md border border-green-200 text-green-800">
              <CheckCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">All Clear</h3>
                <p className="text-sm">
                  No urgent alerts at this time. All carrier documentation is up to date.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Activity Section */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          {/* In a real app, this would be populated with actual activity data */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">New carrier invited</p>
                <p className="text-sm text-muted-foreground">AC Trucking Inc. was invited to join your network</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-4">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Document updated</p>
                <p className="text-sm text-muted-foreground">Smith Transportation updated their insurance certificate</p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-4">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Team member added</p>
                <p className="text-sm text-muted-foreground">Sarah Johnson joined your team as a dispatcher</p>
                <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link">View All Activity</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}