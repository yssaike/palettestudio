import React from 'react';

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  interactive?: boolean;
  pressed?: boolean;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ 
  children, 
  className = '', 
  elevated = false,
  interactive = false,
  pressed = false
}) => {
  const baseStyles = `
    bg-gradient-to-br from-gray-50 to-gray-100
    border border-white/50
    transition-all duration-300 ease-out
  `;

  const shadowStyles = elevated 
    ? `
      shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)]
    `
    : `
      shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.9)]
    `;

  const interactiveStyles = interactive 
    ? `
      hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.85)]
      hover:scale-[1.02]
      active:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]
      active:scale-[0.98]
      cursor-pointer
    `
    : '';

  const pressedStyles = pressed 
    ? `
      shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]
      scale-[0.98]
    `
    : '';

  return (
    <div className={`
      ${baseStyles}
      ${shadowStyles}
      ${interactiveStyles}
      ${pressedStyles}
      ${className}
    `}>
      {children}
    </div>
  );
};