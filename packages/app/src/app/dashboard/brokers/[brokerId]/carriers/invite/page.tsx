'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  ChevronRight, 
  CheckCircle, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Stepper, Step } from '@/components/ui/stepper';

export default function InviteCarrierPage() {
  const { brokerId } = useParams();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('email');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    mcNumber: '',
    dotNumber: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, you would make an API call to send the invitation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setIsSuccess(true);
      
      // In a real app, you'd redirect after success or stay on page with confirmation
      setTimeout(() => {
        router.push(`/dashboard/brokers/${brokerId}/carriers`);
      }, 2000);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-2xl font-bold">Invite a Carrier</h1>
      </div>

      <Tabs 
        defaultValue="email" 
        value={currentTab} 
        onValueChange={setCurrentTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email Invitation
          </TabsTrigger>
          <TabsTrigger value="bulk" disabled>
            Bulk Import
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="mt-0">
          <Card>
            <div className="p-6 border-b">
              <Stepper currentStep={currentStep}>
                <Step title="Carrier Details" />
                <Step title="DOT Information" />
                <Step title="Send Invitation" />
              </Stepper>
            </div>
            
            <div className="p-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">Invitation Sent Successfully!</h2>
                  <p className="text-center text-muted-foreground mb-8 max-w-md">
                    An email has been sent to {formData.email} with instructions on how to join your network.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => {
                      setIsSuccess(false);
                      setCurrentStep(0);
                      setFormData({
                        companyName: '',
                        contactName: '',
                        email: '',
                        phone: '',
                        mcNumber: '',
                        dotNumber: '',
                        message: ''
                      });
                    }}>
                      Invite Another Carrier
                    </Button>
                    <Button onClick={() => router.push(`/dashboard/brokers/${brokerId}/carriers`)}>
                      Return to Carriers
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-6 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name*</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Enter carrier company name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact Name*</Label>
                          <Input
                            id="contactName"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            placeholder="Enter primary contact name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email*</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter carrier email"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter carrier phone number"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="mcNumber">MC Number*</Label>
                          <Input
                            id="mcNumber"
                            name="mcNumber"
                            value={formData.mcNumber}
                            onChange={handleInputChange}
                            placeholder="Enter MC number"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Motor Carrier number issued by the FMCSA
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dotNumber">DOT Number</Label>
                          <Input
                            id="dotNumber"
                            name="dotNumber"
                            value={formData.dotNumber}
                            onChange={handleInputChange}
                            placeholder="Enter DOT number"
                          />
                          <p className="text-xs text-muted-foreground">
                            Department of Transportation identification number
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> The carrier will need to provide documentation to verify their authority 
                          and insurance information during the onboarding process.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Invitation Message (Optional)</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Add a personal message to the invitation email"
                          rows={4}
                        />
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md mb-4">
                        <h3 className="font-semibold mb-2">Invitation Preview</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          An email invitation will be sent to <span className="font-medium">{formData.email}</span> with the following information:
                        </p>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Company: {formData.companyName}</li>
                          <li>Contact: {formData.contactName}</li>
                          <li>MC Number: {formData.mcNumber}</li>
                          {formData.dotNumber && <li>DOT Number: {formData.dotNumber}</li>}
                          <li>Instructions to complete carrier onboarding</li>
                          {formData.message && <li>Your custom message</li>}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6 pt-4 border-t">
                    {currentStep > 0 ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleBack}
                      >
                        Back
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => router.push(`/dashboard/brokers/${brokerId}/carriers`)}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    {currentStep < 2 ? (
                      <Button 
                        type="button" 
                        onClick={handleNext}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : 'Send Invitation'}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulk">
          <Card>
            <div className="p-6">
              <p>Bulk import functionality will be available soon!</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}