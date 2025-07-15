import React from 'react';
import { ShoppingBag, Settings } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  isLoggedIn: boolean;
}

export function Header({ settings, isLoggedIn }: HeaderProps) {
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
          
          <div className="flex items-center space-x-2">
            {isLoggedIn && (
              <a
                href="/admin.html"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Go to Admin Panel"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Panel</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}