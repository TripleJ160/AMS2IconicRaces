import type { Race } from '@/lib/types';

interface BentoGridProps {
  races: Race[];
  children: React.ReactNode;
}

/**
 * BentoGrid component with asymmetric layout pattern
 * Pattern repeats: [2x2] [1x1] [1x2] [1x1] [2x1] [1x1] [1x1] [2x2]
 * Responsive: mobile (1 col), tablet (2 col), desktop (3 col), xl (4 col)
 */
export function BentoGrid({ races, children }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 auto-rows-[300px] md:auto-rows-[350px] lg:auto-rows-[400px]">
      {children}
    </div>
  );
}

/**
 * Get grid span classes for a card based on its index in the pattern
 * Pattern: [2x2] [1x1] [1x2] [1x1] [2x1] [1x1] [1x1] [2x2] (repeats every 8 cards)
 */
export function getGridSpan(index: number): string {
  const patternIndex = index % 8;
  
  const patterns = [
    'md:col-span-2 md:row-span-2', // Large square (2x2)
    'md:col-span-1 md:row-span-1', // Small (1x1)
    'md:col-span-1 md:row-span-2', // Tall (1x2) - NEW
    'md:col-span-1 md:row-span-1', // Small (1x1)
    'md:col-span-2 md:row-span-1', // Wide (2x1)
    'md:col-span-1 md:row-span-1', // Small (1x1)
    'md:col-span-1 md:row-span-1', // Small (1x1)
    'md:col-span-2 md:row-span-2', // Large square (2x2)
  ];
  
  return patterns[patternIndex];
}
