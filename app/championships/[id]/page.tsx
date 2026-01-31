'use client';

import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import championshipsData from '@/data/championships.json';
import { getRaceById } from '@/lib/raceData';
import { useAuth } from '@/components/AuthProvider';
import { RaceCard } from '@/components/gallery/RaceCard';
import { NoiseTexture } from '@/components/shared/NoiseTexture';
import { BackButton } from '@/components/shared/BackButton';
import { LiveryPackCard } from '@/components/shared/LiveryPackCard';
import type { Championship } from '@/lib/types';

interface ChampionshipDetailPageProps {
  params: {
    id: string;
  };
}

export default function ChampionshipDetailPage({ params }: ChampionshipDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const championships = championshipsData as Championship[];

  // Find the championship by ID
  const championship = championships.find((c) => c.id === params.id);

  if (!championship) {
    notFound();
  }

  // Fetch full race data for each race ID
  const races = championship.raceIds
    .map((raceId) => getRaceById(raceId))
    .filter((race) => race !== undefined);

  // Calculate progress
  const completedCount = user
    ? championship.raceIds.filter((raceId) => user.completedRaces.includes(raceId)).length
    : 0;
  const progressPercentage = Math.round((completedCount / championship.raceIds.length) * 100);

  const handleRaceClick = (raceId: string) => {
    router.push(`/race/${raceId}?from=championship`);
  };

  return (
    <main className="min-h-screen">
      {/* Noise texture and vignette overlay */}
      <NoiseTexture />

      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
                   px-4 py-2 bg-accent-red text-white rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-accent-yellow"
      >
        Skip to main content
      </a>

      {/* Back Button */}
      <div className="absolute top-8 left-6 md:left-72 z-40">
        <BackButton />
      </div>

      {/* Hero Image Section */}
      {championship.imageUrl && (
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
          <Image
            src={championship.imageUrl}
            alt={championship.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
                {championship.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Championship Description */}
      <div className="w-full px-6 md:px-8 pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* If no image, show title here */}
          {!championship.imageUrl && (
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {championship.title}
            </h1>
          )}
          
          {/* Description with styled formatting */}
          <div className="max-w-4xl mb-8">
            {championship.description.split('\n\n').map((section, sectionIndex) => {
              // Check if section contains bullet points
              if (section.includes('•')) {
                const lines = section.split('\n');
                const header = lines[0];
                const bullets = lines.slice(1);
                
                return (
                  <div key={sectionIndex} className="mb-6">
                    {/* Section header */}
                    <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                      {header}
                    </p>
                    
                    {/* Bullet points */}
                    <ul className="space-y-3">
                      {bullets.map((bullet, bulletIndex) => {
                        if (!bullet.trim() || !bullet.includes('•')) return null;
                        const text = bullet.replace('•', '').trim();
                        
                        return (
                          <li key={bulletIndex} className="flex items-start gap-3 text-gray-300">
                            <span className="text-accent-yellow text-xl mt-0.5 flex-shrink-0">•</span>
                            <span className="leading-relaxed">{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              } else {
                // Regular paragraph
                return (
                  <p key={sectionIndex} className="text-base text-gray-400 mb-4 leading-relaxed italic">
                    {section}
                  </p>
                );
              }
            })}
          </div>

          {/* Progress Section */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Your Progress</h2>
                <p className="text-gray-400 text-sm">
                  {completedCount} of {championship.raceIds.length} races completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{progressPercentage}%</div>
                {progressPercentage === 100 && (
                  <div className="flex items-center gap-1 text-green-500 text-sm font-bold mt-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Complete!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Livery Pack Section */}
      {championship.liveryPack && (
        <div className="w-full px-6 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <LiveryPackCard liveryPack={championship.liveryPack} />
          </div>
        </div>
      )}

      {/* Section divider */}
      <div className="w-full px-6 md:px-8 mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
      </div>

      {/* Races Grid */}
      <div id="main-content" className="w-full px-6 md:px-8 pb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Championship Races</h2>
        {races.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No races found for this championship.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[400px] md:auto-rows-[450px] lg:auto-rows-[500px]">
            {races.map((race) => (
              <RaceCard
                key={race.id}
                race={race}
                layoutId={`championship-race-${race.id}`}
                gridSpan="col-span-1"
                onClick={() => handleRaceClick(race.id)}
                priority={false}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
