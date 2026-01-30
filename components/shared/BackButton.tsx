'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export function BackButton() {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      whileHover={prefersReducedMotion ? {} : { scale: 1.05, x: -5 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      style={{ willChange: 'transform' }}
      className="fixed top-8 left-8 z-40 glass-effect p-4 rounded-full hover:bg-glass-bg transition-colors"
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6 text-text-primary" />
    </motion.button>
  )
}
