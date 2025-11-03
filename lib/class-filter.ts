import { PlayerClass } from '@/lib/types';

/**
 * Checks if content should be shown for the given player class
 * @param classes - Array of class names, or null/empty for all classes
 * @param playerClass - The player's current class
 * @returns true if the content should be shown
 *
 * Rules:
 * - null or empty array = show for all classes
 * - ["Mage", "Priest"] = show only for Mage or Priest
 * - ["!Mage"] = show for all EXCEPT Mage
 */
export const shouldShowForClass = (
  classes: string[] | null | undefined,
  playerClass: PlayerClass | null,
): boolean => {
  // No player class selected yet
  if (!playerClass) {
    return true;
  }

  // No class restrictions = show for everyone
  if (!classes || classes.length === 0) {
    return true;
  }

  const playerClassName = PlayerClass[playerClass]; // Convert enum to string

  // Check for negative filters (exclusions)
  const exclusions = classes.filter((c) => c.startsWith('!'));
  const inclusions = classes.filter((c) => !c.startsWith('!'));

  // If there are exclusions, check if player class is excluded
  if (exclusions.length > 0) {
    const isExcluded = exclusions.some(
      (exclusion) => exclusion.substring(1) === playerClassName,
    );
    if (isExcluded) {
      return false;
    }
  }

  // If there are inclusions, check if player class is included
  if (inclusions.length > 0) {
    return inclusions.includes(playerClassName);
  }

  // If only exclusions exist and player wasn't excluded, show it
  return true;
};

/**
 * Filters an array of items by class
 * Each item must have a 'classes' property
 */
export const filterByClass = <T extends { classes?: string[] | null }>(
  items: T[],
  playerClass: PlayerClass,
): T[] => {
  return items.filter((item) => shouldShowForClass(item.classes, playerClass));
};
