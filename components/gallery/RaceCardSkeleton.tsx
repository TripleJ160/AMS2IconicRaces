'use client'

import { motion } from 'framer-motion'

interface RaceCardSkeletonProps {
  gridSpan: string
}

/**
 * RaceCardSkeleton component displays a loading placeholder
 * with pulsing animation while race data is being loaded
 */
export function RaceCardSkeleton({ gridSpan }: RaceCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative overflow-hidden rounded-lg ${gridSpan}`}
    >
      <div className="glass-effect p-6 flex flex-col justify-end h-full min-h-[300px]">
        {/* Animated background pulse */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-secondary to-background-tertiary animate-pulse" />
        
        {/* Content skeleton */}
        <div className="relative space-y-3">
          {/* Title skeleton */}
          <div className="h-8 bg-text-muted/20 rounded w-3/4 animate-pulse" />
          
          {/* Driver skeleton */}
          <div className="h-6 bg-accent-yellow/20 rounded w-1/2 animate-pulse" 
               style={{ animationDelay: '0.1s' }} />
          
          {/* Year skeleton */}
          <div className="h-5 bg-text-secondary/20 rounded w-1/4 animate-pulse" 
               style={{ animationDelay: '0.2s' }} />
          
          {/* Tags skeleton */}
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-16 bg-text-muted/20 rounded animate-pulse" 
                 style={{ animationDelay: '0.3s' }} />
            <div className="h-6 w-20 bg-text-muted/20 rounded animate-pulse" 
                 style={{ animationDelay: '0.4s' }} />
            <div className="h-6 w-24 bg-text-muted/20 rounded animate-pulse" 
                 style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
