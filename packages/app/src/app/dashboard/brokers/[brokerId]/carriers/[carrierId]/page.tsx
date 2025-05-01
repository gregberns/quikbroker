'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Clock, 
  Mail, 
  Phone, 
  Building, 
  Truck, 
  Shield, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Calendar, 
  Edit, 
  Send, 
  AlertTriangle, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Carrier {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  mc_number: string;
  dot_number: string;
  status: 'active' | 'pending' | 'expired' | 'inactive';
  compliance_status: 'compliant' | 'warning' | 'non_compliant';
  created_at: string;
  last_active: string;
}

interface Document {
  id: number;
  type: 'insurance' | 'authority' | 'w9' | 'contract' | 'other';
  name: string;
  status: 'valid' | 'pending' | 'expired' | 'rejected';
  uploaded_at: string;
  expires_at?: string;
  file_url: string;
}

export default function CarrierDetailsPage() {
  const { brokerId, carrierId } = useParams();
  const router = useRouter();
  const [carrier, setCarrier] = useState<Carrier | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, fetch carrier from an API
    // For demonstration, we'll use mock data
    const fetchCarrierData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock carrier data
        const mockCarrier: Carrier = {
          id: parseInt(carrierId as string),
          name: 'John Smith',
          company: 'Smith Transportation',
          email: 'john@smithtrans.com',
          phone: '(555) 123-4567',
          address: '123 Trucking Ave, Logistics City, CA 90210',
          mc_number: 'MC123456',
          dot_number: 'USDOT789012',
          status: 'active',
          compliance_status: 'compliant',
          created_at: '2023-05-15T14:30:00Z',
          last_active: '2023-06-01T10:15:00Z'
        };
        
        // Mock documents
        const mockDocuments: Document[] = [
          {
            id: 1,
            type: 'insurance',
            name: 'Liability Insurance Certificate',
            status: 'valid',
            uploaded_at: '2023-05-16T09:45:00Z',
            expires_at: '2024-05-16T00:00:00Z',
            file_url: '/documents/insurance.pdf'
          },
          {
            id: 2,
            type: 'authority',
            name: 'Operating Authority',
            status: 'valid',
            uploaded_at: '2023-05-16T10:15:00Z',
            file_url: '/documents/authority.pdf'
          },
          {
            id: 3,
            type: 'w9',
            name: 'W-9 Form',
            status: 'valid',
            uploaded_at: '2023-05-16T11:30:00Z',
            file_url: '/documents/w9.pdf'
          },
          {
            id: 4,
            type: 'contract',
            name: 'Broker-Carrier Agreement',
            status: 'pending',
            uploaded_at: '2023-06-01T14:20:00Z',
            file_url: '/documents/contract.pdf'
          }
        ];
        
        setCarrier(mockCarrier);
        setDocuments(mockDocuments);
      } catch (err) {
        console.error('Error fetching carrier data:', err);
        setError('Failed to load carrier data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarrierData();
  }, [carrierId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'insurance':
        return <Shield className="h-5 w-5 text-blue-600" />;
      case 'authority':
        return <Truck className="h-5 w-5 text-green-600" />;
      case 'w9':
        return <FileText className="h-5 w-5 text-amber-600" />;
      case 'contract':
        return <FileText className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    const statusStyles = {
      valid: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      expired: "bg-red-100 text-red-800 border-red-200",
      rejected: "bg-destructive/10 text-destructive border-destructive/20",
    };
    
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status as keyof typeof statusStyles]
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !carrier) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
        <h2 className="text-xl font-semibold mb-2">Error loading carrier data</h2>
        <p className="text-muted-foreground">Please try refreshing the page or contact support.</p>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/dashboard/brokers/${brokerId}/carriers`)}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Carriers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/dashboard/brokers/${brokerId}/carriers`)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Carriers
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{carrier.company}</h1>
          <p className="text-muted-foreground">
            MC# {carrier.mc_number} · {carrier.status.charAt(0).toUpperCase() + carrier.status.slice(1)}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Carrier info */}
        <div className="lg:w-1/3 space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Carrier Information</h2>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{carrier.company}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{carrier.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{carrier.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">MC Number</p>
                    <p className="font-medium">{carrier.mc_number}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">DOT Number</p>
                    <p className="font-medium">{carrier.dot_number}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Onboarded</p>
                    <p className="font-medium">{formatDate(carrier.created_at)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-6 flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button className="flex-1">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      carrier.status === 'active' ? "bg-green-100 text-green-800 border-green-200" :
                      carrier.status === 'pending' ? "bg-amber-100 text-amber-800 border-amber-200" :
                      "bg-red-100 text-red-800 border-red-200"
                    )}>
                      {carrier.status.charAt(0).toUpperCase() + carrier.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Compliance</p>
                    <div className="flex items-center">
                      {carrier.compliance_status === 'compliant' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      ) : carrier.compliance_status === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className="text-sm font-medium capitalize">
                        {carrier.compliance_status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">Last Active</p>
                    <p className="text-sm font-medium">{formatDate(carrier.last_active)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right column - Tabs content */}
        <div className="flex-1">
          <Card className="h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="mx-6 mt-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Documents Overview</h2>
                    <Button variant="outline" onClick={() => setActiveTab('documents')}>
                      View All Documents
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-start p-4 bg-muted/30 rounded-md border">
                        <div className="bg-background p-2 rounded-md border mr-3">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{doc.name}</p>
                            {getDocumentStatusBadge(doc.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded: {formatDate(doc.uploaded_at)}
                          </p>
                          {doc.expires_at && (
                            <p className="text-xs text-muted-foreground">
                              Expires: {formatDate(doc.expires_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h2 className="text-xl font-semibold mb-4">Actions Needed</h2>
                    
                    {documents.some(doc => doc.status === 'pending') ? (
                      <div className="p-4 bg-amber-50 rounded-md border border-amber-200 text-amber-800">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold">Document Review Required</h3>
                            <p className="text-sm">
                              There are pending documents that need your review and approval.
                            </p>
                            <Button size="sm" variant="outline" className="mt-2" 
                              onClick={() => setActiveTab('documents')}>
                              Review Documents
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-green-50 rounded-md border border-green-200 text-green-800">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold">No Actions Required</h3>
                            <p className="text-sm">
                              All documents have been reviewed and approved.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Documents</h2>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download All
                      </Button>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Document</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Uploaded</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expires</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {documents.map((doc, index) => (
                          <tr key={doc.id} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-background p-1.5 rounded-md border mr-3">
                                  {getDocumentIcon(doc.type)}
                                </div>
                                <span className="font-medium">{doc.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getDocumentStatusBadge(doc.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {formatDate(doc.uploaded_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {doc.expires_at ? formatDate(doc.expires_at) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Download</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                {doc.status === 'pending' && (
                                  <>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                            <CheckCircle className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Approve</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <AlertCircle className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Reject</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Request Missing Documents
                    </Button>
                    <Button variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Activity History</h2>
                
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4 pb-6 relative">
                    <div className="absolute w-3 h-3 rounded-full bg-primary -left-[7px] top-1"></div>
                    <p className="font-medium">Carrier created</p>
                    <p className="text-sm text-muted-foreground mt-1">John Smith was added as a carrier</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(carrier.created_at)}</p>
                  </div>
                  
                  <div className="border-l-2 border-primary pl-4 pb-6 relative">
                    <div className="absolute w-3 h-3 rounded-full bg-primary -left-[7px] top-1"></div>
                    <p className="font-medium">Documents uploaded</p>
                    <p className="text-sm text-muted-foreground mt-1">Insurance Certificate and Operating Authority uploaded</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(documents[0]?.uploaded_at)}</p>
                  </div>
                  
                  <div className="border-l-2 border-primary pl-4 pb-6 relative">
                    <div className="absolute w-3 h-3 rounded-full bg-primary -left-[7px] top-1"></div>
                    <p className="font-medium">Documents verified</p>
                    <p className="text-sm text-muted-foreground mt-1">Insurance Certificate and Operating Authority verified</p>
                    <p className="text-xs text-muted-foreground mt-1">June 1, 2023</p>
                  </div>
                  
                  <div className="border-l-2 border-primary pl-4 relative">
                    <div className="absolute w-3 h-3 rounded-full bg-primary -left-[7px] top-1"></div>
                    <p className="font-medium">Carrier activated</p>
                    <p className="text-sm text-muted-foreground mt-1">Carrier status changed to Active</p>
                    <p className="text-xs text-muted-foreground mt-1">June 1, 2023</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                
                <div className="bg-muted/30 p-6 rounded-md border text-center">
                  <p className="text-muted-foreground">No notes have been added yet.</p>
                  <Button className="mt-4">Add Note</Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}