import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ColorInfo } from '../types/palette';

interface NeumorphicColorSwatchProps {
  color: ColorInfo;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const NeumorphicColorSwatch: React.FC<NeumorphicColorSwatchProps> = ({ 
  color, 
  size = 'md', 
  showName = true,
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16',
    md: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36'
  };

  const isLightColor = color.hsl[2] > 60;
  const textColor = isLightColor ? 'text-gray-800' : 'text-white';

  // Create a slightly muted version of the color for the neuromorphic effect
  const createNeumorphicGradient = (hex: string) => {
    const rgb = color.rgb;
    const lighterRgb = rgb.map(c => Math.min(255, c + 15));
    const darkerRgb = rgb.map(c => Math.max(0, c - 15));
    
    return {
      background: `linear-gradient(145deg, rgb(${lighterRgb.join(',')}), rgb(${darkerRgb.join(',')}))`,
      boxShadow: isPressed 
        ? `inset 2px 2px 4px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(255,255,255,0.1)`
        : `4px 4px 8px rgba(0,0,0,0.15), -2px -2px 6px rgba(255,255,255,0.1)`
    };
  };

  const neumorphicStyles = createNeumorphicGradient(color.hex);

  return (
    <div className={`group ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-xl sm:rounded-2xl lg:rounded-3xl cursor-pointer relative overflow-hidden
          transition-all duration-300 ease-out
          border border-white/20
          ${isPressed ? 'scale-95' : 'hover:scale-105'}
        `}
        style={neumorphicStyles}
        onClick={() => copyToClipboard(color.hex)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            copyToClipboard(color.hex);
          }
        }}
        aria-label={`Copy color ${color.name} ${color.hex}`}
      >
        {/* Inner highlight for neuromorphic effect */}
        <div 
          className="absolute inset-1 rounded-lg sm:rounded-xl lg:rounded-2xl opacity-30"
          style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.3), transparent)`
          }}
        />
        
        {/* Copy icon overlay with responsive sizing */}
        <div className={`
          absolute inset-0 flex items-center justify-center 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          ${textColor}
          backdrop-blur-sm bg-black/10 rounded-xl sm:rounded-2xl lg:rounded-3xl
        `}>
          {copied ? (
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <Check size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} />
              <span className="text-xs sm:text-sm font-helvetica font-medium">Copied!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <Copy size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
              <span className="text-xs sm:text-sm font-helvetica font-medium">Copy</span>
            </div>
          )}
        </div>
      </div>
      
      {showName && (
        <div className="mt-2 sm:mt-3 lg:mt-4 text-center">
          <p className="font-helvetica text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1 sm:mb-2">{color.name}</p>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl px-2 sm:px-3 lg:px-4 py-1 sm:py-2 lg:py-3 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]">
            <p className="font-helvetica text-xs sm:text-sm lg:text-base text-gray-600 uppercase tracking-wider font-medium">{color.hex}</p>
            <p className="font-helvetica text-xs sm:text-sm lg:text-base text-gray-500 mt-0.5 sm:mt-1">
              RGB({color.rgb.join(', ')})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};