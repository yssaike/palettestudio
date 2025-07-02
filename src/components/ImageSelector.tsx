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
      <NeumorphicCard className="p-4 sm:p-6 rounded-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center flex-shrink-0">
            <Camera className="text-primary-600" size={18} />
          </div>
          <h3 className="font-bodoni text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
            Choose Your Image
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-4 sm:mb-6">
          {/* Curated Images Button */}
          <NeumorphicButton
            onClick={onNextImage}
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-start gap-3 h-auto py-4 px-4 text-left"
          >
            <div className="flex-shrink-0">
              <Shuffle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base leading-tight">Curated Images</div>
              <div className="text-xs opacity-75 mt-1 leading-tight">Professional nature photos</div>
            </div>
          </NeumorphicButton>

          {/* Upload Image Button */}
          <NeumorphicButton
            onClick={() => setShowUpload(!showUpload)}
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-start gap-3 h-auto py-4 px-4 text-left"
          >
            <div className="flex-shrink-0">
              <Upload size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base leading-tight">Upload Image</div>
              <div className="text-xs opacity-75 mt-1 leading-tight">Use your own photo</div>
            </div>
          </NeumorphicButton>
        </div>

        {/* Current Image Info */}
        <div className="pt-4 border-t border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-helvetica text-sm font-medium text-gray-800 truncate">
                Current: {currentImage.alt}
              </p>
              <p className="font-helvetica text-xs text-gray-500 truncate">
                by {currentImage.photographer}
              </p>
            </div>
          </div>
        </div>
      </NeumorphicCard>

      {/* Upload Section */}
      {showUpload && (
        <div className="mt-4 sm:mt-6">
          <ImageUpload onImageSelect={handleCustomImageSelect} />
        </div>
      )}
    </div>
  );
};