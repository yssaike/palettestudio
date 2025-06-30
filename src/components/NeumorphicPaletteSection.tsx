import React from 'react';
import { NeumorphicColorSwatch } from './NeumorphicColorSwatch';
import { NeumorphicCard } from './NeumorphicCard';
import { ColorInfo } from '../types/palette';

interface NeumorphicPaletteSectionProps {
  title: string;
  colors: ColorInfo[];
  description?: string;
  icon?: React.ReactNode;
}

export const NeumorphicPaletteSection: React.FC<NeumorphicPaletteSectionProps> = ({ 
  title, 
  colors, 
  description,
  icon 
}) => {
  return (
    <NeumorphicCard className="p-8 rounded-3xl mb-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
              {icon}
            </div>
          )}
          <h3 className="font-bodoni text-xl font-semibold text-gray-800">
            {title}
          </h3>
        </div>
        {description && (
          <p className="font-helvetica text-sm text-gray-600 ml-11">
            {description}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {colors.map((color, index) => (
          <NeumorphicColorSwatch
            key={`${color.hex}-${index}`}
            color={color}
            size="md"
            showName={true}
          />
        ))}
      </div>
    </NeumorphicCard>
  );
};