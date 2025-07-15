import { useState, useEffect } from 'react';
import { AppData, Product, SiteSettings } from '../types';

const DB_NAME = 'StaticStorefront';
const DB_VERSION = 1;
const STORE_NAME = 'appData';

interface StoredData extends AppData {
  appVersion: number;
}

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

export function useIndexedDB() {
  const [data, setData] = useState<AppData>({
    products: DEFAULT_PRODUCTS,
    settings: DEFAULT_SETTINGS
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [appVersion, setAppVersion] = useState(1.0);

  useEffect(() => {
    initializeDB();
  }, []);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  };

  const initializeDB = async () => {
    try {
      setIsLoading(true);
      
      // Check if admin is logged in
      const isLoggedIn = localStorage.getItem('adminAuthStatus') === 'true';
      
      if (isLoggedIn) {
        await loadFromIndexedDB();
      } else {
        await loadFromJSON();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      // Fallback to default data
      setData({
        products: DEFAULT_PRODUCTS,
        settings: DEFAULT_SETTINGS
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromIndexedDB = async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.get('appData');
      
      return new Promise<void>((resolve, reject) => {
        request.onsuccess = async () => {
          const storedData = request.result as StoredData;
          
          if (storedData) {
            // Check JSON version vs IndexedDB version
            const jsonData = await loadJSONData();
            
            if (jsonData && jsonData.appVersion > storedData.appVersion) {
              // JSON is newer, update IndexedDB
              const updatedData: StoredData = {
                ...jsonData,
                appVersion: jsonData.appVersion
              };
              
              await saveToIndexedDB(updatedData);
              setData({ products: updatedData.products, settings: updatedData.settings });
              setAppVersion(updatedData.appVersion);
            } else {
              // Use IndexedDB data
              setData({ products: storedData.products, settings: storedData.settings });
              setAppVersion(storedData.appVersion);
            }
          } else {
            // No IndexedDB data, try to load from JSON
            const jsonData = await loadJSONData();
            if (jsonData) {
              const initialData: StoredData = {
                ...jsonData,
                appVersion: jsonData.appVersion || 1.0
              };
              await saveToIndexedDB(initialData);
              setData({ products: initialData.products, settings: initialData.settings });
              setAppVersion(initialData.appVersion);
            } else {
              // Use defaults
              const defaultData: StoredData = {
                products: DEFAULT_PRODUCTS,
                settings: DEFAULT_SETTINGS,
                appVersion: 1.0
              };
              await saveToIndexedDB(defaultData);
              setData({ products: defaultData.products, settings: defaultData.settings });
              setAppVersion(1.0);
            }
          }
          resolve();
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
      throw error;
    }
  };

  const loadFromJSON = async () => {
    try {
      const jsonData = await loadJSONData();
      if (jsonData) {
        setData({ products: jsonData.products, settings: jsonData.settings });
        setAppVersion(jsonData.appVersion || 1.0);
      } else {
        setData({
          products: DEFAULT_PRODUCTS,
          settings: DEFAULT_SETTINGS
        });
        setAppVersion(1.0);
      }
    } catch (error) {
      console.error('Error loading from JSON:', error);
      setData({
        products: DEFAULT_PRODUCTS,
        settings: DEFAULT_SETTINGS
      });
      setAppVersion(1.0);
    }
  };

  const loadJSONData = async (): Promise<StoredData | null> => {
    try {
      const response = await fetch('/store-data.json');
      if (response.ok) {
        const jsonData = await response.json();
        return {
          products: jsonData.products || DEFAULT_PRODUCTS,
          settings: { ...DEFAULT_SETTINGS, ...jsonData.settings },
          appVersion: jsonData.appVersion || 1.0
        };
      }
    } catch (error) {
      console.log('No JSON file found or error loading:', error);
    }
    return null;
  };

  const saveToIndexedDB = async (dataToSave: StoredData): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const dataWithId = { ...dataToSave, id: 'appData' };
      
      return new Promise((resolve, reject) => {
        const request = store.put(dataWithId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
      throw error;
    }
  };

  const updateData = async (newData: AppData, showNotification?: (message: string) => void) => {
    try {
      const newVersion = Math.round((appVersion + 0.1) * 10) / 10;
      
      const dataToSave: StoredData = {
        ...newData,
        appVersion: newVersion
      };

      // Save to IndexedDB
      await saveToIndexedDB(dataToSave);
      
      // Update state
      setData(newData);
      setAppVersion(newVersion);
      setHasChanges(true);
      
      // Auto-download updated JSON
      downloadJSON(dataToSave, 'store-data.json');
      
      // Show notification if provided
      if (showNotification) {
        showNotification('Changes saved successfully! Updated JSON file downloaded.');
      }
      
    } catch (error) {
      console.error('Error updating data:', error);
      if (showNotification) {
        showNotification('Error saving changes. Please try again.');
      }
    }
  };

  const downloadJSON = (data: StoredData, filename: string) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateProducts = async (products: Product[], showNotification?: (message: string) => void) => {
    const newData = { ...data, products };
    await updateData(newData, showNotification);
  };

  const updateSettings = async (settings: SiteSettings, showNotification?: (message: string) => void) => {
    const newData = { ...data, settings };
    await updateData(newData, showNotification);
  };

  const exportData = () => {
    const exportData: StoredData = {
      ...data,
      appVersion
    };
    downloadJSON(exportData, 'store-data.json');
    setHasChanges(false);
  };

  const exportFullBackup = async () => {
    try {
      const imageData = localStorage.getItem('storedImages');
      
      const fullBackup = {
        storeData: {
          ...data,
          appVersion
        },
        imageData: imageData ? JSON.parse(imageData) : [],
        exportedAt: new Date().toISOString(),
        version: '2.0'
      };
      
      downloadJSON(fullBackup, 'store-full-backup.json');
      setHasChanges(false);
    } catch (error) {
      console.error('Error creating full backup:', error);
    }
  };

  const importData = async (file: File, showNotification?: (message: string) => void) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (importedData.storeData && importedData.imageData) {
          // Full backup import
          const dataToImport: StoredData = {
            ...importedData.storeData,
            appVersion: importedData.storeData.appVersion || 1.0
          };
          
          await updateData(dataToImport, showNotification);
          localStorage.setItem('storedImages', JSON.stringify(importedData.imageData));
          
          // Reload to refresh image URLs
          setTimeout(() => window.location.reload(), 1000);
        } else {
          // Regular store data import
          const dataToImport: StoredData = {
            products: importedData.products || DEFAULT_PRODUCTS,
            settings: { ...DEFAULT_SETTINGS, ...importedData.settings },
            appVersion: importedData.appVersion || 1.0
          };
          
          await updateData(dataToImport, showNotification);
        }
      } catch (error) {
        console.error('Error importing data:', error);
        if (showNotification) {
          showNotification('Invalid JSON file. Please check the file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const clearChanges = () => {
    setHasChanges(false);
  };

  return {
    data,
    isLoading,
    hasChanges,
    appVersion,
    updateProducts,
    updateSettings,
    exportData,
    exportFullBackup,
    importData,
    clearChanges,
    initializeDB
  };
}