import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { useIndexedDB } from './hooks/useIndexedDB';
import { useAuth } from './hooks/useAuth';

function App() {
  const { data, isLoading } = useIndexedDB();
  const { checkAuthStatus } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading store data...</p>
          <p className="text-gray-500 text-sm mt-2">Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header settings={data.settings} isLoggedIn={checkAuthStatus()} />
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