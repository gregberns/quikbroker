'use client';

import { useState } from 'react';
import { Card } from '../../../ui-components/src/components/ui/card';
import { Button } from '../../../ui-components/src/components/ui/button';
import { Separator } from '../../../ui-components/src/components/ui/separator';
import {
  Truck,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Interface to match the structure from the API
export interface CarrierInfo {
  dot_number: string;
  legal_name: string | null;
  dba_name: string | null;
  carrier_operation: string | null;
  hm_flag: string | null;
  pc_flag: string | null;
  phy_street: string | null;
  phy_city: string | null;
  phy_state: string | null;
  phy_zip: string | null;
  phy_country: string | null;
  mailing_street: string | null;
  mailing_city: string | null;
  mailing_state: string | null;
  mailing_zip: string | null;
  mailing_country: string | null;
  telephone: string | null;
  fax: string | null;
  email_address: string | null;
  mcs150_date: string | null;
  mcs150_mileage: string | null;
  mcs150_mileage_year: string | null;
  add_date: string | null;
  oic_state: string | null;
  nbr_power_unit: string | null;
  driver_total: string | null;
  recent_mileage: string | null;
  recent_mileage_year: string | null;
  authorized_for_hire: string | null;
  private_property: string | null;
  exempt_for_hire: string | null;
  us_mail: string | null;
}

interface CarrierInfoCardProps {
  carrier: CarrierInfo;
  onClose: () => void;
}

export function CarrierInfoCard({ carrier, onClose }: CarrierInfoCardProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'operation'>('basic');
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    
    try {
      // If in ISO format, format it nicely
      if (dateStr.includes('T') || dateStr.includes('-')) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      
      // Handle MM/DD/YYYY format
      if (dateStr.includes('/')) {
        return dateStr;
      }
      
      return dateStr;
    } catch {
      return dateStr;
    }
  };
  
  const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return 'N/A';
    
    // Simple formatting - this could be enhanced based on the actual format received
    return phone;
  };
  
  const formatBoolean = (value: string | null) => {
    if (!value) return null;
    
    const normalized = value.trim().toLowerCase();
    if (normalized === 'y' || normalized === 'yes' || normalized === 'true') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    if (normalized === 'n' || normalized === 'no' || normalized === 'false') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    return value;
  };
  
  return (
    <Card className="max-w-4xl mx-auto overflow-hidden shadow-xl bg-white">
      {/* Header with carrier name and details - using a darker blue gradient for visibility */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-bold truncate text-white">
                {carrier.legal_name || 'Unknown Carrier'}
              </h2>
            </div>
            
            {carrier.dba_name && carrier.dba_name !== carrier.legal_name && (
              <p className="text-white mb-2">DBA: {carrier.dba_name}</p>
            )}
            
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                DOT# {carrier.dot_number}
              </span>
              
              {carrier.phy_state && (
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {carrier.phy_state}
                </span>
              )}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="border-white/30 text-white hover:bg-white/20 hover:text-white"
          >
            Close
          </Button>
        </div>
      </div>
      
      <div className="p-1 bg-gray-100 flex border-b">
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'basic' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white/50'
          }`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'details' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white/50'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'operation' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white/50'
          }`}
          onClick={() => setActiveTab('operation')}
        >
          Operation
        </button>
      </div>
      
      <div className="p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Address Section */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-gray-800">
                <MapPin className="h-5 w-5 text-blue-600" />
                Physical Address
              </h3>
              <p className="text-gray-600">
                {carrier.phy_street || 'Address not available'}<br />
                {carrier.phy_city && carrier.phy_state && carrier.phy_zip && (
                  <>
                    {carrier.phy_city}, {carrier.phy_state} {carrier.phy_zip}<br />
                  </>
                )}
                {carrier.phy_country && carrier.phy_country !== 'US' && carrier.phy_country !== 'USA' && (
                  <>{carrier.phy_country}</>
                )}
              </p>
            </div>
            
            <Separator />
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-gray-800">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Phone:</span> {formatPhoneNumber(carrier.telephone)}
                  </p>
                  {carrier.fax && (
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Fax:</span> {formatPhoneNumber(carrier.fax)}
                    </p>
                  )}
                  {carrier.email_address && (
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Email:</span> {carrier.email_address}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-gray-800">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Fleet Size
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Power Units:</span> {carrier.nbr_power_unit || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Drivers:</span> {carrier.driver_total || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Mailing Address Section */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-gray-800">
                <MapPin className="h-5 w-5 text-blue-600" />
                Mailing Address
              </h3>
              <p className="text-gray-600">
                {carrier.mailing_street || 'Address not available'}<br />
                {carrier.mailing_city && carrier.mailing_state && carrier.mailing_zip && (
                  <>
                    {carrier.mailing_city}, {carrier.mailing_state} {carrier.mailing_zip}<br />
                  </>
                )}
                {carrier.mailing_country && carrier.mailing_country !== 'US' && carrier.mailing_country !== 'USA' && (
                  <>{carrier.mailing_country}</>
                )}
              </p>
            </div>
            
            <Separator />
            
            {/* Filing Info */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-gray-800">
                <Calendar className="h-5 w-5 text-blue-600" />
                Filing Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">MCS-150 Date:</span> {formatDate(carrier.mcs150_date)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Added Date:</span> {formatDate(carrier.add_date)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Recent Mileage:</span> {carrier.recent_mileage || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Mileage Year:</span> {carrier.recent_mileage_year || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'operation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-gray-800">
                <Truck className="h-5 w-5 text-blue-600" />
                Operation Classification
              </h3>
              <p className="text-gray-600 mb-4">
                <span className="font-medium text-gray-700">Carrier Operation:</span> {carrier.carrier_operation || 'N/A'}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-100 rounded-md flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Authorized For-Hire</span>
                  <span className="ml-auto">{formatBoolean(carrier.authorized_for_hire)}</span>
                </div>
                <div className="p-3 bg-gray-100 rounded-md flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Private Property</span>
                  <span className="ml-auto">{formatBoolean(carrier.private_property)}</span>
                </div>
                <div className="p-3 bg-gray-100 rounded-md flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Exempt For-Hire</span>
                  <span className="ml-auto">{formatBoolean(carrier.exempt_for_hire)}</span>
                </div>
                <div className="p-3 bg-gray-100 rounded-md flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">US Mail</span>
                  <span className="ml-auto">{formatBoolean(carrier.us_mail)}</span>
                </div>
                <div className="p-3 bg-gray-100 rounded-md flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Hazardous Materials</span>
                  <span className="ml-auto">{formatBoolean(carrier.hm_flag)}</span>
                </div>
                <div className="p-3 bg-gray-100 rounded-md flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Passenger Carrier</span>
                  <span className="ml-auto">{formatBoolean(carrier.pc_flag)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs text-center text-gray-500">
          Data sourced from FMCSA database. Last updated: {formatDate(carrier.mcs150_date || '')}
        </p>
      </div>
    </Card>
  );
}
