import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const { data } = useLocalStorage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header settings={data.settings} />
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