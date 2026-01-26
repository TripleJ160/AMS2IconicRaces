'use client'

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface HeroSectionProps {
  totalRaces: number;
  totalClasses: number;
}

/**
 * HeroSection component - Engaging homepage introduction
 * Features: glassmorphism styling, responsive text sizing, statistics display
 * Follows cyber-noir aesthetic with accent colors
 */
export function HeroSection({ totalRaces, totalClasses }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      className="w-full px-4 py-8 md:py-12 lg:py-16"
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate="visible"
      variants={prefersReducedMotion ? {} : containerVariants}
      aria-labelledby="hero-title"
    >
      <div className="max-w-5xl mx-auto">
        {/* Glassmorphism Card with subtle red accent */}
        <div className="glass-effect rounded-none border-l-4 border-red-600 p-6 md:p-10 lg:p-12 text-center shadow-[0_0_30px_rgba(220,0,0,0.15)]">
          {/* Title */}
          <motion.h1
            id="hero-title"
            className="font-display text-4xl md:text-5xl lg:text-7xl tracking-wider uppercase mb-4 md:mb-6 text-white"
            variants={prefersReducedMotion ? {} : itemVariants}
          >
            AMS2 Iconic Races
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-text-secondary text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed uppercase tracking-wide"
            variants={prefersReducedMotion ? {} : itemVariants}
          >
            Relive history&apos;s greatest racing moments with exact AMS2 setups
          </motion.p>

          {/* Statistics */}
          <motion.div
            className="flex items-center justify-center gap-4 md:gap-6 flex-wrap"
            variants={prefersReducedMotion ? {} : itemVariants}
            role="group"
            aria-label="Race statistics"
          >
            {/* Total Races */}
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-2xl md:text-3xl lg:text-4xl font-bold" aria-label={`${totalRaces} total races`}>
                {totalRaces}
              </span>
              <span className="hud-label" aria-hidden="true">
                {totalRaces === 1 ? 'Race' : 'Races'}
              </span>
            </div>

            {/* Separator */}
            <span className="text-red-900 text-xl md:text-2xl" aria-hidden="true">•</span>

            {/* Total Classes */}
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-2xl md:text-3xl lg:text-4xl font-bold" aria-label={`${totalClasses} vehicle classes`}>
                {totalClasses}
              </span>
              <span className="hud-label" aria-hidden="true">
                {totalClasses === 1 ? 'Class' : 'Classes'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
