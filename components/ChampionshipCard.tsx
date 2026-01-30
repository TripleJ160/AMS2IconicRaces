'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface Championship {
  id: string;
  title: string;
  description: string;
  raceIds: string[];
  imageUrl?: string;
}

interface ChampionshipCardProps {
  championship: Championship;
  onClick: () => void;
}

/**
 * ChampionshipCard component displaying championship info with progress tracking
 * Shows progress bar for authenticated users, 0% for visitors
 */
export function ChampionshipCard({ championship, onClick }: ChampionshipCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();

  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!user) return 0;
    
    const completedCount = championship.raceIds.filter(raceId =>
      user.completedRaces.includes(raceId)
    ).length;
    
    return Math.round((completedCount / championship.raceIds.length) * 100);
  };

  const progressPercentage = calculateProgress();
  const completedCount = user
    ? championship.raceIds.filter(raceId => user.completedRaces.includes(raceId)).length
    : 0;

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-900/50 backdrop-blur-sm border border-gray-800"
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
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

      {/* Optional Hero Image */}
      {championship.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={isHovered && !prefersReducedMotion ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Image
              src={championship.imageUrl}
              alt={championship.title}
              fill
              className="object-cover transition-all duration-300"
              style={{
                filter: isHovered ? 'saturate(1)' : 'saturate(0.8)',
              }}
            />
          </motion.div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors duration-300">
          {championship.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {championship.description}
        </p>

        {/* Race Count */}
        <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span>
            {championship.raceIds.length} {championship.raceIds.length === 1 ? 'race' : 'races'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-bold">
              {completedCount}/{championship.raceIds.length} ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Completion Badge */}
        {progressPercentage === 100 && (
          <div className="mt-4 flex items-center gap-2 text-green-500 text-sm font-bold">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Championship Complete!</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
