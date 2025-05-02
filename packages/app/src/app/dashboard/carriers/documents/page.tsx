"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  Trash2, 
  Upload, 
  XCircle,
  Info,
  ArrowLeft
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Mock document types
type DocumentStatus = 'verified' | 'pending' | 'expired' | 'rejected'

interface Document {
  id: number
  type: 'insurance' | 'authority' | 'w9' | 'contract' | 'other'
  name: string
  status: DocumentStatus
  uploaded_at: string
  expires_at?: string
  file_url: string
  message?: string
}

// Mock initial documents
const initialDocuments: Document[] = [
  {
    id: 1,
    type: 'insurance',
    name: 'Insurance Certificate',
    status: 'verified',
    uploaded_at: '2023-08-15T10:30:00Z',
    expires_at: '2024-08-15T10:30:00Z',
    file_url: '/documents/insurance.pdf',
  },
  {
    id: 2,
    type: 'authority',
    name: 'Operating Authority',
    status: 'verified',
    uploaded_at: '2023-07-20T14:15:00Z',
    file_url: '/documents/authority.pdf',
  },
  {
    id: 3,
    type: 'w9',
    name: 'W-9 Form',
    status: 'pending',
    uploaded_at: '2023-09-05T09:45:00Z',
    file_url: '/documents/w9.pdf',
    message: 'Under review by broker',
  },
  {
    id: 4,
    type: 'insurance',
    name: 'Workers Compensation',
    status: 'expired',
    uploaded_at: '2023-02-10T16:20:00Z',
    expires_at: '2023-08-10T16:20:00Z',
    file_url: '/documents/workers_comp.pdf',
    message: 'Please upload a current certificate',
  },
]

// Required documents for carrier compliance
const requiredDocuments = [
  { type: 'insurance', name: 'Insurance Certificate (Primary)', required: true },
  { type: 'insurance', name: 'Workers Compensation', required: true },
  { type: 'authority', name: 'Operating Authority', required: true },
  { type: 'w9', name: 'W-9 Form', required: true },
  { type: 'contract', name: 'Broker-Carrier Agreement', required: false },
]

