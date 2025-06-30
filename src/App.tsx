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

  const generatePalette = useCallback(async () => {
    if (!imageLoaded || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const generatedPalette = await extractColorsFromImage(currentImage.url);
      setPalette(generatedPalette);
    } catch (error) {
      console.error('Failed to generate palette:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [currentImage.url, imageLoaded, isGenerating]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (event.key) {
        case ' ':
          event.preventDefault();
          nextImage();
          break;
        case 'Enter':
          event.preventDefault();
          generatePalette();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextImage, generatePalette]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* Header */}
      <header className="w-full py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <NeumorphicCard className="inline-block px-8 py-6 rounded-3xl mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                <Sparkles className="text-primary-600" size={24} />
              </div>
              <h1 className="font-bodoni text-4xl md:text-5xl font-bold text-gray-900">
                Palette Studio
              </h1>
            </div>
            <p className="font-helvetica text-lg text-gray-600 max-w-2xl mx-auto">
              Discover beautiful color palettes from nature's finest moments with neuromorphic design
            </p>
          </NeumorphicCard>
          
          {/* Controls Section - Moved from sidebar */}
          <NeumorphicInstructions />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <NeumorphicImageDisplay
              image={currentImage}
              onImageLoad={handleImageLoad}
              isGenerating={isGenerating}
            />
          </div>

          {/* Image Selector */}
          <div className="lg:col-span-1">
            <ImageSelector
              currentImage={currentImage}
              onImageSelect={handleImageSelect}
              onNextImage={nextImage}
            />
          </div>
        </div>

        {/* Palette Display */}
        {palette && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <NeumorphicCard className="inline-block px-8 py-6 rounded-3xl mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                    <Palette className="text-primary-600" size={20} />
                  </div>
                  <h2 className="font-bodoni text-3xl font-bold text-gray-900">
                    Generated Palette
                  </h2>
                </div>
                
                <p className="font-helvetica text-gray-600 max-w-2xl mx-auto mb-6">
                  Click any color to copy its hex code. These colors are extracted using advanced 
                  clustering algorithms to capture the essence of the image.
                </p>

                <NeumorphicExportButton 
                  palette={palette} 
                  imageName={currentImage.alt}
                />
              </NeumorphicCard>
              
              <NeumorphicCard className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl">
                <Sparkles className="text-primary-600" size={16} />
                <span className="font-helvetica text-sm text-gray-600">
                  Complete design system with neuromorphic styling
                </span>
              </NeumorphicCard>
            </div>

            <div className="space-y-6">
              <NeumorphicPaletteSection
                title="Primary Colors"
                colors={palette.primary}
                description="Dominant colors that define the image's character"
                icon={<Star className="text-primary-600" size={18} />}
              />
              
              <NeumorphicPaletteSection
                title="Secondary Colors"
                colors={palette.secondary}
                description="Supporting colors with high saturation and vibrancy"
                icon={<Zap className="text-primary-600" size={18} />}
              />
              
              <NeumorphicPaletteSection
                title="Brand Colors"
                colors={palette.brand}
                description="Balanced colors perfect for branding and design"
                icon={<Crown className="text-primary-600" size={18} />}
              />
              
              <NeumorphicCard className="p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
                    <Shield className="text-primary-600" size={18} />
                  </div>
                  <h3 className="font-bodoni text-xl font-semibold text-gray-800">
                    Semantic Colors
                  </h3>
                </div>
                <p className="font-helvetica text-sm text-gray-600 mb-6 ml-11">
                  Functional colors for UI states and messaging
                </p>
                <SemanticColors semantic={palette.semantic} />
              </NeumorphicCard>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center py-8">
          <NeumorphicCard className="inline-block px-6 py-4 rounded-2xl">
            <p className="font-helvetica text-sm text-gray-500">
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