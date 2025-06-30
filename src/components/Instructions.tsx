import React from 'react';
import { Keyboard, Palette } from 'lucide-react';

export const Instructions: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Keyboard className="text-primary-600" size={24} />
        <h2 className="font-bodoni text-lg font-semibold text-gray-800">
          Controls
        </h2>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg font-helvetica text-sm font-medium text-gray-700">
            Space
          </kbd>
          <span className="font-helvetica text-sm text-gray-600">Next image</span>
        </div>
        
        <div className="flex items-center gap-4">
          <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg font-helvetica text-sm font-medium text-gray-700">
            Enter
          </kbd>
          <span className="font-helvetica text-sm text-gray-600">Generate palette</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="text-primary-600" size={16} />
          <span className="font-helvetica text-xs font-medium text-gray-700">
            Tip
          </span>
        </div>
        <p className="font-helvetica text-xs text-gray-600">
          Click any color swatch to copy its hex code to clipboard
        </p>
      </div>
    </div>
  );
};