import { describe, it, expect } from 'vitest';
import { calculateRelatedRaces } from './relatedRaces';
import { Race } from './types';

// Helper to create minimal race objects for testing
function createRace(id: string, tags: string[]): Race {
  return {
    id,
    title: `Race ${id}`,
    driver: 'Test Driver',
    team: 'Test Team',
    year: '2024',
    tags,
    description: 'Test description',
    heroImage: '/test.jpg',
    youtubeId: 'test123',
    raceContext: {
      event: 'Test Event',
      circuit: 'Test Circuit',
      laps: 50,
      distance: '300km',
      conditions: 'Dry',
      wikipediaUrl: 'https://test.com',
      podiumResults: [],
      keyMoments: [],
      significance: 'Test significance'
    },
    ams2: {
      trackId: 1,
      trackName: 'Test Track',
      vehicleClassId: 1,
      vehicleClassName: 'Test Class',
      vehicleId: 1,
      vehicleName: 'Test Vehicle',
      date: '2024-01-01',
      time: '14:00',
      aiCount: 20,
      raceLength: '50 laps',
      weather: []
    }
  };
}

describe('calculateRelatedRaces', () => {
  it('should exclude current race from results', () => {
    const currentRace = createRace('1', ['F1', 'Rain']);
    const allRaces = [
      currentRace,
      createRace('2', ['F1']),
      createRace('3', ['Rain'])
    ];

    const result = calculateRelatedRaces(currentRace, allRaces);

    expect(result).toHaveLength(2);
    expect(result.find(r => r.id === '1')).toBeUndefined();
  });

  it('should return races sorted by tag overlap score descending', () => {
    const currentRace = createRace('1', ['F1', 'Rain', 'Historic']);
    const allRaces = [
      currentRace,
      createRace('2', ['F1']), // 1 match
      createRace('3', ['F1', 'Rain']), // 2 matches
      createRace('4', ['F1', 'Rain', 'Historic']), // 3 matches
      createRace('5', ['Endurance']) // 0 matches
    ];

    const result = calculateRelatedRaces(currentRace, allRaces);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('4'); // 3 matches
    expect(result[1].id).toBe('3'); // 2 matches
    expect(result[2].id).toBe('2'); // 1 match
  });

  it('should return top N races (default 3)', () => {
    const currentRace = createRace('1', ['F1']);
    const allRaces = [
      currentRace,
      createRace('2', ['F1']),
      createRace('3', ['F1']),
      createRace('4', ['F1']),
      createRace('5', ['F1'])
    ];

    const result = calculateRelatedRaces(currentRace, allRaces);

    expect(result).toHaveLength(3);
  });

  it('should return fewer than N races when fewer matches exist', () => {
    const currentRace = createRace('1', ['F1']);
    const allRaces = [
      currentRace,
      createRace('2', ['F1']),
      createRace('3', ['Endurance'])
    ];

    const result = calculateRelatedRaces(currentRace, allRaces);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should return empty array when current race has no tags', () => {
    const currentRace = createRace('1', []);
    const allRaces = [
      currentRace,
      createRace('2', ['F1']),
      createRace('3', ['Rain'])
    ];

    const result = calculateRelatedRaces(currentRace, allRaces);

    expect(result).toHaveLength(0);
  });

  it('should return empty array when no races have matching tags', () => {
    const currentRace = createRace('1', ['F1']);
    const allRaces = [
      currentRace,
      createRace('2', ['Endurance']),
      createRace('3', ['Historic'])
    ];

    const result = calculateRelatedRaces(currentRace, allRaces);

    expect(result).toHaveLength(0);
  });

  it('should handle custom maxResults parameter', () => {
    const currentRace = createRace('1', ['F1']);
    const allRaces = [
      currentRace,
      createRace('2', ['F1']),
      createRace('3', ['F1']),
      createRace('4', ['F1']),
      createRace('5', ['F1'])
    ];

    const result = calculateRelatedRaces(currentRace, allRaces, 2);

    expect(result).toHaveLength(2);
  });

  it('should skip candidate races with no tags', () => {
    const currentRace = createRace('1', ['F1']);
    const allRaces = [
      currentRace,
      createRace('2', ['F1']),
      createRace('3', []) // No tags
    ];

    const result = calculateRelatedRaces(currentRace, allRaces);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });
});
