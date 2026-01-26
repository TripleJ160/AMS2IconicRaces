# Implementation Plan: Homepage Search and Filters

## Overview

This implementation plan breaks down the homepage search and filters feature into incremental coding tasks. Each task builds on previous work, with testing integrated throughout to catch errors early. The implementation follows the existing codebase patterns (TypeScript, React, Next.js, Framer Motion, Tailwind CSS).

## Tasks

- [x] 1. Create utility functions and types for filtering
  - Create `lib/filterUtils.ts` with filter logic functions
  - Implement `filterRaces()` function with search and class filter logic
  - Implement `sanitizeSearchQuery()` for input validation
  - Implement `getAvailableClasses()` to extract unique vehicle classes
  - Create TypeScript interfaces: `FilterState`, `FilterActions`
  - _Requirements: 1.2, 1.3, 1.4, 2.3, 2.4, 2.5_

- [ ]* 1.1 Write property test for search filter correctness
  - **Property 1: Search Filter Correctness**
  - **Validates: Requirements 1.2, 1.3, 1.4**

- [ ]* 1.2 Write property test for class filter OR logic
  - **Property 2: Class Filter Correctness (OR Logic)**
  - **Validates: Requirements 2.3, 2.4**

- [ ]* 1.3 Write property test for combined filter AND logic
  - **Property 3: Combined Filter Correctness (AND Logic)**
  - **Validates: Requirements 2.5**

- [ ]* 1.4 Write property test for empty search returns all
  - **Property 4: Empty Search Returns All**
  - **Validates: Requirements 1.5**

- [ ]* 1.5 Write unit tests for filter edge cases
  - Test whitespace-only queries
  - Test special characters in search
  - Test non-existent class filters
  - Test empty race collection
  - _Requirements: 1.2, 1.3, 1.4, 2.3_

- [x] 2. Create SearchBar component
  - Create `components/search/SearchBar.tsx`
  - Implement controlled input with debouncing (150ms)
  - Add search icon (lucide-react) on the left
  - Add clear button that appears when value is non-empty
  - Apply glassmorphism styling (backdrop-blur, semi-transparent bg)
  - Add focus state with accent-red ring
  - Implement responsive sizing
  - _Requirements: 1.1, 1.6, 3.1, 3.2, 8.1_

- [x] 2.1 Write unit tests for SearchBar component

  - Test debounce behavior (150ms delay)
  - Test clear button visibility
  - Test onChange callback
  - Test onClear callback
  - _Requirements: 1.6, 3.1, 3.2_

- [x] 3. Create FilterChip component
  - Create `components/search/FilterChip.tsx`
  - Implement toggle button with active/inactive states
  - Add Framer Motion animations (whileTap scale effect)
  - Style inactive state: semi-transparent, white border
  - Style active state: accent-red bg, yellow text, glow effect
  - Add optional count display
  - Implement responsive touch targets (min 44x44px)
  - _Requirements: 2.2, 2.6, 7.2, 8.5_

- [ ]* 3.1 Write property test for filter toggle idempotence
  - **Property 5: Filter Toggle Idempotence**
  - **Validates: Requirements 2.2, 2.6**

- [ ]* 3.2 Write unit tests for FilterChip component
  - Test active/inactive styling
  - Test onClick callback
  - Test animation behavior
  - _Requirements: 2.2, 7.2_

- [x] 4. Create SearchAndFilterPanel component
  - Create `components/search/SearchAndFilterPanel.tsx`
  - Compose SearchBar and FilterChip components
  - Implement filter list rendering from availableClasses
  - Add "Reset Filters" button (visible when filters active)
  - Add "Clear All" button (visible when search or filters active)
  - Apply glassmorphism container styling
  - Implement responsive layout (stack on mobile, horizontal on desktop)
  - _Requirements: 2.1, 2.7, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 8.4_

- [ ]* 4.1 Write property test for filter count accuracy
  - **Property 10: Filter Count Accuracy**
  - **Validates: Requirements 2.7**

- [ ]* 4.2 Write unit tests for SearchAndFilterPanel
  - Test filter chip rendering
  - Test reset buttons visibility
  - Test callback propagation
  - _Requirements: 2.7, 3.3, 3.4, 3.5_

- [x] 5. Create HeroSection component
  - Create `components/homepage/HeroSection.tsx`
  - Implement title with existing display font (Russo One)
  - Add tagline text with appropriate styling
  - Add statistics display (total races, total classes)
  - Apply glassmorphism card styling
  - Use accent-yellow for statistic numbers
  - Implement responsive text sizing (mobile: text-4xl, desktop: text-7xl)
  - Center layout with responsive padding
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ]* 5.1 Write unit tests for HeroSection
  - Test statistics display with different counts
  - Test responsive rendering
  - _Requirements: 5.3, 5.6_

