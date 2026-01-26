# Implementation Plan: AMS2 Iconic Races

## Overview

This implementation plan breaks down the AMS2 Iconic Races application into discrete, incremental coding tasks. Each task builds on previous work, starting with project setup and foundational components, then progressing through the gallery interface, race detail views, and finally polish and optimization.

## Tasks

- [x] 1. Initialize Next.js project with TypeScript and core dependencies
  - Create Next.js 14+ project with App Router and TypeScript
  - Install dependencies: tailwindcss, framer-motion, lucide-react, zod, fast-check, vitest, @testing-library/react
  - Configure Tailwind with custom theme (colors, fonts, glassmorphism utilities)
  - Set up font imports (Geist Sans, Russo One)
  - Create global styles with aurora gradients and noise texture
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 2. Create data layer and type definitions
  - [x] 2.1 Create data/races.json with mock race data
    - Add two race entries using actual AMS2 IDs (Senna Donington 1993, Clark Spa 1970)
    - Use real track IDs, vehicle IDs, vehicle class IDs, and weather IDs from AMS2 data files
    - _Requirements: 8.1, 8.6_
  
  - [x] 2.2 Define TypeScript interfaces for Race, AMS2Setup, and WeatherSlot
    - Create types matching the JSON structure with AMS2 IDs
    - Include trackId, trackName, vehicleClassId, vehicleClassName, vehicleId, vehicleName
    - Include weatherId and weatherName in WeatherSlot
    - _Requirements: 8.2, 8.3, 8.4_
  
  - [x] 2.3 Implement data loading functions with Zod validation
    - Create lib/raceData.ts with getAllRaces() and getRaceById()
    - Add schema validation using Zod for all AMS2 fields
    - _Requirements: 8.5_
  
  - [ ]* 2.4 Write property test for schema validation
    - **Property 3: Schema Validation**
    - **Validates: Requirements 8.2, 8.3, 8.4, 8.5**

- [x] 3. Build shared UI components and utilities
  - [x] 3.1 Set up Shadcn/UI base components
    - Initialize Shadcn/UI and add button, card components
    - _Requirements: 6.4_
  
  - [x] 3.2 Create AuroraBackground component
    - Implement animated gradient background with Framer Motion
    - _Requirements: 6.3_
  
  - [x] 3.3 Create NoiseTexture component
    - Add subtle grain overlay effect
    - _Requirements: 6.3_
  
  - [x] 3.4 Create BackButton component
    - Implement navigation button with hover animations
    - _Requirements: 10.1, 10.2_
  
  - [ ]* 3.5 Write property test for navigation behavior
    - **Property 6: Navigation Behavior**
    - **Validates: Requirements 2.1, 10.2, 10.5**

- [x] 4. Implement gallery page components
  - [x] 4.1 Create BentoGrid component with responsive layout
    - Implement CSS Grid with asymmetric pattern (2x2, 1x1, 2x1 repeating)
    - Add responsive breakpoints (mobile: 1 col, tablet: 2 col, desktop: 3+ col)
    - _Requirements: 1.1, 9.1, 9.2, 9.3, 9.4_
  
  - [x] 4.2 Create RaceCard component with 3D tilt and hover effects
    - Implement card structure with hero image, title, driver, year, tags
    - Add 3D tilt effect on mouse move
    - Add animated border glow on hover
    - Add Framer Motion layoutId for shared layout animation
    - Apply glassmorphism styling
    - _Requirements: 1.2, 1.3, 1.4, 7.1_
  
  - [x] 4.3 Build gallery page (app/page.tsx)
    - Load race data using getAllRaces()
    - Render BentoGrid with RaceCard components
    - Add click handlers for navigation to race detail
    - _Requirements: 1.5, 2.1_
  
  - [ ]* 4.4 Write property tests for gallery rendering
    - **Property 1: Complete Race Data Rendering**
    - **Property 7: Consistent Glassmorphism Styling**
    - **Property 10: Responsive Grid Adaptation**
    - **Validates: Requirements 1.2, 1.3, 9.1**
  
  - [ ]* 4.5 Write unit tests for gallery edge cases
    - Test empty race array
    - Test single race
    - Test hover interactions

