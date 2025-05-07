'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../ui-components/src/components/ui/button';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';
import { Container } from '../../../ui-components/src/components/ui/container';

// Menu items customized for MC Lookup
const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#info' },
  { label: 'API', href: '/#api' },
  { label: 'About', href: 'https://quikbroker.com/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <Container size="large">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href={{ pathname: "/" }} className="flex items-center space-x-2">
              <span className="font-bold text-xl sm:text-2xl text-blue-600">MC Lookup</span>
              <span className="hidden sm:inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">by QuikBroker</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <Link href={{ pathname: "https://quikbroker.com/login" }}>
                <Button variant="ghost" className="text-sm text-gray-600 hover:text-gray-900">
                  Log in
                </Button>
              </Link>
              <Link href={{ pathname: "https://quikbroker.com/signup" }}>
                <Button className="text-sm bg-blue-600 hover:bg-blue-700 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
            
            <button
              className="flex items-center justify-center rounded-md p-2 text-gray-500 md:hidden"
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
      </Container>
      
      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <Container>
          <div className="py-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-gray-600 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Link href={{ pathname: "https://quikbroker.com/login" }}>
                  <Button variant="ghost" className="w-full justify-start">
                    Log in
                  </Button>
                </Link>
                <Link href={{ pathname: "https://quikbroker.com/signup" }}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </Container>
      </div>
    </header>
  );
}