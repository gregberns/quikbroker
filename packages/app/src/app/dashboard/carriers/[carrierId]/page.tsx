"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Bell, CheckCircle, FileText, Truck, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Carrier {
  id: string
  name: string
  email: string
  phone: string
  dot_number: string
  mc_number: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  contact_person: string
  insurance: {
    provider: string
    policy_number: string
    coverage_amount: number
    expiration_date: string
  }
  compliance_status: 'verified' | 'pending' | 'expired'
  onboarding_progress: number
  documents_completed: number
  total_documents: number
}

const mockCarrier: Carrier = {
  id: '1',
  name: 'FastTrack Logistics, LLC',
  email: 'operations@fasttracklogistics.com',
  phone: '(555) 123-4567',
  dot_number: 'DOT-1234567',
  mc_number: 'MC-987654',
  address: {
    street: '123 Freight Lane',
    city: 'Trucking City',
    state: 'TX',
    zip: '78701'
  },
  contact_person: 'John Trucker',
  insurance: {
    provider: 'TruckerShield Insurance',
    policy_number: 'TSI-12345-XYZ',
    coverage_amount: 1000000,
    expiration_date: '2024-06-15'
  },
  compliance_status: 'pending',
  onboarding_progress: 65,
  documents_completed: 3,
  total_documents: 5
}

// Recent Activity Mock Data
const recentActivity = [
  {
    id: 1,
    type: 'document_uploaded',
    title: 'Insurance Certificate Uploaded',
    date: '2023-09-12T14:30:00Z',
    message: 'Your insurance certificate has been submitted and is awaiting verification.',
  },
  {
    id: 2,
    type: 'document_verified',
    title: 'W-9 Form Verified',
    date: '2023-09-05T09:15:00Z',
    message: 'Your W-9 form has been verified and approved.',
  },
  {
    id: 3,
    type: 'document_rejected',
    title: 'Operating Authority Needs Update',
    date: '2023-08-28T16:45:00Z',
    message: 'Your operating authority document was rejected. Please upload a newer version.',
  },
]

export default function CarrierProfilePage() {
  const { carrierId } = useParams()
  const [carrier] = useState<Carrier>(mockCarrier)
  
  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{carrier.name}</h1>
          <p className="text-muted-foreground">
            Carrier Profile and Compliance Dashboard
          </p>
        </div>
        <div>
          <Button variant="outline" className="mr-2">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </Button>
          <Button asChild>
            <Link href={`/dashboard/carriers/${carrierId}/documents`}>
              <FileText className="mr-2 h-4 w-4" /> Manage Documents
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            <CardDescription>Onboarding and document completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Onboarding Progress</h3>
                <span className="text-sm">{carrier.onboarding_progress}%</span>
              </div>
              <Progress value={carrier.onboarding_progress} />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Document Completion</h3>
                <span className="text-sm">{carrier.documents_completed}/{carrier.total_documents}</span>
              </div>
              <Progress 
                value={(carrier.documents_completed / carrier.total_documents) * 100}
                className={
                  carrier.documents_completed === carrier.total_documents 
                    ? "bg-green-100" 
                    : carrier.documents_completed >= carrier.total_documents / 2 
                      ? "bg-amber-100" 
                      : "bg-red-100"
                }
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full ${
                      carrier.compliance_status === 'verified' ? 'bg-green-100' : 
                      carrier.compliance_status === 'pending' ? 'bg-amber-100' : 
                      'bg-red-100'
                    } mb-3`}>
                      <CheckCircle className={`h-6 w-6 ${
                        carrier.compliance_status === 'verified' ? 'text-green-600' : 
                        carrier.compliance_status === 'pending' ? 'text-amber-600' : 
                        'text-red-600'
                      }`} />
                    </div>
                    <span className="text-sm font-medium">Compliance Status</span>
                    <span className={`text-sm ${
                      carrier.compliance_status === 'verified' ? 'text-green-600' : 
                      carrier.compliance_status === 'pending' ? 'text-amber-600' : 
                      'text-red-600'
                    }`}>
                      {carrier.compliance_status.charAt(0).toUpperCase() + carrier.compliance_status.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-blue-100 mb-3">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">DOT Number</span>
                    <span className="text-sm">{carrier.dot_number}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-violet-100 mb-3">
                      <FileText className="h-6 w-6 text-violet-600" />
                    </div>
                    <span className="text-sm font-medium">MC Number</span>
                    <span className="text-sm">{carrier.mc_number}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    activity.type === 'document_verified' ? 'bg-green-100' : 
                    activity.type === 'document_uploaded' ? 'bg-blue-100' : 
                    'bg-red-100'
                  }`}>
                    {activity.type === 'document_verified' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : activity.type === 'document_uploaded' ? (
                      <FileText className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bell className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                    <p className="text-xs">{activity.message}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="info">Carrier Information</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Details</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{carrier.name}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{carrier.email}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{carrier.phone}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">DOT Number</p>
                  <p className="font-medium">{carrier.dot_number}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">MC Number</p>
                  <p className="font-medium">{carrier.mc_number}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">Primary Contact</p>
                  <p className="font-medium">{carrier.contact_person}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="space-y-0.5">
                    <p className="text-sm text-muted-foreground">Street</p>
                    <p className="font-medium">{carrier.address.street}</p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{carrier.address.city}</p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-medium">{carrier.address.state}</p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-sm text-muted-foreground">ZIP Code</p>
                    <p className="font-medium">{carrier.address.zip}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">Insurance Provider</p>
                  <p className="font-medium">{carrier.insurance.provider}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">Policy Number</p>
                  <p className="font-medium">{carrier.insurance.policy_number}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">Coverage Amount</p>
                  <p className="font-medium">${carrier.insurance.coverage_amount.toLocaleString()}</p>
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm text-muted-foreground">Expiration Date</p>
                  <p className={`font-medium ${
                    new Date(carrier.insurance.expiration_date) < new Date() 
                      ? 'text-red-600' 
                      : ''
                  }`}>
                    {new Date(carrier.insurance.expiration_date).toLocaleDateString()}
                    {new Date(carrier.insurance.expiration_date) < new Date() && ' (Expired)'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button asChild>
                  <Link href={`/dashboard/carriers/${carrierId}/documents`}>
                    <FileText className="mr-2 h-4 w-4" /> View Insurance Documents
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{carrier.contact_person}</h3>
                  <p className="text-sm text-muted-foreground">Operations Manager</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">Email: operations@fasttracklogistics.com</p>
                    <p className="text-sm">Phone: (555) 123-4568</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Additional Contacts</CardTitle>
              <Button variant="ghost" size="sm">+ Add Contact</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">RM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Robert Miles</h3>
                    <p className="text-sm text-muted-foreground">Dispatch Manager</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Email: dispatch@fasttracklogistics.com</p>
                      <p className="text-sm">Phone: (555) 123-9876</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-600">LJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Lisa Johnson</h3>
                    <p className="text-sm text-muted-foreground">Accounting</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Email: accounting@fasttracklogistics.com</p>
                      <p className="text-sm">Phone: (555) 987-6543</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}