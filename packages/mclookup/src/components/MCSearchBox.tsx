'use client';

import { useState } from 'react';
import { Button } from '../../../ui-components/src/components/ui/button';
import { Input } from '../../../ui-components/src/components/ui/input';
import { Search } from 'lucide-react';

interface MCSearchBoxProps {
  onSearch: (mcNumber: string) => void;
  isLoading?: boolean;
}

export function MCSearchBox({ onSearch, isLoading = false }: MCSearchBoxProps) {
  const [mcNumber, setMcNumber] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mcNumber.trim()) {
      onSearch(mcNumber.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Carrier Information Lookup
        </h1>
      </div>
      
      <div className="flex items-center justify-center mb-10">
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Fast, free access to FMCSA carrier data by MC or DOT number
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
        <Input
          type="text"
          value={mcNumber}
          onChange={(e) => setMcNumber(e.target.value)}
          placeholder="Enter MC or DOT number"
          className="h-14 pl-14 pr-24 text-lg rounded-full shadow-lg focus:ring-2 focus:ring-blue-300 border-gray-200"
          aria-label="MC or DOT number"
        />
        <div className="absolute left-5 top-4 text-gray-400">
          <Search size={24} />
        </div>
        <Button 
          type="submit"
          className="absolute right-2 top-2 h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!mcNumber.trim() || isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      
      <p className="mt-4 text-sm text-gray-500">
        Direct access to FMCSA carrier information. No login required.
      </p>
    </div>
  );
}