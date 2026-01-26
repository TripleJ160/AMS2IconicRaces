# Design Document: Homepage Search and Filters

## Overview

This design enhances the AMS2 Iconic Races homepage with real-time search, vehicle class filtering, and visual improvements. The implementation follows React best practices with TypeScript, leveraging existing patterns from the codebase (Framer Motion animations, glassmorphism styling, cyber-noir theme).

The design introduces three new component groups:
1. **Hero Section** - Engaging introduction with statistics
2. **Search and Filter Controls** - Real-time filtering interface
3. **Empty State** - User-friendly feedback when no results match

All components integrate seamlessly with the existing BentoGrid and maintain the established visual language.

## Architecture

### Component Hierarchy

```
HomePage (app/page.tsx)
├── HeroSection
│   ├── Title
│   ├── Tagline
│   └── Statistics
├── SearchAndFilterPanel
│   ├── SearchBar
│   │   ├── SearchInput
│   │   └── ClearButton
│   ├── FilterControls
│   │   ├── FilterChip[] (one per vehicle class)
│   │   └── ResetFiltersButton
│   └── ClearAllButton
├── BentoGrid (existing)
│   └── RaceCard[] (filtered)
└── EmptyState (conditional)
    ├── EmptyMessage
    └── ResetButton
```

### State Management

The homepage will use React hooks for local state management:

```typescript
interface HomePageState {
  searchQuery: string;           // Current search text
  activeFilters: Set<string>;    // Selected vehicle classes
  filteredRaces: Race[];         // Computed filtered results
  availableClasses: string[];    // Unique vehicle classes from data
}
```

State updates flow:
1. User interaction → State update
2. State update → Compute filtered races
3. Filtered races → Re-render BentoGrid with animation

### Data Flow

```
Race Data (races.json)
    ↓
getAllRaces() → Race[]
    ↓
Extract unique vehicle classes → availableClasses[]
    ↓
Apply filters (search + active filters) → filteredRaces[]
    ↓
Render BentoGrid with filteredRaces
```

## Components and Interfaces

### 1. HeroSection Component

**Purpose**: Provide engaging introduction and context for the application.

**Interface**:
```typescript
interface HeroSectionProps {
  totalRaces: number;
  totalClasses: number;
}

export function HeroSection({ totalRaces, totalClasses }: HeroSectionProps): JSX.Element
```

**Styling**:
- Glassmorphism card with backdrop-blur-md
- Centered layout with responsive padding
- Display font for title (Russo One)
- Accent colors for statistics (yellow for numbers)
- Responsive text sizing (mobile: text-4xl, desktop: text-7xl)

**Layout**:
```
┌─────────────────────────────────────┐
│  AMS2 ICONIC RACES                  │  (title - existing style)
│                                     │
│  Relive history's greatest racing  │  (tagline)
│  moments with exact AMS2 setups    │
│                                     │
│  [12 Races] • [5 Classes]          │  (statistics)
└─────────────────────────────────────┘
```

### 2. SearchBar Component

**Purpose**: Real-time text search across driver names, years, and vehicle classes.

**Interface**:
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "Search by driver, year, or class..." 
}: SearchBarProps): JSX.Element
```

**Implementation Details**:
- Debounced input (150ms) to optimize performance
- Clear button appears when value is non-empty
- Search icon on the left (using lucide-react)
- Glassmorphism styling matching theme
- Focus state with accent-red ring

**Styling**:
```css
- Background: bg-glass-bg (rgba(20, 20, 20, 0.6))
- Border: border-glass-border with hover:border-accent-red
- Backdrop blur: backdrop-blur-md
- Text: text-text-primary
- Padding: px-4 py-3
- Rounded: rounded-lg
```

### 3. FilterChip Component

**Purpose**: Toggle button for vehicle class filtering.

**Interface**:
```typescript
interface FilterChipProps {
  label: string;           // Vehicle class name (e.g., "F1", "Vintage")
  isActive: boolean;       // Whether filter is currently selected
  onClick: () => void;     // Toggle handler
  count?: number;          // Optional: number of races in this class
}

