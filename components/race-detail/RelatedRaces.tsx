'use client'

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Race } from '@/lib/types';
import { calculateRelatedRaces } from '@/lib/relatedRaces';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface RelatedRacesProps {
  currentRace: Race;
  allRaces: Race[];
  maxResults?: number;
}

/**
 * RelatedRaces component displays race recommendations based on tag similarity.
 * Features: Mini race cards with thumbnails, responsive grid layout, hover effects.
 * Requirements: 3.1, 3.6
 */
export function RelatedRaces({ currentRace, allRaces, maxResults = 3 }: RelatedRacesProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  // Calculate related races using the tag overlap algorithm
  const relatedRaces = useMemo(
    () => calculateRelatedRaces(currentRace, allRaces, maxResults),
    [currentRace, allRaces, maxResults]
  );

  // Handle empty results - Requirement 3.6
  if (relatedRaces.length === 0) {
    return (
      <section className="w-full py-12" aria-label="Related races">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-8" />
        
        <h2 className="font-display text-3xl md:text-4xl tracking-wider uppercase mb-6 text-white">
          Related Races
        </h2>
        
        <p className="text-text-secondary text-lg">
          No related races found. Explore more races from the home page.
        </p>
      </section>
    );
  }

  // Handler for race navigation
  const handleRaceClick = (raceId: string) => {
    router.push(`/race/${raceId}`);
  };

  return (
    <section className="w-full py-12" aria-label="Related races">
      {/* Section divider - Requirement 3.1 */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-8" />
      
      {/* Section heading - Requirement 3.1 */}
      <h2 className="font-display text-3xl md:text-4xl tracking-wider uppercase mb-8 text-white">
        Related Races
      </h2>

      {/* Responsive grid: 1 column mobile, 3 columns desktop - Requirement 3.6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedRaces.map((race) => (
          <motion.div
            key={race.id}
            className="relative overflow-hidden rounded-lg cursor-pointer group bg-black/40 border border-white/10"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => handleRaceClick(race.id)}
            role="button"
            tabIndex={0}
            aria-label={`View ${race.title} - ${race.driver}, ${race.year}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRaceClick(race.id);
              }
            }}
          >
            {/* Red accent border on hover */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 transition-all duration-300 z-20 
                         opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(220,0,0,0.6)]"
            />

            {/* Thumbnail image - 16:9 aspect ratio - Requirement 3.6 */}
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src={race.heroImage}
                alt={race.title}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:saturate-100"
                style={{
                  filter: 'saturate(0.8)',
                  objectPosition: race.imagePosition || 'center center',
                }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Year badge in corner - Requirement 3.6 */}
              <div className="absolute top-3 right-3">
                <div className="bg-red-600/90 px-3 py-1 backdrop-blur-sm">
                  <span className="text-white font-bold text-xs uppercase tracking-wider">
                    {race.year}
                  </span>
                </div>
              </div>
            </div>

            {/* Title and metadata overlay - Requirement 3.6 */}
            <div className="p-4">
              <h3 className="font-display text-lg md:text-xl tracking-wider uppercase mb-2 text-white 
                           line-clamp-2 group-hover:text-accent-yellow transition-colors duration-300">
                {race.title}
              </h3>
              
              <div className="flex items-center gap-2 text-sm">
                <p className="text-text-secondary">
                  {race.driver}
                </p>
                <span className="text-text-secondary/50">•</span>
                <p className="text-text-secondary/70 text-xs uppercase tracking-wide">
                  {race.raceContext.circuit.split(',')[0]}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
