import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'black' | 'yellow' | 'outline' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  className = '',
}) => {
  const styles = {
    cyan: 'bg-[#5CE1E6] text-black border border-black font-black',
    black: 'bg-black text-white font-bold',
    yellow: 'bg-amber-300 text-black border border-black font-black',
    outline: 'bg-white text-black border border-black font-semibold',
    gray: 'bg-neutral-200 text-neutral-800 font-medium',
  };

  return (
    <span
      className={`inline-block text-[11px] uppercase tracking-wider px-2 py-0.5 select-none ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
