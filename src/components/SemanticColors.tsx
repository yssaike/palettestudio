import React from 'react';
import { ColorSwatch } from './ColorSwatch';
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
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="font-bodoni text-xl font-semibold text-gray-800 mb-1">
          Semantic Colors
        </h3>
        <p className="font-helvetica text-sm text-gray-600">
          Functional colors for UI states and messaging
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {semanticArray.map(({ key, color, label }) => (
          <ColorSwatch
            key={key}
            color={color}
            size="md"
            showName={true}
            className="text-center"
          />
        ))}
      </div>
    </div>
  );
};