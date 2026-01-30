'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { getRaceById } from '@/lib/raceData';
import { getChampionshipById, type Championship } from '@/lib/championshipUtils';

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CareerModal Component
 * Displays user's career statistics including total XP, races completed,
 * and a grid of completed race badges
 */
export function CareerModal({ isOpen, onClose }: CareerModalProps) {
  const { user, resetProgress } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [userData, setUserData] = useState<{
    experiencePoints: number;
    completedRaces: string[];
    completedChampionships: string[];
  } | null>(null);

  // Fetch user data from Firestore when modal opens
  useEffect(() => {
    async function fetchUserData() {
      if (!user || !isOpen) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            experiencePoints: data.experiencePoints || 0,
            completedRaces: data.completedRaces || [],
            completedChampionships: data.completedChampionships || [],
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, isOpen]);

  const handleResetProgress = async () => {
    setIsResetting(true);
    try {
      await resetProgress();
      setShowConfirmReset(false);
      // Refresh the modal data
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            experiencePoints: data.experiencePoints || 0,
            completedRaces: data.completedRaces || [],
            completedChampionships: data.completedChampionships || [],
          });
        }
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
      alert('Failed to reset progress. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-background-secondary/95 backdrop-blur-md border border-glass-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="p-6 border-b border-glass-border flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl tracking-wider uppercase text-white">
                My Career
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Your racing journey and achievements
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfirmReset(true)}
                className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                aria-label="Reset progress"
                title="Reset all progress"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6 text-text-secondary hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
              </div>
            ) : userData ? (
              <>
                {/* Stats Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <StatCard
                    label="Total Experience"
                    value={userData.experiencePoints}
                    suffix="XP"
                    icon={<StarIcon />}
                  />
                  <StatCard
                    label="Races Completed"
                    value={userData.completedRaces.length}
                    suffix={userData.completedRaces.length === 1 ? 'Race' : 'Races'}
                    icon={<RaceIcon />}
                  />
                  <StatCard
                    label="Championships Won"
                    value={userData.completedChampionships.length}
                    suffix={userData.completedChampionships.length === 1 ? 'Championship' : 'Championships'}
                    icon={<TrophyIcon />}
                  />
                </section>

                {/* Completed Races Section */}
                <section className="mb-8">
                  <h3 className="font-display text-xl tracking-wider uppercase text-white mb-4">
                    Completed Races
                  </h3>

                  {userData.completedRaces.length === 0 ? (
                    <EmptyState 
                      title="No Races Completed Yet"
                      message="Start your racing journey by browsing the gallery and completing your first iconic race!"
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userData.completedRaces.map((raceId) => (
                        <RaceBadge key={raceId} raceId={raceId} />
                      ))}
                    </div>
                  )}
                </section>

                {/* Completed Championships Section */}
                <section>
                  <h3 className="font-display text-xl tracking-wider uppercase text-white mb-4">
                    Completed Championships
                  </h3>

                  {userData.completedChampionships.length === 0 ? (
                    <EmptyState 
                      title="No Championships Completed Yet"
                      message="Complete all races in a championship to earn 500 bonus XP and unlock this achievement!"
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userData.completedChampionships.map((championshipId) => (
                        <ChampionshipBadge key={championshipId} championshipId={championshipId} />
                      ))}
                    </div>
                  )}
                </section>
              </>
            ) : (
              <div className="text-center py-12 text-text-secondary">
                Failed to load career data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showConfirmReset && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={() => setShowConfirmReset(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="bg-background-secondary border border-red-600/50 rounded-lg shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Reset Progress?</h3>
                  <p className="text-sm text-text-secondary">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-text-secondary mb-6">
                This will reset your experience points to <span className="text-white font-bold">0 XP</span> and 
                remove all <span className="text-white font-bold">{userData?.completedRaces.length || 0} completed races</span>. 
                Your account will return to its default state.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  disabled={isResetting}
                  className="flex-1 px-4 py-2 bg-background-tertiary hover:bg-background-tertiary/80 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  disabled={isResetting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isResetting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    'Reset Progress'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/**
 * StatCard Component
 * Displays a single statistic with icon, label, and value
 */
interface StatCardProps {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, suffix, icon }: StatCardProps) {
  return (
    <div className="bg-background-tertiary/50 border border-glass-border rounded-lg p-6 flex items-center gap-4">
      <div className="w-12 h-12 bg-accent-red/20 rounded-lg flex items-center justify-center text-accent-red">
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-secondary uppercase tracking-wide">
          {label}
        </p>
        <p className="text-3xl font-bold text-white mt-1">
          {value.toLocaleString()}{' '}
          <span className="text-lg text-text-secondary font-normal">
            {suffix}
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * RaceBadge Component
 * Displays a badge for a completed race with image and title
 */
interface RaceBadgeProps {
  raceId: string;
}

function RaceBadge({ raceId }: RaceBadgeProps) {
  const race = getRaceById(raceId);

  if (!race) {
    return (
      <div className="bg-background-tertiary/50 border border-glass-border rounded-lg p-4 text-center text-text-secondary">
        Race not found
      </div>
    );
  }

  return (
    <div className="bg-background-tertiary/50 border border-glass-border rounded-lg overflow-hidden hover:border-accent-red/50 transition-colors group">
      {/* Race Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={race.heroImage}
          alt={race.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-tertiary to-transparent" />
        
        {/* Checkmark Badge */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-accent-red rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Race Info */}
      <div className="p-3">
        <h4 className="text-sm font-semibold text-white truncate">
          {race.title}
        </h4>
        <p className="text-xs text-text-secondary mt-1">
          {race.driver} • {race.year}
        </p>
      </div>
    </div>
  );
}

/**
 * ChampionshipBadge Component
 * Displays a badge for a completed championship with image and title
 */
interface ChampionshipBadgeProps {
  championshipId: string;
}

function ChampionshipBadge({ championshipId }: ChampionshipBadgeProps) {
  const championship = getChampionshipById(championshipId);

  if (!championship) {
    return (
      <div className="bg-background-tertiary/50 border border-glass-border rounded-lg p-4 text-center text-text-secondary">
        Championship not found
      </div>
    );
  }

  return (
    <div className="bg-background-tertiary/50 border border-glass-border rounded-lg overflow-hidden hover:border-accent-red/50 transition-colors group">
      {/* Championship Image */}
      <div className="relative h-40 overflow-hidden">
        {championship.imageUrl ? (
          <img
            src={championship.imageUrl}
            alt={championship.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-red/20 to-background-tertiary flex items-center justify-center">
            <TrophyIcon />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background-tertiary to-transparent" />
        
        {/* Trophy Badge */}
        <div className="absolute top-2 right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>

        {/* 500 XP Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-accent-red/90 backdrop-blur-sm rounded text-xs font-bold text-white">
          +500 XP
        </div>
      </div>

      {/* Championship Info */}
      <div className="p-4">
        <h4 className="text-base font-semibold text-white mb-1">
          {championship.title}
        </h4>
        <p className="text-xs text-text-secondary line-clamp-2">
          {championship.description}
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs text-green-500 font-semibold">
          <svg
            className="w-4 h-4"
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
          <span>Championship Complete</span>
        </div>
      </div>
    </div>
  );
}

/**
 * EmptyState Component
 * Displayed when user has no completed items
 */
interface EmptyStateProps {
  title?: string;
  message?: string;
}

function EmptyState({ title = "No Races Completed Yet", message = "Start your racing journey by browsing the gallery and completing your first iconic race!" }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-20 h-20 bg-background-tertiary/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-10 h-10 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-text-secondary max-w-md mx-auto">
        {message}
      </p>
    </div>
  );
}

// Icon Components
function StarIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function RaceIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
