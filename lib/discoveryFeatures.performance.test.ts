import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { filterRacesByCategory } from './filterUtils';
import { calculateRelatedRaces } from './relatedRaces';
import type { Race, EraCategory } from './types';

/**
 * Arbitrary generator for race tags
 */
const tagArbitrary = fc.constantFrom(
  'F1', 'Endurance', 'Group C', 'GT1', 'LMDh',
  'Modern', 'GT3', 'V8', 'Historic', 'Vintage',
  'Group A', 'Brazil', 'Stock Car', 'Copa Truck',
  'Rain', 'Wet', 'Night', 'Oval'
);

/**
 * Arbitrary generator for era categories
 */
const categoryArbitrary = fc.constantFrom<EraCategory>(
  'All', 'Formula 1', 'Endurance', 'Modern', 'Historic', 'Brazil'
);

/**
 * Arbitrary generator for Race objects
 */
const raceArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  title: fc.string({ minLength: 5, maxLength: 50 }),
  driver: fc.string({ minLength: 3, maxLength: 30 }),
  team: fc.string({ minLength: 3, maxLength: 30 }),
  year: fc.integer({ min: 1950, max: 2024 }).map(String),
  tags: fc.array(tagArbitrary, { minLength: 1, maxLength: 5 }),
  description: fc.string({ minLength: 10, maxLength: 200 }),
  heroImage: fc.constant('/test.png'),
  youtubeId: fc.string({ minLength: 5, maxLength: 15 }),
  raceContext: fc.record({
    event: fc.string({ minLength: 5, maxLength: 50 }),
    circuit: fc.string({ minLength: 5, maxLength: 50 }),
    laps: fc.integer({ min: 10, max: 100 }),
    distance: fc.string({ minLength: 3, maxLength: 10 }),
    conditions: fc.constantFrom('Dry', 'Wet', 'Mixed'),
    wikipediaUrl: fc.constant('https://test.com'),
    podiumResults: fc.constant([]),
    keyMoments: fc.constant([]),
    significance: fc.string({ minLength: 10, maxLength: 100 })
  }),
  ams2: fc.record({
    trackId: fc.integer({ min: 1, max: 100 }),
    trackName: fc.string({ minLength: 5, maxLength: 30 }),
    vehicleClassId: fc.integer({ min: 1, max: 50 }),
    vehicleClassName: fc.string({ minLength: 5, maxLength: 30 }),
    vehicleId: fc.integer({ min: 1, max: 200 }),
    vehicleName: fc.string({ minLength: 5, maxLength: 30 }),
    date: fc.constant('2024-01-01'),
    time: fc.constant('14:00'),
    aiCount: fc.integer({ min: 5, max: 30 }),
    raceLength: fc.string({ minLength: 5, maxLength: 20 }),
    weather: fc.constant([])
  })
}) as fc.Arbitrary<Race>;

/**
 * Feature: discovery-features, Property 7: Category Filtering Performance
 * 
 * For any dataset of up to 1000 races, applying a category filter should
 * complete within 100ms.
 * 
 * Validates: Requirements 8.1
 */
describe('Property 7: Category Filtering Performance', () => {
  it('should filter up to 1000 races within 100ms', () => {
    fc.assert(
      fc.property(
        fc.array(raceArbitrary, { minLength: 100, maxLength: 1000 }),
        categoryArbitrary,
        (races, category) => {
          const startTime = performance.now();
          const result = filterRacesByCategory(races, category);
          const endTime = performance.now();
          
          const executionTime = endTime - startTime;
          
          // Verify the operation completed within 100ms
          expect(executionTime).toBeLessThan(100);
          
          // Verify result is an array (basic sanity check)
          expect(Array.isArray(result)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should filter 500 races within 100ms consistently', () => {
    fc.assert(
      fc.property(
        fc.array(raceArbitrary, { minLength: 500, maxLength: 500 }),
        categoryArbitrary,
        (races, category) => {
          const startTime = performance.now();
          filterRacesByCategory(races, category);
          const endTime = performance.now();
          
          const executionTime = endTime - startTime;
          
          expect(executionTime).toBeLessThan(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should filter 1000 races within 100ms for worst-case category', () => {
    // Worst case: "All" category which returns all races
    fc.assert(
      fc.property(
        fc.array(raceArbitrary, { minLength: 1000, maxLength: 1000 }),
        (races) => {
          const startTime = performance.now();
          filterRacesByCategory(races, 'All');
          const endTime = performance.now();
          
          const executionTime = endTime - startTime;
          
          expect(executionTime).toBeLessThan(100);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: discovery-features, Property 8: Related Races Calculation Performance
 * 
 * For any dataset of up to 1000 races, calculating related races for a given
 * race should complete within 200ms.
 * 
 * Validates: Requirements 8.2
 */
describe('Property 8: Related Races Calculation Performance', () => {
  it('should calculate related races for up to 1000 races within 200ms', () => {
    fc.assert(
      fc.property(
        fc.array(raceArbitrary, { minLength: 100, maxLength: 1000 }),
        fc.integer({ min: 0, max: 999 }),
        (races, currentIndex) => {
          // Use a race from the dataset as the current race
          const currentRace = races[currentIndex % races.length];
          
          const startTime = performance.now();
          const result = calculateRelatedRaces(currentRace, races, 3);
          const endTime = performance.now();
          
          const executionTime = endTime - startTime;
          
          // Verify the operation completed within 200ms
          expect(executionTime).toBeLessThan(200);
          
          // Verify result is an array (basic sanity check)
          expect(Array.isArray(result)).toBe(true);
          
          // Verify result has at most 3 races
          expect(result.length).toBeLessThanOrEqual(3);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate related races for 500 races within 200ms consistently', () => {
    fc.assert(
      fc.property(
        fc.array(raceArbitrary, { minLength: 500, maxLength: 500 }),
        fc.integer({ min: 0, max: 499 }),
        (races, currentIndex) => {
          const currentRace = races[currentIndex];
          
          const startTime = performance.now();
          calculateRelatedRaces(currentRace, races, 3);
          const endTime = performance.now();
          
          const executionTime = endTime - startTime;
          
          expect(executionTime).toBeLessThan(200);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate related races for 1000 races within 200ms for worst-case scenario', () => {
    // Worst case: race with many tags, all races have overlapping tags
    fc.assert(
      fc.property(
        fc.array(raceArbitrary, { minLength: 1000, maxLength: 1000 }),
        (races) => {
          // Pick the first race as current race
          const currentRace = races[0];
          
          const startTime = performance.now();
          calculateRelatedRaces(currentRace, races, 3);
          const endTime = performance.now();
          
          const executionTime = endTime - startTime;
          
          expect(executionTime).toBeLessThan(200);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle maxResults parameter efficiently', () => {
    fc.assert(
      fc.property(
        fc.array(raceArbitrary, { minLength: 500, maxLength: 1000 }),
        fc.integer({ min: 1, max: 10 }),
        (races, maxResults) => {
          const currentRace = races[0];
          
          const startTime = performance.now();
          const result = calculateRelatedRaces(currentRace, races, maxResults);
          const endTime = performance.now();
          
          const executionTime = endTime - startTime;
          
          expect(executionTime).toBeLessThan(200);
          expect(result.length).toBeLessThanOrEqual(maxResults);
        }
      ),
      { numRuns: 100 }
    );
  });
});
