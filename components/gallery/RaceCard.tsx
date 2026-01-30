'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Race } from '@/lib/types';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { DLCBadge } from '@/components/shared/DLCBadge';
import { shouldShowDLCBadge } from '@/lib/filterUtils';
import { useAuth } from '@/components/AuthProvider';

interface RaceCardProps {
  race: Race;
  layoutId: string;
  gridSpan: string;
  onClick: () => void;
  priority?: boolean;
}

/**
 * RaceCard component with cinematic AMS2-inspired styling
 * Features: Full-image backgrounds, red accent borders, subtle zoom on hover
 * Optimized with GPU-accelerated properties and reduced motion support
 */
export function RaceCard({ race, layoutId, gridSpan, onClick, priority = false }: RaceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  
  const isCompleted = user?.completedRaces.includes(race.id) || false;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-none cursor-pointer ${gridSpan} group`}
      whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Red accent border - appears on hover */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 bg-red-600 transition-all duration-300 z-20 ${
          isHovered ? 'opacity-100 shadow-[0_0_20px_rgba(220,0,0,0.6)]' : 'opacity-0'
        }`}
      />

      {/* DLC Badge - top-right corner */}
      {shouldShowDLCBadge(race) && (
        <div className="absolute top-3 right-3 z-20">
          <DLCBadge requiredDLC={race.ams2.requiredDLC!} variant="card" />
        </div>
      )}

      {/* Completion Badge - top-left corner */}
      {isCompleted && (
        <div className="absolute top-3 left-3 z-20">
          <div className="flex items-center gap-2 bg-green-600/90 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              Completed
            </span>
          </div>
        </div>
      )}

      {/* Background Image with zoom effect and desaturation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={isHovered && !prefersReducedMotion ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div 
            className="absolute inset-0"
            style={{
              transform: `translate(${race.imageOffsetX || 0}px, ${race.imageOffsetY || 0}px) scale(${race.imageScale || 1})`,
            }}
          >
            <Image
              src={race.heroImage}
              alt={race.title}
              fill
              className="object-cover transition-all duration-300"
              style={{
                filter: isHovered ? 'saturate(1)' : 'saturate(0.8)',
                objectPosition: race.imagePosition || 'center center',
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          </div>
        </motion.div>
      </div>

      {/* Scanline animation on hover */}
      {isHovered && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            width: '50%',
          }}
        />
      )}

      {/* Gradient overlay for text readability - lighter version */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end p-3 md:p-5">
        {/* Vehicle Class Tag - AMS2 skewed style */}
        <div className="mb-3">
          <div className="inline-block skew-ams2 bg-red-600/90 px-3 py-1 shadow-lg">
            <span className="skew-ams2-content text-white font-bold text-xs uppercase tracking-[0.2em]">
              {race.ams2.vehicleClassName}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl md:text-2xl lg:text-3xl tracking-wider uppercase mb-2 text-white drop-shadow-2xl">
          {race.title}
        </h3>

        {/* Driver and Year */}
        <div className="flex items-center gap-3 mb-3">
          <p className="text-accent-yellow text-base md:text-lg font-semibold drop-shadow-lg">
            {race.driver}
          </p>
          <span className="text-text-secondary text-sm">•</span>
          <p className="text-text-secondary text-sm md:text-base uppercase tracking-wider">
            {race.year}
          </p>
        </div>

        {/* Track and Date Labels - HUD style */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="hud-label">TRACK</span>
            <span className="text-text-secondary text-xs uppercase tracking-wide">
              {race.raceContext.circuit.split(',')[0]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hud-label">DATE</span>
            <span className="text-text-secondary text-xs uppercase tracking-wide">
              {new Date(race.ams2.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {race.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-black/80 backdrop-blur-sm border border-red-900/50 text-text-secondary uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
