'use client'

/**
 * SiteHeader component - Minimal branding header with glassmorphism
 * Provides site identity separate from the hero content
 */
export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      {/* Background bar with glassmorphism effect */}
      <div className="bg-black/40 backdrop-blur-md px-6 md:px-8 py-4 md:py-6 border-b border-red-900/30">
        <div className="flex items-center justify-between">
          {/* Site branding */}
          <div className="flex items-center gap-3">
            {/* Red accent bar */}
            <div className="w-1 h-8 md:h-10 bg-red-600 shadow-[0_0_10px_rgba(220,0,0,0.6)]" />
            
            {/* Site title */}
            <div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-wider uppercase text-white drop-shadow-2xl">
                AMS2 Iconic Races
              </h1>
              <p className="text-sm md:text-base text-text-secondary uppercase tracking-wide">
                Legendary Moments in Motorsport
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Race label */}
      <div className="absolute left-6 md:left-8 -bottom-12 md:-bottom-14">
        <div className="skew-ams2 bg-red-600 px-4 py-2 shadow-lg">
          <span className="skew-ams2-content text-white font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
            Featured Race of the Week
          </span>
        </div>
      </div>
    </header>
  );
}
