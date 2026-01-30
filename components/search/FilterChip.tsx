'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface FilterChipProps {
  label: string;           // Vehicle class name (e.g., "F1", "Vintage")
  isActive: boolean;       // Whether filter is currently selected
  onClick: () => void;     // Toggle handler
  count?: number;          // Optional: number of races in this class
  variant?: 'red' | 'yellow'; // Color variant (default: red)
}

export const FilterChip = memo(function FilterChip({ 
  label, 
  isActive, 
  onClick, 
  count,
  variant = 'red'
}: FilterChipProps) {
  // Define color classes based on variant
  const colorClasses = variant === 'yellow' 
    ? {
        active: 'bg-accent-yellow border-accent-yellow text-black shadow-lg shadow-yellow-600/50',
        inactive: 'bg-black/60 backdrop-blur-md border-yellow-900/50 text-text-secondary hover:border-accent-yellow hover:text-text-primary',
        focusRing: 'focus:ring-accent-yellow'
      }
    : {
        active: 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/50',
        inactive: 'bg-black/60 backdrop-blur-md border-red-900/50 text-text-secondary hover:border-red-600 hover:text-text-primary',
        focusRing: 'focus:ring-accent-red'
      };

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`
        skew-ams2
        px-4 py-2
        border transition-all duration-200
        text-sm font-semibold uppercase tracking-wider
        min-h-[44px] min-w-[44px]
        focus:outline-none focus:ring-2 ${colorClasses.focusRing} focus:ring-offset-2 focus:ring-offset-background-primary
        ${isActive ? colorClasses.active : colorClasses.inactive}
      `}
      aria-pressed={isActive}
      aria-label={`Filter by ${label}${count !== undefined ? `, ${count} races` : ''}`}
    >
      <span className="skew-ams2-content flex items-center gap-2">
        {label}
        {count !== undefined && (
          <span className={`text-xs font-normal ${isActive ? (variant === 'yellow' ? 'text-black/80' : 'text-white/90') : 'text-text-muted'}`}>
            ({count})
          </span>
        )}
      </span>
    </motion.button>
  );
});
