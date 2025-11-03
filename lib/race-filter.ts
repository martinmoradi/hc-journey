import { PlayerRace } from '@/lib/types';

/**
 * Checks if content should be shown for the given player class
 * @param races - Array of race names, or null/empty for all races
 * @param playerRace - The player's current race
 * @returns true if the content should be shown
 *
 * Rules:
 * - null or empty array = show for all races
 * - ["Mage", "Priest"] = show only for Mage or Priest
 * - ["!Mage"] = show for all EXCEPT Mage
 */
export const shouldShowForRace = (
  races: string[] | null | undefined,
  playerRace: PlayerRace | null,
): boolean => {
  // No player class selected yet
  if (!playerRace) {
    return true;
  }

  // No class restrictions = show for everyone
  if (!races || races.length === 0) {
    return true;
  }

  const playerRaceName = PlayerRace[playerRace]; // Convert enum to string

  // Check for negative filters (exclusions)
  const exclusions = races.filter((c) => c.startsWith('!'));
  const inclusions = races.filter((c) => !c.startsWith('!'));

  // If there are exclusions, check if player class is excluded
  if (exclusions.length > 0) {
    const isExcluded = exclusions.some(
      (exclusion) => exclusion.substring(1) === playerRaceName,
    );
    if (isExcluded) {
      return false;
    }
  }

  // If there are inclusions, check if player class is included
  if (inclusions.length > 0) {
    return inclusions.includes(playerRaceName);
  }

  // If only exclusions exist and player wasn't excluded, show it
  return true;
};

/**
 * Filters an array of items by race
 * Each item must have a 'races' property
 */
export const filterByRace = <T extends { races?: string[] | null }>(
  items: T[],
  playerRace: PlayerRace,
): T[] => {
  return items.filter((item) => shouldShowForRace(item.races, playerRace));
};
