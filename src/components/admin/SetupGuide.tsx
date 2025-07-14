import React from 'react';
import { ArrowLeft, Download, Upload, FileText, Globe, Settings, Shield } from 'lucide-react';

interface SetupGuideProps {
  onBack: () => void;
}

export function SetupGuide({ onBack }: SetupGuideProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Admin</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Settings className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Guide</h1>
            <p className="text-lg text-gray-600">Complete guide for managing your static storefront</p>
          </div>

          <div className="space-y-8">
            {/* Access Section */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Accessing Your Store</h2>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <p><strong>Public Store:</strong> <code>index.html</code> or your main domain</p>
                <p><strong>Admin Panel:</strong> <code>admin.html</code> or <code>yourdomain.com/admin.html</code></p>
                <p><strong>Default Password:</strong> <code>admin123</code></p>
              </div>
            </section>

            {/* Data Management */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Download className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Export Data</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Save your store configuration and products</p>
                  <div className="bg-gray-50 rounded p-2 text-sm">
                    <p><strong>File:</strong> <code>store-data.json</code></p>
                    <p><strong>Contains:</strong> Products, settings, basic data</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Download className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Full Backup</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Complete backup including all images</p>
                  <div className="bg-gray-50 rounded p-2 text-sm">
                    <p><strong>File:</strong> <code>store-full-backup.json</code></p>
                    <p><strong>Contains:</strong> Everything + embedded images</p>
                  </div>
                </div>
              </div>
            </section>

            {/* File Structure */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Upload className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">File Structure for Deployment</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-800">
{`your-website/
├── index.html          (Public storefront)
├── admin.html          (Admin panel)
├── store-data.json     (Your data file)
├── assets/             (Generated CSS/JS)
└── vite.svg           (Favicon)`}
                </pre>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Place your exported <code>store-data.json</code> file in the root directory 
                  alongside <code>index.html</code> and <code>admin.html</code> for the data to load automatically.
                </p>
              </div>
            </section>

            {/* Hosting Platforms */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Hosting Platforms</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-semibold mb-2">GitHub Pages</h3>
                  <p className="text-sm text-gray-600">Upload files to repository, enable Pages</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-semibold mb-2">Netlify</h3>
                  <p className="text-sm text-gray-600">Drag & drop your build folder</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-semibold mb-2">IPFS</h3>
                  <p className="text-sm text-gray-600">Perfect for decentralized hosting</p>
                </div>
              </div>
            </section>

            {/* Security */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Security Notes</h2>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• Change the default admin password in your settings</li>
                  <li>• Admin access is client-side only - suitable for personal/small business use</li>
                  <li>• For high-security needs, consider server-side authentication</li>
                  <li>• Regular backups are recommended</li>
                </ul>
              </div>
            </section>

            {/* Quick Start */}
            <section>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Start Checklist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2">Setup:</h3>
                    <ul className="space-y-1">
                      <li>✓ Access admin.html</li>
                      <li>✓ Login with admin123</li>
                      <li>✓ Update site settings</li>
                      <li>✓ Add your products</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Deploy:</h3>
                    <ul className="space-y-1">
                      <li>✓ Export your data</li>
                      <li>✓ Build for production</li>
                      <li>✓ Upload to hosting</li>
                      <li>✓ Test both pages</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}