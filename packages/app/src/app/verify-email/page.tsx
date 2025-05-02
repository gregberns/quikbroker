'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const [token, setToken] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSet, setPasswordSet] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the token from the URL
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      verifyToken(tokenParam);
    } else {
      setError('No verification token provided. Please check your invitation link.');
    }
  }, [searchParams]);

  // Function to verify the token with the API
  const verifyToken = async (tokenToVerify: string) => {
    setVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerified(true);
        // Store user info in localStorage or state
      } else {
        setError(data.message || 'Unable to verify your email. The link may be expired or invalid.');
      }
    } catch (err) {
      console.error('Error verifying token:', err);
      setError('An error occurred while verifying your email. Please try again later.');
    } finally {
      setVerifying(false);
    }
  };

  // Function to set the user's password
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    // Validate passwords
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setSettingPassword(true);

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Password set successfully
        setPasswordSet(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setPasswordError(data.message || 'Failed to set password. Please try again.');
      }
    } catch (err) {
      console.error('Error setting password:', err);
      setPasswordError('An error occurred while setting your password. Please try again.');
    } finally {
      setSettingPassword(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-12">
          <div className="max-w-md mx-auto bg-card rounded-lg shadow border border-border overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-center mb-6">Verify Your Email</h1>
              
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start mb-6" role="alert">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              {verifying && (
                <div className="text-center py-4 flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Verifying your email...</p>
                </div>
              )}
              
              {passwordSet && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Password Set Successfully
                  </h3>
                  <p className="text-green-700 mb-2">
                    Your password has been set and your account is now active.
                  </p>
                  <p className="text-green-700">
                    Redirecting you to login...
                  </p>
                </div>
              )}
              
              {verified && !passwordSet && (
                <div>
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-green-500" />
                    <span>Your email has been verified successfully! Please set your password to complete your account setup.</span>
                  </div>
                  
                  <form onSubmit={handleSetPassword} className="space-y-4">
                    {passwordError && (
                      <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start" role="alert">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{passwordError}</span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={settingPassword}
                    >
                      {settingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting Password...
                        </>
                      ) : 'Set Password and Continue'}
                    </Button>
                  </form>
                </div>
              )}
              
              {!token && !error && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No verification token found in the URL.</p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Having trouble? <Link href={{ pathname: "/support" }} className="text-primary hover:underline font-medium">Contact support</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-12">
            <div className="max-w-md mx-auto bg-card rounded-lg shadow border border-border overflow-hidden">
              <div className="h-2 bg-primary"></div>
              <div className="p-6 sm:p-8 flex justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
