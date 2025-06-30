import React from 'react';
import { ColorSwatch } from './ColorSwatch';
import { ColorInfo } from '../types/palette';

interface PaletteSectionProps {
  title: string;
  colors: ColorInfo[];
  description?: string;
}

export const PaletteSection: React.FC<PaletteSectionProps> = ({ 
  title, 
  colors, 
  description 
}) => {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="font-bodoni text-xl font-semibold text-gray-800 mb-1">
          {title}
        </h3>
        {description && (
          <p className="font-helvetica text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {colors.map((color, index) => (
          <ColorSwatch
            key={`${color.hex}-${index}`}
            color={color}
            size="md"
            showName={true}
          />
        ))}
      </div>
    </div>
  );
};