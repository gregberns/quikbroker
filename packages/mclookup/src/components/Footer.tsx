'use client';

import Link from 'next/link';
import { Container } from '../../../ui-components/src/components/ui/container';

// Footer content customized for MC Lookup
const footerLinks = {
  company: [
    { label: 'About Us', href: { pathname: 'https://quikbroker.com/about' } },
    { label: 'Careers', href: { pathname: 'https://quikbroker.com/careers' } },
    { label: 'Blog', href: { pathname: 'https://quikbroker.com/blog' } },
    { label: 'Press', href: { pathname: 'https://quikbroker.com/press' } },
  ],
  product: [
    { label: 'Features', href: { pathname: '#info' } },
    { label: 'Pricing', href: { pathname: 'https://quikbroker.com/pricing' } },
    { label: 'Security', href: { pathname: 'https://quikbroker.com/security' } },
    { label: 'Enterprise', href: { pathname: 'https://quikbroker.com/enterprise' } },
  ],
  resources: [
    { label: 'Documentation', href: { pathname: 'https://quikbroker.com/docs' } },
    { label: 'Knowledge Base', href: { pathname: 'https://quikbroker.com/knowledge-base' } },
    { label: 'Support', href: { pathname: 'https://quikbroker.com/support' } },
    { label: 'API', href: { pathname: 'https://quikbroker.com/api' } },
  ],
  legal: [
    { label: 'Privacy Policy', href: { pathname: 'https://quikbroker.com/privacy' } },
    { label: 'Terms of Service', href: { pathname: 'https://quikbroker.com/terms' } },
    { label: 'FMCSA Compliance', href: { pathname: 'https://quikbroker.com/compliance' } },
    { label: 'Security Practices', href: { pathname: 'https://quikbroker.com/security-practices' } },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200 w-full mt-auto">
      <Container size="large">
        {/* Three-column layout on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* QuikBroker section */}
          <div>
            <Link href={{ pathname: "https://quikbroker.com" }} className="inline-block mb-4">
              <span className="font-bold text-xl text-blue-600">QuikBroker</span>
            </Link>
            <p className="text-gray-600 max-w-xs">
              Streamlining carrier onboarding and compliance management for freight brokers.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://linkedin.com/company/quikbroker" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.5A1.5 1.5 0 118 7a1.5 1.5 0 01-1.5 1.5zM19 19h-3v-4.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5V19h-3v-9h3v1.5c.5-1 1.8-1.5 2.5-1.5 1.7 0 3.5 1.3 3.5 3.5V19z" />
                </svg>
              </a>
              <a href="https://twitter.com/quikbroker" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07a4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://facebook.com/quikbroker" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Company section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href.pathname}>
                  <Link href={link.href} className="text-gray-500 hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Product section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href.pathname}>
                  <Link href={link.href} className="text-gray-500 hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Copyright and legal links */}
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} QuikBroker. All rights reserved.
          </p>
          <ul className="mt-4 md:mt-0 flex flex-wrap gap-6">
            {footerLinks.legal.map((link) => (
              <li key={link.href.pathname}>
                <Link href={link.href} className="text-xs text-gray-500 hover:text-gray-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}