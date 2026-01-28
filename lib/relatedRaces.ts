import { Race } from './types';

/**
 * Internal interface for tracking race scores during calculation
 */
interface RelatedRaceScore {
  race: Race;
  score: number;
  matchingTags: string[];
}

/**
 * Calculates related races based on tag overlap scoring algorithm.
 * 
 * Algorithm:
 * 1. Exclude the current race from candidates
 * 2. For each candidate race, count matching tags with current race
 * 3. Sort candidates by match count (score) in descending order
 * 4. Return top N races (default 3)
 * 
 * Edge cases handled:
 * - Current race has no tags: returns empty array
 * - No races have matching tags: returns empty array
 * - Fewer than N matches: returns all matches
 * - Current race not in dataset: processes normally
 * 
 * @param currentRace - The race to find related races for
 * @param allRaces - The complete dataset of races to search
 * @param maxResults - Maximum number of related races to return (default: 3)
 * @returns Array of related races, sorted by relevance (highest score first)
 * 
 * Requirements: 3.2, 3.3, 3.4, 3.5, 3.7
 */
export function calculateRelatedRaces(
  currentRace: Race,
  allRaces: Race[],
  maxResults: number = 3
): Race[] {
  // Handle edge case: current race has no tags
  if (!currentRace.tags || currentRace.tags.length === 0) {
    return [];
  }

  // Convert current race tags to Set for O(1) lookup
  const currentTags = new Set(currentRace.tags);
  
  // Initialize scores array
  const scores: RelatedRaceScore[] = [];

  // Calculate scores for each candidate race
  for (const candidate of allRaces) {
    // Requirement 3.2: Exclude current race from results
    if (candidate.id === currentRace.id) {
      continue;
    }

    // Handle candidate with no tags
    if (!candidate.tags || candidate.tags.length === 0) {
      continue;
    }

    // Count matching tags
    let matchCount = 0;
    const matchingTags: string[] = [];

    for (const tag of candidate.tags) {
      if (currentTags.has(tag)) {
        matchCount++;
        matchingTags.push(tag);
      }
    }

    // Only include races with at least one matching tag
    // Requirement 3.3: Score based on tag overlap
    if (matchCount > 0) {
      scores.push({
        race: candidate,
        score: matchCount,
        matchingTags
      });
    }
  }

  // Requirement 3.4: Sort by score descending (higher score = more matches)
  scores.sort((a, b) => b.score - a.score);

  // Requirement 3.5: Select top N races
  // Requirement 3.7: If fewer than N matches, return all matches
  const topScores = scores.slice(0, maxResults);

  // Extract race objects from scores
  return topScores.map(score => score.race);
}
