"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bell, 
  FileText, 
  MoreHorizontal, 
  RefreshCcw, 
  Shield, 
  Truck,
  Calendar
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface CarrierSummary {
  id: string
  name: string
  compliance_status: 'verified' | 'pending' | 'rejected'
  onboarding_progress: number
  documents_completed: number
  total_documents: number
  alerts: number
  upcoming_expirations: boolean
}

// Mock carrier data for currently logged in carrier
const mockCarrierData: CarrierSummary = {
  id: '12345',
  name: 'FastTrack Logistics, LLC',
  compliance_status: 'pending',
  onboarding_progress: 65,
  documents_completed: 3,
  total_documents: 5,
  alerts: 2,
  upcoming_expirations: true
}

// Mock upcoming document expirations
const mockExpirations = [
  {
    id: 1,
    document_name: 'Insurance Certificate',
    expiration_date: '2023-11-15',
    days_remaining: 30
  },
  {
    id: 2,
    document_name: 'Medical Card',
    expiration_date: '2023-10-25',
    days_remaining: 10
  }
]

// Mock recent notifications
const mockNotifications = [
  {
    id: 1,
    title: 'Document Approved',
    message: 'Your W-9 form has been verified and approved.',
    date: '2023-09-12T10:30:00Z',
    read: false
  },
  {
    id: 2,
    title: 'Document Rejected',
    message: 'Your insurance certificate was rejected. Please upload a current version.',
    date: '2023-09-10T14:45:00Z',
    read: false
  },
  {
    id: 3,
    title: 'Onboarding Update',
    message: 'Your carrier profile is 65% complete. Complete the remaining documents to gain full access.',
    date: '2023-09-05T09:15:00Z',
    read: true
  }
]