export function FilterChip({ 
  label, 
  isActive, 
  onClick, 
  count 
}: FilterChipProps): JSX.Element
```

**States**:
- **Inactive**: Semi-transparent, white border, hover effect
- **Active**: Accent-red background, yellow text, glow effect

**Styling**:
```typescript
// Inactive
className="px-4 py-2 rounded-full border border-glass-border bg-glass-bg 
           text-text-secondary hover:border-accent-red hover:text-text-primary
           transition-all duration-200"

// Active
className="px-4 py-2 rounded-full border border-accent-red bg-accent-red 
           text-accent-yellow shadow-lg shadow-accent-red/50
           transition-all duration-200"
```

**Animation**: Framer Motion scale on click (whileTap: { scale: 0.95 })

### 4. SearchAndFilterPanel Component

**Purpose**: Container grouping search and filter controls.

**Interface**:
```typescript
interface SearchAndFilterPanelProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  availableClasses: string[];
  activeFilters: Set<string>;
  onFilterToggle: (className: string) => void;
  onResetFilters: () => void;
  onClearAll: () => void;
}

export function SearchAndFilterPanel(props: SearchAndFilterPanelProps): JSX.Element
```

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│  [🔍 Search by driver, year, or class...] [×]       │
│                                                     │
│  [F1] [Vintage] [GT3] [Prototype]  [Reset Filters] │
│                                                     │
│  [Clear All]                                        │
└─────────────────────────────────────────────────────┘
```

**Responsive Behavior**:
- Mobile (< 768px): Stack vertically, full-width search
- Tablet (768px - 1024px): Search full-width, filters wrap
- Desktop (> 1024px): Horizontal layout with flex-wrap

### 5. EmptyState Component

**Purpose**: User-friendly feedback when no races match filters.

**Interface**:
```typescript
interface EmptyStateProps {
  searchQuery: string;
  activeFilters: string[];
  onReset: () => void;
}

export function EmptyState({ 
  searchQuery, 
  activeFilters, 
  onReset 
}: EmptyStateProps): JSX.Element
```

**Content Logic**:
```typescript
function getEmptyMessage(searchQuery: string, activeFilters: string[]): string {
  if (searchQuery && activeFilters.length > 0) {
    return `No races found for "${searchQuery}" in ${activeFilters.join(", ")}`;
  } else if (searchQuery) {
    return `No races found for "${searchQuery}"`;
  } else if (activeFilters.length > 0) {
    return `No races found in ${activeFilters.join(", ")}`;
  }
  return "No races available";
}
```

**Styling**:
- Centered layout with glassmorphism card
- Large icon (search-x from lucide-react)
- Accent-yellow for icon
- Clear call-to-action button

### 6. Updated HomePage Component

**Purpose**: Orchestrate all components and manage filtering logic.

**State Management**:
```typescript
const [searchQuery, setSearchQuery] = useState<string>("");
const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

// Derived state
const availableClasses = useMemo(() => 
  Array.from(new Set(races.map(r => r.ams2.vehicleClassName))).sort(),
  [races]
);

const filteredRaces = useMemo(() => 
  filterRaces(races, searchQuery, activeFilters),
  [races, searchQuery, activeFilters]
);
```

**Filtering Logic**:
```typescript
function filterRaces(
  races: Race[], 
  searchQuery: string, 
  activeFilters: Set<string>
): Race[] {
  let results = races;
  
  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    results = results.filter(race => 
      race.driver.toLowerCase().includes(query) ||
      race.year.includes(query) ||
      race.ams2.vehicleClassName.toLowerCase().includes(query)
    );
  }
  
  // Apply class filters (OR logic)
  if (activeFilters.size > 0) {
    results = results.filter(race => 
      activeFilters.has(race.ams2.vehicleClassName)
    );
  }
  
  return results;
}
```

## Data Models

### Existing Race Interface (no changes)

The existing `Race` interface in `lib/types.ts` already contains all necessary data:

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
  raceContext: RaceContext;
  ams2: AMS2Setup;  // Contains vehicleClassName for filtering
}
```

### New Utility Types

```typescript
// lib/filterUtils.ts
export type FilterFunction = (races: Race[], query: string, filters: Set<string>) => Race[];

export interface FilterState {
  searchQuery: string;
  activeFilters: Set<string>;
}

