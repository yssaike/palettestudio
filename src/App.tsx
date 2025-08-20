import React, { useState, useEffect, useCallback } from 'react';
import { Palette, Sparkles, Star, Zap, Crown, Shield } from 'lucide-react';
import { NeumorphicImageDisplay } from './components/NeumorphicImageDisplay';
import { NeumorphicInstructions } from './components/NeumorphicInstructions';
import { NeumorphicPaletteSection } from './components/NeumorphicPaletteSection';
import { NeumorphicExportButton } from './components/NeumorphicExportButton';
import { NeumorphicCard } from './components/NeumorphicCard';
import { ImageSelector } from './components/ImageSelector';
import { SemanticColors } from './components/SemanticColors';
import { extractColorsFromImage } from './utils/colorExtractor';
import { smoothScrollToElement, createScrollMonitor } from './utils/scrollUtils';
import { natureImages } from './data/images';
import type { ColorPalette, NatureImage } from './types/palette';

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState<NatureImage>(natureImages[0]);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCustomImage, setIsCustomImage] = useState(false);

  // Shuffle images on initial load
  useEffect(() => {
    const shuffledImages = [...natureImages].sort(() => Math.random() - 0.5);
    const initialIndex = 0;
    setCurrentImage(shuffledImages[initialIndex]);
    setCurrentImageIndex(initialIndex);
  }, []);

  const nextImage = useCallback(() => {
    const nextIndex = (currentImageIndex + 1) % natureImages.length;
    setCurrentImageIndex(nextIndex);
    setCurrentImage(natureImages[nextIndex]);
    setPalette(null);
    setImageLoaded(false);
    setIsCustomImage(false);
  }, [currentImageIndex]);

  const handleImageSelect = useCallback((imageUrl: string, imageName: string, isCustom = false) => {
    const customImage: NatureImage = {
      id: 'custom',
      url: imageUrl,
      alt: imageName,
      photographer: 'You'
    };
    
    setCurrentImage(customImage);
    setPalette(null);
    setImageLoaded(false);
    setIsCustomImage(isCustom);
  }, []);

  // Enhanced smooth scroll with viewport awareness and focus management
  const scrollToColors = useCallback(async () => {
    try {
      await smoothScrollToElement('colors', {
        duration: 600,
        onComplete: () => {
          // Additional completion logic if needed
        }
      });
    } catch (error) {
  // Enhanced scroll position monitoring
      console.error('Scroll to colors failed:', error);
    }
    if (palette) {
      const cleanup = createScrollMonitor('colors');
      return cleanup;
    }
  }, [palette]);

  const generatePalette = useCallback(async () => {
    if (!imageLoaded || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const extractedPalette = await extractColorsFromImage(currentImage.url);
      setPalette(extractedPalette);
      setTimeout(() => scrollToColors(), 100);
    } catch (error) {
      console.error('Failed to generate palette:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [currentImage.url, imageLoaded, isGenerating, scrollToColors]);

  useEffect(() => {
    if (imageLoaded && !palette && !isGenerating) {
      generatePalette();
    }
  }, [nextImage, generatePalette, palette, scrollToColors, imageLoaded, isGenerating]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* Enhanced Header with Responsive Scaling */}
      <header className="w-full py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <NeumorphicCard className="inline-block px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 md:py-6 lg:py-8 rounded-2xl sm:rounded-3xl lg:rounded-4xl mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                <Sparkles className="text-primary-600" size={16} />
              </div>
              <h1 className="font-bodoni text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 leading-tight">
                Palette Studio
              </h1>
            </div>
            <p className="font-helvetica text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed">
              Discover beautiful color palettes from nature's finest moments with neuromorphic design
            </p>
          </NeumorphicCard>
          
          {/* Enhanced Controls Section */}
          <NeumorphicInstructions />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16 xl:pb-20">
        {/* Enhanced Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          {/* Image Section - Responsive Scaling */}
          <div className="lg:col-span-2 xl:col-span-3 order-2 lg:order-1">
            <NeumorphicImageDisplay
              image={currentImage}
              onImageLoad={handleImageLoad}
              isGenerating={isGenerating}
            />
          </div>

          {/* Image Selector - Enhanced Responsive Behavior */}
          <div className="lg:col-span-1 xl:col-span-1 order-1 lg:order-2">
            <ImageSelector
              currentImage={currentImage}
              onImageSelect={handleImageSelect}
              onNextImage={nextImage}
            />
          </div>
        </div>

        {/* Enhanced Palette Display with Focus Management */}
        {palette && (
          <div 
            id="colors" 
            className="mt-8 sm:mt-12 lg:mt-16 xl:mt-20 2xl:mt-24 scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24 xl:scroll-mt-28" 
            role="region" 
            aria-label="Generated color palette"
            tabIndex={-1}
          >
            <div className="text-center mb-6 sm:mb-8 lg:mb-12 xl:mb-16">
              <NeumorphicCard className="inline-block px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 md:py-6 lg:py-8 rounded-2xl sm:rounded-3xl lg:rounded-4xl mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                    <Palette className="text-primary-600" size={14} />
                  </div>
                  <h2 className="font-bodoni text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                    Generated Palette
                  </h2>
                </div>
                
                <p className="font-helvetica text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed">
                  Click any color to copy its hex code. These colors are extracted using advanced 
                  clustering algorithms to capture the essence of the image.
                </p>

                <NeumorphicExportButton 
                  palette={palette} 
                  imageName={currentImage.alt}
                />
              </NeumorphicCard>
              
              <NeumorphicCard className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl">
                <Sparkles className="text-primary-600" size={12} />
                <span className="font-helvetica text-xs sm:text-sm md:text-base text-gray-600">
                  Complete design system with neuromorphic styling
                </span>
              </NeumorphicCard>
            </div>

            {/* Enhanced Palette Sections with Responsive Spacing */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
              <NeumorphicPaletteSection
                title="Primary Colors"
                colors={palette.primary}
                description="Dominant colors that define the image's character"
                icon={<Star className="text-primary-600" size={16} />}
              />
              
              <NeumorphicPaletteSection
                title="Secondary Colors"
                colors={palette.secondary}
                description="Supporting colors with high saturation and vibrancy"
                icon={<Zap className="text-primary-600" size={16} />}
              />
              
              <NeumorphicPaletteSection
                title="Brand Colors"
                colors={palette.brand}
                description="Balanced colors perfect for branding and design"
                icon={<Crown className="text-primary-600" size={16} />}
              />
              
              <NeumorphicCard className="p-4 sm:p-6 lg:p-8 xl:p-10 rounded-2xl sm:rounded-3xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
                    <Shield className="text-primary-600" size={14} />
                  </div>
                  <h3 className="font-bodoni text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                    Semantic Colors
                  </h3>
                </div>
                <p className="font-helvetica text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 lg:mb-6 ml-8 sm:ml-11">
                  Functional colors for UI states and messaging
                </p>
                <SemanticColors semantic={palette.semantic} />
              </NeumorphicCard>
            </div>
          </div>
        )}

        {/* Enhanced Footer with Responsive Scaling */}
        <footer className="mt-8 sm:mt-12 lg:mt-16 xl:mt-20 2xl:mt-24 text-center py-4 sm:py-6 lg:py-8">
          <NeumorphicCard className="inline-block px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl">
            <p className="font-helvetica text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed">
              {isCustomImage 
                ? 'Custom image uploaded • Neuromorphic design by Palette Studio'
                : 'Images provided by talented photographers on Pexels • Neuromorphic design by Palette Studio'
              }
            </p>
          </NeumorphicCard>
        </footer>
      </main>
    </div>
  );
}

export default App;