import { describe, it, expect } from 'vitest';
import { filterRaces, sanitizeSearchQuery, getAvailableClasses } from './filterUtils';
import { Race } from './types';

const mockRaces: Race[] = [
  {
    id: 'senna-93',
    title: 'Lap of the Gods',
    driver: 'Ayrton Senna',
    team: 'McLaren',
    year: '1993',
    tags: ['F1'],
    description: 'Test race',
    heroImage: '/test.png',
    youtubeId: 'test',
    raceContext: {
      event: 'Test Event',
      circuit: 'Test Circuit',
      laps: 50,
      distance: '300km',
      conditions: 'Wet',
      wikipediaUrl: 'https://test.com',
      podiumResults: [],
      keyMoments: [],
      significance: 'Test'
    },
    ams2: {
      trackId: 1,
      trackName: 'Test Track',
      vehicleClassId: 1,
      vehicleClassName: 'F-Hitech_Gen2',
      vehicleId: 1,
      vehicleName: 'Test Car',
      date: '1993-04-11',
      time: '14:00',
      aiCount: 20,
      raceLength: '50 laps',
      weather: []
    }
  },
  {
    id: 'clark-70',
    title: 'The Impossible Lead',
    driver: 'Jim Clark',
    team: 'Lotus',
    year: '1970',
    tags: ['Vintage'],
    description: 'Test race 2',
    heroImage: '/test2.png',
    youtubeId: 'test2',
    raceContext: {
      event: 'Test Event 2',
      circuit: 'Test Circuit 2',
      laps: 30,
      distance: '400km',
      conditions: 'Rain',
      wikipediaUrl: 'https://test2.com',
      podiumResults: [],
      keyMoments: [],
      significance: 'Test 2'
    },
    ams2: {
      trackId: 2,
      trackName: 'Test Track 2',
      vehicleClassId: 2,
      vehicleClassName: 'F-Vintage_Gen1',
      vehicleId: 2,
      vehicleName: 'Test Car 2',
      date: '1970-06-07',
      time: '15:00',
      aiCount: 15,
      raceLength: '30 laps',
      weather: []
    }
  }
];

describe('sanitizeSearchQuery', () => {
  it('should trim whitespace', () => {
    expect(sanitizeSearchQuery('  test  ')).toBe('test');
  });

  it('should limit to 100 characters', () => {
    const longQuery = 'a'.repeat(150);
    expect(sanitizeSearchQuery(longQuery)).toHaveLength(100);
  });

  it('should handle empty strings', () => {
    expect(sanitizeSearchQuery('')).toBe('');
    expect(sanitizeSearchQuery('   ')).toBe('');
  });
});

describe('getAvailableClasses', () => {
  it('should extract unique vehicle classes', () => {
    const classes = getAvailableClasses(mockRaces);
    expect(classes).toEqual(['F-Hitech_Gen2', 'F-Vintage_Gen1']);
  });

  it('should return sorted classes', () => {
    const classes = getAvailableClasses(mockRaces);
    expect(classes[0]).toBe('F-Hitech_Gen2');
    expect(classes[1]).toBe('F-Vintage_Gen1');
  });

  it('should handle empty race array', () => {
    expect(getAvailableClasses([])).toEqual([]);
  });
});

describe('filterRaces', () => {
  it('should return all races when no filters applied', () => {
    const result = filterRaces(mockRaces, '', new Set());
    expect(result).toHaveLength(2);
  });

  it('should filter by driver name (case-insensitive)', () => {
    const result = filterRaces(mockRaces, 'senna', new Set());
    expect(result).toHaveLength(1);
    expect(result[0].driver).toBe('Ayrton Senna');
  });

  it('should filter by year', () => {
    const result = filterRaces(mockRaces, '1993', new Set());
    expect(result).toHaveLength(1);
    expect(result[0].year).toBe('1993');
  });

  it('should filter by vehicle class (case-insensitive)', () => {
    const result = filterRaces(mockRaces, 'vintage', new Set());
    expect(result).toHaveLength(1);
    expect(result[0].ams2.vehicleClassName).toBe('F-Vintage_Gen1');
  });

  it('should filter by active class filters', () => {
    const result = filterRaces(mockRaces, '', new Set(['F-Hitech_Gen2']));
    expect(result).toHaveLength(1);
    expect(result[0].ams2.vehicleClassName).toBe('F-Hitech_Gen2');
  });

  it('should apply OR logic for multiple class filters', () => {
    const result = filterRaces(mockRaces, '', new Set(['F-Hitech_Gen2', 'F-Vintage_Gen1']));
    expect(result).toHaveLength(2);
  });

  it('should apply AND logic for search + class filters', () => {
    const result = filterRaces(mockRaces, 'senna', new Set(['F-Hitech_Gen2']));
    expect(result).toHaveLength(1);
    expect(result[0].driver).toBe('Ayrton Senna');
  });

  it('should return empty array when no matches', () => {
    const result = filterRaces(mockRaces, 'nonexistent', new Set());
    expect(result).toHaveLength(0);
  });

  it('should handle whitespace-only queries', () => {
    const result = filterRaces(mockRaces, '   ', new Set());
    expect(result).toHaveLength(2);
  });
});
