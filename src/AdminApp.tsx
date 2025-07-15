import React, { useState } from 'react';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { SetupGuide } from './components/admin/SetupGuide';
import { useIndexedDB } from './hooks/useIndexedDB';
import { useAuth } from './hooks/useAuth';
import { NotificationSystem, useNotifications } from './components/admin/NotificationSystem';

type AdminMode = 'login' | 'admin' | 'setup';

function AdminApp() {
  const [mode, setMode] = useState<AdminMode>('login');
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const { 
    data, 
    isLoading: dbLoading, 
    hasChanges, 
    appVersion,
    updateProducts, 
    updateSettings, 
    exportData, 
    exportFullBackup, 
    importData,
    clearChanges
  } = useIndexedDB();
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Auto-redirect to admin if already authenticated
  React.useEffect(() => {
    if (!isLoading && !dbLoading && isAuthenticated) {
      setMode('admin');
    }
  }, [isAuthenticated, isLoading, dbLoading]);

  const handleLogin = (password: string) => {
    if (login(password)) {
      setMode('admin');
    } else {
      addNotification('Invalid password', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    setMode('login');
    clearChanges();
  };

  const handleShowSetup = () => {
    setMode('setup');
  };

  const handleBackToAdmin = () => {
    setMode('admin');
  };

  const handleExportData = () => {
    exportData();
    addNotification('Data exported successfully!', 'success');
  };

  const handleExportFull = () => {
    exportFullBackup();
    addNotification('Full backup exported successfully!', 'success');
  };

  const handleImportData = (file: File) => {
    importData(file, addNotification);
  };

  const handleUpdateProducts = (products: any[]) => {
    updateProducts(products, addNotification);
  };

  const handleUpdateSettings = (settings: any) => {
    updateSettings(settings, addNotification);
  };

  if (isLoading || dbLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin panel...</p>
          <p className="text-gray-500 text-sm mt-2">
            {isLoading ? 'Checking authentication...' : 'Initializing database...'}
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <>
        <AdminLogin onLogin={handleLogin} onShowSetup={handleShowSetup} />
        <NotificationSystem notifications={notifications} onRemove={removeNotification} />
      </>
    );
  }

  if (mode === 'setup') {
    return <SetupGuide onBack={handleBackToAdmin} />;
  }

  if (mode === 'admin' && isAuthenticated) {
    return (
      <>
        <AdminPanel
          data={data}
          hasChanges={hasChanges}
          appVersion={appVersion}
          onUpdateProducts={handleUpdateProducts}
          onUpdateSettings={handleUpdateSettings}
          onLogout={handleLogout}
          onExport={handleExportData}
          onExportFull={handleExportFull}
          onImport={handleImportData}
          onShowSetup={handleShowSetup}
        />
        <NotificationSystem notifications={notifications} onRemove={removeNotification} />
      </>
    );
  }

  return (
    <>
      <AdminLogin onLogin={handleLogin} onShowSetup={handleShowSetup} />
      <NotificationSystem notifications={notifications} onRemove={removeNotification} />
    </>
  );
}

export default AdminApp;