'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

/**
 * Reusable Card component with dark surface styling and optional hover effects.
 */
export function Card({ children, className = '', padding = 'md', hover = true }: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  if (!hover) {
    return (
      <div
        className={`bg-[#1a1a18] border border-[#3a3a38] rounded-xl ${paddingClasses[padding]} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: '0 0 24px rgba(224, 112, 64, 0.2)',
        borderColor: '#e07040',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-[#1a1a18] border border-[#3a3a38] rounded-xl ${paddingClasses[padding]} ${className}`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
