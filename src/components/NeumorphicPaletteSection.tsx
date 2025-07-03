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
    <NeumorphicCard className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-2xl sm:rounded-3xl lg:rounded-4xl mb-4 sm:mb-6 lg:mb-8">
      <div className="mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-1 sm:mb-2 lg:mb-3">
          {icon && (
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
              {icon}
            </div>
          )}
          <h3 className="font-bodoni text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800">
            {title}
          </h3>
        </div>
        {description && (
          <p className="font-helvetica text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 ml-8 sm:ml-11 lg:ml-14 xl:ml-16">
            {description}
          </p>
        )}
      </div>
      
      {/* Enhanced Responsive Grid for Color Swatches */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
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