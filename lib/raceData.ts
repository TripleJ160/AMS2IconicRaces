import { z } from 'zod';
import type { Race } from './types';

// Import race data by vehicle class
import f1HitechRaces from '@/data/races/f-hitech-gen2.json';
import f1ClassicRaces from '@/data/races/f-classic-gen4.json';
import f1VintageRaces from '@/data/races/f-vintage-gen1.json';
import groupCRaces from '@/data/races/group-c.json';
import f1ClassicGen1Races from '@/data/races/f-classic-gen1.json';
import opalaRaces from '@/data/races/opala79.json';
import fUsaGen2Races from '@/data/races/f-usa-gen2.json';
import groupARaces from '@/data/races/group-a.json';
import lmdhRaces from '@/data/races/lmdh.json';
import fRetroGen3Races from '@/data/races/f-retro-gen3.json';
import copaTruckRaces from '@/data/races/copa-truck.json';
import fClassicGen2Races from '@/data/races/f-classic-gen2.json';
import superV8Races from '@/data/races/super-v8.json';
import gt1Races from '@/data/races/gt1.json';
import fV10Gen2Races from '@/data/races/f-v10-gen2.json';
import fReizaRaces from '@/data/races/f-reiza.json';

// Combine all race collections
const racesData = [
  ...f1HitechRaces,
  ...f1ClassicRaces,
  ...f1VintageRaces,
  ...groupCRaces,
  ...f1ClassicGen1Races,
  ...opalaRaces,
  ...fUsaGen2Races,
  ...groupARaces,
  ...lmdhRaces,
  ...fRetroGen3Races,
  ...copaTruckRaces,
  ...fClassicGen2Races,
  ...superV8Races,
  ...gt1Races,
  ...fV10Gen2Races,
  ...fReizaRaces,
];

/**
 * Zod schema for PodiumResult validation
 */
const PodiumResultSchema = z.object({
  position: z.number(),
  driver: z.string(),
  team: z.string(),
  vehicle: z.string(),
});

/**
 * Zod schema for RaceContext validation
 */
const RaceContextSchema = z.object({
  event: z.string(),
  circuit: z.string(),
  laps: z.number(),
  distance: z.string(),
  conditions: z.string(),
  wikipediaUrl: z.string(),
  podiumResults: z.array(PodiumResultSchema),
  keyMoments: z.array(z.string()),
  significance: z.string(),
});

/**
 * Zod schema for WeatherSlot validation
 */
const WeatherSlotSchema = z.object({
  slot: z.number(),
  weatherId: z.number(),
  weatherName: z.string(),
});

/**
 * Zod schema for AI class distribution
 */
const AIClassDistributionSchema = z.object({
  vehicleClassId: z.number(),
  vehicleClassName: z.string(),
  count: z.number(),
  note: z.string().optional(),
});

/**
 * Zod schema for AMS2Setup validation
 */
const AMS2SetupSchema = z.object({
  trackId: z.number(),
  trackName: z.string(),
  vehicleClassId: z.number(),
  vehicleClassName: z.string(),
  vehicleId: z.number(),
  vehicleName: z.string(),
  date: z.string(),
  time: z.string(),
  aiCount: z.number(),
  raceLength: z.string(),
  weather: z.array(WeatherSlotSchema),
  requiredDLC: z.array(z.string()).optional(),
  multiClass: z.boolean().optional(),
  aiDistribution: z.array(AIClassDistributionSchema).optional(),
});

/**
 * Zod schema for Race validation
 */
const RaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  driver: z.string(),
  team: z.string(),
  year: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  heroImage: z.string(),
  imagePosition: z.string().optional(),
  imageScale: z.number().optional(),
  imageOffsetX: z.number().optional(),
  imageOffsetY: z.number().optional(),
  youtubeId: z.string(),
  raceContext: RaceContextSchema,
  ams2: AMS2SetupSchema,
  showInGallery: z.boolean().optional(),
});

/**
 * Get all races with schema validation
 * @returns Array of validated Race objects
 */
export const getAllRaces = (): Race[] => {
  return racesData.map(race => RaceSchema.parse(race)) as Race[];
};

/**
 * Get races that should be displayed in the Gallery
 * Filters out races marked with showInGallery: false
 * @returns Array of validated Race objects for gallery display
 */
export const getGalleryRaces = (): Race[] => {
  return getAllRaces().filter(race => race.showInGallery !== false);
};

/**
 * Get a race by ID with schema validation
 * @param id - The race ID to retrieve
 * @returns The validated Race object or undefined if not found
 */
export const getRaceById = (id: string): Race | undefined => {
  const race = racesData.find(r => r.id === id);
  return race ? (RaceSchema.parse(race) as Race) : undefined;
};

/**
 * Get races by vehicle class name
 * @param className - The vehicle class name to filter by
 * @returns Array of validated Race objects matching the class
 */
export const getRacesByClass = (className: string): Race[] => {
  return getAllRaces().filter(race => 
    race.ams2.vehicleClassName === className
  );
};

/**
 * Get all unique vehicle class names
 * @returns Array of unique vehicle class names
 */
export const getAllVehicleClasses = (): string[] => {
  const classes = new Set(racesData.map(race => race.ams2.vehicleClassName));
  return Array.from(classes).sort();
};
