'use client'

import { motion } from 'framer-motion'
import type { AMS2Setup } from '@/lib/types'

interface SetupSectionProps {
  ams2: AMS2Setup
}

interface SetupItemProps {
  label: string
  value: string
}

function SetupItem({ label, value }: SetupItemProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-text-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="text-lg md:text-xl text-text-primary font-medium">
        {value}
      </p>
    </div>
  )
}

export function SetupSection({ ams2 }: SetupSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-effect p-6 md:p-8 rounded-lg space-y-8"
    >
      <h2 className="font-display text-4xl md:text-6xl text-accent-yellow tracking-wider uppercase">
        THE SETUP
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <SetupItem label="Track" value={ams2.trackName} />
        <SetupItem label="Vehicle Class" value={ams2.vehicleClassName} />
        <SetupItem label="Vehicle" value={ams2.vehicleName} />
        <SetupItem label="Date" value={ams2.date} />
        <SetupItem label="Time" value={ams2.time} />
        <SetupItem label="AI Opponents" value={ams2.aiCount.toString()} />
        <SetupItem label="Race Length" value={ams2.raceLength} />
      </div>
      
      {/* Weather Configuration */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-xl md:text-2xl font-display text-accent-red tracking-wider uppercase">
          Weather Progression
        </h3>
        
        <div className="space-y-3">
          {ams2.weather.map((slot) => (
            <div 
              key={slot.slot}
              className="flex items-center justify-between p-3 bg-black/30 rounded border border-white/10"
            >
              <div className="flex items-center gap-4">
                <span className="text-text-muted text-sm font-mono">
                  Slot {slot.slot}
                </span>
                <span className="text-text-primary font-medium">
                  {slot.weatherName}
                </span>
              </div>
              <span className="text-text-muted text-xs font-mono">
                ID: {slot.weatherId}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
