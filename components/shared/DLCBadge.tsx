'use client';

import { useState } from 'react';

interface DLCBadgeProps {
  requiredDLC: string[];
  variant?: 'card' | 'detail';
}

export function DLCBadge({ requiredDLC, variant = 'card' }: DLCBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!requiredDLC || requiredDLC.length === 0) {
    return null;
  }

  const sizeClasses = variant === 'detail' 
    ? 'px-3 py-1.5 text-sm' 
    : 'px-2 py-1 text-xs';

  const dlcList = requiredDLC.join(', ');

  return (
    <div className="relative inline-block">
      <div
        className={`
          ${sizeClasses}
          bg-amber-500/20 backdrop-blur-sm
          border border-amber-500/50
          text-amber-400 font-semibold
          rounded-md
          cursor-help
          transition-all duration-200
          hover:bg-amber-500/30 hover:border-amber-500/70
        `}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        role="tooltip"
        aria-label={`Required DLC: ${dlcList}`}
      >
        [DLC]
      </div>
      
      {showTooltip && (
        <div
          className="
            absolute z-50 
            bottom-full left-1/2 -translate-x-1/2 mb-2
            px-3 py-2
            bg-gray-900/95 backdrop-blur-sm
            border border-amber-500/30
            text-amber-200 text-xs
            rounded-md
            whitespace-nowrap
            pointer-events-none
            animate-in fade-in duration-200
          "
          role="tooltip"
        >
          <div className="font-medium mb-1">Required DLC:</div>
          <div>{dlcList}</div>
          {/* Tooltip arrow */}
          <div
            className="
              absolute top-full left-1/2 -translate-x-1/2
              w-0 h-0
              border-l-4 border-l-transparent
              border-r-4 border-r-transparent
              border-t-4 border-t-gray-900/95
            "
          />
        </div>
      )}
    </div>
  );
}
