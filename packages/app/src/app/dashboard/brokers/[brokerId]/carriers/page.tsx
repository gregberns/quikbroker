'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle,
  Mail,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/dashboard/data-table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Carrier {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'expired' | 'inactive';
  mc_number: string;
  compliance_status: 'compliant' | 'warning' | 'non_compliant';
  documents_status: 'complete' | 'incomplete' | 'expired';
  created_at: string;
  last_active: string;
}

export default function BrokerCarriersPage() {
  const { brokerId } = useParams();
  const router = useRouter();
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, fetch carriers from an API
    // For demonstration, we'll use mock data
    const fetchCarriers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockCarriers: Carrier[] = [
          {
            id: 1,
            name: 'John Smith',
            company: 'Smith Transportation',
            email: 'john@smithtrans.com',
            phone: '(555) 123-4567',
            status: 'active',
            mc_number: 'MC123456',
            compliance_status: 'compliant',
            documents_status: 'complete',
            created_at: '2023-05-15T14:30:00Z',
            last_active: '2023-06-01T10:15:00Z'
          },
          {
            id: 2,
            name: 'Jane Doe',
            company: 'JD Trucking Inc.',
            email: 'jane@jdtrucking.com',
            phone: '(555) 987-6543',
            status: 'active',
            mc_number: 'MC789012',
            compliance_status: 'warning',
            documents_status: 'incomplete',
            created_at: '2023-04-20T09:45:00Z',
            last_active: '2023-05-28T16:20:00Z'
          },
          {
            id: 3,
            name: 'Robert Johnson',
            company: 'Johnson Freight Services',
            email: 'robert@johnsonfreight.com',
            phone: '(555) 456-7890',
            status: 'pending',
            mc_number: 'MC345678',
            compliance_status: 'non_compliant',
            documents_status: 'incomplete',
            created_at: '2023-05-30T11:15:00Z',
            last_active: '2023-05-30T11:15:00Z'
          },
          {
            id: 4,
            name: 'Sarah Wilson',
            company: 'Wilson Logistics',
            email: 'sarah@wilsonlogistics.com',
            phone: '(555) 234-5678',
            status: 'expired',
            mc_number: 'MC567890',
            compliance_status: 'non_compliant',
            documents_status: 'expired',
            created_at: '2023-03-10T13:45:00Z',
            last_active: '2023-04-15T09:30:00Z'
          },
          {
            id: 5,
            name: 'Michael Brown',
            company: 'Brown Express',
            email: 'michael@brownexpress.com',
            phone: '(555) 876-5432',
            status: 'active',
            mc_number: 'MC901234',
            compliance_status: 'compliant',
            documents_status: 'complete',
            created_at: '2023-02-25T10:30:00Z',
            last_active: '2023-06-02T14:45:00Z'
          }
        ];
        
        setCarriers(mockCarriers);
      } catch (err) {
        console.error('Error fetching carriers:', err);
        setError('Failed to load carriers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarriers();
  }, [brokerId]);

  // Filter carriers based on search query and status filter
  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = searchQuery === '' || 
      carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carrier.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carrier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carrier.mc_number.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === null || carrier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInviteCarrier = () => {
    router.push(`/dashboard/brokers/${brokerId}/carriers/invite`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Define columns for the data table
  const columns = [
    {
      key: 'company' as keyof Carrier,
      header: 'Company',
      cell: (carrier: Carrier) => (
        <Link 
          href={`/dashboard/brokers/${brokerId}/carriers/${carrier.id}`}
          className="flex flex-col"
        >
          <span className="font-medium text-primary hover:underline">{carrier.company}</span>
          <span className="text-xs text-muted-foreground">MC# {carrier.mc_number}</span>
        </Link>
      )
    },
    {
      key: 'name' as keyof Carrier,
      header: 'Contact',
      cell: (carrier: Carrier) => (
        <div className="flex flex-col">
          <span>{carrier.name}</span>
          <span className="text-xs text-muted-foreground">{carrier.email}</span>
        </div>
      )
    },
    {
      key: 'status' as keyof Carrier,
      header: 'Status',
      cell: (carrier: Carrier) => {
        const statusStyles = {
          active: "bg-green-100 text-green-800 border-green-200",
          pending: "bg-amber-100 text-amber-800 border-amber-200",
          expired: "bg-red-100 text-red-800 border-red-200",
          inactive: "bg-gray-100 text-gray-800 border-gray-200",
        };
        
        const statusLabels = {
          active: "Active",
          pending: "Pending",
          expired: "Expired",
          inactive: "Inactive",
        };
        
        return (
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            statusStyles[carrier.status]
          )}>
            {statusLabels[carrier.status]}
          </span>
        );
      }
    },
    {
      key: 'compliance_status' as keyof Carrier,
      header: 'Compliance',
      cell: (carrier: Carrier) => {
        let icon;
        let style;
        
        switch (carrier.compliance_status) {
          case 'compliant':
            icon = <CheckCircle className="h-4 w-4 mr-1 text-green-600" />;
            style = "text-green-800";
            break;
          case 'warning':
            icon = <AlertTriangle className="h-4 w-4 mr-1 text-amber-600" />;
            style = "text-amber-800";
            break;
          case 'non_compliant':
            icon = <AlertCircle className="h-4 w-4 mr-1 text-red-600" />;
            style = "text-red-800";
            break;
        }
        
        return (
          <div className={`flex items-center ${style}`}>
            {icon}
            <span className="capitalize">
              {carrier.compliance_status.replace('_', ' ')}
            </span>
          </div>
        );
      }
    },
    {
      key: 'created_at' as keyof Carrier,
      header: 'Created',
      cell: (carrier: Carrier) => formatDate(carrier.created_at)
    },
    {
      key: 'actions' as keyof Carrier,
      header: 'Actions',
      className: 'text-right',
      cell: (carrier: Carrier) => (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            Documents
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => router.push(`/dashboard/brokers/${brokerId}/carriers/${carrier.id}`)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Carrier</DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              {carrier.status === 'active' && (
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Deactivate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
            onClick={() => router.push(`/dashboard/brokers/${brokerId}`)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Carriers</h1>
            <p className="text-muted-foreground">
              Manage your carrier network
            </p>
          </div>
        </div>
        <Button onClick={handleInviteCarrier}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Carrier
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search carriers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter ? `Status: ${statusFilter}` : 'Filter by Status'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('expired')}>
                    Expired
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter(null);
                }}
              >
                Clear Filters
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
              data={filteredCarriers}
              columns={columns}
              pagination
              itemsPerPage={10}
              emptyMessage="No carriers found matching your filters."
            />
          )}
        </div>
      </Card>
    </div>
  );
}