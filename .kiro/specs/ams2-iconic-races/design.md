# Design Document: AMS2 Iconic Races

## Overview

AMS2 Iconic Races is a Next.js 14+ web application that presents historical racing moments through an immersive, cyber-noir themed interface. The application uses modern web technologies including Tailwind CSS, Shadcn/UI, and Framer Motion to create a "bleeding edge" user experience with glassmorphism, aurora gradients, and sophisticated animations including shared layout transitions and 3D tilt effects.

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

### Application Structure

```
app/
├── layout.tsx                 # Root layout with theme configuration
├── page.tsx                   # Gallery page (home)
├── race/[id]/page.tsx        # Race detail page
├── globals.css               # Global styles, Tailwind imports
components/
├── ui/                       # Shadcn/UI base components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── gallery/
│   ├── BentoGrid.tsx        # Asymmetric grid layout
│   ├── RaceCard.tsx         # Individual race card with hover effects
│   └── RaceCardSkeleton.tsx # Loading state
├── race-detail/
│   ├── RaceDetailView.tsx   # Shared layout animated container
│   ├── StorySection.tsx     # Historical context with scrollytelling
│   ├── SetupSection.tsx     # AMS2 configuration display
│   ├── MediaSection.tsx     # YouTube embed and artwork
│   └── WeatherTimeline.tsx  # Visual weather progression bar
├── shared/
│   ├── BackButton.tsx       # Navigation back to gallery
│   ├── AuroraBackground.tsx # Animated gradient background
│   └── NoiseTexture.tsx     # Subtle noise overlay
data/
└── races.json               # Race data store
lib/
├── utils.ts                 # Utility functions (cn, etc.)
├── raceData.ts             # Data loading and validation
└── animations.ts           # Reusable Framer Motion variants
public/
└── images/
    └── races/              # Hero artwork for each race
```

## Design System

### Color Palette

**Cyber-Noir Theme (Dark Mode Only)**

```typescript
// tailwind.config.ts colors
colors: {
  background: {
    primary: '#0a0a0a',      // Deep black
    secondary: '#141414',    // Slightly lighter black
    tertiary: '#1a1a1a',     // Card backgrounds
  },
  accent: {
    red: '#dc0000',          // Formula 1 red
    yellow: '#ffd700',       // Racing yellow
    redGlow: '#ff0000',      // Brighter red for glows
  },
  glass: {
    border: 'rgba(255, 255, 255, 0.1)',
    bg: 'rgba(20, 20, 20, 0.6)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#a3a3a3',
    muted: '#737373',
  }
}
```

### Typography

**Font Configuration**

```typescript
// tailwind.config.ts fonts
fontFamily: {
  sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
  display: ['var(--font-russo-one)', 'Oswald', 'Impact', 'sans-serif'],
}

// app/layout.tsx
import { GeistSans } from 'geist/font/sans'
import { Russo_One } from 'next/font/google'

const russoOne = Russo_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-russo-one'
})
```

**Typography Scale**

- **Display Headers**: font-display, tracking-wider, uppercase
  - H1: text-6xl md:text-8xl (race titles)
  - H2: text-4xl md:text-6xl (section headers)
- **Body Text**: font-sans
  - Large: text-lg leading-relaxed (story descriptions)
  - Base: text-base (setup details)
  - Small: text-sm (metadata)

### Visual Effects

#### Glassmorphism

```css
/* Applied to cards and overlays */
.glass-effect {
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### Aurora Gradients

```css
/* Animated background gradients */
.aurora-bg {
  background: radial-gradient(
    ellipse 80% 50% at 50% -20%,
    rgba(220, 0, 0, 0.15),
    transparent
  ),
  radial-gradient(
    ellipse 60% 40% at 80% 80%,
    rgba(255, 215, 0, 0.1),
    transparent
  );
  animation: aurora-shift 15s ease-in-out infinite;
}
```

#### Noise Texture

```css
/* Subtle grain overlay */
.noise-texture {
  background-image: url("data:image/svg+xml,...");
  opacity: 0.03;
  mix-blend-mode: overlay;
}
```

## Components and Interfaces

### Data Models

#### Race Interface

```typescript
interface Race {
  id: string;
  title: string;
  driver: string;
  team: string;
  year: string;
  tags: string[];
  description: string;
  heroImage: string;
  youtubeId: string;
  ams2: AMS2Setup;
}

