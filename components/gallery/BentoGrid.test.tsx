import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getGridSpan } from './BentoGrid';

describe('BentoGrid - Grid Span Pattern', () => {
  describe('Property 1: Uniform Grid Pattern', () => {
    it('should return uniform 1x1 grid spans for all cards', () => {
      // Tag: Feature: uniform-grid, Property 1: Uniform Grid Pattern
      // Validates: All cards should have consistent 1x1 sizing
      
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (raceCount) => {
            // Generate grid spans for the race array
            const gridSpans = Array.from({ length: raceCount }, (_, index) => 
              getGridSpan(index)
            );
            
            // All spans should be uniform 1x1
            const allUniform = gridSpans.every(span => 
              span === 'col-span-1 row-span-1'
            );
            
            return allUniform;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
