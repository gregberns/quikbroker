'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SignupFormProps {
  className?: string;
  title?: string;
  description?: string;
  redirectPath?: string;
}

export function SignupForm({
  className,
  title = "Get Started Today",
  description = "Enter your email to begin your journey towards operational excellence and improved profitability.",
  redirectPath = "/signup",
}: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      // Save the email to localStorage to retrieve on the signup page
      localStorage.setItem('signupEmail', email);
      
      // If in a real environment, we'd call the API here:
      // const response = await fetch('/api/signups', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to signup page with email as query param
      router.push(`${redirectPath}?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      console.error("Signup submission error:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={cn(error && "border-destructive focus-visible:ring-destructive")}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : (
              'Start Your Journey'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our <Link href={{ pathname: "/terms" }} className="underline hover:text-foreground">Terms of Service</Link> and <Link href={{ pathname: "/privacy" }} className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}