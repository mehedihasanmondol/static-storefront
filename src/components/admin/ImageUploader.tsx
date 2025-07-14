import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useImageStorage } from '../../hooks/useImageStorage';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  selectedImage?: string;
  className?: string;
}

export function ImageUploader({ onImageSelect, selectedImage, className = '' }: ImageUploaderProps) {
  const { images, uploadImage, deleteImage, formatFileSize } = useImageStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedImage = await uploadImage(file);
      if (uploadedImage) {
        onImageSelect(uploadedImage.url);
        setShowGallery(false);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    setShowGallery(false);
  };

  const handleDeleteImage = async (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(imageId);
        // If the deleted image was selected, clear the selection
        const deletedImage = images.find(img => img.id === imageId);
        if (deletedImage && selectedImage === deletedImage.url) {
          onImageSelect('');
        }
      } catch (error) {
        alert('Failed to delete image');
      }
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Current Selection */}
        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
            />
            <button
              onClick={() => onImageSelect('')}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Upload and Gallery Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload New'}</span>
          </button>
          
          <button
            onClick={() => setShowGallery(!showGallery)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Gallery</span>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Image Gallery */}
        {showGallery && (
          <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
            <h4 className="font-medium text-gray-900 mb-3">Select from Gallery</h4>
            
            {images.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No images uploaded yet
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer"
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-16 object-cover rounded border hover:border-blue-400 transition-colors"
                    />
                    
                    {/* Image Info Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDeleteImage(e, image.id)}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Image Details */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 rounded-b opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="truncate">{image.name}</div>
                      <div>{formatFileSize(image.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Instructions */}
        <div className="text-xs text-gray-500">
          <p>• Supported formats: JPG, PNG, GIF, WebP</p>
          <p>• Maximum file size: 5MB</p>
          <p>• Images are stored locally as blob data in your browser</p>
        </div>
      </div>
    </div>
  );
}