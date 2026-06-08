'use client';

import { motion } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * Button component with variants and Framer Motion hover effects.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      'bg-[#e07040] text-[#0d0d0c] hover:bg-[#c8b89a] border-transparent',
    secondary:
      'bg-[#1a1a18] text-[#f0ede6] border-[#3a3a38] hover:border-[#e07040] hover:text-[#e07040]',
    ghost:
      'bg-transparent text-[#888884] border-transparent hover:text-[#f0ede6]',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-2 rounded-xl border font-medium transition-colors duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...(props as object)}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}
