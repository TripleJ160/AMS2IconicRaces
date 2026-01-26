run # Design Document: Cinematic Masonry Homepage

## Overview

This design transforms the current homepage from a blog-style layout with centered containers into a cinematic, full-bleed masonry experience inspired by Netflix, Apple TV, and high-end fashion magazines. The redesign focuses on three key architectural changes:

1. **Immersive Hero Section**: Replace the current HeroSection component with a full-viewport (80vh) hero that uses a race image as a background with dramatic typography overlay
2. **Full-Width Layout**: Remove container constraints (max-w-7xl) and extend the grid to either full width or max-w-[1920px] with minimal padding
3. **Dynamic Masonry Grid**: Enhance the existing BentoGrid with more varied card sizes and reduced gaps to create visual density

The design maintains the existing component architecture (RaceCard, BentoGrid) while introducing a new CinematicHero component and modifying layout constraints in the main page component.

## Architecture

### Component Hierarchy

```
app/page.tsx (Homepage)
├── CinematicHero (NEW)
│   ├── Background Image (full-bleed)
│   ├── Gradient Overlay
│   └── Title Overlay (100px font)
├── SearchAndFilterPanel (EXISTING)
└── EnhancedBentoGrid (MODIFIED)
    └── RaceCard[] (EXISTING, minimal changes)
```

### Layout Flow

1. **Hero Section (80vh)**: Full-bleed featured race with dramatic title overlay
2. **Search/Filter Panel**: Positioned below hero, maintains current functionality
3. **Masonry Grid**: Edge-to-edge grid with varying card sizes, reduced gaps

### Responsive Breakpoints

- **Mobile (< 768px)**: Single column, hero at 60vh, reduced title size
- **Tablet (768px - 1024px)**: 2-column masonry, hero at 70vh
- **Desktop (> 1024px)**: 3+ column masonry, hero at 80vh, full cinematic effect

## Components and Interfaces

### 1. CinematicHero Component (NEW)

**Purpose**: Display a full-bleed, immersive hero section featuring a single race.

**Props Interface**:
```typescript
interface CinematicHeroProps {
  race: Race;
  onClick: () => void;
}
```

**Styling Approach**:
- Container: `h-[80vh] md:h-[80vh] relative overflow-hidden w-full`
- Background: Next.js Image component with `fill` and `object-cover`
- Gradient: `bg-gradient-to-t from-black via-black/60 to-transparent`
- Title positioning: `absolute bottom-0 left-0 p-8 md:p-12 lg:p-16`
- Title typography: `text-[60px] md:text-[80px] lg:text-[100px] font-display uppercase tracking-wider`

**Accessibility Considerations**:
- Clickable area with proper ARIA labels
- Sufficient contrast ratio (gradient ensures text readability)
- Keyboard navigation support
- Alt text for background image

**Implementation Notes**:
- Use the first race from filtered results as the featured race
- Fallback to a default featured race if no results
- Maintain existing click behavior (navigate to race detail)
- Apply `priority` loading to hero image for LCP optimization

### 2. Enhanced BentoGrid Component (MODIFIED)

**Current Implementation**:
```typescript
// Current: max-w-7xl container with gap-4 md:gap-6
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[350px] md:auto-rows-[400px]">
```

**New Implementation**:
```typescript
// New: full-width or max-w-[1920px] with reduced gaps
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 auto-rows-[300px] md:auto-rows-[350px] lg:auto-rows-[400px]">
```

**Changes**:
- Remove parent container's `max-w-7xl` constraint
- Add `max-w-[1920px] mx-auto` to grid container itself
- Reduce gaps: `gap-4 md:gap-6` → `gap-2 md:gap-4`
- Add XL breakpoint for 4-column layout on ultra-wide screens
- Adjust auto-row heights for denser packing

**Grid Span Pattern Enhancement**:

Current pattern (repeats every 6 cards):
```
[2x2] [1x1] [1x1] [1x1] [2x1] [1x1]
```

Enhanced pattern (repeats every 8 cards):
```
[2x2] [1x1] [1x2] [1x1] [2x1] [1x1] [1x1] [2x2]
```

