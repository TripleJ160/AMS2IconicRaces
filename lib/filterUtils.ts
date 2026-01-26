import { Race } from './types';

/**
 * Filter state interface
 */
export interface FilterState {
  searchQuery: string;
  activeFilters: Set<string>;
}

/**
 * Filter actions interface
 */
export interface FilterActions {
  setSearchQuery: (query: string) => void;
  toggleFilter: (className: string) => void;
  clearSearch: () => void;
  clearFilters: () => void;
  clearAll: () => void;
}

/**
 * Sanitizes search query by trimming whitespace and limiting length
 * @param query - Raw search query string
 * @returns Sanitized query string (max 100 characters, trimmed)
 */
export function sanitizeSearchQuery(query: string): string {
  return query.trim().slice(0, 100);
}

/**
 * Extracts unique vehicle class names from race collection
 * @param races - Array of race objects
 * @returns Sorted array of unique vehicle class names
 */
export function getAvailableClasses(races: Race[]): string[] {
  const classSet = new Set<string>();
  
  for (const race of races) {
    if (race.ams2?.vehicleClassName) {
      classSet.add(race.ams2.vehicleClassName);
    }
  }
  
  return Array.from(classSet).sort();
}

/**
 * Filters races based on search query and active class filters
 * @param races - Array of race objects to filter
 * @param searchQuery - Search query string (matches driver, year, or vehicle class)
 * @param activeFilters - Set of active vehicle class names
 * @returns Filtered array of races matching both search and class filters (AND logic)
 */
export function filterRaces(
  races: Race[],
  searchQuery: string,
  activeFilters: Set<string>
): Race[] {
  let results = races;
  
  // Apply search filter (OR logic across driver, year, class)
  const sanitizedQuery = sanitizeSearchQuery(searchQuery);
  if (sanitizedQuery) {
    const query = sanitizedQuery.toLowerCase();
    results = results.filter(race => {
      const driverMatch = race.driver.toLowerCase().includes(query);
      const yearMatch = race.year.includes(query);
      const classMatch = race.ams2?.vehicleClassName.toLowerCase().includes(query);
      
      return driverMatch || yearMatch || classMatch;
    });
  }
  
  // Apply class filters (OR logic across selected classes)
  if (activeFilters.size > 0) {
    results = results.filter(race => 
      activeFilters.has(race.ams2?.vehicleClassName)
    );
  }
  
  return results;
}
