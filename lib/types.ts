/**
 * Livery pack information from Overtake.gg or other sources
 */
export interface LiveryPack {
  name: string;
  author: string;
  url: string;
  downloads?: number;
  rating?: number;
}

/**
 * Podium result entry
 */
export interface PodiumResult {
  position: number;
  driver: string;
  team: string;
  vehicle: string;
}

/**
 * Historical race context information
 */
export interface RaceContext {
  event: string;
  circuit: string;
  laps: number;
  distance: string;
  conditions: string;
  wikipediaUrl: string;
  podiumResults: PodiumResult[];
  keyMoments: string[];
  significance: string;
}

/**
 * Weather slot configuration for AMS2
 */
export interface WeatherSlot {
  slot: number;
  weatherId: number;
  weatherName: string;
}

/**
 * AI opponent class distribution for multi-class races
 */
export interface AIClassDistribution {
  vehicleClassId: number;
  vehicleClassName: string;
  count: number;
  note?: string;
}

/**
 * AMS2 setup configuration with actual game IDs
 */
export interface AMS2Setup {
  trackId: number;
  trackName: string;
  vehicleClassId: number;
  vehicleClassName: string;
  vehicleId: number;
  vehicleName: string;
  date: string;
  time: string;
  aiCount: number;
  raceLength: string;
  weather: WeatherSlot[];
  requiredDLC?: string[];
  multiClass?: boolean;
  aiDistribution?: AIClassDistribution[];
}

/**
 * Race data structure
 */
export interface Race {
  id: string;
  title: string;
  driver: string;
  team: string;
  year: string;
  tags: string[];
  description: string;
  heroImage: string;
  imagePosition?: string; // CSS object-position value (e.g., "center center", "left top", "60% 40%")
  imageOffsetX?: number; // Horizontal offset in pixels (e.g., -50, 100)
  imageOffsetY?: number; // Vertical offset in pixels (e.g., -30, 50)
  imageScale?: number; // Scale multiplier (e.g., 1.2 = 120% zoom in, 0.8 = 80% zoom out)
  youtubeId: string;
  raceContext: RaceContext;
  ams2: AMS2Setup;
  showInGallery?: boolean; // Whether to display in Gallery (defaults to true). Set to false for championship-only races.
  liveryPack?: LiveryPack; // Optional livery pack for standalone races
}

/**
 * Championship data structure
 */
export interface Championship {
  id: string;
  title: string;
  description: string;
  raceIds: string[];
  imageUrl: string;
  liveryPack?: LiveryPack; // Optional livery pack for the entire championship
}
