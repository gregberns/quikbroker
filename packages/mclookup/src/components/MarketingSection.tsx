'use client';

import { Container } from '../../../ui-components/src/components/ui/container';
import { Separator } from '../../../ui-components/src/components/ui/separator';
import { FeatureCard } from '../../../ui-components/src/components/marketing/FeatureCard';
import { CtaSection } from '../../../ui-components/src/components/marketing/CtaSection';
import { 
  Search, 
  CheckCircle, 
  Zap, 
  Shield, 
  FileText, 
  RefreshCw, 
  Clock, 
  Truck
} from 'lucide-react';

export function MarketingSection() {
  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Instant Carrier Lookup",
      description: "Search MC or DOT numbers and get comprehensive carrier information instantly."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "FMCSA Verified Data",
      description: "All information is sourced directly from the official FMCSA databases."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast & Free",
      description: "No cost, no registration, no login required for basic lookups."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enhanced Due Diligence",
      description: "Premium features help brokers mitigate risk by thoroughly vetting carriers."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Complete Documentation",
      description: "Access and store carrier qualification documents securely in one place."
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: "Real-time Monitoring",
      description: "Premium users can monitor changes in carrier status and get instant alerts."
    }
  ];

  const productFeatures = [
    {
      title: "Free Lookup Tool",
      description: "Basic carrier information for occasional lookup needs",
      features: [
        "MC/DOT number verification",
        "Contact information",
        "Basic operating status",
        "Limited to 5 searches per hour",
        "No registration required"
      ],
      cta: "Use Free Lookup",
      ctaHref: "#search",
      popular: false
    },
    {
      title: "QuikBroker Pro",
      description: "Advanced carrier management for freight brokers",
      features: [
        "Unlimited carrier lookups",
        "Automated carrier onboarding",
        "Document collection & storage",
        "Expiration alerts",
        "Compliance monitoring",
        "Integration with TMS systems"
      ],
      cta: "Try QuikBroker Pro",
      ctaHref: "https://quikbroker.com/signup",
      popular: true
    },
    {
      title: "Enterprise Solution",
      description: "Custom solutions for large brokerages",
      features: [
        "Custom workflow integration",
        "API access",
        "Advanced reporting",
        "Bulk carrier management",
        "Dedicated support",
        "Compliance training"
      ],
      cta: "Contact Sales",
      ctaHref: "https://quikbroker.com/enterprise",
      popular: false
    }
  ];

  return (
    <div className="py-16 mt-8">
      <Separator className="mb-16" />
      
      {/* Features Section */}
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-4">
            More Than Just a Lookup Tool
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            QuikBroker's MC Lookup is part of a comprehensive carrier compliance platform 
            designed specifically for freight brokers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </Container>
      
      {/* Product Comparison */}
      <div className="bg-muted/30 py-16 mt-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-4">
              Choose the Right Plan for Your Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From occasional lookups to complete carrier management, we have solutions for businesses of all sizes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productFeatures.map((product, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden border ${
                  product.popular ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
                }`}
              >
                {product.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-medium">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href={product.ctaHref}
                    className={`block w-full py-2 px-4 text-center rounded-md font-medium ${
                      product.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                    }`}
                  >
                    {product.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
      
      {/* CTA Section */}
      <CtaSection 
        title="Ready to streamline your carrier management?"
        description="Join thousands of freight brokers who trust QuikBroker for carrier compliance and onboarding."
        primaryAction={{ 
          text: "Start Your Free Trial", 
          href: "https://quikbroker.com/signup" 
        }}
        secondaryAction={{ 
          text: "Schedule a Demo", 
          href: "https://quikbroker.com/demo" 
        }}
      />
    </div>
  );
}