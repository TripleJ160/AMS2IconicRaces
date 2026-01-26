import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getGridSpan } from './BentoGrid';

describe('BentoGrid - Grid Span Pattern', () => {
  describe('Property 1: Grid Span Pattern Variety', () => {
    it('should include at least one wide, one tall, and one large square card in any 8-20 race array', () => {
      // Tag: Feature: cinematic-masonry-homepage, Property 1: Grid Span Pattern Variety
      // Validates: Requirements 3.1, 3.2, 3.3, 3.4
      
      fc.assert(
        fc.property(
          fc.integer({ min: 8, max: 20 }),
          (raceCount) => {
            // Generate grid spans for the race array
            const gridSpans = Array.from({ length: raceCount }, (_, index) => 
              getGridSpan(index)
            );
            
            // Check for required span types
            const hasWide = gridSpans.some(span => 
              span.includes('col-span-2') && !span.includes('row-span-2')
            );
            const hasTall = gridSpans.some(span => 
              span.includes('row-span-2') && !span.includes('col-span-2')
            );
            const hasLargeSquare = gridSpans.some(span => 
              span.includes('col-span-2') && span.includes('row-span-2')
            );
            
            // Verify all required types are present
            return hasWide && hasTall && hasLargeSquare;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
