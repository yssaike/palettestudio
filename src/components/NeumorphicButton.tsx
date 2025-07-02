import React, { useState } from 'react';

interface NeumorphicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800',
    secondary: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700',
    success: 'bg-gradient-to-br from-green-50 to-green-100 text-green-800',
    danger: 'bg-gradient-to-br from-red-50 to-red-100 text-red-800'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl'
  };

  const baseStyles = `
    font-helvetica font-medium
    border border-white/60
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-4 focus:ring-blue-200/50
    w-full
  `;

  const shadowStyles = isPressed
    ? 'shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] scale-[0.98]'
    : 'shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.8)] hover:shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.9)] hover:scale-[1.01]';

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${shadowStyles}
        ${disabledStyles}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {children}
    </button>
  );
};