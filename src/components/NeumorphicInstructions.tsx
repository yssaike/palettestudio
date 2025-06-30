import React, { useState } from 'react';
import { Keyboard, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { NeumorphicCard } from './NeumorphicCard';

export const NeumorphicInstructions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <NeumorphicCard className="rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
            <Keyboard className="text-primary-600" size={18} />
          </div>
          <h2 className="font-bodoni text-lg font-semibold text-gray-800">
            Controls
          </h2>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[2px_2px_4px_rgba(163,177,198,0.4),-2px_-2px_4px_rgba(255,255,255,0.9)] hover:shadow-[3px_3px_6px_rgba(163,177,198,0.3),-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all duration-200 flex items-center justify-center text-gray-600"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] rounded-xl font-helvetica text-sm font-medium text-gray-700">
            Space
          </div>
          <span className="font-helvetica text-sm text-gray-600">Next image</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] rounded-xl font-helvetica text-sm font-medium text-gray-700">
            Enter
          </div>
          <span className="font-helvetica text-sm text-gray-600">Generate palette</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center">
              <Palette className="text-primary-600" size={12} />
            </div>
            <span className="font-helvetica text-xs font-medium text-gray-700">
              Pro Tips
            </span>
          </div>
          <div className="space-y-2">
            <p className="font-helvetica text-xs text-gray-600">
              • Click any color swatch to copy its hex code
            </p>
            <p className="font-helvetica text-xs text-gray-600">
              • Export complete design systems for Figma
            </p>
            <p className="font-helvetica text-xs text-gray-600">
              • Colors are extracted using advanced AI clustering
            </p>
          </div>
        </div>
      )}
    </NeumorphicCard>
  );
};