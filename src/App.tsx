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

  // Smooth scroll to colors section with cross-browser compatibility
  const scrollToColors = useCallback(() => {
    const colorsSection = document.getElementById('colors');
    if (!colorsSection) return;

    // Check if browser supports smooth scrolling
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    
    if (supportsNativeSmoothScroll) {
      // Use native smooth scrolling
      colorsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      // Fallback for older browsers with custom smooth scroll
      const startPosition = window.pageYOffset;
      const targetPosition = colorsSection.offsetTop - 80; // 80px offset for better visual spacing
      const distance = targetPosition - startPosition;
      const duration = 500; // 500ms duration
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }

    // Announce to screen readers for accessibility
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Scrolled to color palette section';
    document.body.appendChild(announcement);
    
    // Clean up announcement after screen readers have processed it
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const generatePalette = useCallback(async () => {
    if (!imageLoaded || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const generatedPalette = await extractColorsFromImage(currentImage.url);
      setPalette(generatedPalette);
      
      // Scroll to colors section after palette is generated
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToColors();
      }, 100);
    } catch (error) {
      console.error('Failed to generate palette:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [currentImage.url, imageLoaded, isGenerating, scrollToColors]);

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
          if (palette) {
            // If palette already exists, just scroll to it
            scrollToColors();
          } else {
            // Generate palette and scroll will happen automatically
            generatePalette();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextImage, generatePalette, palette, scrollToColors]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* Header */}
      <header className="w-full py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <NeumorphicCard className="inline-block px-6 sm:px-8 py-4 sm:py-6 rounded-3xl mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                <Sparkles className="text-primary-600" size={20} />
              </div>
              <h1 className="font-bodoni text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Palette Studio
              </h1>
            </div>
            <p className="font-helvetica text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover beautiful color palettes from nature's finest moments with neuromorphic design
            </p>
          </NeumorphicCard>
          
          {/* Controls Section */}
          <NeumorphicInstructions />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <NeumorphicImageDisplay
              image={currentImage}
              onImageLoad={handleImageLoad}
              isGenerating={isGenerating}
            />
          </div>

          {/* Image Selector */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <ImageSelector
              currentImage={currentImage}
              onImageSelect={handleImageSelect}
              onNextImage={nextImage}
            />
          </div>
        </div>

        {/* Palette Display */}
        {palette && (
          <div id="colors" className="mt-12 sm:mt-16" role="region" aria-label="Generated color palette">
            <div className="text-center mb-8 sm:mb-12">
              <NeumorphicCard className="inline-block px-6 sm:px-8 py-4 sm:py-6 rounded-3xl mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
                    <Palette className="text-primary-600" size={18} />
                  </div>
                  <h2 className="font-bodoni text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    Generated Palette
                  </h2>
                </div>
                
                <p className="font-helvetica text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed">
                  Click any color to copy its hex code. These colors are extracted using advanced 
                  clustering algorithms to capture the essence of the image.
                </p>

                <NeumorphicExportButton 
                  palette={palette} 
                  imageName={currentImage.alt}
                />
              </NeumorphicCard>
              
              <NeumorphicCard className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl">
                <Sparkles className="text-primary-600" size={14} />
                <span className="font-helvetica text-xs sm:text-sm text-gray-600">
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
              
              <NeumorphicCard className="p-6 sm:p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
                    <Shield className="text-primary-600" size={18} />
                  </div>
                  <h3 className="font-bodoni text-lg sm:text-xl font-semibold text-gray-800">
                    Semantic Colors
                  </h3>
                </div>
                <p className="font-helvetica text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 ml-11">
                  Functional colors for UI states and messaging
                </p>
                <SemanticColors semantic={palette.semantic} />
              </NeumorphicCard>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center py-6 sm:py-8">
          <NeumorphicCard className="inline-block px-4 sm:px-6 py-3 sm:py-4 rounded-2xl">
            <p className="font-helvetica text-xs sm:text-sm text-gray-500 leading-relaxed">
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