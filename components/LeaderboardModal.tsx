'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardEntry {
  uid: string;
  displayName: string | null;
  experiencePoints: number;
  rank: number;
}

/**
 * LeaderboardModal Component
 * Displays the global leaderboard with top 50 users sorted by experience points
 */
export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data from Firestore when modal opens
  useEffect(() => {
    async function fetchLeaderboard() {
      if (!isOpen) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('experiencePoints', 'desc'),
          limit(50)
        );

        const snapshot = await getDocs(usersQuery);
        const entries: LeaderboardEntry[] = snapshot.docs.map((doc, index) => ({
          uid: doc.id,
          displayName: doc.data().displayName || null,
          experiencePoints: doc.data().experiencePoints || 0,
          rank: index + 1,
        }));

        setLeaderboard(entries);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [isOpen]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger re-fetch by toggling a dependency
    fetchLeaderboard();
  };

  async function fetchLeaderboard() {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('experiencePoints', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(usersQuery);
      const entries: LeaderboardEntry[] = snapshot.docs.map((doc, index) => ({
        uid: doc.id,
        displayName: doc.data().displayName || null,
        experiencePoints: doc.data().experiencePoints || 0,
        rank: index + 1,
      }));

      setLeaderboard(entries);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }

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
                Global Leaderboard
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Top 50 Drivers by Experience Points
              </p>
            </div>
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
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-text-secondary mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-accent-red hover:bg-accent-red/80 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-background-tertiary/50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-text-secondary">No drivers on the leaderboard yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-tertiary/50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Experience
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {leaderboard.map((entry) => {
                      const isCurrentUser = user && entry.uid === user.uid;
                      
                      return (
                        <tr
                          key={entry.uid}
                          className={`
                            transition-colors
                            ${isCurrentUser 
                              ? 'bg-accent-red/10 border-l-4 border-accent-red' 
                              : 'hover:bg-background-tertiary/30'
                            }
                          `}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {entry.rank <= 3 ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">
                                    {entry.rank === 1 && '🥇'}
                                    {entry.rank === 2 && '🥈'}
                                    {entry.rank === 3 && '🥉'}
                                  </span>
                                  <span className="text-sm font-bold text-white">
                                    {entry.rank}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm font-medium text-text-secondary">
                                  {entry.rank}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${isCurrentUser ? 'text-white font-bold' : 'text-white'}`}>
                                {entry.displayName || 'Anonymous Driver'}
                              </span>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-accent-red text-white text-xs font-semibold rounded">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${isCurrentUser ? 'text-white' : 'text-text-secondary'}`}>
                              {entry.experiencePoints.toLocaleString()} XP
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
