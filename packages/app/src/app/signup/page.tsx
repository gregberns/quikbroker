'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';

function SignupForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [brokerage, setBrokerage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update email state if the query parameter changes
  useEffect(() => {
    setEmail(searchParams.get('email') || '');
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // TODO: Implement API call to update signup record with contact details
    console.log('Submitting contact info:', { email, name, brokerage, phoneNumber });

    // Placeholder for API call simulation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Example: Handle potential API errors
    // setError('Failed to submit information. Please try again.');

    // Example: Handle success
    setSuccessMessage('Thank you! We have received your information and will be in touch shortly.');

    setIsLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          Request More Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          Thanks for your interest! If you'd like us to contact you directly with more details about QuikBroker, please provide your information below. Otherwise, feel free to explore the site.
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // Keep email required as it was the entry point
              fullWidth
              InputProps={{ readOnly: !!initialEmail }} // Make email read-only if pre-filled
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Full Name (Optional)"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Brokerage Name (Optional)"
              variant="outlined"
              value={brokerage}
              onChange={(e) => setBrokerage(e.target.value)}
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Phone Number (Optional)"
              variant="outlined"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {successMessage && (
              <Typography color="success.main" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {successMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || !!successMessage} // Disable if loading or already successful
              sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Request Contact'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

// Wrap the component with Suspense for useSearchParams
export default function SignupPage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>}>
      <SignupForm />
    </Suspense>
  );
} 