interface AMS2Setup {
  trackId: number;           // AMS2 track ID from ams2_tracks.json
  trackName: string;         // Track name (e.g., "Donington_GP")
  vehicleClassId: number;    // AMS2 vehicle class ID from ams2_vehicle_classes.json
  vehicleClassName: string;  // Class name (e.g., "F-Hitech_Gen2")
  vehicleId: number;         // AMS2 vehicle ID from ams2_vehicles.json
  vehicleName: string;       // Vehicle name (e.g., "McLaren Cosworth MP4/8")
  date: string;              // ISO date format (YYYY-MM-DD)
  time: string;              // 24-hour format (HH:MM)
  weather: WeatherSlot[];
}

interface WeatherSlot {
  slot: number;              // Weather slot number (1-based)
  weatherId: number;         // AMS2 weather ID from ams2_weather.json
  weatherName: string;       // Weather name (e.g., "LightRain", "Storm")
}

// Reference data interfaces (from AMS2 game files)
interface AMS2Track {
  id: number;
  name: string;
  gridsize: number;
  default_day: number;
  default_month: number;
  default_year: number;
}

interface AMS2VehicleClass {
  value: number;
  name: string;
  translated_name: string;
}

interface AMS2Vehicle {
  id: number;
  name: string;
  class: string;
}

interface AMS2Weather {
  value: number;
  name: string;
}
```

### Gallery Components

#### BentoGrid Component

**Purpose**: Asymmetric grid layout with varying card sizes

**Implementation**:

```typescript
// components/gallery/BentoGrid.tsx
interface BentoGridProps {
  races: Race[];
}

// Grid pattern: Repeating 6-card pattern
// [2x2] [1x1] [1x1]
// [1x1] [2x1] [1x1]

const gridPattern = [
  'col-span-2 row-span-2', // Large featured
  'col-span-1 row-span-1', // Small
  'col-span-1 row-span-1', // Small
  'col-span-1 row-span-1', // Small
  'col-span-2 row-span-1', // Wide
  'col-span-1 row-span-1', // Small
];

// Responsive breakpoints
// Mobile: 1 column (all cards full width)
// Tablet: 2 columns
// Desktop: 3 columns
```

**Styling**:
- CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
- Gap: 1.5rem
- Padding: 2rem

#### RaceCard Component

**Purpose**: Individual race moment card with hover effects

**Props**:
```typescript
interface RaceCardProps {
  race: Race;
  layoutId: string; // For shared layout animation
  gridSpan: string; // CSS classes for grid positioning
}
```

**Hover Effects**:

1. **3D Tilt Effect**:
```typescript
// Using Framer Motion
const [rotateX, setRotateX] = useState(0);
const [rotateY, setRotateY] = useState(0);

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  setRotateY((x - centerX) / 10);
  setRotateX((centerY - y) / 10);
};

<motion.div
  style={{ 
    rotateX, 
    rotateY,
    transformStyle: 'preserve-3d'
  }}
  whileHover={{ scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 300 }}
/>
```

2. **Animated Border Glow**:
```css
/* Gradient border that moves on hover */
.card-glow {
  position: relative;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(220, 0, 0, 0.5),
    rgba(255, 215, 0, 0.5),
    transparent
  );
  background-size: 200% 100%;
  animation: glow-move 3s linear infinite;
}

