import React, { useState } from 'react';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { SetupGuide } from './components/admin/SetupGuide';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';

type AdminMode = 'login' | 'admin' | 'setup';

function AdminApp() {
  const [mode, setMode] = useState<AdminMode>('login');
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const { data, updateProducts, updateSettings, exportData, exportFullBackup, importData } = useLocalStorage();

  // Auto-redirect to admin if already authenticated
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setMode('admin');
    }
  }, [isAuthenticated, isLoading]);

  const handleLogin = (password: string) => {
    if (login(password)) {
      setMode('admin');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    logout();
    setMode('login');
  };

  const handleShowSetup = () => {
    setMode('setup');
  };

  const handleBackToAdmin = () => {
    setMode('admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (mode === 'login') {
    return <AdminLogin onLogin={handleLogin} onShowSetup={handleShowSetup} />;
  }

  if (mode === 'setup') {
    return <SetupGuide onBack={handleBackToAdmin} />;
  }

  if (mode === 'admin' && isAuthenticated) {
    return (
      <AdminPanel
        data={data}
        onUpdateProducts={updateProducts}
        onUpdateSettings={updateSettings}
        onLogout={handleLogout}
        onExport={exportData}
        onExportFull={exportFullBackup}
        onImport={importData}
        onShowSetup={handleShowSetup}
      />
    );
  }

  return <AdminLogin onLogin={handleLogin} onShowSetup={handleShowSetup} />;
}

export default AdminApp;