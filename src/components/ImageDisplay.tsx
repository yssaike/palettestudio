import React, { useState } from 'react';
import { Loader2, Camera } from 'lucide-react';
import { NatureImage } from '../types/palette';

interface ImageDisplayProps {
  image: NatureImage;
  onImageLoad: () => void;
  isGenerating: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  image, 
  onImageLoad,
  isGenerating 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
    onImageLoad();
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="animate-spin text-primary-600" size={32} />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
            <Camera size={48} className="mb-4" />
            <p className="font-helvetica text-sm">Failed to load image</p>
          </div>
        )}
        
        <img
          src={image.url}
          alt={image.alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loading || error ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {isGenerating && !loading && !error && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-3">
              <Loader2 className="animate-spin text-primary-600" size={20} />
              <span className="font-helvetica text-sm font-medium text-gray-700">
                Analyzing colors...
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="font-helvetica text-sm text-gray-600">
          Photo by <span className="font-medium">{image.photographer}</span>
        </p>
      </div>
    </div>
  );
};