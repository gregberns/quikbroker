'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { FormField } from '@/components/ui/form-field';
import { Container } from '@/components/ui/container';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { ArrowLeft, ArrowRight, Building, Check, Users, Shield } from 'lucide-react';
import Link from 'next/link';

// Simple phone validation function
const isValidPhone = (phone: string): boolean => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  // Check for reasonable length
  return digits.length >= 7 && digits.length <= 15;
};

function BenefitPoint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 h-6 w-6 text-primary mt-0.5">
        {icon}
      </div>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [brokerage, setBrokerage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [utmParams, setUtmParams] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync email when URL changes
  useEffect(() => {
    setEmail(searchParams.get('email') || '');
  }, [searchParams]);

  // Extract UTM parameters on mount
  useEffect(() => {
    const params: { [key: string]: string } = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
      const v = searchParams.get(key);
      if (v) params[key] = v;
    });
    setUtmParams(params);
  }, [searchParams]);

  // Handler for phone number changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    // Clear error when user starts typing again
    if (phoneError) {
      setPhoneError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPhoneError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    // Validate phone
    if (phoneNumber && !isValidPhone(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        email,
        contact_name: name || undefined,
        brokerage_name: brokerage || undefined,
        phone_number: phoneNumber || undefined,
        ...utmParams,
      };
      const res = await fetch('/api/signups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }
      setSuccessMessage('Thank you! We have received your information and will be in touch shortly.');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-primary/5 to-background">
          <Container className="py-8 md:py-12">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Left side - Form */}
              <div className="lg:col-span-3">
                <Card className="shadow-md overflow-hidden">
                  <div className="bg-primary h-2"></div>
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-2xl font-bold text-center sm:text-left">
                      Complete Your Registration
                    </CardTitle>
                    <CardDescription className="text-base">
                      Begin your journey to streamlined carrier management and operational excellence.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <FormField 
                        id="email" 
                        label="Email Address"
                      >
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          readOnly={!!initialEmail}
                          className="w-full"
                        />
                      </FormField>
                      
                      <FormField 
                        id="name" 
                        label="Full Name (Optional)"
                      >
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full"
                        />
                      </FormField>
                      
                      <FormField 
                        id="brokerage" 
                        label="Brokerage Name (Optional)"
                      >
                        <Input
                          id="brokerage"
                          type="text"
                          value={brokerage}
                          onChange={e => setBrokerage(e.target.value)}
                          className="w-full"
                        />
                      </FormField>
                      
                      <FormField 
                        id="phone" 
                        label="Phone Number (Optional)"
                        error={phoneError || undefined}
                      >
                        <PhoneInput
                          id="phone"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          error={!!phoneError}
                          className="w-full"
                        />
                      </FormField>
                      
                      {error && (
                        <div className="text-sm text-destructive pt-2">
                          {error}
                        </div>
                      )}
                      
                      {successMessage && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 font-medium text-center">
                          <Check className="h-5 w-5 text-green-600 mx-auto mb-2" />
                          {successMessage}
                        </div>
                      )}
                      
                      <Button
                        type="submit"
                        className="w-full mt-4"
                        size="lg"
                        disabled={isLoading || !!successMessage}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Your Request
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            Start Your Journey
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right side - Benefits */}
              <div className="lg:col-span-2">
                <div className="bg-muted rounded-lg p-6 md:p-8 h-full">
                  <h3 className="font-semibold text-xl mb-6">Why Join QuikBroker?</h3>
                  
                  <div className="space-y-6">
                    <BenefitPoint 
                      icon={<Shield />} 
                      text="Reduced risk through automated verification of carrier credentials and real-time monitoring" 
                    />
                    
                    <BenefitPoint 
                      icon={<Building />} 
                      text="80% faster onboarding process with digital workflows and automated document validation" 
                    />
                    
                    <BenefitPoint 
                      icon={<Check />} 
                      text="Continuous compliance monitoring with automatic alerts for expiring documents" 
                    />
                    
                    <BenefitPoint 
                      icon={<Users />} 
                      text="Enhanced carrier relationships with a professional, streamlined onboarding experience" 
                    />
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="font-medium mb-2">What happens next?</p>
                    <ol className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-baseline gap-2">
                        <span className="font-medium text-foreground">1.</span>
                        <span>Our team will contact you within 1 business day</span>
                      </li>
                      <li className="flex items-baseline gap-2">
                        <span className="font-medium text-foreground">2.</span>
                        <span>We'll schedule a personalized demo of the platform</span>
                      </li>
                      <li className="flex items-baseline gap-2">
                        <span className="font-medium text-foreground">3.</span>
                        <span>You'll receive a custom implementation plan</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function SignupPageContent() {
  return <SignupForm />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
} 
