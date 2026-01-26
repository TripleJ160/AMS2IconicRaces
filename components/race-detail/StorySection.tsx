'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface StorySectionProps {
  description: string
}

export function StorySection({ description }: StorySectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-100px' 
  })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : (prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 })}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ willChange: 'transform, opacity' }}
      className="space-y-6"
    >
      <h2 className="font-display text-4xl md:text-6xl text-accent-red tracking-wider uppercase">
        THE STORY
      </h2>
      
      <p className="text-lg md:text-xl leading-relaxed text-text-primary max-w-4xl">
        {description}
      </p>
    </motion.section>
  )
}
