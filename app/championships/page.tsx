'use client';

import { useRouter } from 'next/navigation';
import championshipsData from '@/data/championships.json';
import { ChampionshipCard } from '@/components/ChampionshipCard';
import { NoiseTexture } from '@/components/shared/NoiseTexture';

interface Championship {
  id: string;
  title: string;
  description: string;
  raceIds: string[];
  imageUrl?: string;
}

export default function ChampionshipsPage() {
  const router = useRouter();
  const championships = championshipsData as Championship[];

  const handleChampionshipClick = (championshipId: string) => {
    router.push(`/championships/${championshipId}`);
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

      {/* Page Header */}
      <div className="w-full px-6 md:px-8 pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Championships
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-3">
            Curated collections of legendary races. Complete championships to track your progress
            through motorsport history.
          </p>
          <p className="text-sm text-gray-400 max-w-3xl italic">
            Note: Some tracks are not available in AMS2, so certain races have been adapted to similar circuits to simulate the championship experience.
          </p>
        </div>
      </div>

      {/* Section divider */}
      <div className="w-full px-6 md:px-8 mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
      </div>

      {/* Championships Grid */}
      <div id="main-content" className="w-full px-6 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {championships.map((championship) => (
              <ChampionshipCard
                key={championship.id}
                championship={championship}
                onClick={() => handleChampionshipClick(championship.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
