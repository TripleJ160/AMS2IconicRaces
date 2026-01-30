import championshipsData from '@/data/championships.json';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Championship {
  id: string;
  title: string;
  description: string;
  raceIds: string[];
  imageUrl?: string;
}

/**
 * Get all championships
 */
export function getAllChampionships(): Championship[] {
  return championshipsData as Championship[];
}

/**
 * Get a championship by ID
 */
export function getChampionshipById(id: string): Championship | undefined {
  const championships = getAllChampionships();
  return championships.find((c) => c.id === id);
}

/**
 * Check if a championship is completed based on completed races
 */
export function isChampionshipCompleted(
  championshipId: string,
  completedRaces: string[]
): boolean {
  const championship = getChampionshipById(championshipId);
  if (!championship) return false;

  return championship.raceIds.every((raceId) => completedRaces.includes(raceId));
}

/**
 * Get all completed championships for a user
 */
export function getCompletedChampionships(completedRaces: string[]): Championship[] {
  const championships = getAllChampionships();
  return championships.filter((championship) =>
    isChampionshipCompleted(championship.id, completedRaces)
  );
}

/**
 * Calculate championship progress
 */
export function calculateChampionshipProgress(
  championshipId: string,
  completedRaces: string[]
): { completed: number; total: number; percentage: number } {
  const championship = getChampionshipById(championshipId);
  if (!championship) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completed = championship.raceIds.filter((raceId) =>
    completedRaces.includes(raceId)
  ).length;
  const total = championship.raceIds.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

/**
 * Award championship completion bonus (500 XP)
 * This should be called when a user completes the last race in a championship
 */
export async function awardChampionshipCompletion(
  userId: string,
  championshipId: string
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    completedChampionships: arrayUnion(championshipId),
    experiencePoints: increment(500),
  });
}

/**
 * Remove championship completion (if user uncompletes a race)
 * This should be called when a user uncompletes a race that was part of a completed championship
 */
export async function removeChampionshipCompletion(
  userId: string,
  championshipId: string
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    completedChampionships: arrayRemove(championshipId),
    experiencePoints: increment(-500),
  });
}
