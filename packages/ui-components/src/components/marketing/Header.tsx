'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Menu, X } from 'lucide-react';

// Menu items can be easily changed by marketing
const menuItems = [
  { label: 'Features', href: { pathname: '#features' } },
  { label: 'Benefits', href: { pathname: '#benefits' } },
  { label: 'Testimonials', href: { pathname: '#testimonials' } },
  { label: 'Contact', href: { pathname: '#contact' } },
  { label: 'FAQ', href: { pathname: '#faq' } },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={{ pathname: "/" }} className="flex items-center space-x-2">
            <span className="font-bold text-xl sm:text-2xl text-primary">QuikBroker</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href.pathname}
                href={item.href}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            <Link href={{ pathname: "/login" }}>
              <Button variant="ghost" className="text-sm">
                Log in
              </Button>
            </Link>
            <Link href={{ pathname: "/signup" }}>
              <Button variant="default" className="text-sm">
                Sign up
              </Button>
            </Link>
          </div>
          
          <button
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto py-4">
          <nav className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.href.pathname}
                href={item.href}
                className="text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link href={{ pathname: "/login" }}>
                <Button variant="ghost" className="w-full justify-start">
                  Log in
                </Button>
              </Link>
              <Link href={{ pathname: "/signup" }}>
                <Button variant="default" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}