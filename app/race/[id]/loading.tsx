'use client'

import { motion } from 'framer-motion'
import { BackButton } from '@/components/shared/BackButton'

/**
 * Loading state for the race detail page
 * Displays skeleton content while race data is being loaded
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background-primary">
      <BackButton />
      
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Header skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-16 space-y-6"
        >
          {/* Title skeleton */}
          <div className="h-20 md:h-32 bg-text-muted/20 rounded w-3/4 animate-pulse" />
          
          {/* Metadata skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-8 bg-accent-yellow/20 rounded w-32 animate-pulse" 
                 style={{ animationDelay: '0.1s' }} />
            <div className="h-8 w-8 bg-text-secondary/20 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.2s' }} />
            <div className="h-8 bg-text-secondary/20 rounded w-24 animate-pulse" 
                 style={{ animationDelay: '0.3s' }} />
          </div>
          
          {/* Tags skeleton */}
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-text-muted/20 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.4s' }} />
            <div className="h-8 w-16 bg-text-muted/20 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.5s' }} />
            <div className="h-8 w-24 bg-text-muted/20 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.6s' }} />
          </div>
        </motion.div>

        {/* Content sections skeleton */}
        <div className="space-y-20">
          {/* Story section skeleton */}
          <div className="space-y-6">
            <div className="h-12 bg-accent-red/20 rounded w-48 animate-pulse" />
            <div className="space-y-3">
              <div className="h-6 bg-text-muted/20 rounded w-full animate-pulse" 
                   style={{ animationDelay: '0.1s' }} />
              <div className="h-6 bg-text-muted/20 rounded w-11/12 animate-pulse" 
                   style={{ animationDelay: '0.2s' }} />
              <div className="h-6 bg-text-muted/20 rounded w-10/12 animate-pulse" 
                   style={{ animationDelay: '0.3s' }} />
            </div>
          </div>

          {/* Setup section skeleton */}
          <div className="glass-effect p-8 rounded-lg space-y-6">
            <div className="h-12 bg-accent-yellow/20 rounded w-48 animate-pulse" />
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-text-muted/20 rounded w-24 animate-pulse" 
                       style={{ animationDelay: `${i * 0.1}s` }} />
                  <div className="h-6 bg-text-muted/20 rounded w-full animate-pulse" 
                       style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Media section skeleton */}
          <div className="space-y-6">
            <div className="h-12 bg-accent-red/20 rounded w-64 animate-pulse" />
            <div className="aspect-video glass-effect rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
