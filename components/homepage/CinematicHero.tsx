'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Race } from '@/lib/types';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface CinematicHeroProps {
  race: Race;
  onClick: () => void;
}

/**
 * CinematicHero component - Full-bleed immersive hero section
 * Features: 80vh height, dramatic typography, gradient overlay, priority image loading
 * Implements Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.3, 6.4
 */
export function CinematicHero({ race, onClick }: CinematicHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="h-[50vh] md:h-[55vh] lg:h-[60vh] relative overflow-hidden w-full cursor-pointer"
      onClick={onClick}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${race.title} - ${race.driver}, ${race.year}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Featured Race Label - positioned to avoid sidebar */}
      <div className="absolute top-6 left-6 md:left-8 z-10">
        <div className="skew-ams2 bg-red-600 px-4 py-2 shadow-lg">
          <span className="skew-ams2-content text-white font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
            Featured Race of the Week
          </span>
        </div>
      </div>

      {/* Background Image with priority loading */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute"
          style={{
            width: `${(race.imageScale || 1) * 100}%`,
            height: `${(race.imageScale || 1) * 150}%`,
            left: `calc(50% + ${race.imageOffsetX || 0}px)`,
            top: `calc(50% + ${race.imageOffsetY || 0}px)`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Image
            src={race.heroImage}
            alt={`${race.title} - ${race.driver} at ${race.raceContext.circuit}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            style={{
              objectPosition: race.imagePosition || 'center center',
            }}
          />
        </div>
      </div>

      {/* Gradient overlay for text readability - lighter version */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Title overlay positioned at bottom-left */}
      <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 w-full">
        {/* Vehicle Class Tag */}
        <motion.div
          className="mb-4 md:mb-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="inline-block skew-ams2 bg-red-600/90 px-4 py-2 shadow-lg">
            <span className="skew-ams2-content text-white font-bold text-sm md:text-base uppercase tracking-[0.2em]">
              {race.ams2.vehicleClassName}
            </span>
          </div>
        </motion.div>

        {/* Race Title - Dramatic typography */}
        <motion.h1
          className="font-display text-[48px] md:text-[64px] lg:text-[80px] tracking-wider uppercase mb-4 md:mb-6 text-white drop-shadow-2xl leading-none"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          {race.title}
        </motion.h1>

        {/* Driver name and year metadata */}
        <motion.div
          className="flex items-center gap-4 md:gap-6 flex-wrap"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <p className="text-accent-yellow text-2xl md:text-3xl lg:text-4xl font-semibold drop-shadow-lg">
            {race.driver}
          </p>
          <span className="text-text-secondary text-xl md:text-2xl" aria-hidden="true">•</span>
          <p className="text-text-secondary text-xl md:text-2xl lg:text-3xl uppercase tracking-wider">
            {race.year}
          </p>
        </motion.div>

        {/* Circuit information */}
        <motion.div
          className="mt-4 md:mt-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3">
            <span className="hud-label text-sm md:text-base">CIRCUIT</span>
            <span className="text-text-secondary text-base md:text-lg uppercase tracking-wide">
              {race.raceContext.circuit.split(',')[0]}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