export default function CarrierDocumentsPage() {
  // This is a placeholder for demonstration. In production, this would come from useParams()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const carrierId = '12345'
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadType, setUploadType] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  
  const verifiedDocs = documents.filter(doc => doc.status === 'verified')
  const pendingDocs = documents.filter(doc => doc.status === 'pending')
  const expiredDocs = documents.filter(doc => doc.status === 'expired' || doc.status === 'rejected')
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0])
    }
  }
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadFile || !uploadType) {
      return
    }
    
    setUploadStatus('uploading')
    
    try {
      // In a real app, upload the file to your API
      // For demonstration, we'll simulate an upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create a new document entry
      const newDocument: Document = {
        id: Math.max(...documents.map(d => d.id), 0) + 1,
        type: uploadType as 'insurance' | 'authority' | 'w9' | 'contract' | 'other',
        name: uploadType === 'other' ? uploadFile.name : requiredDocuments.find(d => d.type === uploadType)?.name || `${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} Document`,
        status: 'pending',
        uploaded_at: new Date().toISOString(),
        file_url: URL.createObjectURL(uploadFile),
        message: 'Awaiting broker approval',
      }
      
      // If expiration date was provided for insurance documents
      if (expirationDate && (uploadType === 'insurance')) {
        newDocument.expires_at = new Date(expirationDate).toISOString()
      }
      
      // Add the new document to the list
      setDocuments([...documents, newDocument])
      setUploadStatus('success')
      
      // Close the modal after a delay
      setTimeout(() => {
        setShowUploadModal(false)
        setUploadStatus('idle')
        setUploadFile(null)
        setUploadType('')
        setExpirationDate('')
      }, 1500)
    } catch (err) {
      console.error('Error uploading document:', err)
      setUploadStatus('error')
    }
  }
  
  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }
  
  // Used in DocumentCard component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date)
  }
  
  const getMissingDocuments = () => {
    // Only need to check if documents exist with the right status
    return requiredDocuments.filter(doc => 
      doc.required && !documents.some(d => 
        d.type === doc.type && (d.status === 'verified' || d.status === 'pending')
      )
    )
  }
  
  const deleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }
  
  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild className="p-0 h-8 w-8">
              <Link href={`/dashboard/carriers`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your compliance documents
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
      
      {getMissingDocuments().length > 0 && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertTitle>Missing Required Documents</AlertTitle>
          <AlertDescription>
            You are missing {getMissingDocuments().length} required documents: 
            {getMissingDocuments().map(doc => doc.name).join(', ')}
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Document Requirements</CardTitle>
          <CardDescription>Required documents for compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocuments.map((doc, idx) => {
              const uploaded = documents.find(d => 
                d.type === doc.type && 
                (d.status === 'verified' || d.status === 'pending')
              )
              
              return (
                <div key={idx} className="flex items-center space-x-3 p-3 border rounded-md">
                  {uploaded ? getStatusIcon(uploaded.status) : (
                    doc.required ? <XCircle className="h-5 w-5 text-red-500" /> : <Clock className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {uploaded 
                        ? `Status: ${uploaded.status.charAt(0).toUpperCase() + uploaded.status.slice(1)}` 
                        : (doc.required ? 'Status: Missing (Required)' : 'Status: Optional')}
                    </p>
                  </div>
                  {!uploaded && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadType(doc.type)
                        setShowUploadModal(true)
                      }}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full md:w-auto mb-2">
          <TabsTrigger value="active">Active Documents ({verifiedDocs.length + pendingDocs.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired/Rejected ({expiredDocs.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {verifiedDocs.length > 0 && (
            <>
              <h3 className="text-lg font-semibold">Verified Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verifiedDocs.map(doc => (
                  <DocumentCard 
                    key={doc.id} 
                    document={doc} 
                    onDelete={() => deleteDocument(doc.id)} 
                  />
                ))}
              </div>
            </>
          )}
          
          {pendingDocs.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6">Pending Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDocs.map(doc => (
                  <DocumentCard 
                    key={doc.id} 
                    document={doc} 
                    onDelete={() => deleteDocument(doc.id)} 
                  />
                ))}
              </div>
            </>
          )}
          
          {verifiedDocs.length === 0 && pendingDocs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No Active Documents</h3>
              <p className="text-muted-foreground">Upload your first document to get started</p>
              <Button 
                className="mt-4" 
                onClick={() => setShowUploadModal(true)}
              >
                Upload Document
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          {expiredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expiredDocs.map(doc => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc} 
                  onDelete={() => deleteDocument(doc.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No Expired Documents</h3>
              <p className="text-muted-foreground">All your documents are up to date</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Document Upload Dialog */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="documentType">Document Type</Label>
                <select 
                  id="documentType"
                  value={uploadType} 
                  onChange={(e) => setUploadType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select document type</option>
                  <option value="insurance">Insurance Certificate</option>
                  <option value="authority">Operating Authority</option>
                  <option value="w9">W-9 Form</option>
                  <option value="contract">Broker-Carrier Agreement</option>
                  <option value="other">Other Document</option>
                </select>
              </div>
              
              {uploadType === 'insurance' && (
                <div className="grid gap-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <span className="flex items-center justify-center px-3 border-r bg-muted">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="border-0"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                  {uploadFile ? (
                    <div className="text-center">
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">{uploadFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => setUploadFile(null)}
                        type="button"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Input
                        id="file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        required
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => document.getElementById('file')?.click()}
                        type="button"
                      >
                        Browse Files
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowUploadModal(false)}
                type="button"
                disabled={uploadStatus === 'uploading'}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!uploadFile || !uploadType || uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 
                  uploadStatus === 'success' ? 'Uploaded!' : 'Upload'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface DocumentCardProps {
  document: Document;
  onDelete: () => void;
}

function DocumentCard({ document, onDelete }: DocumentCardProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {getStatusIcon(document.status)}
              <span className={`ml-2 text-xs font-medium rounded-full px-2 py-0.5 ${
                document.status === 'verified' ? 'bg-green-100 text-green-800' :
                document.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => window.open(document.file_url, '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer text-red-600"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="font-medium">{document.name}</h3>
          
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-start">
              <span className="text-muted-foreground w-24 flex-shrink-0">Uploaded:</span>
              <span>{formatDate(document.uploaded_at)}</span>
            </div>
            
            {document.expires_at && (
              <div className="flex items-start">
                <span className="text-muted-foreground w-24 flex-shrink-0">Expires:</span>
                <span className={new Date(document.expires_at) < new Date() ? 'text-red-500 font-medium' : ''}>
                  {formatDate(document.expires_at)}
                </span>
              </div>
            )}
            
            {document.message && (
              <div className="flex items-start mt-2">
                <span className="text-muted-foreground w-24 flex-shrink-0">Note:</span>
                <span className="italic">{document.message}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3 bg-muted/50 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => window.open(document.file_url, '_blank')}
          >
            <FileText className="mr-2 h-4 w-4" />
            View Document
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// This helper function is defined twice in the file (lines 157-170 and here)
// Keeping this version since it's used in DocumentCard component