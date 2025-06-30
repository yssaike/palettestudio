import React from 'react';
import { NeumorphicColorSwatch } from './NeumorphicColorSwatch';
import { ColorPalette } from '../types/palette';

interface SemanticColorsProps {
  semantic: ColorPalette['semantic'];
}

export const SemanticColors: React.FC<SemanticColorsProps> = ({ semantic }) => {
  const semanticArray = [
    { key: 'success', color: semantic.success, label: 'Success' },
    { key: 'warning', color: semantic.warning, label: 'Warning' }, 
    { key: 'error', color: semantic.error, label: 'Error' },
    { key: 'info', color: semantic.info, label: 'Info' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {semanticArray.map(({ key, color, label }) => (
        <NeumorphicColorSwatch
          key={key}
          color={color}
          size="md"
          showName={true}
          className="text-center"
        />
      ))}
    </div>
  );
};