**New `getGridSpan` function**:
```typescript
export function getGridSpan(index: number): string {
  const patternIndex = index % 8;
  
  const patterns = [
    'md:col-span-2 md:row-span-2', // Large square (2x2)
    'md:col-span-1 md:row-span-1', // Small (1x1)
    'md:col-span-1 md:row-span-2', // Tall (1x2) - NEW
    'md:col-span-1 md:row-span-1', // Small (1x1)
    'md:col-span-2 md:row-span-1', // Wide (2x1)
    'md:col-span-1 md:row-span-1', // Small (1x1)
    'md:col-span-1 md:row-span-1', // Small (1x1)
    'md:col-span-2 md:row-span-2', // Large square (2x2)
  ];
  
  return patterns[patternIndex];
}
```

### 3. Homepage Layout (MODIFIED)

**Current Container Structure**:
```typescript
<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
  <HeroSection />
  <SearchAndFilterPanel />
  <BentoGrid />
</div>
```

**New Container Structure**:
```typescript
<main className="min-h-screen">
  <CinematicHero /> {/* Full-bleed, no container */}
  
  <div className="px-4 py-8 md:py-12 max-w-[1920px] mx-auto">
    <SearchAndFilterPanel />
  </div>
  
  <div className="px-4 max-w-[1920px] mx-auto">
    <BentoGrid /> {/* Grid itself handles layout */}
  </div>
</main>
```

**Key Changes**:
- Remove outer `max-w-7xl` constraint
- CinematicHero sits outside any container (full-bleed)
- SearchAndFilterPanel gets minimal container with `max-w-[1920px]`
- BentoGrid gets minimal horizontal padding only
- Reduce vertical spacing between sections

### 4. RaceCard Component (MINIMAL CHANGES)

**Current Implementation**: Already supports varying grid spans via props.

**Required Changes**:
- None to core functionality
- May adjust internal padding for denser layout: `p-4 md:p-6` → `p-3 md:p-5`
- Ensure hover effects work well with reduced gaps

## Data Models

### Race Selection for Hero

**Logic**:
```typescript
// In Homepage component
const featuredRace = useMemo(() => {
  // Use first filtered race, or first race overall as fallback
  return filteredRaces.length > 0 ? filteredRaces[0] : races[0];
}, [filteredRaces, races]);
```

**Rationale**: 
- When filters are active, show the top result as the hero
- When no filters, show the first race (can be manually curated in data)
- Provides dynamic hero that responds to user interaction

### Grid Pattern State

No additional state required. The `getGridSpan` function remains pure and deterministic based on index.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Grid Span Pattern Variety

*For any* set of 8 or more race cards, the assigned grid spans should include at least one wide card (col-span-2), at least one tall card (row-span-2), and at least one large square card (col-span-2 row-span-2), ensuring visual variety in the masonry layout.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 2: Lazy Loading for Non-Hero Images

*For any* race card that is not the featured hero race, the image should not have the `priority` prop set, ensuring off-screen images are lazy-loaded for performance optimization.

**Validates: Requirements 6.2**

### Property 3: Masonry Layout Preservation Across Filter States

*For any* filter state (including empty filters, active search, or active class filters), the race grid should maintain the masonry layout structure with varying grid spans, ensuring consistent visual presentation.

**Validates: Requirements 7.1**

### Property 4: Hero Race Selection Logic

*For any* filter state, the hero section should display either the first race from the filtered results (if results exist) or a default featured race (if no results), ensuring the hero always shows relevant content.

**Validates: Requirements 7.3**

### Property 5: Navigation Behavior Consistency

*For any* clickable race element (hero section or race card), clicking should trigger navigation to the race detail page with the correct race ID, ensuring consistent interaction behavior across all race displays.

**Validates: Requirements 7.4**

## Error Handling

### Image Loading Failures

**Scenario**: Race image fails to load in hero or card.

**Handling**:
- Next.js Image component provides built-in error handling
- Implement `onError` callback to show fallback gradient background
- Log error to console for debugging
- Maintain layout structure even without image

**Implementation**:
```typescript
<Image
  src={race.heroImage}
  alt={race.title}
  fill
  onError={(e) => {
    console.error('Failed to load hero image:', race.id);
    // Fallback handled by CSS background
  }}
/>
```

### Empty Race Data

**Scenario**: No races available to display.

**Handling**:
- Show empty state component (already implemented)
- Hero section should gracefully handle missing featured race
- Provide clear messaging to user

### Responsive Layout Edge Cases

**Scenario**: Ultra-wide screens (> 2560px) or very narrow screens (< 320px).

**Handling**:
- Max width constraint (1920px) prevents excessive stretching
- Grid maintains minimum column width through auto-fit
- Mobile layout works down to 320px viewport width
- Test at extreme viewport sizes

### Accessibility Failures

