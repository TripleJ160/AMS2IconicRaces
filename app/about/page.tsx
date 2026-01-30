'use client';

import { NoiseTexture } from '@/components/shared/NoiseTexture';
import { BackButton } from '@/components/shared/BackButton';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <NoiseTexture />
      
      <div className="w-full px-6 md:px-8 pt-8">
        <BackButton />
      </div>

      <div className="w-full px-6 md:px-8 pt-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            About AMS2 Iconic Races
          </h1>

          {/* About the Project */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-accent-yellow mb-4">About This Project</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                AMS2 Iconic Races is an <strong className="text-white">unofficial fan-made website</strong> dedicated 
                to celebrating motorsport history through Automobilista 2. I created this project as a racing 
                enthusiast with the goal of recreating legendary racing moments in the most authentic way possible.
              </p>
              <p>
                I meticulously research each race scenario, matching historical conditions, weather, 
                circuits, and vehicle specifications to help you experience these iconic moments as they 
                happened. Whether it&apos;s Senna&apos;s masterclass at Donington in the rain or the dramatic 2012 
                season finale at Interlagos, every detail matters.
              </p>
              <p>
                This is a <strong className="text-white">community-driven platform</strong> where you can 
                track your progress, discover new races, request additions, and compete on the global 
                leaderboard. I&apos;m constantly expanding the collection based on community feedback.
              </p>
            </div>
          </section>

          {/* About Automobilista 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-accent-yellow mb-4">About Automobilista 2</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                <a 
                  href="https://automobilista.gg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-yellow hover:text-yellow-400 underline transition-colors"
                >
                  Automobilista 2
                </a>
                {' '}is a motorsports simulator developed by{' '}
                <a 
                  href="https://forum.reizastudios.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-yellow hover:text-yellow-400 underline transition-colors"
                >
                  Reiza Studios
                </a>
                . Known for its exceptional physics, authentic Brazilian racing content, and diverse 
                vehicle roster spanning multiple eras of motorsport.
              </p>
              <p className="text-sm text-gray-400 italic">
                This website is not affiliated with, endorsed by, or connected to Reiza Studios or 
                Automobilista 2. All trademarks and copyrights belong to their respective owners.
              </p>
            </div>
          </section>

          {/* Image Credits */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-accent-yellow mb-4">Image Credits</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                The hero images used throughout this site are generated using{' '}
                <strong className="text-white">Google Gemini AI</strong>. I chose this approach for 
                several practical reasons:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-white">Historical span:</strong> The races cover decades of 
                  motorsport history (1950s-2020s), making it challenging to find consistent, 
                  high-quality archival photography
                </li>
                <li>
                  <strong className="text-white">Copyright considerations:</strong> Using historical 
                  racing photography would involve complex licensing and attribution requirements
                </li>
                <li>
                  <strong className="text-white">Visual consistency:</strong> AI generation allows 
                  maintaining a cohesive artistic style across all eras and racing series
                </li>
                <li>
                  <strong className="text-white">Accessibility:</strong> This approach keeps the 
                  project sustainable and freely accessible to all racing fans
                </li>
              </ul>
              <p>
                I respect the incredible work of motorsport photographers past and present. The AI-generated 
                images serve as artistic representations to enhance the user experience, not as replacements 
                for authentic historical documentation.
              </p>
            </div>
          </section>

          {/* Get Involved */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-accent-yellow mb-4">Get Involved</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                Have a legendary race you&apos;d like to see added? Found an error in the setups? 
                Want to contribute? Use the <strong className="text-white">Discovery</strong> page 
                to submit race requests and vote on community suggestions.
              </p>
              <p>
                This project is built by a fan, for fans. Your feedback and contributions help make 
                it better for everyone.
              </p>
            </div>
          </section>

          {/* Support the Project */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-accent-yellow mb-4">Support the Project</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                AMS2 Iconic Races is a passion project that I maintain in my free time. If you find 
                this resource helpful and want to support its continued development, you can buy me 
                a coffee!
              </p>
              <p>
                Your support helps cover server costs, Firebase hosting, and motivates me to keep 
                adding more iconic races and features.
              </p>
              <div className="flex justify-center mt-6">
                <a
                  href="https://buymeacoffee.com/johanusa16d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-accent-yellow hover:bg-accent-yellow/90 text-gray-900 font-bold rounded-lg transition-colors text-lg shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21h18v-2H2v2zm2-8h10V5H4v8zm12 0V5h2a2 2 0 012 2v4a2 2 0 01-2 2h-2z" />
                  </svg>
                  <span>Buy Me a Coffee</span>
                </a>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="border-t border-gray-800 pt-8 mt-12">
            <p className="text-gray-400 text-sm text-center">
              Made with passion for motorsport history and simulation racing
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
