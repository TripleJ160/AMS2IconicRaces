'use client';

import { RequestForm } from '@/components/RequestForm';
import { VotingBoard } from '@/components/VotingBoard';
import { NoiseTexture } from '@/components/shared/NoiseTexture';

export default function DiscoveryPage() {
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
      <div className="w-full px-6 md:px-8 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Discovery
          </h1>
          <p className="text-lg text-gray-300">
            Help shape the future of AMS2 Iconic Races by suggesting legendary moments, requesting collections, or providing notes on corrections needed for existing race cards.
          </p>
        </div>
      </div>

      {/* Section divider */}
      <div className="w-full px-6 md:px-8 mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
      </div>

      {/* Main Content - Two Column Layout */}
      <div id="main-content" className="w-full px-6 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Request Form Section */}
            <section aria-label="Submit a race request">
              <RequestForm />
            </section>

            {/* Voting Board Section */}
            <section aria-label="Community requests">
              <VotingBoard />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
