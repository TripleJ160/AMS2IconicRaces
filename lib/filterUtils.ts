import { Race } from './types';
import { EraCategory, CATEGORY_TAG_MAP } from './constants';

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
 * @param dlcFilter - DLC filter option ('all', 'base', or 'dlc')
 * @returns Filtered array of races matching both search and class filters (AND logic)
 */
export function filterRaces(
  races: Race[],
  searchQuery: string,
  activeFilters: Set<string>,
  dlcFilter: 'all' | 'base' | 'dlc' = 'all'
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
  
  // Apply DLC filter
  if (dlcFilter === 'base') {
    // Show only races that don't require DLC
    results = results.filter(race => !shouldShowDLCBadge(race));
  } else if (dlcFilter === 'dlc') {
    // Show only races that require DLC
    results = results.filter(race => shouldShowDLCBadge(race));
  }
  // If dlcFilter === 'all', show all races (no filtering)
  
  return results;
}

/**
 * Filters races by era category based on tag overlap
 * @param races - Array of race objects to filter
 * @param category - Era category to filter by
 * @returns Filtered array of races matching the category (deduplicated)
 */
export function filterRacesByCategory(
  races: Race[],
  category: EraCategory
): Race[] {
  // If category is "All", return all races
  if (category === 'All') {
    return races;
  }
  
  // Get the tag list for the selected category
  const tagList = CATEGORY_TAG_MAP[category];
  
  // Handle edge case: empty race array
  if (races.length === 0) {
    return [];
  }
  
  // Filter races by tag overlap
  const result: Race[] = [];
  
  for (const race of races) {
    // Handle edge case: race with no tags
    if (!race.tags || race.tags.length === 0) {
      continue;
    }
    
    // Check if any of the race's tags match the category's tags
    for (const tag of race.tags) {
      if (tagList.includes(tag)) {
        result.push(race);
        break; // Avoid duplicates - only add race once
      }
    }
  }
  
  return result;
}

/**
 * Determines if a DLC badge should be displayed for a race
 * @param race - Race object to check
 * @returns True if the race requires DLC and badge should be shown, false otherwise
 */
export function shouldShowDLCBadge(race: Race): boolean {
  // Check if race.ams2 exists and has a non-empty requiredDLC array
  return (race.ams2?.requiredDLC?.length ?? 0) > 0;
}

/**
 * Sanitizes and validates a DLC array by filtering out invalid entries
 * @param dlc - Unknown value that should be a DLC array
 * @returns Array of valid DLC strings, or undefined if no valid entries remain
 */
export function sanitizeDLCArray(dlc: unknown): string[] | undefined {
  // Check if input is an array
  if (!Array.isArray(dlc)) {
    return undefined;
  }
  
  // Filter out invalid entries (non-strings and empty strings)
  const valid = dlc.filter(item => 
    typeof item === 'string' && item.trim().length > 0
  );
  
  // Return undefined if no valid entries remain, otherwise return the valid array
  return valid.length > 0 ? valid : undefined;
}
