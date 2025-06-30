import React, { useState } from 'react';
import { Loader2, Camera, Sparkles } from 'lucide-react';
import { NatureImage } from '../types/palette';
import { NeumorphicCard } from './NeumorphicCard';

interface NeumorphicImageDisplayProps {
  image: NatureImage;
  onImageLoad: () => void;
  isGenerating: boolean;
}

export const NeumorphicImageDisplay: React.FC<NeumorphicImageDisplayProps> = ({ 
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
      <NeumorphicCard 
        className="relative aspect-[4/3] rounded-3xl overflow-hidden p-2"
        elevated={true}
      >
        {/* Inner container with additional neuromorphic styling */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary-600" size={24} />
                  </div>
                </div>
                <p className="font-helvetica text-sm text-gray-600">Loading image...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center mb-4">
                <Camera size={32} />
              </div>
              <p className="font-helvetica text-sm">Failed to load image</p>
            </div>
          )}
          
          <img
            src={image.url}
            alt={image.alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-opacity duration-500 rounded-2xl ${
              loading || error ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {isGenerating && !loading && !error && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <NeumorphicCard className="px-8 py-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
                      <Loader2 className="animate-spin text-primary-600" size={16} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-primary-600" size={18} />
                    <span className="font-helvetica text-sm font-medium text-gray-700">
                      Analyzing colors...
                    </span>
                  </div>
                </div>
              </NeumorphicCard>
            </div>
          )}
        </div>
      </NeumorphicCard>
      
      <div className="mt-6 text-center">
        <NeumorphicCard className="inline-block px-6 py-3 rounded-2xl">
          <p className="font-helvetica text-sm text-gray-600">
            Photo by <span className="font-medium text-gray-800">{image.photographer}</span>
          </p>
        </NeumorphicCard>
      </div>
    </div>
  );
};