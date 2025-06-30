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
    <div className={className}>
      <NeumorphicCard className="p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
            <Camera className="text-primary-600" size={18} />
          </div>
          <h3 className="font-bodoni text-xl font-semibold text-gray-800">
            Choose Your Image
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Use Curated Images */}
          <NeumorphicButton
            onClick={onNextImage}
            variant="secondary"
            size="lg"
            className="flex items-center justify-center gap-3 h-16"
          >
            <Shuffle size={20} />
            <div className="text-left">
              <div className="font-medium">Curated Images</div>
              <div className="text-xs opacity-75">Professional nature photos</div>
            </div>
          </NeumorphicButton>

          {/* Upload Custom Image */}
          <NeumorphicButton
            onClick={() => setShowUpload(!showUpload)}
            variant="primary"
            size="lg"
            className="flex items-center justify-center gap-3 h-16"
          >
            <Upload size={20} />
            <div className="text-left">
              <div className="font-medium">Upload Image</div>
              <div className="text-xs opacity-75">Use your own photo</div>
            </div>
          </NeumorphicButton>
        </div>

        {/* Current Image Info */}
        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-helvetica text-sm font-medium text-gray-800">
                Current: {currentImage.alt}
              </p>
              <p className="font-helvetica text-xs text-gray-500">
                by {currentImage.photographer}
              </p>
            </div>
          </div>
        </div>
      </NeumorphicCard>

      {/* Upload Section */}
      {showUpload && (
        <div className="mt-6">
          <ImageUpload onImageSelect={handleCustomImageSelect} />
        </div>
      )}
    </div>
  );
};