'use client'

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllRaces } from '@/lib/raceData';
import { filterRaces, getAvailableClasses } from '@/lib/filterUtils';
import { BentoGrid, getGridSpan } from '@/components/gallery/BentoGrid';
import { RaceCard } from '@/components/gallery/RaceCard';
import { CinematicHero } from '@/components/homepage/CinematicHero';
import { SearchAndFilterPanel } from '@/components/search/SearchAndFilterPanel';
import { EmptyState } from '@/components/search/EmptyState';
import { SiteHeader } from '@/components/shared/SiteHeader';
import { NoiseTexture } from '@/components/shared/NoiseTexture';

export default function Home() {
  const router = useRouter();
  const races = getAllRaces();

  // State management for filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  // Derived state - available vehicle classes
  const availableClasses = useMemo(() => 
    getAvailableClasses(races),
    [races]
  );

  // Derived state - filtered races
  const filteredRaces = useMemo(() => 
    filterRaces(races, searchQuery, activeFilters),
    [races, searchQuery, activeFilters]
  );

  // Hero race selection - always use the first race (Featured Race of the Week)
  const featuredRace = useMemo(() => {
    return races[0];
  }, [races]);

  // Accessibility announcement for screen readers
  const resultsAnnouncement = useMemo(() => {
    const count = filteredRaces.length;
    const hasFilters = activeFilters.size > 0 || searchQuery.trim().length > 0;
    
    if (!hasFilters) {
      return `Showing all ${count} ${count === 1 ? 'race' : 'races'}`;
    }
    
    return `Found ${count} ${count === 1 ? 'race' : 'races'} matching your search and filters`;
  }, [filteredRaces.length, activeFilters.size, searchQuery]);

  // Handler functions
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleFilterToggle = useCallback((className: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(className)) {
        newFilters.delete(className);
      } else {
        newFilters.add(className);
      }
      return newFilters;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    setActiveFilters(new Set());
  }, []);

  const handleRaceClick = useCallback((raceId: string) => {
    router.push(`/race/${raceId}`);
  }, [router]);

  return (
    <main className="min-h-screen">
      {/* Noise texture and vignette overlay */}
      <NoiseTexture />
      
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
                   px-4 py-2 bg-accent-red text-white rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-accent-yellow"
      >
        Skip to main content
      </a>

      {/* Site Header - Overlays hero */}
      <SiteHeader />

      {/* Cinematic Hero - Full-bleed, no container */}
      <CinematicHero 
        race={featuredRace}
        onClick={() => handleRaceClick(featuredRace.id)}
      />
      
      {/* Section divider after hero */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
      
      {/* Search and Filter Panel - Full fluid with edge padding */}
      <div className="w-full px-6 md:px-8 py-6 md:py-8">
        <SearchAndFilterPanel
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          availableClasses={availableClasses}
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Section divider before race grid */}
      <div className="w-full px-6 md:px-8 mb-6 md:mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
      </div>

      {/* Live region for screen reader announcements */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {resultsAnnouncement}
      </div>
      
      {/* Race Grid or Empty State - Full fluid with edge padding */}
      <div id="main-content" className="w-full px-6 md:px-8 pb-12">
        {filteredRaces.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            activeFilters={Array.from(activeFilters)}
            onReset={handleClearAll}
          />
        ) : (
          <section aria-label="Race results">
            <BentoGrid races={filteredRaces}>
              {filteredRaces.map((race, index) => (
                <RaceCard
                  key={race.id}
                  race={race}
                  layoutId={`race-${race.id}`}
                  gridSpan={getGridSpan(index)}
                  onClick={() => handleRaceClick(race.id)}
                  priority={false}
                />
              ))}
            </BentoGrid>
          </section>
        )}
      </div>
    </main>
  );
}
