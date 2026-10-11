import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all focus:outline-none select-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-none',
    md: 'px-5 py-2.5 text-sm rounded-none',
    lg: 'px-7 py-3 text-base rounded-none',
  };

  const variantStyles = {
    primary:
      'bg-[#5CE1E6] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000000]',
    secondary:
      'bg-black text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:bg-neutral-800 active:translate-x-[2px] active:translate-y-[2px]',
    outline:
      'bg-white text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:bg-neutral-50 active:translate-x-[2px] active:translate-y-[2px]',
    ghost: 'bg-transparent text-black hover:bg-neutral-100 border border-transparent',
    danger:
      'bg-red-500 text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:bg-red-600',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
