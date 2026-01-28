'use client'

import { useRef, useEffect, type KeyboardEvent } from 'react';
import type { EraCategory } from '@/lib/constants';

interface FilterPillsProps {
  activeCategory: EraCategory;
  onCategoryChange: (category: EraCategory) => void;
}

const CATEGORIES: EraCategory[] = [
  'All',
  'Formula 1',
  'Endurance',
  'Modern',
  'Historic',
  'Brazil'
];

/**
 * FilterPills component - Horizontal scrollable category filter
 * Features: 7 predefined categories, keyboard navigation, ARIA attributes
 * Implements Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7
 */
export function FilterPills({ activeCategory, onCategoryChange }: FilterPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<EraCategory, HTMLButtonElement>>(new Map());

  // Focus management for keyboard navigation
  useEffect(() => {
    const activePill = pillRefs.current.get(activeCategory);
    if (activePill && document.activeElement?.getAttribute('role') === 'tab') {
      activePill.focus();
    }
  }, [activeCategory]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentCategory: EraCategory) => {
    const currentIndex = CATEGORIES.indexOf(currentCategory);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : CATEGORIES.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = currentIndex < CATEGORIES.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = CATEGORIES.length - 1;
        break;
      default:
        return;
    }

    const nextCategory = CATEGORIES[nextIndex];
    onCategoryChange(nextCategory);
    pillRefs.current.get(nextCategory)?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto scrollbar-hide"
      role="tablist"
      aria-label="Race category filters"
    >
      <div className="flex gap-3 px-4 md:px-8 lg:px-16 py-6 min-w-max">
        {CATEGORIES.map((category) => {
          const isActive = category === activeCategory;
          
          return (
            <button
              key={category}
              ref={(el) => {
                if (el) {
                  pillRefs.current.set(category, el);
                } else {
                  pillRefs.current.delete(category);
                }
              }}
              role="tab"
              aria-selected={isActive}
              aria-label={`Filter by ${category}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onCategoryChange(category)}
              onKeyDown={(e) => handleKeyDown(e, category)}
              className={`
                px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wider
                transition-all duration-200 ease-out whitespace-nowrap
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black
                ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
