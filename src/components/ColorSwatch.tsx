import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ColorInfo } from '../types/palette';

interface ColorSwatchProps {
  color: ColorInfo;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  color, 
  size = 'md', 
  showName = true,
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);

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
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const isLightColor = color.hsl[2] > 60;
  const textColor = isLightColor ? 'text-gray-800' : 'text-white';

  return (
    <div className={`group ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden`}
        style={{ backgroundColor: color.hex }}
        onClick={() => copyToClipboard(color.hex)}
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
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${textColor}`}>
          {copied ? (
            <Check size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
          ) : (
            <Copy size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} />
          )}
        </div>
      </div>
      
      {showName && (
        <div className="mt-2 text-center">
          <p className="font-helvetica text-sm font-medium text-gray-700">{color.name}</p>
          <p className="font-helvetica text-xs text-gray-500 uppercase tracking-wider">{color.hex}</p>
          <p className="font-helvetica text-xs text-gray-400">
            RGB({color.rgb.join(', ')})
          </p>
        </div>
      )}
    </div>
  );
};