- [x] 6. Create EmptyState component
  - Create `components/search/EmptyState.tsx`
  - Implement dynamic message based on search query and active filters
  - Add search-x icon from lucide-react
  - Style with glassmorphism card (centered layout)
  - Add "Clear All" button with onClick handler
  - Use accent-yellow for icon
  - Implement responsive sizing
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 6.1 Write property test for empty state visibility
  - **Property 7: Empty State Visibility**
  - **Validates: Requirements 4.1**

- [ ]* 6.2 Write unit tests for EmptyState
  - Test message generation with different filter states
  - Test button callback
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 7. Update HomePage with filtering logic
  - Update `app/page.tsx` to add state management
  - Add useState for searchQuery (string)
  - Add useState for activeFilters (Set<string>)
  - Add useMemo for availableClasses (extract from races)
  - Add useMemo for filteredRaces (apply filterRaces function)
  - Implement handler functions: handleSearchChange, handleSearchClear, handleFilterToggle, handleResetFilters, handleClearAll
  - _Requirements: 1.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 7.1 Write property test for available classes uniqueness
  - **Property 8: Available Classes Uniqueness**
  - **Validates: Requirements 2.1**

- [ ]* 7.2 Write property test for clear all restoration
  - **Property 9: Clear All Restoration**
  - **Validates: Requirements 3.5**

- [x] 8. Integrate components into HomePage layout
  - Add HeroSection at top of page (pass totalRaces and totalClasses)
  - Add SearchAndFilterPanel below HeroSection (pass all filter state and handlers)
  - Update BentoGrid to use filteredRaces instead of all races
  - Add conditional EmptyState rendering (when filteredRaces.length === 0)
  - Maintain existing spacing and container structure
  - _Requirements: 5.1, 6.1, 6.2_

- [ ] 9. Add Framer Motion animations for filtering
  - Wrap BentoGrid with AnimatePresence for exit animations
  - Add layout animation to RaceCard components
  - Implement stagger effect for cards appearing (staggerChildren: 0.05)
  - Add fade-in animation for EmptyState
  - Ensure animations respect prefers-reduced-motion
  - Optimize with layoutId for smooth transitions
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ]* 9.1 Write property test for search debounce timing
  - **Property 6: Search Debounce Timing**
  - **Validates: Requirements 1.6, 9.2**

- [ ]* 9.2 Write unit tests for animation behavior
  - Test AnimatePresence wrapping
  - Test stagger timing
  - Test reduced motion handling
  - _Requirements: 7.4, 7.5, 7.6_

- [x] 10. Checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Verify filtering works correctly in browser
  - Test responsive behavior at mobile, tablet, desktop sizes
  - Verify animations are smooth and performant
  - Check accessibility (keyboard navigation, screen readers)
  - Ask the user if questions arise

- [ ] 11. Add error handling and validation
  - Add race data validation in filterUtils (validateRace function)
  - Add console warnings for invalid race data
  - Add input sanitization in SearchBar (100 char limit, trim whitespace)
  - Add error boundary for race data loading failures
  - Handle empty race collection gracefully
  - _Requirements: 9.1, 9.3, 9.4, 9.5_

- [ ]* 11.1 Write unit tests for error handling
  - Test race data validation
  - Test input sanitization
  - Test empty collection handling
  - Test malformed data handling
  - _Requirements: 9.1, 9.3, 9.4, 9.5_

- [x] 12. Performance optimization
  - Verify useMemo is used for expensive computations (availableClasses, filteredRaces)
  - Verify debouncing is working (150ms delay)
  - Add React.memo to FilterChip if needed
  - Test with large race collections (50+ races)
  - Verify 60fps animation performance
  - Profile and optimize if needed
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ]* 12.1 Write performance tests
  - Test filter execution time with 100+ races (< 100ms)
  - Test debounce effectiveness
  - Test animation frame rate
  - _Requirements: 9.1, 9.2, 9.4_

- [x] 13. Final polish and accessibility
  - Add ARIA labels to search input and filter buttons
  - Ensure keyboard navigation works (Tab, Enter, Space)
  - Test with screen reader
  - Verify color contrast meets WCAG AA standards
  - Add focus indicators for all interactive elements
  - Test with keyboard-only navigation
  - _Requirements: 8.5, 8.6_

- [ ]* 13.1 Write accessibility tests
  - Test ARIA labels presence
  - Test keyboard navigation
  - Test focus management
  - _Requirements: 8.5, 8.6_

- [ ] 14. Final checkpoint - Complete testing and verification
  - Run full test suite (unit + property tests)
  - Manual testing across all breakpoints
  - Verify all requirements are met
  - Check visual consistency with cyber-noir theme
  - Ensure all animations are smooth
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties (min 100 iterations each)
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation
- All components follow existing codebase patterns (TypeScript, Tailwind, Framer Motion)
- Glassmorphism styling maintains cyber-noir aesthetic throughout
