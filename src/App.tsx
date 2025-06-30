import React, { useState, useEffect, useCallback } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { ImageDisplay } from './components/ImageDisplay';
import { Instructions } from './components/Instructions';
import { PaletteSection } from './components/PaletteSection';
import { SemanticColors } from './components/SemanticColors';
import { PaletteHeader } from './components/PaletteHeader';
import { extractColorsFromImage } from './utils/colorExtractor';
import { natureImages } from './data/images';
import type { ColorPalette, NatureImage } from './types/palette';

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState<NatureImage>(natureImages[0]);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
  }, [currentImageIndex]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="w-full py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-primary-600" size={32} />
            <h1 className="font-bodoni text-4xl md:text-5xl font-bold text-gray-900">
              Palette Studio
            </h1>
          </div>
          <p className="font-helvetica text-lg text-gray-600 max-w-2xl mx-auto">
            Discover beautiful color palettes from nature's finest moments. 
            Press <kbd className="px-2 py-1 bg-gray-200 rounded text-sm">Space</kbd> for new images, 
            <kbd className="px-2 py-1 bg-gray-200 rounded text-sm ml-1">Enter</kbd> to generate palettes.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-8">
            <ImageDisplay
              image={currentImage}
              onImageLoad={handleImageLoad}
              isGenerating={isGenerating}
            />
          </div>

          {/* Instructions */}
          <div className="lg:col-span-4">
            <Instructions />
          </div>
        </div>

        {/* Palette Display */}
        {palette && (
          <div className="mt-16">
            <PaletteHeader 
              palette={palette} 
              imageName={currentImage.alt}
            />

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <PaletteSection
                title="Primary Colors"
                colors={palette.primary}
                description="Dominant colors that define the image's character"
              />
              
              <PaletteSection
                title="Secondary Colors"
                colors={palette.secondary}
                description="Supporting colors with high saturation and vibrancy"
              />
              
              <PaletteSection
                title="Brand Colors"
                colors={palette.brand}
                description="Balanced colors perfect for branding and design"
              />
              
              <SemanticColors semantic={palette.semantic} />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center py-8 border-t border-gray-200">
          <p className="font-helvetica text-sm text-gray-500">
            Images provided by talented photographers on Pexels
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;