@keyframes glow-move {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Structure**:
```tsx
<motion.div layoutId={`race-${race.id}`}>
  <div className="glass-effect">
    <Image src={race.heroImage} /> {/* Background */}
    <div className="gradient-overlay" /> {/* Dark gradient for text readability */}
    <div className="content">
      <h3 className="font-display">{race.title}</h3>
      <p className="text-accent-yellow">{race.driver}</p>
      <p className="text-text-secondary">{race.year}</p>
      <div className="flex gap-2 mt-2">
        {race.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-1 glass-effect rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
</motion.div>
```

### Race Detail Components

#### RaceDetailView Component

**Purpose**: Full-screen race detail container with shared layout animation

**Implementation**:

```typescript
// app/race/[id]/page.tsx
<motion.div
  layoutId={`race-${race.id}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 z-50 overflow-y-auto"
>
  <BackButton />
  <div className="container mx-auto px-4 py-20">
    <motion.h1
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="font-display text-8xl"
    >
      {race.title}
    </motion.h1>
    
    <StorySection />
    <SetupSection />
    <MediaSection />
  </div>
</motion.div>
```

**Shared Layout Animation**:
- Uses Framer Motion `layoutId` to create seamless card-to-page transition
- Card expands from its grid position to fill the screen
- Hero image morphs into page header background
- Content fades in progressively after layout animation completes

#### StorySection Component

**Purpose**: Display historical context with scrollytelling

**Scrollytelling Implementation**:

```typescript
import { useInView } from 'framer-motion';

const ref = useRef(null);
const isInView = useInView(ref, { 
  once: true, 
  margin: '-100px' 
});

<motion.section
  ref={ref}
  initial={{ opacity: 0, y: 100 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
  <h2 className="font-display text-6xl text-accent-red">
    THE STORY
  </h2>
  <p className="text-lg leading-relaxed">
    {race.description}
  </p>
</motion.section>
```

#### SetupSection Component

**Purpose**: Display AMS2 configuration data

**Structure**:

```tsx
<motion.section className="glass-effect p-8">
  <h2 className="font-display text-6xl text-accent-yellow">
    THE SETUP
  </h2>
  
  <div className="grid grid-cols-2 gap-6">
    <SetupItem label="Track" value={ams2.trackName} />
    <SetupItem label="Vehicle Class" value={ams2.vehicleClassName} />
    <SetupItem label="Vehicle" value={ams2.vehicleName} />
    <SetupItem label="Date" value={ams2.date} />
    <SetupItem label="Time" value={ams2.time} />
  </div>
  
  <WeatherTimeline slots={ams2.weather} />
</motion.section>
```

#### WeatherTimeline Component

**Purpose**: Visual representation of weather progression

**Design**: Horizontal timeline bar with gradient stops and icon markers representing weather changes

**Implementation**:

```typescript
interface WeatherTimelineProps {
  slots: WeatherSlot[];
}

// Weather name to color mapping (based on AMS2 weather types)
const weatherColors: Record<string, string> = {
  'Clear': '#ffd700',
  'LightCloud': '#a3a3a3',
  'MediumCloud': '#8a8a8a',
  'HeavyCloud': '#737373',
  'Overcast': '#5a5a5a',
  'LightRain': '#4a90e2',
  'Rain': '#2563eb',
  'Storm': '#1e3a8a',
  'ThunderStorm': '#312e81',
  'Foggy': '#9ca3af',
  'FogWithRain': '#6b7280',
  'HeavyFog': '#4b5563',
  'HeavyFogWithRain': '#374151',
  'Hazy': '#d1d5db',
  'Random': '#737373',
};

// Weather name to icon mapping (using Lucide React)
const weatherIcons: Record<string, any> = {
  'Clear': Sun,
  'LightCloud': Cloud,
  'MediumCloud': Cloud,
  'HeavyCloud': CloudDrizzle,
  'Overcast': CloudDrizzle,
  'LightRain': CloudRain,
  'Rain': CloudRain,
  'Storm': CloudLightning,
  'ThunderStorm': CloudLightning,
  'Foggy': CloudFog,
  'FogWithRain': CloudRain,
  'HeavyFog': CloudFog,
  'HeavyFogWithRain': CloudRain,
  'Hazy': Haze,
  'Random': Cloud,
};

// Generate gradient stops
const generateGradient = (slots: WeatherSlot[]) => {
  const stops = slots.map((slot, index) => {
    const position = (index / (slots.length - 1)) * 100;
    const color = weatherColors[slot.weatherName] || '#737373';
    return `${color} ${position}%`;
  });
  
  return `linear-gradient(90deg, ${stops.join(', ')})`;
};
```

**Visual Structure**:

```tsx
<div className="weather-timeline">
  <h3 className="text-xl font-display">WEATHER PROGRESSION</h3>
  
  {/* Timeline bar */}
  <div className="relative h-16 rounded-full overflow-hidden glass-effect">
    <div 
      className="absolute inset-0"
      style={{ background: generateGradient(slots) }}
    />
    
    {/* Weather slot markers */}
    {slots.map((slot, index) => {
      const Icon = weatherIcons[slot.weatherName] || Cloud;
      return (
        <div 
          key={slot.slot}
          className="absolute top-0 bottom-0"
          style={{ left: `${(index / (slots.length - 1)) * 100}%` }}
        >
          <div className="h-full w-px bg-white/30" />
          <div className="absolute top-full mt-2 -translate-x-1/2">
            <Icon className="w-6 h-6 text-white" />
            <p className="text-xs text-text-secondary mt-1">{slot.weatherName}</p>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

**Styling**:
- Height: 4rem
- Border radius: Full (pill shape)
- Glassmorphism background with gradient overlay
- Weather icons positioned at gradient stops
- Hover effect: Slight scale and glow

#### MediaSection Component

**Purpose**: Display YouTube video and hero artwork

**Implementation**:

```tsx
<motion.section
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6 }}
>
  <h2 className="font-display text-6xl text-accent-red">
    WATCH THE RACE
  </h2>
  
  {race.youtubeId ? (
    <div className="aspect-video glass-effect overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${race.youtubeId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  ) : (
    <Image 
      src={race.heroImage}
      alt={race.title}
      className="rounded-lg"
    />
  )}
</motion.section>
```

### Shared Components

#### BackButton Component

```tsx
<motion.button
  whileHover={{ scale: 1.05, x: -5 }}
  whileTap={{ scale: 0.95 }}
  className="fixed top-8 left-8 z-50 glass-effect p-4 rounded-full"
  onClick={() => router.back()}
>
  <ArrowLeft className="w-6 h-6" />
</motion.button>
```

#### AuroraBackground Component

```tsx
<div className="fixed inset-0 -z-10 overflow-hidden">
  <motion.div
    className="aurora-bg"
    animate={{
      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
</div>
```

#### NoiseTexture Component

```tsx
<div className="fixed inset-0 -z-5 noise-texture pointer-events-none" />
```

## Data Models

### races.json Structure

**Note**: The application uses actual AMS2 game data for tracks, vehicles, vehicle classes, and weather conditions. Reference files are available in `data/ams2_*.json`.

```json
[
  {
    "id": "senna-donington-93",
    "title": "Lap of the Gods",
    "driver": "Ayrton Senna",
    "team": "McLaren",
    "year": "1993",
    "tags": ["Rain Master", "F1", "Heroic"],
    "description": "Senna starts 4th in treacherous conditions. By the end of lap 1, he is leading. Recreate the variable wet conditions that defined this masterclass.",
    "heroImage": "/images/senna-donington.jpg",
    "youtubeId": "cZqOsDY-uco",
    "ams2": {
      "trackId": 1497365379,
      "trackName": "Donington_GP",
      "vehicleClassId": -1271841366,
      "vehicleClassName": "F-Hitech_Gen2",
      "vehicleId": -1271841366,
      "vehicleName": "McLaren Cosworth MP4/8",
      "date": "1993-04-11",
      "time": "14:00",
      "weather": [
        { "slot": 1, "weatherId": 296956818, "weatherName": "LightCloud" },
        { "slot": 2, "weatherId": 270338437, "weatherName": "LightRain" },
        { "slot": 3, "weatherId": -1293634875, "weatherName": "Overcast" },
        { "slot": 4, "weatherId": 1461703858, "weatherName": "Rain" }
      ]
    }
  },
  {
    "id": "clark-spa-70",
    "title": "The Impossible Lead",
    "driver": "Jim Clark",
    "team": "Lotus",
    "year": "1970",
    "tags": ["Vintage", "F1", "Dominance"],
    "description": "Jim Clark laps the entire field except for Bruce McLaren in driving rain at the old Spa circuit.",
    "heroImage": "/images/clark-spa.jpg",
    "youtubeId": "VIDEO_ID_HERE",
    "ams2": {
      "trackId": -1736505524,
      "trackName": "Spa_Francorchamps_1970",
      "vehicleClassId": 520250275,
      "vehicleClassName": "F-Vintage_Gen1",
      "vehicleId": 318400650,
      "vehicleName": "Formula Vintage Gen1 Model2",
      "date": "1970-06-07",
      "time": "15:00",
      "weather": [
        { "slot": 1, "weatherId": -1592958063, "weatherName": "Storm" },
        { "slot": 2, "weatherId": 1461703858, "weatherName": "Rain" }
      ]
    }
  }
]
```

**AMS2 Data Integration**:
- Track IDs and names from `data/ams2_tracks.json`
- Vehicle class IDs and names from `data/ams2_vehicle_classes.json`
- Vehicle IDs and names from `data/ams2_vehicles.json`
- Weather IDs and names from `data/ams2_weather.json`
- All IDs are the actual game values for accurate recreation

### Data Loading and Validation

```typescript
// lib/raceData.ts
import racesData from '@/data/races.json';
import { z } from 'zod';

const WeatherSlotSchema = z.object({
  slot: z.number(),
  weatherId: z.number(),
  weatherName: z.string(),
});

const AMS2SetupSchema = z.object({
  trackId: z.number(),
  trackName: z.string(),
  vehicleClassId: z.number(),
  vehicleClassName: z.string(),
  vehicleId: z.number(),
  vehicleName: z.string(),
  date: z.string(),
  time: z.string(),
  weather: z.array(WeatherSlotSchema),
});

const RaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  driver: z.string(),
  team: z.string(),
  year: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  heroImage: z.string(),
  youtubeId: z.string(),
  ams2: AMS2SetupSchema,
});

export const getAllRaces = (): Race[] => {
  return racesData.map(race => RaceSchema.parse(race));
};

export const getRaceById = (id: string): Race | undefined => {
  const race = racesData.find(r => r.id === id);
  return race ? RaceSchema.parse(race) : undefined;
};
```

## Correctness Properties

Now I'll analyze the acceptance criteria to determine which are testable as properties.



*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Complete Race Data Rendering

*For any* race object with all required fields (title, driver, year, heroImage, description, ams2Data), when rendered in either the gallery or detail view, all specified fields should be present in the rendered output.

**Validates: Requirements 1.2, 2.2, 4.1, 4.2**

### Property 2: Data Loading and Retrieval

*For any* valid race ID in the data store, calling getRaceById should return a race object that matches the race with that ID in the JSON file.

**Validates: Requirements 1.5, 2.5**

### Property 3: Schema Validation

*For any* race object in the data store, it should pass validation against the Race schema, including all nested fields (ams2 with track, layout, carClass, car, date, time, and weather array where each slot has slot number, type, and icon).

**Validates: Requirements 8.2, 8.3, 8.4, 8.5**

### Property 4: Weather Slot Rendering

*For any* race with N weather slots, the WeatherTimeline component should render exactly N weather markers with corresponding type and icon.

**Validates: Requirements 4.3**

### Property 5: Conditional Media Rendering

*For any* race object, if youtubeId is present and non-empty, the MediaSection should render an iframe; if youtubeId is absent or empty, it should render the hero image instead.

**Validates: Requirements 5.2, 5.3**

### Property 6: Navigation Behavior

*For any* race card click event, the application should navigate to a URL matching the pattern `/race/[race.id]`, and clicking the back button should navigate to the gallery page.

**Validates: Requirements 2.1, 10.2, 10.5**

### Property 7: Consistent Glassmorphism Styling

*For any* card component (RaceCard, SetupSection, or other glass-effect elements), the rendered output should include backdrop-filter blur and semi-transparent background styling.

**Validates: Requirements 1.3, 4.5, 6.4**

### Property 8: Scroll-Triggered Animations

*For any* section component with scrollytelling (StorySection, MediaSection), when the component enters the viewport, animation properties (opacity, y-position) should transition from initial to animate state.

**Validates: Requirements 2.4, 3.3, 5.4, 7.3**

### Property 9: Framer Motion Animation Configuration

*For any* interactive component with hover or tap animations, the component should use Framer Motion props (whileHover, whileTap, or animate) with spring-based transition curves.

**Validates: Requirements 1.4, 7.1, 7.2, 7.4**

### Property 10: Responsive Grid Adaptation

*For any* viewport width, the BentoGrid should adjust its column count according to breakpoints: 1 column for mobile (<768px), 2 columns for tablet (768-1024px), and 3+ columns for desktop (>1024px).

**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

### Property 11: Component Structure Ordering

*For any* race detail page, the rendered component tree should contain StorySection, SetupSection, and MediaSection in that specific order.

**Validates: Requirements 2.3, 3.4**

### Property 12: Image Optimization

*For any* hero image or artwork, the application should use Next.js Image component with lazy loading enabled rather than standard HTML img tags.

**Validates: Requirements 11.1, 11.2**

### Property 13: GPU-Accelerated Animations

*For any* Framer Motion animation, the animated properties should be limited to transform (translateX, translateY, scale, rotate) and opacity to ensure GPU acceleration.

**Validates: Requirements 11.4**

### Property 14: Theme Color Consistency

*For any* interactive element (buttons, links, hover states), the applied colors should use only the defined accent colors (#dc0000 for red, #ffd700 for yellow) from the theme configuration.

**Validates: Requirements 6.2**

## Error Handling

### Data Loading Errors

**Invalid JSON Structure**:
- If races.json cannot be parsed, display an error boundary with a user-friendly message
- Log the parsing error to console for debugging
- Provide a fallback empty state in the gallery

**Missing Race Data**:
- If a race ID in the URL doesn't exist, redirect to 404 page
- Display "Race not found" message with link back to gallery

**Schema Validation Failures**:
- If a race object fails schema validation, log the validation error
- Skip the invalid race and continue loading valid races
- Display a warning in development mode

### Media Loading Errors

**Missing Hero Images**:
- Provide a fallback placeholder image with the race title
- Use a gradient background matching the theme

**YouTube Embed Failures**:
- Wrap iframe in error boundary
- Display fallback message: "Video unavailable" with link to YouTube

### Animation Performance

**Reduced Motion Preference**:
```typescript
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
/>
```

**Animation Frame Drops**:
- Use `will-change` CSS property sparingly
- Disable complex animations on low-end devices (detected via performance API)

## Testing Strategy

### Dual Testing Approach

The application will use both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Component rendering with specific race data
- Navigation flows
- Error boundary behavior
- Responsive breakpoint transitions

**Property Tests**: Verify universal properties across all inputs
- Data schema validation across randomly generated race objects
- Component rendering with various data combinations
- Animation behavior across different viewport sizes
- Styling consistency across all card components

### Property-Based Testing Configuration

**Library**: fast-check (JavaScript/TypeScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: ams2-iconic-races, Property {N}: {property description}`

**Example Property Test**:

```typescript
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { RaceCard } from '@/components/gallery/RaceCard';

// Feature: ams2-iconic-races, Property 1: Complete Race Data Rendering
describe('Property 1: Complete Race Data Rendering', () => {
  it('should render all required fields for any valid race object', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          title: fc.string(),
          driver: fc.string(),
          team: fc.string(),
          year: fc.string(),
          tags: fc.array(fc.string()),
          description: fc.string(),
          youtubeId: fc.string(),
          heroImage: fc.string(),
          ams2: fc.record({
            track: fc.string(),
            layout: fc.string(),
            carClass: fc.string(),
            car: fc.string(),
            date: fc.date().map(d => d.toISOString().split('T')[0]),
            time: fc.string(),
            weather: fc.array(fc.record({
              slot: fc.integer({ min: 1, max: 10 }),
              type: fc.string(),
              icon: fc.string(),
            })),
          }),
        }),
        (race) => {
          const { getByText } = render(<RaceCard race={race} />);
          
          expect(getByText(race.title)).toBeInTheDocument();
          expect(getByText(race.driver)).toBeInTheDocument();
          expect(getByText(race.year)).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing Focus Areas

**Component Integration**:
- Gallery page loads and displays race cards
- Race detail page loads with correct data
- Navigation between pages works correctly

**Edge Cases**:
- Empty race data array
- Race with no weather slots
- Race with no YouTube URL
- Very long race descriptions
- Special characters in race titles

**Error Conditions**:
- Invalid race ID in URL
- Malformed JSON data
- Missing required fields
- Network errors (if API is added later)

### Testing Tools

- **Test Runner**: Vitest
- **Component Testing**: React Testing Library
- **Property Testing**: fast-check
- **E2E Testing**: Playwright (for critical user flows)
- **Visual Regression**: Chromatic (for design consistency)

### Test Coverage Goals

- Unit test coverage: >80% for components and utilities
- Property test coverage: All 14 correctness properties implemented
- E2E test coverage: Critical user paths (browse → select → view → back)

### Continuous Integration

- Run all tests on every pull request
- Run visual regression tests on UI changes
- Performance budgets enforced via Lighthouse CI
- Accessibility checks via axe-core