export interface FilterActions {
  setSearchQuery: (query: string) => void;
  toggleFilter: (className: string) => void;
  clearSearch: () => void;
  clearFilters: () => void;
  clearAll: () => void;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Search Filter Correctness

*For any* search query and race collection, all filtered results must match the search query in at least one of: driver name (case-insensitive substring), year (exact match), or vehicle class name (case-insensitive substring).

**Validates: Requirements 1.2, 1.3, 1.4**

### Property 2: Class Filter Correctness (OR Logic)

*For any* set of active class filters and race collection, all filtered results must have a vehicle class that matches at least one active filter.

**Validates: Requirements 2.3, 2.4**

### Property 3: Combined Filter Correctness (AND Logic)

*For any* search query, set of active class filters, and race collection, all filtered results must satisfy both the search criteria AND match at least one active class filter.

**Validates: Requirements 2.5**

### Property 4: Empty Search Returns All

*For any* race collection, when the search query is empty and no class filters are active, the filtered results must equal the original race collection.

**Validates: Requirements 1.5**

### Property 5: Filter Toggle Idempotence

*For any* filter state, toggling a filter twice (activate then deactivate) must return to the original filter state.

**Validates: Requirements 2.2, 2.6**

### Property 6: Search Debounce Timing

*For any* sequence of rapid keystrokes in the search bar, the filter function must execute at most once per 150ms window.

**Validates: Requirements 1.6, 9.2**

### Property 7: Empty State Visibility

*For any* filter state, the empty state component must be visible if and only if the filtered results array has length zero.

**Validates: Requirements 4.1**

### Property 8: Available Classes Uniqueness

*For any* race collection, the list of available vehicle classes must contain each unique class name exactly once, with no duplicates.

**Validates: Requirements 2.1**

### Property 9: Clear All Restoration

*For any* filter state with active search or filters, executing "clear all" must result in displaying all races from the original collection.

**Validates: Requirements 3.5**

### Property 10: Filter Count Accuracy

*For any* set of active filters, the displayed filter count must equal the size of the active filters set.

**Validates: Requirements 2.7**

## Error Handling

### Search Input Validation

**Scenario**: User enters special characters or extremely long strings

**Handling**:
- Sanitize input to prevent XSS (React handles this by default)
- Limit search query length to 100 characters
- Trim whitespace before filtering
- Handle empty/whitespace-only queries as "no search"

**Implementation**:
```typescript
function sanitizeSearchQuery(query: string): string {
  return query.trim().slice(0, 100);
}
```

### Missing or Malformed Race Data

**Scenario**: Race data is missing required fields (driver, year, vehicleClassName)

**Handling**:
- Validate race data on load
- Filter out invalid races with console warning
- Display error boundary if all races are invalid
- Graceful degradation: show available valid races

**Implementation**:
```typescript
function validateRace(race: any): race is Race {
  return (
    typeof race.driver === 'string' &&
    typeof race.year === 'string' &&
    typeof race.ams2?.vehicleClassName === 'string'
  );
}

const validRaces = races.filter(race => {
  const isValid = validateRace(race);
  if (!isValid) {
    console.warn('Invalid race data:', race);
  }
  return isValid;
});
```

### Empty Race Collection

**Scenario**: No races exist in the data file

**Handling**:
- Display special empty state: "No races available yet"
- Hide search and filter controls
- Provide helpful message for administrators

### Animation Performance Issues

**Scenario**: User has reduced motion preferences or low-end device

**Handling**:
- Respect `prefers-reduced-motion` media query
- Disable 3D transforms and complex animations
- Use instant transitions instead of animated ones
- Maintain functionality without animations

**Implementation**:
```typescript
const prefersReducedMotion = useReducedMotion(); // existing hook

const animationConfig = prefersReducedMotion 
  ? { duration: 0 }
  : { duration: 0.3, ease: "easeInOut" };
```

### Filter State Synchronization

**Scenario**: Race data updates while filters are active

**Handling**:
- Re-compute available classes when race data changes
- Remove active filters that no longer have matching races
- Update filtered results automatically
- Show notification if active filters were removed

## Testing Strategy

### Unit Tests

Unit tests verify specific examples, edge cases, and error conditions. Focus on discrete functionality and integration points.

**Search Filtering**:
- Test exact year match: "1993" returns Senna race
- Test partial driver name: "senn" returns Senna race (case-insensitive)
- Test partial class name: "f1" returns F1 races (case-insensitive)
- Test no matches: "xyz123" returns empty array
- Test empty query: "" returns all races
- Test whitespace-only query: "   " returns all races
- Test special characters: "Senna!" handles gracefully

**Class Filtering**:
- Test single filter: activeFilters=["F1"] returns only F1 races
- Test multiple filters: activeFilters=["F1", "Vintage"] returns F1 OR Vintage races
- Test non-existent class: activeFilters=["NonExistent"] returns empty array
- Test empty filters: activeFilters=[] returns all races

**Combined Filtering**:
- Test search + filter: query="Senna", filters=["F1"] returns Senna F1 races
- Test search + filter no match: query="Clark", filters=["GT3"] returns empty array

**Component Rendering**:
- Test HeroSection displays correct statistics
- Test SearchBar shows clear button when value is non-empty
- Test FilterChip active/inactive states
- Test EmptyState displays correct message based on filter state

**Edge Cases**:
- Test with single race in collection
- Test with no races in collection
- Test with all races filtered out
- Test with duplicate vehicle class names (should deduplicate)

### Property-Based Tests

Property tests verify universal properties across all inputs using randomized test data. Each test runs minimum 100 iterations.

**Configuration**: Use `@fast-check/vitest` for property-based testing in TypeScript.

**Property Test 1: Search Filter Correctness**
- **Feature**: homepage-search-and-filters, Property 1
- **Generator**: Random race arrays, random search queries
- **Property**: All filtered results match query in driver/year/class
- **Validates**: Requirements 1.2, 1.3, 1.4

**Property Test 2: Class Filter OR Logic**
- **Feature**: homepage-search-and-filters, Property 2
- **Generator**: Random race arrays, random filter sets
- **Property**: All filtered results have class in active filters
- **Validates**: Requirements 2.3, 2.4

**Property Test 3: Combined Filter AND Logic**
- **Feature**: homepage-search-and-filters, Property 3
- **Generator**: Random race arrays, random queries, random filters
- **Property**: Results match both search AND class filter
- **Validates**: Requirements 2.5

**Property Test 4: Empty Search Identity**
- **Feature**: homepage-search-and-filters, Property 4
- **Generator**: Random race arrays
- **Property**: filterRaces(races, "", new Set()) === races
- **Validates**: Requirements 1.5

**Property Test 5: Filter Toggle Idempotence**
- **Feature**: homepage-search-and-filters, Property 5
- **Generator**: Random filter states, random class names
- **Property**: toggle(toggle(state, class), class) === state
- **Validates**: Requirements 2.2, 2.6

**Property Test 6: Empty State Equivalence**
- **Feature**: homepage-search-and-filters, Property 7
- **Generator**: Random race arrays, random filter states
- **Property**: showEmptyState === (filteredRaces.length === 0)
- **Validates**: Requirements 4.1

**Property Test 7: Available Classes Uniqueness**
- **Feature**: homepage-search-and-filters, Property 8
- **Generator**: Random race arrays (including duplicates)
- **Property**: availableClasses has no duplicates
- **Validates**: Requirements 2.1

**Property Test 8: Clear All Restoration**
- **Feature**: homepage-search-and-filters, Property 9
- **Generator**: Random race arrays, random filter states
- **Property**: After clearAll(), filteredRaces === allRaces
- **Validates**: Requirements 3.5

**Property Test 9: Filter Count Accuracy**
- **Feature**: homepage-search-and-filters, Property 10
- **Generator**: Random filter sets
- **Property**: displayedCount === activeFilters.size
- **Validates**: Requirements 2.7

### Integration Tests

- Test full user flow: search → filter → clear → results update
- Test animation performance with large race collections (50+ races)
- Test responsive behavior at different viewport sizes
- Test keyboard navigation and accessibility

### Performance Tests

- Measure filter execution time with 100+ races (should be < 100ms)
- Measure debounce effectiveness (should batch rapid keystrokes)
- Measure animation frame rate (should maintain 60fps)
- Test memory usage with repeated filter operations

### Visual Regression Tests

- Capture screenshots of hero section at different viewports
- Capture search and filter panel states (empty, active, with results)
- Capture empty state variations
- Verify glassmorphism effects render correctly
