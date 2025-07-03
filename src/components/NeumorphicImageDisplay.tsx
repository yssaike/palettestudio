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
    <div className="relative w-full max-w-none mx-auto">
      <NeumorphicCard 
        className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl lg:rounded-4xl overflow-hidden p-1 sm:p-2 lg:p-3"
        elevated={true}
      >
        {/* Enhanced Inner Container with Responsive Styling */}
        <div className="relative w-full h-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary-600" size={20} />
                  </div>
                </div>
                <p className="font-helvetica text-sm sm:text-base lg:text-lg text-gray-600">Loading image...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center mb-3 sm:mb-4 lg:mb-6">
                <Camera size={24} />
              </div>
              <p className="font-helvetica text-sm sm:text-base lg:text-lg">Failed to load image</p>
            </div>
          )}
          
          <img
            src={image.url}
            alt={image.alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-opacity duration-500 rounded-xl sm:rounded-2xl lg:rounded-3xl ${
              loading || error ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {isGenerating && !loading && !error && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl sm:rounded-2xl lg:rounded-3xl">
              <NeumorphicCard className="px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 lg:py-6 xl:py-8 rounded-xl sm:rounded-2xl lg:rounded-3xl">
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                  <div className="relative">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
                      <Loader2 className="animate-spin text-primary-600" size={14} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Sparkles className="text-primary-600" size={16} />
                    <span className="font-helvetica text-sm sm:text-base lg:text-lg font-medium text-gray-700">
                      Analyzing colors...
                    </span>
                  </div>
                </div>
              </NeumorphicCard>
            </div>
          )}
        </div>
      </NeumorphicCard>
      
      {/* Enhanced Photographer Credit with Responsive Scaling */}
      <div className="mt-4 sm:mt-6 lg:mt-8 xl:mt-10 text-center">
        <NeumorphicCard className="inline-block px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl lg:rounded-3xl">
          <p className="font-helvetica text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
            Photo by <span className="font-medium text-gray-800">{image.photographer}</span>
          </p>
        </NeumorphicCard>
      </div>
    </div>
  );
};