'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  runTransaction,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Request {
  id: string;
  userId: string;
  raceTitle: string;
  driver: string;
  year: number;
  wikipediaLink: string;
  notes?: string | null;
  votes: number;
  upvotedBy: string[];
}

export function VotingBoard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingVotes, setProcessingVotes] = useState<Set<string>>(new Set());
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Fetch requests from Firestore ordered by votes descending
  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'requests'),
      orderBy('votes', 'desc')
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const requestsData: Request[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Request));
        setRequests(requestsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching requests:', err);
        setError('Failed to load community requests. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle upvote toggle using Firestore transaction
  const handleToggleUpvote = async (requestId: string) => {
    if (!user) return;

    // Prevent duplicate submissions
    if (processingVotes.has(requestId)) return;

    setProcessingVotes((prev) => new Set(prev).add(requestId));

    try {
      const requestRef = doc(db, 'requests', requestId);

      await runTransaction(db, async (transaction) => {
        const requestDoc = await transaction.get(requestRef);

        if (!requestDoc.exists()) {
          throw new Error('Request not found');
        }

        const data = requestDoc.data();
        const hasUpvoted = data.upvotedBy?.includes(user.uid) || false;

        if (hasUpvoted) {
          // User has already upvoted - remove upvote
          transaction.update(requestRef, {
            votes: increment(-1),
            upvotedBy: arrayRemove(user.uid),
          });
        } else {
          // User hasn't upvoted - add upvote
          transaction.update(requestRef, {
            votes: increment(1),
            upvotedBy: arrayUnion(user.uid),
          });
        }
      });
    } catch (err) {
      console.error('Error toggling upvote:', err);
      setError('Failed to update vote. Please try again.');
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessingVotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  // Check if user has upvoted a request
  const hasUserUpvoted = (request: Request): boolean => {
    if (!user) return false;
    return request.upvotedBy?.includes(user.uid) || false;
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Community Requests
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-red"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Community Requests
      </h2>
      <p className="text-gray-400 mb-6">
        Vote for the racing moments you&apos;d like to see added to the collection.
      </p>

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg"
          role="alert"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No requests yet</p>
          <p className="text-gray-600 text-sm">
            Be the first to suggest a legendary racing moment!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const isUpvoted = hasUserUpvoted(request);
            const isProcessing = processingVotes.has(request.id);
            const isDisabled = !user || isProcessing;

            return (
              <div
                key={request.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Request Details */}
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex-1 min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-accent-yellow rounded"
                  >
                    <h3 className="text-lg font-semibold text-white mb-1 truncate hover:text-accent-yellow transition-colors">
                      {request.raceTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-300">
                          {request.driver}
                        </span>
                      </span>
                      <span className="text-gray-600">•</span>
                      <span>{request.year}</span>
                      {request.notes && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-accent-yellow text-xs">Has notes</span>
                        </>
                      )}
                    </div>
                    {request.wikipediaLink && (
                      <span className="text-sm text-accent-red hover:text-red-400 inline-flex items-center gap-1">
                        Learn more
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </span>
                    )}
                  </button>

                  {/* Upvote Button */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleToggleUpvote(request.id)}
                      disabled={isDisabled}
                      className={`
                        flex items-center justify-center w-12 h-12 rounded-lg
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-gray-900
                        ${
                          isUpvoted
                            ? 'bg-accent-red text-white hover:bg-red-700'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                        ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }
                      `}
                      aria-label={
                        isUpvoted
                          ? `Remove upvote from ${request.raceTitle}`
                          : `Upvote ${request.raceTitle}`
                      }
                      aria-pressed={isUpvoted}
                      title={
                        !user
                          ? 'Sign in to vote'
                          : isUpvoted
                          ? 'Remove upvote'
                          : 'Upvote this request'
                      }
                    >
                      {isProcessing ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <svg
                          className="w-6 h-6"
                          fill={isUpvoted ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        isUpvoted ? 'text-accent-red' : 'text-gray-400'
                      }`}
                    >
                      {request.votes}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sign-in prompt for visitors */}
      {!user && requests.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400 text-center">
            Sign in using the sidebar to vote on community requests
          </p>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (() => {
        // Get the current request data from the requests array to ensure real-time updates
        const currentRequest = requests.find(r => r.id === selectedRequest.id) || selectedRequest;
        const isUpvoted = hasUserUpvoted(currentRequest);
        const isProcessing = processingVotes.has(currentRequest.id);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          >
            <div
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white pr-8">
                  {currentRequest.raceTitle}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent-yellow rounded p-1"
                  aria-label="Close modal"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Request Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Driver</p>
                  <p className="text-lg text-white font-medium">
                    {currentRequest.driver}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Year</p>
                  <p className="text-lg text-white">{currentRequest.year}</p>
                </div>

                {currentRequest.wikipediaLink && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Reference</p>
                    <a
                      href={currentRequest.wikipediaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-red hover:text-red-400 hover:underline inline-flex items-center gap-1"
                    >
                      View on Wikipedia
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}

                {currentRequest.notes && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Additional Notes</p>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                      <p className="text-white whitespace-pre-wrap">
                        {currentRequest.notes}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Community Votes</p>
                      <p className="text-2xl font-bold text-accent-red">
                        {currentRequest.votes}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleToggleUpvote(currentRequest.id);
                      }}
                      disabled={!user || isProcessing}
                      className={`
                        px-6 py-3 rounded-lg font-medium transition-all
                        focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-gray-900
                        ${
                          isUpvoted
                            ? 'bg-accent-red text-white hover:bg-red-700'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }
                        ${
                          !user || isProcessing
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }
                      `}
                    >
                      {isProcessing
                        ? 'Processing...'
                        : isUpvoted
                        ? 'Remove Vote'
                        : 'Upvote'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
