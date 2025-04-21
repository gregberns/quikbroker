'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping,
  Speed,
  Payments,
  Security
} from '@mui/icons-material';

// Component to handle search params access (needs Suspense boundary)
function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState({});

  // Extract UTM params on component mount
  useEffect(() => {
    const params: { [key: string]: string } = {};
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmKeys.forEach(key => {
      const value = searchParams.get(key);
      if (value) {
        params[key] = value;
      }
    });
    setUtmParams(params);
  }, [searchParams]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, ...utmParams }), // Include UTM params
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit email.');
      }

      // Redirect on success, keep existing UTM params if present
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('email', email);
      router.push(`/signup?${currentParams.toString()}` as Route);

    } catch (err: any) {
      console.error("Signup submission error:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box className="py-16 md:py-24 flex flex-col items-center text-center">
          <Typography variant="h2" component="h1" className="font-bold text-blue-800 mb-4">
            Welcome to QuikBroker
          </Typography>
          <Typography variant="h5" className="text-gray-600 max-w-2xl mb-8">
            Streamlining logistics and trucking operations for brokers and carriers with our powerful platform.
          </Typography>
          <Box className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="contained"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
              href="#signup-form"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              href="/login"
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Box className="py-16 bg-white">
        <Container maxWidth="lg">
          <Typography variant="h3" className="text-center mb-12 text-blue-800 font-semibold">
            Why Choose QuikBroker?
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <Card sx={{ height: '100%' }} className="shadow-sm hover:shadow-md transition">
                <Box className="p-4 flex justify-center">
                  <LocalShipping className="text-blue-500" sx={{ fontSize: 64 }} />
                </Box>
                <CardContent>
                  <Typography variant="h6" className="font-semibold text-center mb-2">
                    Fleet Management
                  </Typography>
                  <Typography className="text-gray-600 text-center" sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Track and manage your fleet with real-time updates and insights.
                  </Typography>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col">
              <Card sx={{ height: '100%' }} className="shadow-sm hover:shadow-md transition">
                <Box className="p-4 flex justify-center">
                  <Speed className="text-blue-500" sx={{ fontSize: 64 }} />
                </Box>
                <CardContent>
                  <Typography variant="h6" className="font-semibold text-center mb-2">
                    Fast Processing
                  </Typography>
                  <Typography className="text-gray-600 text-center" sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Reduce paperwork and quickly process shipments with our streamlined system.
                  </Typography>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col">
              <Card sx={{ height: '100%' }} className="shadow-sm hover:shadow-md transition">
                <Box className="p-4 flex justify-center">
                  <Payments className="text-blue-500" sx={{ fontSize: 64 }} />
                </Box>
                <CardContent>
                  <Typography variant="h6" className="font-semibold text-center mb-2">
                    Simplified Payments
                  </Typography>
                  <Typography className="text-gray-600 text-center" sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Manage invoices, payments, and financial tracking in one place.
                  </Typography>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col">
              <Card sx={{ height: '100%' }} className="shadow-sm hover:shadow-md transition">
                <Box className="p-4 flex justify-center">
                  <Security className="text-blue-500" sx={{ fontSize: 64 }} />
                </Box>
                <CardContent>
                  <Typography variant="h6" className="font-semibold text-center mb-2">
                    Secure Platform
                  </Typography>
                  <Typography className="text-gray-600 text-center" sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Your data is protected with enterprise-grade security protocols.
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Box>

      {/* Signup Form Section */}
      <Box id="signup-form" className="py-16 bg-blue-50">
        <Container maxWidth="sm">
          <Paper className="p-8 shadow-lg bg-white rounded-lg">
            <Typography variant="h4" className="text-center font-semibold mb-4 text-blue-800">
              Get Started with QuikBroker
            </Typography>
            <Typography className="text-center text-gray-600 mb-6">
              Enter your email to begin the signup process.
            </Typography>
            <form onSubmit={handleEmailSubmit}>
              <Box className="flex flex-col sm:flex-row gap-4 justify-center items-start">
                <TextField
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  disabled={isLoading}
                  error={!!error}
                  helperText={error}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.375rem',
                    },
                    backgroundColor: 'white'
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 py-3 text-lg sm:py-0 sm:px-8 w-full sm:w-auto"
                  sx={{ height: '56px' }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="py-8 bg-gray-800 text-white">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <Typography variant="h6" className="font-semibold mb-4">
                QuikBroker
              </Typography>
              <Typography className="text-gray-300">
                Streamlining logistics and trucking for brokers and carriers since 2023.
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="h6" className="font-semibold mb-4">
                Quick Links
              </Typography>
              <Box className="flex flex-col space-y-2">
                <a href="/about" className="text-gray-300 hover:text-white transition">About Us</a>
                <a href="/features" className="text-gray-300 hover:text-white transition">Features</a>
                <a href="/pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
                <a href="/contact" className="text-gray-300 hover:text-white transition">Contact</a>
              </Box>
            </div>
            <div className="flex flex-col">
              <Typography variant="h6" className="font-semibold mb-4">
                Contact Us
              </Typography>
              <Typography className="text-gray-300 mb-2">
                123 Logistics Way, Trucking City, TC 12345
              </Typography>
              <Typography className="text-gray-300 mb-2">
                info@quikbroker.com
              </Typography>
              <Typography className="text-gray-300">
                (555) 123-4567
              </Typography>
            </div>
          </div>
          <Box className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            &copy; {new Date().getFullYear()} QuikBroker. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

// Wrap the main export in Suspense because useSearchParams needs it
export default function Home() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>}>
      <HomePageContent />
    </Suspense>
  );
}
