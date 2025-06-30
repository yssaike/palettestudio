import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { ColorPalette } from '../types/palette';

interface PaletteHeaderProps {
  palette: ColorPalette;
  imageName?: string;
}

export const PaletteHeader: React.FC<PaletteHeaderProps> = ({ palette, imageName }) => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Palette className="text-primary-600" size={28} />
        <h2 className="font-bodoni text-3xl font-bold text-gray-900">
          Generated Palette
        </h2>
      </div>
      
      <p className="font-helvetica text-gray-600 max-w-2xl mx-auto mb-8">
        Click any color to copy its hex code. These colors are extracted using advanced 
        clustering algorithms to capture the essence of the image.
      </p>

      <div className="flex flex-col items-center gap-6">
        <ExportButton 
          palette={palette} 
          imageName={imageName}
        />
        
        <div className="flex items-center gap-2 text-sm text-gray-500 font-helvetica bg-gray-50 px-4 py-2 rounded-full">
          <Sparkles size={16} />
          <span>Complete design system with colors, typography & effects</span>
        </div>
      </div>
    </div>
  );
};