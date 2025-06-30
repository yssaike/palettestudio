import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { NeumorphicCard } from './NeumorphicCard';
import { NeumorphicButton } from './NeumorphicButton';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string, imageName: string) => void;
  className?: string;
}

interface UploadedImage {
  url: string;
  name: string;
  size: number;
  type: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, className = '' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WebP image file.';
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 10MB.';
    }

    return null;
  };

  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create object URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      // Create an image element to check dimensions
      const img = new Image();
      img.onload = () => {
        const uploadedImageData: UploadedImage = {
          url: imageUrl,
          name: file.name,
          size: file.size,
          type: file.type
        };

        setUploadedImage(uploadedImageData);
        setIsProcessing(false);

        // Recommend minimum resolution
        if (img.width < 1000 || img.height < 1000) {
          setError('For best results, use images with at least 1000x1000 pixels resolution.');
        }
      };

      img.onerror = () => {
        setError('Failed to load the image. Please try a different file.');
        setIsProcessing(false);
        URL.revokeObjectURL(imageUrl);
      };

      img.src = imageUrl;
    } catch (err) {
      setError('Failed to process the image. Please try again.');
      setIsProcessing(false);
    }
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    processImage(file);
  }, [processImage]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const handleUseImage = () => {
    if (uploadedImage) {
      onImageSelect(uploadedImage.url, uploadedImage.name);
    }
  };

  const handleRemoveImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.url);
      setUploadedImage(null);
      setError(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <NeumorphicCard className="p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
            <Upload className="text-primary-600" size={18} />
          </div>
          <h3 className="font-bodoni text-xl font-semibold text-gray-800">
            Upload Your Image
          </h3>
        </div>

        <p className="font-helvetica text-sm text-gray-600 mb-6">
          Upload your own image to generate a personalized color palette. Supports JPG, PNG, and WebP formats up to 10MB.
        </p>

        {!uploadedImage ? (
          <div
            className={`
              relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
              ${dragActive 
                ? 'border-primary-400 bg-primary-50/50' 
                : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50/50'
              }
              ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                {isProcessing ? (
                  <div className="animate-spin">
                    <Upload className="text-primary-600" size={24} />
                  </div>
                ) : (
                  <ImageIcon className="text-gray-400" size={24} />
                )}
              </div>

              <div>
                <p className="font-helvetica text-lg font-medium text-gray-700 mb-2">
                  {isProcessing ? 'Processing image...' : 'Drop your image here'}
                </p>
                <p className="font-helvetica text-sm text-gray-500">
                  or click to browse files
                </p>
              </div>

              <div className="text-xs text-gray-400 font-helvetica">
                <p>• JPG, PNG, WebP formats</p>
                <p>• Maximum 10MB file size</p>
                <p>• Recommended: 1000x1000px or higher</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <NeumorphicCard className="p-4 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={uploadedImage.url}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-helvetica text-sm font-medium text-gray-800 truncate">
                        {uploadedImage.name}
                      </p>
                      <p className="font-helvetica text-xs text-gray-500">
                        {formatFileSize(uploadedImage.size)} • {uploadedImage.type.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleRemoveImage}
                      className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-50 to-red-100 shadow-[2px_2px_4px_rgba(163,177,198,0.4),-2px_-2px_4px_rgba(255,255,255,0.9)] hover:shadow-[3px_3px_6px_rgba(163,177,198,0.3),-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all duration-200 flex items-center justify-center text-red-600 hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </NeumorphicCard>

            {/* Use Image Button */}
            <NeumorphicButton
              onClick={handleUseImage}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-3"
            >
              <Check size={18} />
              <span>Use This Image</span>
            </NeumorphicButton>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <NeumorphicCard className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-[inset_1px_1px_2px_rgba(217,119,6,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center flex-shrink-0">
                <AlertCircle size={14} className="text-yellow-600" />
              </div>
              <p className="font-helvetica text-sm text-yellow-800">{error}</p>
            </div>
          </NeumorphicCard>
        )}
      </NeumorphicCard>
    </div>
  );
};