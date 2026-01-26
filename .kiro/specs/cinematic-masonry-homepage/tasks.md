# Implementation Plan: Cinematic Masonry Homepage

## Overview

This implementation plan transforms the current homepage into a cinematic, full-bleed masonry experience. The work is organized into three main phases: (1) Create the new CinematicHero component, (2) Enhance the BentoGrid layout system, and (3) Refactor the homepage layout to remove container constraints and integrate the new components.

## Tasks

- [x] 1. Create CinematicHero component with full-bleed styling
  - [x] 1.1 Create new component file `components/homepage/CinematicHero.tsx`
    - Implement component with Race prop and onClick handler
    - Add full-bleed container with h-[80vh] and relative positioning
    - Integrate Next.js Image component with fill and object-cover
    - Add gradient overlay (bg-gradient-to-t from-black via-black/60 to-transparent)
    - Position title overlay at bottom-left with responsive typography (text-[60px] md:text-[80px] lg:text-[100px])
    - Include driver name and year metadata
    - Add click handler for navigation
    - Implement accessibility features (ARIA labels, alt text, keyboard support)
    - Apply priority loading to hero image
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.3, 6.4_
  
  - [ ]* 1.2 Write unit tests for CinematicHero component
    - Test component renders with correct race data
    - Test title displays at correct font size
    - Test gradient overlay is applied
    - Test click handler triggers with correct race ID
    - Test height class is h-[80vh]
    - Test image has priority prop
    - Test accessibility attributes are present
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Enhance BentoGrid component for denser masonry layout
  - [x] 2.1 Update BentoGrid component styling
    - Modify grid classes to reduce gaps: gap-2 md:gap-4
    - Add XL breakpoint for 4-column layout: xl:grid-cols-4
    - Adjust auto-row heights: auto-rows-[300px] md:auto-rows-[350px] lg:auto-rows-[400px]
    - Remove any max-width constraints from grid container
    - _Requirements: 2.2, 4.1, 5.1, 5.2, 5.3_
  
  - [x] 2.2 Update getGridSpan function with enhanced 8-card pattern
    - Modify pattern array to include tall cards (1x2): `['md:col-span-2 md:row-span-2', 'md:col-span-1 md:row-span-1', 'md:col-span-1 md:row-span-2', 'md:col-span-1 md:row-span-1', 'md:col-span-2 md:row-span-1', 'md:col-span-1 md:row-span-1', 'md:col-span-1 md:row-span-1', 'md:col-span-2 md:row-span-2']`
    - Update pattern repeat logic to use modulo 8 instead of 6
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 2.3 Write property test for grid span pattern variety

    - **Property 1: Grid Span Pattern Variety**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
    - Generate arrays of 8-20 races
    - Map indices to grid spans using getGridSpan
    - Verify pattern includes at least one wide (col-span-2), one tall (row-span-2), and one large square (col-span-2 row-span-2)
    - Run 100+ iterations
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 2.4 Write unit tests for BentoGrid component
    - Test grid renders correct number of children
    - Test gap classes are gap-2 md:gap-4
    - Test grid column classes at different breakpoints
    - Test getGridSpan returns correct pattern for indices 0-7
    - Test pattern repeats correctly after index 7
    - _Requirements: 3.1, 4.1, 5.1, 5.2, 5.3_

- [x] 3. Refactor homepage layout to remove container constraints
  - [x] 3.1 Update app/page.tsx layout structure
    - Remove outer container with max-w-7xl constraint
    - Move CinematicHero outside any container (full-bleed)
    - Wrap SearchAndFilterPanel in minimal container: px-4 py-8 md:py-12 max-w-[1920px] mx-auto
    - Wrap BentoGrid in minimal container: px-4 max-w-[1920px] mx-auto
    - Update main element to remove py-12 md:py-20 padding
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 3.2 Implement hero race selection logic
    - Create useMemo hook to select featured race
    - Use first filtered race if filteredRaces.length > 0
    - Fallback to first overall race if no filtered results
    - Pass selected race to CinematicHero component
    - _Requirements: 7.3_
  
  - [ ]* 3.3 Write property test for hero race selection logic
    - **Property 4: Hero Race Selection Logic**
    - **Validates: Requirements 7.3**
    - Generate arrays of races and random filter states
    - Apply filters to get filtered results
    - Verify hero shows first filtered race when results exist
    - Verify hero shows first overall race when no filtered results
    - Run 100+ iterations
    - _Requirements: 7.3_

