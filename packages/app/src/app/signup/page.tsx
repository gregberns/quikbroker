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
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

// Phone number regex for client-side validation
const phonePattern = /^[+]?[-\d()\s]{7,20}$/;

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
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    // Clear error when user starts typing again
    if (error && error.includes('phone')) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    // Validate phone using the matchIsValidTel function from mui-tel-input
    if (phoneNumber && !matchIsValidTel(phoneNumber)) {
      setError('Please enter a valid phone number');
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
    <Container maxWidth="sm">
      <Paper sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          Request More Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          Thanks for your interest! If you'd like us to contact you directly with more details about QuikBroker, please provide your information below. Otherwise, feel free to explore the site.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            InputProps={{ readOnly: !!initialEmail }}
            sx={{ backgroundColor: 'white' }}
          />
          <TextField
            label="Full Name (Optional)"
            variant="outlined"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            sx={{ backgroundColor: 'white' }}
          />
          <TextField
            label="Brokerage Name (Optional)"
            variant="outlined"
            value={brokerage}
            onChange={e => setBrokerage(e.target.value)}
            fullWidth
            sx={{ backgroundColor: 'white' }}
          />
          <MuiTelInput
            label="Phone Number (Optional)"
            value={phoneNumber}
            onChange={handlePhoneChange}
            defaultCountry="US"
            preferredCountries={['US', 'CA']}
            fullWidth
            error={!!error && error.includes('phone')}
            helperText={error && error.includes('phone') ? error : ''}
            sx={{ backgroundColor: 'white' }}
          />
          {error && !error.includes('phone') && (
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
            disabled={isLoading || !!successMessage}
            sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Request Contact'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <SignupForm />
    </Suspense>
  );
} 
