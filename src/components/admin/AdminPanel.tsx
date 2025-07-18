import React, { useState } from 'react';
import { LogOut, Package, Settings, Download, Upload, HardDrive, Home, HelpCircle } from 'lucide-react';
import { ProductManager } from './ProductManager';
import { SettingsManager } from './SettingsManager';
import { ChangesPendingIndicator } from './ChangesPendingIndicator';
import { AppData } from '../../types';

interface AdminPanelProps {
  data: AppData;
  hasChanges: boolean;
  appVersion: number;
  onUpdateProducts: (products: any[]) => void;
  onUpdateSettings: (settings: any) => void;
  onLogout: () => void;
  onExport: () => void;
  onExportFull: () => void;
  onImport: (file: File) => void;
  onShowSetup?: () => void;
}

export function AdminPanel({
  data,
  hasChanges,
  appVersion,
  onUpdateProducts,
  onUpdateSettings,
  onLogout,
  onExport,
  onExportFull,
  onImport,
  onShowSetup
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Version {appVersion}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>View Store</span>
              </a>
              
              {onShowSetup && (
                <button
                  onClick={onShowSetup}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Setup Guide</span>
                </button>
              )}
              
              <button
                onClick={onExport}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export JSON</span>
              </button>
              
              <button
                onClick={onExportFull}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
              >
                <HardDrive className="h-4 w-4" />
                <span>Full JSON Backup</span>
              </button>
              
              <label className="flex items-center space-x-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChangesPendingIndicator hasChanges={hasChanges} onExport={onExport} />
        
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Products</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
        
        {activeTab === 'products' ? (
          <ProductManager
            products={data.products}
            onUpdateProducts={onUpdateProducts}
          />
        ) : (
          <SettingsManager
            settings={data.settings}
            onUpdateSettings={onUpdateSettings}
          />
        )}
      </div>
    </div>
  );
}