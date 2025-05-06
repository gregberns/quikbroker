'use client';

import { useState } from 'react';
import { Container } from '../../../ui-components/src/components/ui/container';
import { Button } from '../../../ui-components/src/components/ui/button';
import { Alert } from '../../../ui-components/src/components/ui/alert';
import { AlertCircle, ArrowUp } from 'lucide-react';

// Components
import { MCSearchBox } from '../components/MCSearchBox';
import { CarrierInfoCard, CarrierInfo } from '../components/CarrierInfoCard';
import { MarketingSection } from '../components/MarketingSection';

// API
import { fetchCarrierByDotNumber } from '../lib/api';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [carrier, setCarrier] = useState<CarrierInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Handle scrolling behavior
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    });
  }
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearch = async (mcNumber: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { data, error, rateLimited } = await fetchCarrierByDotNumber(mcNumber);
      
      if (error) {
        setError(error.message);
      } else if (data) {
        setCarrier(data);
      } else {
        setError('No carrier found with that MC/DOT number.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error in handleSearch:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeResults = () => {
    setCarrier(null);
  };
  
  return (
    <>
      {/* Hero Section with Search */}
      <div className="min-h-[80vh] flex flex-col justify-center py-12 bg-gradient-to-b from-background to-secondary/20">
        <Container>
          <div className="mb-8">
            <a 
              id="search" 
              className="absolute top-[-100px]" 
              aria-hidden="true"
            />
            <MCSearchBox onSearch={handleSearch} isLoading={isLoading} />
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="max-w-3xl mx-auto mt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>{error}</span>
              </Alert>
            </div>
          )}
          
          {/* Carrier Results */}
          {carrier && (
            <div className="mt-8 animate-in fade-in duration-500">
              <CarrierInfoCard carrier={carrier} onClose={closeResults} />
            </div>
          )}
        </Container>
      </div>
      
      {/* Marketing Sections */}
      <div id="info">
        <MarketingSection />
      </div>
      
      {/* Scroll to top button */}
      {showScrollToTop && (
        <Button
          className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}