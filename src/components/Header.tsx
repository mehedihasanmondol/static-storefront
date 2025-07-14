import React from 'react';
import { ShoppingBag, Settings, User } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  onAdminClick?: () => void;
  showAdminLink?: boolean;
}

export function Header({ settings, onAdminClick, showAdminLink = true }: HeaderProps) {
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
            {showAdminLink && (
              <a
                href="/admin.html"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                title="Admin Panel"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </a>
            )}
            
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Admin Panel"
              >
                <Settings className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}