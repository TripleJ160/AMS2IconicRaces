'use client'

import { 
  Sun, 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudLightning, 
  CloudFog,
  Haze,
  type LucideIcon
} from 'lucide-react'
import type { WeatherSlot } from '@/lib/types'

interface WeatherTimelineProps {
  slots: WeatherSlot[]
}

// Weather name to color mapping (based on AMS2 weather types)
const weatherColors: Record<string, string> = {
  'Clear': '#ffd700',
  'LightCloud': '#a3a3a3',
  'MediumCloud': '#8a8a8a',
  'HeavyCloud': '#737373',
  'Overcast': '#5a5a5a',
  'LightRain': '#4a90e2',
  'Rain': '#2563eb',
  'Storm': '#1e3a8a',
  'ThunderStorm': '#312e81',
  'Foggy': '#9ca3af',
  'FogWithRain': '#6b7280',
  'HeavyFog': '#4b5563',
  'HeavyFogWithRain': '#374151',
  'Hazy': '#d1d5db',
  'Random': '#737373',
}

// Weather name to icon mapping (using Lucide React)
const weatherIcons: Record<string, LucideIcon> = {
  'Clear': Sun,
  'LightCloud': Cloud,
  'MediumCloud': Cloud,
  'HeavyCloud': CloudDrizzle,
  'Overcast': CloudDrizzle,
  'LightRain': CloudRain,
  'Rain': CloudRain,
  'Storm': CloudLightning,
  'ThunderStorm': CloudLightning,
  'Foggy': CloudFog,
  'FogWithRain': CloudRain,
  'HeavyFog': CloudFog,
  'HeavyFogWithRain': CloudRain,
  'Hazy': Haze,
  'Random': Cloud,
}

function generateGradient(slots: WeatherSlot[]): string {
  if (slots.length === 0) return 'transparent'
  if (slots.length === 1) {
    const color = weatherColors[slots[0].weatherName] || '#737373'
    return color
  }

  const stops = slots.map((slot, index) => {
    const position = (index / (slots.length - 1)) * 100
    const color = weatherColors[slot.weatherName] || '#737373'
    return `${color} ${position}%`
  })
  
  return `linear-gradient(90deg, ${stops.join(', ')})`
}

export function WeatherTimeline({ slots }: WeatherTimelineProps) {
  if (slots.length === 0) return null

  const gradient = generateGradient(slots)

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl md:text-2xl font-display text-text-primary tracking-wider uppercase">
        WEATHER PROGRESSION
      </h3>
      
      {/* Timeline bar */}
      <div className="relative h-16 rounded-full overflow-hidden glass-effect">
        <div 
          className="absolute inset-0"
          style={{ background: gradient }}
        />
        
        {/* Weather slot markers */}
        {slots.map((slot, index) => {
          const Icon = weatherIcons[slot.weatherName] || Cloud
          const position = slots.length === 1 ? 50 : (index / (slots.length - 1)) * 100
          
          return (
            <div 
              key={slot.slot}
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            >
              <div className="h-full w-px bg-white/30" />
              <div className="absolute top-full mt-2 flex flex-col items-center">
                <Icon className="w-6 h-6 text-white" />
                <p className="text-xs text-text-secondary mt-1 whitespace-nowrap">
                  {slot.weatherName}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
