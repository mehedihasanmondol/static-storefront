import { useState, useEffect } from 'react';
import { AppData, Product, SiteSettings } from '../types';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Your Store',
  tagline: 'Amazing products for amazing people',
  aboutText: 'We offer high-quality products with excellent customer service.',
  contactEmail: 'contact@yourstore.com',
  telegram: '@yourstore',
  instagram: '@yourstore',
  whatsapp: '+1234567890',
  heroTitle: 'Welcome to Your Store',
  heroSubtitle: 'Discover our amazing collection of products'
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    image: '',
    category: 'Electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Advanced fitness tracking and smart notifications',
    price: 199.99,
    image: '',
    category: 'Electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Wireless Speaker',
    description: 'Portable speaker with amazing sound quality',
    price: 89.99,
    image: '',
    category: 'Electronics',
    inStock: false
  }
];

export function useLocalStorage() {
  const [data, setData] = useState<AppData>({
    products: DEFAULT_PRODUCTS,
    settings: DEFAULT_SETTINGS
  });

  useEffect(() => {
    loadDataFromJSON();
  }, []);

  const loadDataFromJSON = async () => {
    try {
      // Try to load from a local JSON file first
      const response = await fetch('/store-data.json');
      if (response.ok) {
        const jsonData = await response.json();
        setData({
          products: jsonData.products || DEFAULT_PRODUCTS,
          settings: { ...DEFAULT_SETTINGS, ...jsonData.settings }
        });
        return;
      }
    } catch (error) {
      console.log('No JSON file found, using localStorage fallback');
    }

    // Fallback to localStorage
    const stored = localStorage.getItem('storeData');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setData({
          products: parsedData.products || DEFAULT_PRODUCTS,
          settings: { ...DEFAULT_SETTINGS, ...parsedData.settings }
        });
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  };
  const saveData = (newData: AppData) => {
    setData(newData);
    // Save to localStorage as backup
    localStorage.setItem('storeData', JSON.stringify(newData, null, 2));
    
    // Also trigger JSON file download for manual saving
    downloadJSON(newData, 'store-data.json');
  };

  const downloadJSON = (data: any, filename: string) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  const updateProducts = (products: Product[]) => {
    const newData = { ...data, products };
    saveData(newData);
  };

  const updateSettings = (settings: SiteSettings) => {
    const newData = { ...data, settings };
    saveData(newData);
  };

  const exportData = () => {
    downloadJSON(data, 'store-data.json');
  };

  const exportFullBackup = () => {
    // Include both store data and images with complete blob data
    const imageData = localStorage.getItem('storedImages');
    
    const fullBackup = {
      storeData: data,
      imageData: imageData ? JSON.parse(imageData) : [],
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
    
    downloadJSON(fullBackup, 'store-full-backup.json');
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Check if it's a full backup or just store data
        if (importedData.storeData && importedData.imageData) {
          // Full backup import
          saveData(importedData.storeData);
          localStorage.setItem('storedImages', JSON.stringify(importedData.imageData));
          // Reload the page to refresh image URLs
          window.location.reload();
        } else {
          // Legacy store data import
          saveData(importedData);
        }
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return {
    data,
    updateProducts,
    updateSettings,
    exportData,
    exportFullBackup,
    importData
  };
}