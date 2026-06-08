interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'completed' | 'ongoing';
  className?: string;
}

/**
 * Pill-shaped badge component for tags and status indicators.
 */
export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-[#2a2a28] text-[#888884] border-[#3a3a38]',
    completed: 'bg-[#1a2a1a] text-green-400 border-green-800',
    ongoing: 'bg-[#2a2a1a] text-yellow-400 border-yellow-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
