import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { useLocalStorage } from './hooks/useLocalStorage';

type AppMode = 'public' | 'login' | 'admin';

function App() {
  const [mode, setMode] = useState<AppMode>('public');
  const { data, updateProducts, updateSettings, exportData, importData } = useLocalStorage();

  const handleAdminClick = () => {
    setMode('login');
  };

  const handleLogin = (password: string) => {
    // Simple password check - in a real app, you'd want something more secure
    if (password === 'admin123') {
      setMode('admin');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setMode('public');
  };

  if (mode === 'login') {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (mode === 'admin') {
    return (
      <AdminPanel
        data={data}
        onUpdateProducts={updateProducts}
        onUpdateSettings={updateSettings}
        onLogout={handleLogout}
        onExport={exportData}
        onImport={importData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header settings={data.settings} onAdminClick={handleAdminClick} />
      <Hero settings={data.settings} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-lg text-gray-600">Discover our curated collection</p>
        </div>
        
        <ProductGrid products={data.products} />
      </main>
      
      <Footer settings={data.settings} />
    </div>
  );
}

export default App;