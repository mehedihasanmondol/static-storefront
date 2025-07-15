import React from 'react';
import { Download, AlertTriangle } from 'lucide-react';

interface ChangesPendingIndicatorProps {
  hasChanges: boolean;
  onExport: () => void;
}

export function ChangesPendingIndicator({ hasChanges, onExport }: ChangesPendingIndicatorProps) {
  if (!hasChanges) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Changes Pending</h3>
            <p className="text-sm text-yellow-700">
              You have unsaved changes. Download the updated JSON file to keep your data in sync.
            </p>
          </div>
        </div>
        
        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
        >
          <Download className="h-4 w-4" />
          <span>Download JSON</span>
        </button>
      </div>
    </div>
  );
}