- [x] 5. Checkpoint - Verify gallery functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement race detail page structure
  - [x] 6.1 Create race detail page (app/race/[id]/page.tsx)
    - Implement dynamic route with race ID parameter
    - Load race data using getRaceById()
    - Add 404 handling for invalid race IDs
    - Implement shared layout animation container with layoutId
    - _Requirements: 2.2, 2.5_
  
  - [x] 6.2 Create RaceDetailView component
    - Implement full-screen container with scroll
    - Add BackButton component
    - Add animated page header with race title, driver, year
    - _Requirements: 2.2, 7.2_
  
  - [ ]* 6.3 Write property test for data retrieval
    - **Property 2: Data Loading and Retrieval**
    - **Validates: Requirements 1.5, 2.5**

- [x] 7. Build race detail content sections
  - [x] 7.1 Create StorySection component
    - Display "THE STORY" header with accent styling
    - Render race description with proper typography
    - Implement scrollytelling animation (fade in on scroll)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 7.2 Create SetupSection component
    - Display "THE SETUP" header with accent styling
    - Render AMS2 configuration in grid layout (trackName, vehicleClassName, vehicleName, date, time)
    - Apply glassmorphism styling
    - _Requirements: 4.1, 4.2, 4.4, 4.5_
  
  - [x] 7.3 Create WeatherTimeline component
    - Generate gradient from weather slot colors using weatherName
    - Render weather markers with icons (using Lucide React) based on weatherName
    - Display weather name labels
    - Support all AMS2 weather types (Clear, LightCloud, Rain, Storm, Foggy, etc.)
    - Apply glassmorphism styling
    - _Requirements: 4.3_
  
  - [x] 7.4 Create MediaSection component
    - Display "WATCH THE RACE" header
    - Conditionally render YouTube iframe or hero image
    - Implement scrollytelling animation
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 7.5 Wire all sections into RaceDetailView
    - Ensure sections appear in correct order (Story, Setup, Media)
    - _Requirements: 2.3_
  
  - [ ]* 7.6 Write property tests for race detail components
    - **Property 4: Weather Slot Rendering**
    - **Property 5: Conditional Media Rendering**
    - **Property 8: Scroll-Triggered Animations**
    - **Property 11: Component Structure Ordering**
    - **Validates: Requirements 2.3, 4.3, 5.2, 5.3**
  
  - [ ]* 7.7 Write unit tests for section components
    - Test StorySection with long descriptions
    - Test SetupSection with all fields
    - Test WeatherTimeline with varying slot counts
    - Test MediaSection with and without YouTube ID

- [x] 8. Checkpoint - Verify race detail functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement animations and polish
  - [x] 9.1 Add page transition animations
    - Implement enter/exit animations for route changes
    - Ensure smooth shared layout transitions from card to detail
    - _Requirements: 7.2, 7.3_
  
  - [x] 9.2 Configure animation performance optimizations
    - Ensure all animations use GPU-accelerated properties (transform, opacity)
    - Add will-change hints where appropriate
    - Implement reduced motion support
    - _Requirements: 11.4_
  
  - [x] 9.3 Add loading states and skeletons
    - Create RaceCardSkeleton component
    - Add loading states to gallery and detail pages
    - _Requirements: 1.1_
  
  - [ ]* 9.4 Write property tests for animation configuration
    - **Property 9: Framer Motion Animation Configuration**
    - **Property 13: GPU-Accelerated Animations**
    - **Property 14: Theme Color Consistency**
    - **Validates: Requirements 7.1, 7.4, 11.4**

- [x] 10. Optimize images and performance
  - [x] 10.1 Add placeholder hero images
    - Create placeholder images for the two races in public/images/
    - _Requirements: 1.2_
  
  - [x] 10.2 Implement Next.js Image optimization
    - Replace all img tags with Next.js Image component
    - Configure lazy loading for off-screen images
    - Add proper width/height attributes
    - _Requirements: 11.1, 11.2_
  
  - [ ]* 10.3 Write property test for image optimization
    - **Property 12: Image Optimization**
    - **Validates: Requirements 11.1, 11.2**

- [x] 11. Configure deployment
  - [x] 11.1 Create Vercel configuration
    - Add vercel.json if needed for custom configuration
    - Verify next.config.js has proper settings
    - _Requirements: 12.1, 12.3_
  
  - [x] 11.2 Add README with deployment instructions
    - Document how to run locally
    - Document how to deploy to Vercel
    - _Requirements: 12.1_

- [x] 12. Final checkpoint - End-to-end verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: data layer → shared components → gallery → detail pages → polish
