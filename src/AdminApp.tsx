import React, { useState } from 'react';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { SetupGuide } from './components/admin/SetupGuide';
import { useLocalStorage } from './hooks/useLocalStorage';

type AdminMode = 'login' | 'admin' | 'setup';

function AdminApp() {
  const [mode, setMode] = useState<AdminMode>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data, updateProducts, updateSettings, exportData, exportFullBackup, importData } = useLocalStorage();

  const handleLogin = (password: string) => {
    // Simple password check - in a real app, you'd want something more secure
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setMode('admin');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMode('login');
  };

  const handleShowSetup = () => {
    setMode('setup');
  };

  const handleBackToAdmin = () => {
    setMode('admin');
  };

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