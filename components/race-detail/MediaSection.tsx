'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface MediaSectionProps {
  youtubeId: string
  heroImage: string
  title: string
}

export function MediaSection({ youtubeId, heroImage, title }: MediaSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-100px' 
  })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : (prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 })}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ willChange: 'transform, opacity' }}
      className="space-y-6"
    >
      <h2 className="font-display text-4xl md:text-6xl text-accent-red tracking-wider uppercase">
        WATCH THE RACE
      </h2>
      
      {youtubeId ? (
        <div className="aspect-video glass-effect overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title={`${title} - Race Video`}
          />
        </div>
      ) : (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image 
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            priority={false}
          />
        </div>
      )}
    </motion.section>
  )
}
