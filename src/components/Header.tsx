import React from 'react';
import { ShoppingBag, Settings } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  onAdminClick: () => void;
}

export function Header({ settings, onAdminClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{settings.siteName}</h1>
              <p className="text-sm text-gray-500">{settings.tagline}</p>
            </div>
          </div>
          
          <button
            onClick={onAdminClick}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Admin Panel"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}