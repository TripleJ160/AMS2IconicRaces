'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const CURRENT_VERSION = '1.1.0';
const STORAGE_KEY = 'ams2-last-seen-version';

interface WhatsNewModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function WhatsNewModal({ isOpen: externalIsOpen, onClose: externalOnClose }: WhatsNewModalProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose !== undefined ? () => {} : setInternalIsOpen;

  useEffect(() => {
    // Only auto-show if not externally controlled
    if (externalIsOpen === undefined) {
      // Check if user has seen this version
      const lastSeenVersion = localStorage.getItem(STORAGE_KEY);
      
      if (lastSeenVersion !== CURRENT_VERSION) {
        // Show modal after a short delay for better UX
        const timer = setTimeout(() => {
          setInternalIsOpen(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [externalIsOpen]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-accent-yellow/20 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-accent-yellow/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                What&apos;s New in v{CURRENT_VERSION}
              </h2>
              <p className="text-accent-yellow font-semibold">Beta Release</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Community Update */}
          <div>
            <h3 className="text-xl font-bold text-accent-yellow mb-3">
              🎉 Community Update
            </h3>
            <p className="text-gray-300 mb-4">
              This release focuses on community engagement and quality of life improvements.
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">
                🗳️ Discovery Page
              </h4>
              <p className="text-gray-300 text-sm">
                Submit race requests, vote on community suggestions, and help shape the future of AMS2 Iconic Races. 
                Add notes for corrections or historical context.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">
                🏎️ 2012 F1 Season Championship
              </h4>
              <p className="text-gray-300 text-sm">
                Relive one of the greatest F1 seasons with 10 iconic races. Seven different winners in the first seven races!
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">
                🎮 DLC Filter Pills
              </h4>
              <p className="text-gray-300 text-sm">
                Easily filter races by base game or DLC content. Find races that match your content library.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">
                ⭐ Improved XP System
              </h4>
              <p className="text-gray-300 text-sm">
                Gallery races now award 200 XP, championship races 100 XP, and completing a championship gives 500 XP bonus.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">
                ℹ️ About Page
              </h4>
              <p className="text-gray-300 text-sm">
                Learn more about the project, AMS2, and how the race cards are created.
              </p>
            </div>
          </div>

          {/* Beta Notice */}
          <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-accent-yellow">Beta Notice:</span> This is a beta release. 
              If you encounter any issues or have suggestions, please use the Discovery page to let me know!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-accent-yellow/20 p-6">
          <button
            onClick={handleClose}
            className="w-full bg-accent-yellow hover:bg-accent-yellow/90 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Got it, let&apos;s race!
          </button>
        </div>
      </div>
    </div>
  );
}