export default function CarrierDashboardPage() {
  const [carrier] = useState<CarrierSummary>(mockCarrierData)
  const [expirations] = useState(mockExpirations)
  const [notifications] = useState(mockNotifications)

  const unreadNotifications = notifications.filter(n => !n.read)
  
  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Carrier Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {carrier.name}
          </p>
        </div>
        <div>
          <Button variant="outline" className="mr-2">
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
          <Button asChild>
            <Link href={{ pathname: `/dashboard/carriers/${carrier.id}` }}>
              <Truck className="mr-2 h-4 w-4" /> My Profile
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Compliance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
          <CardDescription>Your current compliance status and document completion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className={`p-3 rounded-full 
                    ${carrier.compliance_status === 'verified' ? 'bg-green-100' : 
                    carrier.compliance_status === 'pending' ? 'bg-amber-100' : 
                    'bg-red-100'} mb-3`}>
                    <Shield className={`h-6 w-6 
                      ${carrier.compliance_status === 'verified' ? 'text-green-600' : 
                      carrier.compliance_status === 'pending' ? 'text-amber-600' : 
                      'text-red-600'}`} />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Compliance Status</h3>
                  <span className={`text-sm font-medium
                    ${carrier.compliance_status === 'verified' ? 'text-green-600' : 
                    carrier.compliance_status === 'pending' ? 'text-amber-600' : 
                    'text-red-600'}`}>
                    {carrier.compliance_status === 'verified' ? 'Verified' : 
                     carrier.compliance_status === 'pending' ? 'Pending Verification' : 
                     'Action Required'}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="p-3 rounded-full bg-blue-100 mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Document Completion</h3>
                  <div className="w-full flex items-center gap-3 mt-2">
                    <Progress 
                      value={(carrier.documents_completed / carrier.total_documents) * 100}
                      className={carrier.documents_completed === carrier.total_documents ? "bg-green-100" : ""}
                    />
                    <span className="text-sm font-medium">
                      {carrier.documents_completed}/{carrier.total_documents}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="p-3 rounded-full bg-violet-100 mb-3">
                    <Bell className="h-6 w-6 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Action Items</h3>
                  <span className="text-sm">
                    {carrier.alerts > 0 ? (
                      <span className="text-red-600 font-medium">{carrier.alerts} items require attention</span>
                    ) : (
                      <span className="text-green-600 font-medium">No pending actions</span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-2">
            <Button asChild>
              <Link href={{ pathname: `/dashboard/carriers/${carrier.id}/documents` }}>
                Manage Documents
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button asChild variant="outline" className="justify-start h-auto py-4 px-4">
                  <Link href={{ pathname: `/dashboard/carriers/${carrier.id}/documents` }} className="flex items-start">
                    <div className="p-2 mr-3 rounded-full bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Upload Documents</span>
                      <p className="text-sm text-muted-foreground mt-1">Submit required compliance documents</p>
                    </div>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="justify-start h-auto py-4 px-4">
                  <Link href={{ pathname: `/dashboard/carriers/${carrier.id}` }} className="flex items-start">
                    <div className="p-2 mr-3 rounded-full bg-violet-100">
                      <Truck className="h-5 w-5 text-violet-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Update Profile</span>
                      <p className="text-sm text-muted-foreground mt-1">Manage your carrier information</p>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {carrier.upcoming_expirations && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Document Expirations</CardTitle>
                <CardDescription>Documents that require renewal soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expirations.map((exp) => (
                    <Alert key={exp.id} className={exp.days_remaining <= 15 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}>
                      <Calendar className={`h-4 w-4 ${exp.days_remaining <= 15 ? "text-red-600" : "text-amber-600"}`} />
                      <AlertTitle>
                        {exp.document_name} - Expires in {exp.days_remaining} days
                      </AlertTitle>
                      <AlertDescription>
                        Expiration date: {new Date(exp.expiration_date).toLocaleDateString()}
                      </AlertDescription>
                      <div className="mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={exp.days_remaining <= 15 ? "border-red-200 bg-white hover:bg-red-50" : "border-amber-200 bg-white hover:bg-amber-50"}
                          asChild
                        >
                          <Link href={{ pathname: `/dashboard/carriers/${carrier.id}/documents` }}>
                            Renew Now
                          </Link>
                        </Button>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Notifications</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mark all as read</DropdownMenuItem>
                  <DropdownMenuItem>View all notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>
              You have {unreadNotifications.length} unread notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-1">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-md border ${!notification.read ? 'bg-blue-50 border-blue-100' : 'bg-muted/50'}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  </div>
                  <p className="text-sm mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <Button variant="outline" className="w-full" size="sm">View All Notifications</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="document_status" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="document_status">Document Status</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="document_status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Document Status</CardTitle>
              <CardDescription>Track the status of your compliance documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="p-2 mr-3 rounded-full bg-green-100">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">W-9 Form</h3>
                        <p className="text-xs text-green-700 mt-1">Verified</p>
                        <p className="text-xs text-muted-foreground mt-1">Uploaded: Sep 5, 2023</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="p-2 mr-3 rounded-full bg-green-100">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Operating Authority</h3>
                        <p className="text-xs text-green-700 mt-1">Verified</p>
                        <p className="text-xs text-muted-foreground mt-1">Uploaded: Aug 20, 2023</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="p-2 mr-3 rounded-full bg-amber-100">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Insurance Certificate</h3>
                        <p className="text-xs text-amber-700 mt-1">Pending Review</p>
                        <p className="text-xs text-muted-foreground mt-1">Uploaded: Sep 12, 2023</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="p-2 mr-3 rounded-full bg-red-100">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Workers Compensation</h3>
                        <p className="text-xs text-red-700 mt-1">Expired</p>
                        <p className="text-xs text-muted-foreground mt-1">Expired: Aug 10, 2023</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-slate-200 bg-slate-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="p-2 mr-3 rounded-full bg-slate-100">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Broker-Carrier Agreement</h3>
                        <p className="text-xs text-slate-700 mt-1">Not Uploaded (Optional)</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-7 px-2 text-xs"
                          asChild
                        >
                          <Link href={{ pathname: `/dashboard/carriers/${carrier.id}/documents` }}>
                            Upload
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={{ pathname: `/dashboard/carriers/${carrier.id}/documents` }}>
                  View All Documents
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100 mt-0.5">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-medium">Insurance Certificate</span> was uploaded</p>
                    <p className="text-xs text-muted-foreground">Sep 12, 2023 at 2:30 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100 mt-0.5">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-medium">W-9 Form</span> was verified</p>
                    <p className="text-xs text-muted-foreground">Sep 7, 2023 at 11:15 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100 mt-0.5">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-medium">W-9 Form</span> was uploaded</p>
                    <p className="text-xs text-muted-foreground">Sep 5, 2023 at 9:45 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-100 mt-0.5">
                    <Bell className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-medium">Workers Compensation</span> document expired</p>
                    <p className="text-xs text-muted-foreground">Aug 10, 2023 at 12:00 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100 mt-0.5">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-medium">Operating Authority</span> was verified</p>
                    <p className="text-xs text-muted-foreground">Aug 22, 2023 at 3:30 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                Load More Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}