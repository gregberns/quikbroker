'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/authClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  
  // Use our auth hook for centralized auth management
  const { isAuthenticated, isLoading, login } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Function to get URL parameters
  const getUrlParameter = (name: string) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setIsLoggingIn(true); // Start loading state

    try {
      // Use the login function from our auth hook
      const response = await login({ email, password });
      
      console.log('Login attempt result:', response);
      
      if (response.success) {
        // Add a small delay to let the cookie be set properly before redirecting
        setTimeout(() => {
          console.log('Redirecting after successful login...');
          
          // Check if we were redirected from another page and should return there
          const fromPath = getUrlParameter('from');
          const redirectPath = fromPath || '/dashboard';
          
          console.log(`Redirecting to: ${redirectPath}`);
          
          // Force a full page reload to ensure the cookie is used in the next request
          window.location.href = redirectPath;
        }, 500);
      } else {
        setError(response.error || 'Invalid email or password');
        setIsLoggingIn(false);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-12 flex flex-col items-center">
          <Link href="/" className="self-start inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          
          <div className="text-center max-w-md mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-2">Log into QuikBroker</h1>
            <p className="text-muted-foreground">Access your account to manage logistics efficiently.</p>
          </div>
          
          <div className="w-full max-w-md bg-card rounded-lg shadow border border-border overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <div className="p-6 sm:p-8">
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start mb-6" role="alert">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href={{pathname: "/forgot-password"}} className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoggingIn || isLoading}>
                  {isLoggingIn || isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Log in'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link href={{ pathname: "/signup" }} className="text-primary hover:underline font-medium">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
