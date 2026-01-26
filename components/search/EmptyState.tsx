'use client';

import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  activeFilters: string[];
  onReset: () => void;
}

export function EmptyState({ 
  searchQuery, 
  activeFilters, 
  onReset 
}: EmptyStateProps) {
  // Generate dynamic message based on filter state
  const getMessage = (): string => {
    const hasSearch = searchQuery.trim().length > 0;
    const hasFilters = activeFilters.length > 0;

    if (hasSearch && hasFilters) {
      return `No races found for "${searchQuery}" in ${activeFilters.join(", ")}`;
    } else if (hasSearch) {
      return `No races found for "${searchQuery}"`;
    } else if (hasFilters) {
      return `No races found in ${activeFilters.join(", ")}`;
    }
    return "No races available";
  };

  return (
    <section 
      className="w-full flex items-center justify-center py-16 sm:py-24"
      aria-labelledby="empty-state-heading"
      role="region"
    >
      <div className="bg-black/60 backdrop-blur-md border-l-4 border-red-600 rounded-none p-8 sm:p-12 max-w-md w-full mx-4 shadow-[0_0_30px_rgba(220,0,0,0.2)]">
        {/* Icon */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <SearchX className="w-16 h-16 sm:w-20 sm:h-20 text-red-500" strokeWidth={1.5} />
        </div>

        {/* Message */}
        <h2 
          id="empty-state-heading"
          className="text-center text-text-secondary text-base sm:text-lg mb-8 leading-relaxed uppercase tracking-wide"
        >
          {getMessage()}
        </h2>

        {/* Clear All Button */}
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="skew-ams2 px-6 py-3
                       bg-red-600 border border-red-600
                       text-white font-semibold uppercase tracking-wider
                       hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/50
                       transition-all duration-200
                       text-sm sm:text-base
                       focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-background-primary"
            aria-label="Clear all filters and search to show all races"
          >
            <span className="skew-ams2-content">Clear All</span>
          </button>
        </div>
      </div>
    </section>
  );
}
