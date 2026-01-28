import type { Race } from '@/lib/types';

interface BentoGridProps {
  races: Race[];
  children: React.ReactNode;
}

/**
 * Standard 3-column grid layout
 * Responsive: mobile (1 col), tablet (2 col), desktop (3 col)
 * Consistent card heights for uniform appearance
 */
export function BentoGrid({ races, children }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[400px] md:auto-rows-[450px] lg:auto-rows-[500px]">
      {children}
    </div>
  );
}

/**
 * Get grid span classes for a card
 * All cards are uniform 1x1 in the standard grid
 */
export function getGridSpan(index: number): string {
  return 'col-span-1 row-span-1';
}
