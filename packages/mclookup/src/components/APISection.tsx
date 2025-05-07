'use client';

import { Container } from '../../../ui-components/src/components/ui/container';
import { Code } from 'lucide-react';
import { Button } from '../../../ui-components/src/components/ui/button';

export function APISection() {
  return (
    <div id="api" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4">
              <Code className="h-4 w-4 mr-2" />
              Developer Tools
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Integrate Carrier Data with Our API
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Build powerful, data-driven applications with direct access to FMCSA carrier information through our 
              comprehensive REST API. Seamlessly integrate carrier verification into your existing systems.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-900">Simple REST Integration</h3>
                  <p className="text-gray-600">JSON responses with consistent schema and comprehensive documentation</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-900">Real-time Data Access</h3>
                  <p className="text-gray-600">Always up-to-date carrier information synchronized with FMCSA</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-900">High-performance Infrastructure</h3>
                  <p className="text-gray-600">Optimized endpoints with 99.9% uptime and enterprise-grade reliability</p>
                </div>
              </div>
            </div>
            
            {/* Buttons removed as requested */}
          </div>
          
          <div className="flex-1 p-5 bg-gray-800 text-gray-300 rounded-lg shadow-lg font-mono text-sm overflow-auto">
            <div className="mb-4 border-b border-gray-700 pb-2 text-blue-400">
              # Example API Request
            </div>
            <pre className="whitespace-pre-wrap">
{`curl -X GET "https://api.quikbroker.com/v1/carriers/12345" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Response
{
  "carrier": {
    "dot_number": "12345",
    "legal_name": "ACME TRANSPORTATION INC.",
    "dba_name": "ACME FREIGHT",
    "carrier_operation": "A",
    "phy_street": "123 MAIN ST",
    "phy_city": "SPRINGFIELD",
    "phy_state": "IL",
    "phy_zip": "62701",
    "nbr_power_unit": "45",
    "driver_total": "52",
    "status": "ACTIVE"
  },
  "meta": {
    "last_updated": "2025-05-01T12:30:45Z"
  }
}`}
            </pre>
          </div>
        </div>
      </Container>
    </div>
  );
}