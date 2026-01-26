'use client';

import { SearchBar } from './SearchBar';
import { FilterChip } from './FilterChip';

interface SearchAndFilterPanelProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  availableClasses: string[];
  activeFilters: Set<string>;
  onFilterToggle: (className: string) => void;
  onResetFilters: () => void;
  onClearAll: () => void;
  raceCountByClass?: Map<string, number>;
}

export function SearchAndFilterPanel({
  searchQuery,
  onSearchChange,
  onSearchClear,
  availableClasses,
  activeFilters,
  onFilterToggle,
  onResetFilters,
  onClearAll,
  raceCountByClass,
}: SearchAndFilterPanelProps) {
  const hasActiveFilters = activeFilters.size > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const showClearAll = hasActiveFilters || hasSearchQuery;

  return (
    <section 
      className="w-full bg-black/60 backdrop-blur-md border-l-4 border-red-900/50 rounded-none p-4 sm:p-6 space-y-4 shadow-[0_0_20px_rgba(139,0,0,0.1)]"
      aria-label="Search and filter controls"
    >
      {/* Search Bar */}
      <div className="w-full">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
        />
      </div>

      {/* Filter Controls */}
      <div className="space-y-3">
        {/* Filter Chips */}
        <div 
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Vehicle class filters"
        >
          {availableClasses.map((className) => (
            <FilterChip
              key={className}
              label={className}
              isActive={activeFilters.has(className)}
              onClick={() => onFilterToggle(className)}
              count={raceCountByClass?.get(className)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="skew-ams2 px-4 py-2
                         bg-black/80 backdrop-blur-md
                         border border-red-900/50
                         text-text-secondary hover:text-text-primary hover:border-red-600
                         transition-all duration-200
                         text-sm font-semibold uppercase tracking-wider
                         focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-background-primary"
              aria-label="Reset all filters"
            >
              <span className="skew-ams2-content">Reset Filters</span>
            </button>
          )}

          {/* Clear All Button */}
          {showClearAll && (
            <button
              onClick={onClearAll}
              className="skew-ams2 px-4 py-2
                         bg-red-600 backdrop-blur-md
                         border border-red-600
                         text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/50
                         transition-all duration-200
                         text-sm font-semibold uppercase tracking-wider
                         focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-background-primary"
              aria-label="Clear all search and filters"
            >
              <span className="skew-ams2-content">Clear All</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
