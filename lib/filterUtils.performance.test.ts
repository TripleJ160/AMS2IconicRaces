import { describe, it, expect } from 'vitest';
import { filterRaces, getAvailableClasses } from './filterUtils';
import type { Race } from './types';

// Helper to generate mock race data
function generateMockRaces(count: number): Race[] {
  const drivers = ['Senna', 'Prost', 'Schumacher', 'Hamilton', 'Verstappen', 'Alonso', 'Vettel'];
  const classes = ['F1', 'GT3', 'Vintage', 'Prototype', 'Touring'];
  const years = ['1988', '1993', '2000', '2010', '2020', '2023'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `race-${i}`,
    title: `Race ${i}`,
    driver: drivers[i % drivers.length],
    team: `Team ${i}`,
    year: years[i % years.length],
    tags: ['tag1', 'tag2'],
    description: `Description for race ${i}`,
    heroImage: `/images/race-${i}.jpg`,
    youtubeId: `video-${i}`,
    raceContext: {
      location: 'Track',
      championship: 'Championship',
      round: 1,
      significance: 'Significant',
      weatherConditions: 'Dry',
      keyMoments: []
    },
    ams2: {
      trackName: 'Track',
      vehicleName: 'Vehicle',
      vehicleClassName: classes[i % classes.length],
      setup: {
        tyres: { compound: 'Soft', pressure: { front: 25, rear: 25 } },
        suspension: { front: { springs: 100, dampers: 50 }, rear: { springs: 100, dampers: 50 } },
        aerodynamics: { frontWing: 5, rearWing: 5 },
        differential: { preload: 50, powerRamp: 50, coastRamp: 50 },
        brakes: { brakePressure: 100, brakeBias: 55 },
        fuelLoad: 50
      },
      weather: {
        conditions: 'Dry',
        temperature: { ambient: 25, track: 30 },
        wind: { speed: 5, direction: 'N' }
      }
    }
  }));
}

describe('Performance Tests - Filter Operations', () => {
  it('should filter 100+ races in under 100ms', () => {
    const races = generateMockRaces(150);
    const searchQuery = 'Senna';
    const activeFilters = new Set<string>();
    
    const startTime = performance.now();
    const result = filterRaces(races, searchQuery, activeFilters);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    expect(result.length).toBeGreaterThan(0);
    expect(executionTime).toBeLessThan(100);
  });

  it('should filter with multiple class filters in under 100ms', () => {
    const races = generateMockRaces(150);
    const searchQuery = '';
    const activeFilters = new Set(['F1', 'GT3', 'Vintage']);
    
    const startTime = performance.now();
    const result = filterRaces(races, searchQuery, activeFilters);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    expect(result.length).toBeGreaterThan(0);
    expect(executionTime).toBeLessThan(100);
  });

  it('should filter with combined search and filters in under 100ms', () => {
    const races = generateMockRaces(150);
    const searchQuery = 'Senna';
    const activeFilters = new Set(['F1', 'Vintage']);
    
    const startTime = performance.now();
    const result = filterRaces(races, searchQuery, activeFilters);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    expect(executionTime).toBeLessThan(100);
  });

  it('should extract available classes from 100+ races in under 50ms', () => {
    const races = generateMockRaces(150);
    
    const startTime = performance.now();
    const result = getAvailableClasses(races);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    expect(result.length).toBeGreaterThan(0);
    expect(executionTime).toBeLessThan(50);
  });

  it('should handle worst-case scenario (no matches) efficiently', () => {
    const races = generateMockRaces(150);
    const searchQuery = 'NonExistentDriver12345';
    const activeFilters = new Set<string>();
    
    const startTime = performance.now();
    const result = filterRaces(races, searchQuery, activeFilters);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    expect(result.length).toBe(0);
    expect(executionTime).toBeLessThan(100);
  });

  it('should handle large filter sets efficiently', () => {
    const races = generateMockRaces(200);
    const searchQuery = '';
    const activeFilters = new Set(['F1', 'GT3', 'Vintage', 'Prototype', 'Touring']);
    
    const startTime = performance.now();
    const result = filterRaces(races, searchQuery, activeFilters);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    expect(result.length).toBe(200); // All races should match
    expect(executionTime).toBeLessThan(100);
  });
});

describe('Performance Tests - Debounce Verification', () => {
  it('should verify filter execution is fast enough for 150ms debounce', () => {
    // This test verifies that filter operations complete well within
    // the 150ms debounce window, ensuring smooth user experience
    const races = generateMockRaces(100);
    const searchQuery = 'Hamilton';
    const activeFilters = new Set(['F1']);
    
    const startTime = performance.now();
    const result = filterRaces(races, searchQuery, activeFilters);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    // Should complete in less than 50ms to leave plenty of headroom
    // within the 150ms debounce window
    expect(executionTime).toBeLessThan(50);
    expect(result.length).toBeGreaterThan(0);
  });
});