- [x] 4. Integrate CinematicHero with navigation and filtering
  - [x] 4.1 Wire CinematicHero click handler to navigation
    - Pass handleRaceClick callback to CinematicHero
    - Ensure hero navigates to correct race detail page
    - _Requirements: 7.4_
  
  - [x] 4.2 Verify search/filter integration maintains masonry layout
    - Ensure filtered results still render in BentoGrid
    - Verify empty state displays when no results
    - Confirm search panel positioning between hero and grid
    - _Requirements: 7.1, 7.2, 7.5_
  
  - [ ]* 4.3 Write property test for masonry layout preservation
    - **Property 3: Masonry Layout Preservation Across Filter States**
    - **Validates: Requirements 7.1**
    - Generate arrays of races, random search queries, and filter sets
    - Apply filters and render grid
    - Verify grid still uses getGridSpan pattern with varying spans
    - Run 100+ iterations
    - _Requirements: 7.1_
  
  - [ ]* 4.4 Write property test for navigation behavior consistency
    - **Property 5: Navigation Behavior Consistency**
    - **Validates: Requirements 7.4**
    - Generate arrays of races and random index selections
    - Simulate clicks on hero and various cards
    - Verify navigation is called with correct race IDs
    - Run 100+ iterations
    - _Requirements: 7.4_

- [x] 5. Optimize performance and accessibility
  - [x] 5.1 Implement lazy loading for non-hero images
    - Ensure only hero image (index 0) has priority prop
    - Verify all other RaceCard images do not have priority
    - _Requirements: 6.2_
  
  - [x] 5.2 Add responsive behavior for mobile and tablet
    - Test hero height on mobile (may adjust to h-[60vh] on small screens)
    - Verify grid columns adjust correctly at breakpoints
    - Test typography scaling on smaller screens
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 5.3 Verify accessibility compliance
    - Test keyboard navigation through hero and grid
    - Verify ARIA labels on hero section
    - Check color contrast ratios meet WCAG AA
    - Ensure reduced motion preference is respected
    - _Requirements: 6.1, 6.3, 6.4, 6.5_
  
  - [ ]* 5.4 Write property test for lazy loading
    - **Property 2: Lazy Loading for Non-Hero Images**
    - **Validates: Requirements 6.2**
    - Generate arrays of 2-50 races
    - Render race cards
    - Verify only index 0 has priority prop
    - Verify all other indices do not have priority prop
    - Run 100+ iterations
    - _Requirements: 6.2_
  
  - [ ]* 5.5 Write unit tests for accessibility features
    - Test hero has sufficient contrast ratio
    - Test all interactive elements have ARIA labels
    - Test keyboard navigation follows logical order
    - Test reduced motion preference disables animations
    - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [x] 6. Final integration and polish
  - [x] 6.1 Adjust RaceCard padding for denser layout
    - Reduce internal padding: p-3 md:p-5 (from p-4 md:p-6)
    - Test hover effects work well with reduced gaps
    - _Requirements: 4.1_
  
  - [x] 6.2 Test complete homepage flow
    - Verify hero loads and displays correctly
    - Test search and filter updates both hero and grid
    - Verify navigation from hero and cards
    - Test responsive behavior at all breakpoints
    - Verify empty state displays correctly
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 6.3 Write integration tests for complete homepage

    - Test full homepage renders all components
    - Test search/filter integration updates hero and grid
    - Test navigation flow from hero and cards
    - Test responsive layout changes at breakpoints
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7. Checkpoint - Ensure all tests pass and review with user
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples, edge cases, and component behavior
- The implementation maintains existing functionality while adding cinematic visual enhancements
