'use client'

import { motion } from 'framer-motion'

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 50% at 50% -20%,
              rgba(220, 0, 0, 0.15),
              transparent
            ),
            radial-gradient(
              ellipse 60% 40% at 80% 80%,
              rgba(255, 215, 0, 0.1),
              transparent
            ),
            #0a0a0a
          `,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
