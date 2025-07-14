import { useState, useEffect } from 'react';

interface StoredImage {
  id: string;
  name: string;
  url: string;
  blob: Blob;
  size: number;
  type: string;
  uploadedAt: string;
}

export function useImageStorage() {
  const [images, setImages] = useState<StoredImage[]>([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const stored = localStorage.getItem('storedImages');
      if (stored) {
        const imageData = JSON.parse(stored);
        const loadedImages: StoredImage[] = [];

        for (const item of imageData) {
          try {
            // Convert base64 back to blob
            const response = await fetch(item.dataUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            loadedImages.push({
              ...item,
              blob,
              url
            });
          } catch (error) {
            console.error('Error loading image:', item.name, error);
          }
        }
        
        setImages(loadedImages);
      }
    } catch (error) {
      console.error('Error loading images from storage:', error);
    }
  };

  const saveImages = async (imagesToSave: StoredImage[]) => {
    try {
      const dataToStore = await Promise.all(
        imagesToSave.map(async (img) => {
          // Convert blob to base64 for storage
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onload = () => {
              resolve({
                id: img.id,
                name: img.name,
                size: img.size,
                type: img.type,
                uploadedAt: img.uploadedAt,
                dataUrl: reader.result
              });
            };
            reader.readAsDataURL(img.blob);
          });
        })
      );
      
      localStorage.setItem('storedImages', JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving images to storage:', error);
    }
  };

  const uploadImage = async (file: File): Promise<StoredImage | null> => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      const id = Date.now().toString();
      const url = URL.createObjectURL(file);
      
      const newImage: StoredImage = {
        id,
        name: file.name,
        url,
        blob: file,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };

      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      await saveImages(updatedImages);
      
      return newImage;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const imageToDelete = images.find(img => img.id === id);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      
      const updatedImages = images.filter(img => img.id !== id);
      setImages(updatedImages);
      await saveImages(updatedImages);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  const getImageUrl = (id: string): string | null => {
    const image = images.find(img => img.id === id);
    return image ? image.url : null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    images,
    uploadImage,
    deleteImage,
    getImageUrl,
    formatFileSize
  };
}