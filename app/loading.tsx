'use client'

import { BentoGrid, getGridSpan } from '@/components/gallery/BentoGrid'
import { RaceCardSkeleton } from '@/components/gallery/RaceCardSkeleton'

/**
 * Loading state for the gallery page
 * Displays skeleton cards while race data is being loaded
 */
export default function Loading() {
  // Show 6 skeleton cards (one full pattern cycle)
  const skeletonCount = 6

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="font-display text-6xl md:text-8xl tracking-wider uppercase text-center mb-12">
        AMS2 Iconic Races
      </h1>
      
      <BentoGrid races={[]}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <RaceCardSkeleton
            key={`skeleton-${index}`}
            gridSpan={getGridSpan(index)}
          />
        ))}
      </BentoGrid>
    </main>
  )
}
