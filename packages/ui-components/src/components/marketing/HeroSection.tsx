'use client';

import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  primaryCta?: {
    text: string;
    href: { pathname: string };
  };
  secondaryCta?: {
    text: string;
    href: { pathname: string };
  };
  highlights?: string[];
  className?: string;
  imageUrl?: string;
  imagePlacement?: 'right' | 'left';
}

export function HeroSection({
  title = "Streamline Carrier Onboarding & Compliance Management",
  subtitle = "QuikBroker helps freight brokers reduce risk, ensure compliance, and accelerate carrier onboarding with automated document verification and real-time monitoring.",
  primaryCta = { text: "Get Started", href: { pathname: "#signup-form" } },
  secondaryCta = { text: "Book a Demo", href: { pathname: "/demo" } },
  highlights = [
    "Reduce onboarding time by up to 80%",
    "Automatic FMCSA verification",
    "Real-time insurance monitoring",
    "Secure document management"
  ],
  className,
  imageUrl = "/dashboard-preview.png", // This would be replaced with actual image
  imagePlacement = 'right',
}: HeroSectionProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-16 md:py-24",
      className
    )}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className={cn(
          "grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center",
          imagePlacement === 'left' && "lg:flex-row-reverse"
        )}>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              {subtitle}
            </p>
            
            {highlights && highlights.length > 0 && (
              <div className="mt-8 space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {primaryCta && (
                <Button asChild size="lg" className="group">
                  <Link href={primaryCta.href}>
                    {primaryCta.text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
              
              {secondaryCta && (
                <Button asChild variant="outline" size="lg">
                  <Link href={secondaryCta.href}>
                    {secondaryCta.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          <div className="relative mx-auto lg:mx-0 w-full max-w-lg lg:max-w-none">
            {/* This can be replaced with an actual screenshot/image */}
            <div className="relative w-full aspect-[4/3] rounded-lg shadow-2xl overflow-hidden bg-gray-100/40 border border-border">
              {imageUrl ? (
                <Image 
                  src={imageUrl}
                  alt="QuikBroker dashboard preview"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Dashboard Preview
                </div>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-4 -left-6 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute -z-10 -bottom-8 -right-6 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}