**Scenario**: User has JavaScript disabled or screen reader compatibility issues.

**Handling**:
- Semantic HTML ensures basic functionality without JS
- All interactive elements are native HTML buttons/links
- ARIA labels provide fallback descriptions
- Keyboard navigation works without JS enhancements

## Testing Strategy

### Unit Tests

Unit tests will focus on specific examples, edge cases, and component rendering:

**CinematicHero Component**:
- Renders with correct race data
- Displays title at correct font size
- Applies gradient overlay
- Handles click events
- Renders with correct height class (80vh)
- Shows correct image with priority loading

**Enhanced BentoGrid**:
- Renders correct number of children
- Applies correct gap classes
- Uses correct grid column classes at different breakpoints
- Handles empty children array

**getGridSpan Function**:
- Returns correct pattern for indices 0-7
- Pattern repeats correctly after index 7
- Returns correct responsive classes

**Homepage Layout**:
- Renders all major sections in correct order
- Hero appears before search panel
- Search panel appears before grid
- Applies correct container constraints
- Handles filtered results correctly
- Shows empty state when no results

**Responsive Behavior**:
- Mobile viewport shows single column
- Tablet viewport shows 2 columns
- Desktop viewport shows 3+ columns
- Hero maintains height across breakpoints

**Accessibility**:
- Hero has sufficient contrast ratio
- All interactive elements have ARIA labels
- Keyboard navigation follows logical order
- Reduced motion preference is respected

### Property-Based Tests

Property-based tests will verify universal properties across all inputs. Each test should run a minimum of 100 iterations.

**Test Configuration**: Use `@fast-check/vitest` for TypeScript/React property-based testing.

**Property Test 1: Grid Span Pattern Variety**
- **Tag**: `Feature: cinematic-masonry-homepage, Property 1: Grid Span Pattern Variety`
- **Generator**: Array of 8-20 race objects
- **Property**: For any array of 8+ races, the grid spans assigned should include at least one of each type (wide, tall, large square)
- **Validation**: Map indices to grid spans, verify all required span types are present

**Property Test 2: Lazy Loading for Non-Hero Images**
- **Tag**: `Feature: cinematic-masonry-homepage, Property 2: Lazy Loading for Non-Hero Images`
- **Generator**: Array of 2-50 race objects
- **Property**: For any array of races, only the first race (hero) should have priority loading, all others should not
- **Validation**: Render cards, verify priority prop is only set on index 0

**Property Test 3: Masonry Layout Preservation Across Filter States**
- **Tag**: `Feature: cinematic-masonry-homepage, Property 3: Masonry Layout Preservation Across Filter States`
- **Generator**: Array of races, random search query, random filter set
- **Property**: For any filter state, the rendered grid should maintain masonry layout with varying spans
- **Validation**: Apply filters, verify grid still uses getGridSpan pattern

**Property Test 4: Hero Race Selection Logic**
- **Tag**: `Feature: cinematic-masonry-homepage, Property 4: Hero Race Selection Logic`
- **Generator**: Array of races, random filter state (may result in empty filtered array)
- **Property**: For any filter state, hero should show first filtered race or fallback to first overall race
- **Validation**: Apply filters, verify hero displays correct race based on filtered results

**Property Test 5: Navigation Behavior Consistency**
- **Tag**: `Feature: cinematic-masonry-homepage, Property 5: Navigation Behavior Consistency`
- **Generator**: Array of races, random index selection
- **Property**: For any race (hero or card), clicking should trigger navigation with correct race ID
- **Validation**: Simulate clicks, verify navigation calls with correct race IDs

### Integration Tests

Integration tests will verify the complete homepage flow:

- **Full Homepage Render**: Verify all components render together correctly
- **Search and Filter Integration**: Verify search/filter updates hero and grid
- **Navigation Flow**: Verify clicking hero or cards navigates to detail page
- **Responsive Layout**: Verify layout changes at different viewport sizes
- **Performance**: Verify images load efficiently, no layout shift

### Visual Regression Tests

Consider using visual regression testing tools (e.g., Percy, Chromatic) to catch unintended layout changes:

- Hero section appearance at different breakpoints
- Grid layout patterns
- Card hover states
- Empty state display

### Performance Testing

- **Lighthouse Scores**: Target LCP < 2.5s, CLS < 0.1
- **Image Loading**: Verify lazy loading works for off-screen images
- **Bundle Size**: Monitor JavaScript bundle size impact
- **Render Performance**: Verify smooth scrolling with many cards
