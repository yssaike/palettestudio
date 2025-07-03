import React, { useState } from 'react';
import { Camera, Upload, Shuffle } from 'lucide-react';
import { NeumorphicCard } from './NeumorphicCard';
import { NeumorphicButton } from './NeumorphicButton';
import { ImageUpload } from './ImageUpload';
import { NatureImage } from '../types/palette';

interface ImageSelectorProps {
  currentImage: NatureImage;
  onImageSelect: (imageUrl: string, imageName: string, isCustom?: boolean) => void;
  onNextImage: () => void;
  className?: string;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  currentImage,
  onImageSelect,
  onNextImage,
  className = ''
}) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleCustomImageSelect = (imageUrl: string, imageName: string) => {
    onImageSelect(imageUrl, imageName, true);
    setShowUpload(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <NeumorphicCard className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 rounded-2xl sm:rounded-3xl lg:rounded-4xl">
        {/* Enhanced Header with Responsive Scaling */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
          <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center flex-shrink-0">
            <Camera className="text-primary-600" size={14} />
          </div>
          <h3 className="font-bodoni text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 leading-tight">
            Choose Your Image
          </h3>
        </div>

        {/* Enhanced Action Buttons with Better Responsive Behavior */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
          {/* Curated Images Button */}
          <NeumorphicButton
            onClick={onNextImage}
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-start gap-2 sm:gap-3 lg:gap-4 h-auto py-3 sm:py-4 lg:py-5 xl:py-6 px-3 sm:px-4 lg:px-5 text-left"
          >
            <div className="flex-shrink-0">
              <Shuffle size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">Curated Images</div>
              <div className="text-xs sm:text-sm lg:text-base opacity-75 mt-0.5 sm:mt-1 leading-tight">Professional nature photos</div>
            </div>
          </NeumorphicButton>

          {/* Upload Image Button */}
          <NeumorphicButton
            onClick={() => setShowUpload(!showUpload)}
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-start gap-2 sm:gap-3 lg:gap-4 h-auto py-3 sm:py-4 lg:py-5 xl:py-6 px-3 sm:px-4 lg:px-5 text-left"
          >
            <div className="flex-shrink-0">
              <Upload size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">Upload Image</div>
              <div className="text-xs sm:text-sm lg:text-base opacity-75 mt-0.5 sm:mt-1 leading-tight">Use your own photo</div>
            </div>
          </NeumorphicButton>
        </div>

        {/* Enhanced Current Image Info with Responsive Layout */}
        <div className="pt-3 sm:pt-4 lg:pt-6 border-t border-gray-200/50">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-helvetica text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-800 truncate">
                Current: {currentImage.alt}
              </p>
              <p className="font-helvetica text-xs sm:text-sm lg:text-base text-gray-500 truncate">
                by {currentImage.photographer}
              </p>
            </div>
          </div>
        </div>
      </NeumorphicCard>

      {/* Enhanced Upload Section */}
      {showUpload && (
        <div className="mt-3 sm:mt-4 md:mt-6 lg:mt-8">
          <ImageUpload onImageSelect={handleCustomImageSelect} />
        </div>
      )}
    </div>
  );
};