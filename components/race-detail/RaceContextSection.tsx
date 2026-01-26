'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Trophy } from 'lucide-react'
import type { RaceContext } from '@/lib/types'

interface RaceContextSectionProps {
  context: RaceContext
}

const podiumColors = {
  1: 'text-yellow-400', // Gold
  2: 'text-gray-300',   // Silver
  3: 'text-amber-600',  // Bronze
}

export function RaceContextSection({ context }: RaceContextSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-4xl md:text-6xl text-accent-red tracking-wider uppercase">
          RACE CONTEXT
        </h2>
        <a
          href={context.wikipediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-accent-yellow hover:text-accent-red transition-colors px-4 py-2 glass-effect rounded-lg"
        >
          <span className="text-sm md:text-base">Wikipedia</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      {/* Event Details */}
      <div className="glass-effect p-6 md:p-8 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Event</p>
            <p className="text-text-primary text-lg font-medium">{context.event}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Circuit</p>
            <p className="text-text-primary text-lg font-medium">{context.circuit}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Distance</p>
            <p className="text-text-primary text-lg font-medium">{context.distance} ({context.laps} laps)</p>
          </div>
          <div>
            <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Conditions</p>
            <p className="text-text-primary text-lg font-medium">{context.conditions}</p>
          </div>
        </div>
      </div>

      {/* Podium Results */}
      <div className="glass-effect p-6 md:p-8 rounded-lg space-y-4">
        <h3 className="text-xl md:text-2xl font-display text-accent-yellow tracking-wider uppercase flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Podium
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {context.podiumResults.map((result) => (
            <div 
              key={result.position}
              className="p-4 bg-black/30 rounded-lg border border-white/10 text-center"
            >
              <div className={`text-4xl font-bold mb-2 ${podiumColors[result.position as keyof typeof podiumColors]}`}>
                {result.position === 1 ? '🥇' : result.position === 2 ? '🥈' : '🥉'}
              </div>
              <p className="text-text-primary font-bold text-lg mb-1">{result.driver}</p>
              <p className="text-text-muted text-sm mb-1">{result.team}</p>
              <p className="text-accent-yellow text-xs">{result.vehicle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Moments */}
      <div className="glass-effect p-6 md:p-8 rounded-lg space-y-4">
        <h3 className="text-xl md:text-2xl font-display text-accent-yellow tracking-wider uppercase">
          Key Moments
        </h3>
        <ul className="space-y-3">
          {context.keyMoments.map((moment, index) => (
            <li 
              key={index}
              className="flex gap-3 text-text-primary"
            >
              <span className="text-accent-red font-bold">•</span>
              <span>{moment}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Significance */}
      <div className="glass-effect p-6 md:p-8 rounded-lg">
        <h3 className="text-xl md:text-2xl font-display text-accent-yellow tracking-wider uppercase mb-4">
          Historical Significance
        </h3>
        <p className="text-text-primary text-lg leading-relaxed">
          {context.significance}
        </p>
      </div>
    </motion.section>
  )
}
