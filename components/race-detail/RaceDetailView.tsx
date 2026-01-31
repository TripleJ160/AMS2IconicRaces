'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/AuthProvider'
import { BackButton } from '@/components/shared/BackButton'
import { DLCBadge } from '@/components/shared/DLCBadge'
import { LiveryPackCard } from '@/components/shared/LiveryPackCard'
import { StorySection } from './StorySection'
import { RaceContextSection } from './RaceContextSection'
import { SetupSection } from './SetupSection'
import { MediaSection } from './MediaSection'
import { RelatedRaces } from './RelatedRaces'
import { shouldShowDLCBadge } from '@/lib/filterUtils'
import { triggerRaceCompletionConfetti } from '@/lib/confetti'
import type { Race } from '@/lib/types'
import { 
  getAllChampionships, 
  isChampionshipCompleted,
  awardChampionshipCompletion,
  removeChampionshipCompletion
} from '@/lib/championshipUtils'

interface RaceDetailViewProps {
  race: Race
  allRaces: Race[]
  isFromChampionship?: boolean
}

export function RaceDetailView({ race, allRaces, isFromChampionship = false }: RaceDetailViewProps) {
  const { user, refreshUser } = useAuth()
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(
    user?.completedRaces.includes(race.id) || false
  )
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  // Update completion state when user changes
  useEffect(() => {
    if (user) {
      setIsCompleted(user.completedRaces.includes(race.id))
    }
  }, [user, race.id])

  const displayToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleToggleComplete = async () => {
    if (!user) return

    setIsCompleting(true)
    try {
      const userRef = doc(db, 'users', user.uid)
      const isCurrentlyCompleted = isCompleted
      
      // Determine XP based on context: 200 XP for gallery races, 100 XP for championship races
      const xpAmount = isFromChampionship ? 100 : 200

      if (isCurrentlyCompleted) {
        // Un-complete the race
        await updateDoc(userRef, {
          completedRaces: arrayRemove(race.id),
          experiencePoints: increment(-xpAmount),
        })
        setIsCompleted(false)
        
        // Check if this race was part of any completed championships
        const championships = getAllChampionships()
        const affectedChampionships = championships.filter(championship =>
          championship.raceIds.includes(race.id) &&
          user.completedChampionships?.includes(championship.id)
        )
        
        // Remove championship completion bonuses
        for (const championship of affectedChampionships) {
          await removeChampionshipCompletion(user.uid, championship.id)
        }
        
        if (affectedChampionships.length > 0) {
          displayToast(
            `Race unmarked. ${affectedChampionships.length} championship${affectedChampionships.length > 1 ? 's' : ''} no longer complete (-${affectedChampionships.length * 500} XP)`,
            'success'
          )
        } else {
          displayToast('Race unmarked as complete', 'success')
        }
      } else {
        // Complete the race
        await updateDoc(userRef, {
          completedRaces: arrayUnion(race.id),
          experiencePoints: increment(xpAmount),
        })
        setIsCompleted(true)
        triggerRaceCompletionConfetti()
        
        // Check if this race completion completes any championships
        const updatedCompletedRaces = [...user.completedRaces, race.id]
        const championships = getAllChampionships()
        const newlyCompletedChampionships = championships.filter(championship =>
          championship.raceIds.includes(race.id) &&
          !user.completedChampionships?.includes(championship.id) &&
          isChampionshipCompleted(championship.id, updatedCompletedRaces)
        )
        
        // Award championship completion bonuses
        for (const championship of newlyCompletedChampionships) {
          await awardChampionshipCompletion(user.uid, championship.id)
        }
        
        if (newlyCompletedChampionships.length > 0) {
          displayToast(
            `Race completed! +${xpAmount} XP. 🏆 ${newlyCompletedChampionships.length} championship${newlyCompletedChampionships.length > 1 ? 's' : ''} complete! +${newlyCompletedChampionships.length * 500} XP`,
            'success'
          )
        } else {
          displayToast(`Race completed! +${xpAmount} XP`, 'success')
        }
      }
      
      // Refresh user data in AuthContext
      await refreshUser()
    } catch (error) {
      console.error('Error toggling race completion:', error)
      displayToast('Failed to update race completion. Please try again.', 'error')
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background-primary">
      <BackButton />

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toastType === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toastMessage}
        </div>
      )}
      
      <div className="relative container mx-auto px-4 py-20 max-w-6xl min-h-screen">
        {/* Hero Image Section */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-12">
          <Image
            src={race.heroImage}
            alt={race.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          />
          {/* Lighter gradient overlay for better image visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* DLC Badge - positioned in top-right corner with detail variant */}
          {shouldShowDLCBadge(race) && race.ams2?.requiredDLC && (
            <div className="absolute top-4 right-4 z-10">
              <DLCBadge requiredDLC={race.ams2.requiredDLC} variant="detail" />
            </div>
          )}
          
          {/* Title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wider uppercase mb-4 drop-shadow-2xl">
              {race.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xl md:text-2xl">
              <p className="text-accent-yellow drop-shadow-lg">
                {race.driver}
              </p>
              
              <span className="text-text-secondary">
                •
              </span>
              
              <p className="text-text-secondary">
                {race.year}
              </p>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {race.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Completion Toggle Button - Only for authenticated users */}
            {user && (
              <div className="mt-6">
                <button
                  onClick={handleToggleComplete}
                  disabled={isCompleting}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider
                    transition-all duration-200 shadow-lg
                    ${
                      isCompleted
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-accent-red hover:bg-red-700 text-white'
                    }
                    ${isCompleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isCompleting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
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
                      <span>Processing...</span>
                    </>
                  ) : isCompleted ? (
                    <>
                      <svg
                        className="h-5 w-5"
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
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>Mark as Complete</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-20">
          <StorySection description={race.description} />
          <RaceContextSection context={race.raceContext} />
          <SetupSection ams2={race.ams2} />
          
          {/* Livery Pack Section */}
          {race.liveryPack && (
            <section>
              <LiveryPackCard liveryPack={race.liveryPack} />
            </section>
          )}
          
          <MediaSection 
            youtubeId={race.youtubeId} 
            heroImage={race.heroImage}
            title={race.title}
          />
          
          {/* Related Races Section - added at bottom of page */}
          <RelatedRaces 
            currentRace={race} 
            allRaces={allRaces}
            maxResults={3}
          />
        </div>
      </div>
    </div>
  )
}
