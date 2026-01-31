import type { LiveryPack } from '@/lib/types';

interface LiveryPackCardProps {
  liveryPack: LiveryPack;
  variant?: 'compact' | 'full';
}

/**
 * LiveryPackCard Component
 * Displays livery pack information with download link
 */
export function LiveryPackCard({ liveryPack, variant = 'full' }: LiveryPackCardProps) {
  if (variant === 'compact') {
    return (
      <a
        href={liveryPack.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 bg-accent-yellow hover:bg-accent-yellow/90 text-gray-900 font-semibold rounded-lg transition-colors shadow-lg"
      >
        <DownloadIcon />
        <span>Get Authentic Liveries</span>
      </a>
    );
  }

  return (
    <div className="bg-background-secondary/80 backdrop-blur-sm border border-accent-yellow/30 rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <PaintBrushIcon />
            <h3 className="text-lg font-bold text-accent-yellow">Authentic Liveries Available</h3>
          </div>
          
          <p className="text-white font-semibold mb-1">{liveryPack.name}</p>
          <p className="text-text-secondary text-sm mb-3">
            by <span className="text-white">{liveryPack.author}</span>
          </p>

          {(liveryPack.downloads || liveryPack.rating) && (
            <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
              {liveryPack.downloads && (
                <div className="flex items-center gap-1">
                  <DownloadIcon className="w-4 h-4" />
                  <span>{liveryPack.downloads.toLocaleString()} downloads</span>
                </div>
              )}
              {liveryPack.rating && (
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-accent-yellow" />
                  <span>{liveryPack.rating.toFixed(2)} rating</span>
                </div>
              )}
            </div>
          )}

          <a
            href={liveryPack.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-yellow hover:bg-accent-yellow/90 text-gray-900 font-bold rounded-lg transition-colors text-sm shadow-lg"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Download from Overtake.gg</span>
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Icon Components
function DownloadIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

function PaintBrushIcon() {
  return (
    <svg className="w-5 h-5 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  );
}

function StarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
