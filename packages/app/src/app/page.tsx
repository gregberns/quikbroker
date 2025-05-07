'use client';

import { Suspense } from 'react';
import { ClipboardCheck, Gauge, Shield, BarChart4, Truck, FileText } from 'lucide-react';

// Marketing Components from shared UI components package
// Direct imports from ui-components source
import { Header } from '../../../ui-components/src/components/marketing/Header';
import { Footer } from '../../../ui-components/src/components/marketing/Footer';
import { HeroSection } from '../../../ui-components/src/components/marketing/HeroSection';
import { FeatureList } from '../../../ui-components/src/components/marketing/FeatureCard';
import { SignupForm } from '../../../ui-components/src/components/marketing/SignupForm';
import { StatsSection } from '../../../ui-components/src/components/marketing/StatsSection';
import { TestimonialSection } from '../../../ui-components/src/components/marketing/Testimonial';
import { TrustSection } from '../../../ui-components/src/components/marketing/TrustSection';
import { CtaSection } from '../../../ui-components/src/components/marketing/CtaSection';

// Landing page with suspense boundary for search params
function HomePageContent() {
  // Key features with easily editable content
  const features = [
    {
      icon: <ClipboardCheck className="h-8 w-8" />,
      title: "Streamlined Onboarding",
      description: "Reduce carrier onboarding time by up to 80% with our digital workflow that eliminates paperwork and automates verification."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Fraud Prevention",
      description: "Advanced cross-verification and validation helps identify potential red flags and suspicious patterns to protect your business."
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: "Real-time Monitoring",
      description: "Continuous monitoring of insurance status, authority, and safety ratings with automated alerts for any compliance issues."
    },
    {
      icon: <BarChart4 className="h-8 w-8" />,
      title: "Compliance Analytics",
      description: "Comprehensive reporting and analytics dashboards provide insights into carrier compliance status and onboarding efficiency."
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Carrier Management",
      description: "Manage your entire carrier network in one place with detailed profiles, compliance status, and performance history."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Document Management",
      description: "Secure storage and management of all carrier documents with automated reminders for expiring credentials."
    }
  ];

  // Stats that marketing can easily update
  const stats = [
    {
      value: "80%",
      label: "Time Saved",
      description: "Reduction in carrier onboarding time"
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Ensuring your operations never stop"
    },
    {
      value: "24/7",
      label: "Monitoring",
      description: "Real-time compliance monitoring"
    },
    {
      value: "5,000+",
      label: "Carriers Onboarded",
      description: "And growing every day"
    }
  ];

  // Testimonials that marketing can easily update
  const testimonials = [
    {
      quote: "QuikBroker has transformed our carrier onboarding process. What used to take days now happens in minutes, and with better compliance checks.",
      author: "Sarah Johnson",
      role: "Operations Director",
      company: "TransGlobal Logistics"
    },
    {
      quote: "The automation and verification tools have helped us identify several fraudulent carriers before we worked with them. That alone has saved us thousands.",
      author: "Michael Chen",
      role: "Risk Manager",
      company: "FastFreight Systems"
    },
    {
      quote: "I appreciate how easy it is to onboard new carriers. Our compliance team spends less time on paperwork and more time building relationships.",
      author: "David Rodriguez",
      role: "Compliance Officer",
      company: "Elite Transport Solutions"
    }
  ];
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection secondaryCta={null} />
        
        {/* Stats Section */}
        <StatsSection 
          stats={stats}
          title="Delivering Results for Freight Brokers"
          description="Our clients see measurable improvements in efficiency, compliance, and risk management."
        />
        
        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything You Need to Manage Carriers
              </h2>
              <p className="text-lg text-muted-foreground">
                QuikBroker provides a comprehensive platform for carrier onboarding, verification, and compliance management.
              </p>
            </div>
            
            <FeatureList features={features} columns={3} />
          </div>
        </section>
        
        {/* Trust Section */}
        <TrustSection />
        
        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lg text-muted-foreground">
                Hear what freight brokers have to say about their experience with QuikBroker.
              </p>
            </div>
            
            <TestimonialSection testimonials={testimonials} />
          </div>
        </section>
        
        {/* CTA Section */}
        <CtaSection 
          title="Ready to transform your carrier management?"
          description="Join the growing number of freight brokers who are enhancing their bottom line through streamlined operations and reduced risk with QuikBroker."
          primaryAction={{ text: "Get Started", href: { pathname: "signup" } }}
        />
        
        {/* Signup Form */}
        <section id="signup-form" className="py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Get Started with QuikBroker
              </h2>
              <p className="text-lg text-muted-foreground">
                Begin your journey to streamlined operations, reduced risk, and a stronger bottom line today.
              </p>
            </div>
            
            <SignupForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Wrap in Suspense for useSearchParams compatibility
export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
