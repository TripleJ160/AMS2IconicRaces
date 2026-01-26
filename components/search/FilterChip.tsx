'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface FilterChipProps {
  label: string;           // Vehicle class name (e.g., "F1", "Vintage")
  isActive: boolean;       // Whether filter is currently selected
  onClick: () => void;     // Toggle handler
  count?: number;          // Optional: number of races in this class
}

export const FilterChip = memo(function FilterChip({ 
  label, 
  isActive, 
  onClick, 
  count 
}: FilterChipProps) {
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
        focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-background-primary
        ${
          isActive
            ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/50'
            : 'bg-black/60 backdrop-blur-md border-red-900/50 text-text-secondary hover:border-red-600 hover:text-text-primary'
        }
      `}
      aria-pressed={isActive}
      aria-label={`Filter by ${label}${count !== undefined ? `, ${count} races` : ''}`}
    >
      <span className="skew-ams2-content flex items-center gap-2">
        {label}
        {count !== undefined && (
          <span className={`text-xs font-normal ${isActive ? 'text-white/90' : 'text-text-muted'}`}>
            ({count})
          </span>
        )}
      </span>
    </motion.button>
  );
});
