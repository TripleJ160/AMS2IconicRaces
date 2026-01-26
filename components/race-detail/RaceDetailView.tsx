'use client'

import Image from 'next/image'
import { BackButton } from '@/components/shared/BackButton'
import { StorySection } from './StorySection'
import { RaceContextSection } from './RaceContextSection'
import { SetupSection } from './SetupSection'
import { MediaSection } from './MediaSection'
import type { Race } from '@/lib/types'

interface RaceDetailViewProps {
  race: Race
}

export function RaceDetailView({ race }: RaceDetailViewProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background-primary">
      <BackButton />
      
      <div className="relative container mx-auto px-4 py-20 max-w-6xl min-h-screen">
        {/* Hero Image Section */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-12">
          <Image
            src={race.heroImage}
            alt={race.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          />
          {/* Lighter gradient overlay for better image visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wider uppercase mb-4 drop-shadow-2xl">
              {race.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xl md:text-2xl">
              <p className="text-accent-yellow drop-shadow-lg">
                {race.driver}
              </p>
              
              <span className="text-text-secondary">
                •
              </span>
              
              <p className="text-text-secondary">
                {race.year}
              </p>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {race.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-20">
          <StorySection description={race.description} />
          <RaceContextSection context={race.raceContext} />
          <SetupSection ams2={race.ams2} />
          <MediaSection 
            youtubeId={race.youtubeId} 
            heroImage={race.heroImage}
            title={race.title}
          />
        </div>
      </div>
    </div>
  )
}
