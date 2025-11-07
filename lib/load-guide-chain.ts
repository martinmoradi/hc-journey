import { shouldShowForClass } from '@/lib/class-filter';
import { getFaction } from '@/lib/get-faction';
import { getStartingGuide } from '@/lib/get-starting-guide';
import { shouldShowForRace } from '@/lib/race-filter';
import { PlayerClass, PlayerRace, ProcessedStep, Step, ZoneGuide } from '@/lib/types';

export async function loadGuideChain(
  playerRace: PlayerRace,
  playerClass: PlayerClass
): Promise<ProcessedStep[]> {
  const allSteps: ProcessedStep[] = [];
  let globalIndex = 0;
  const startingGuideName = getStartingGuide(playerRace);
  let currentGuideName: string | null = startingGuideName;

  const faction = getFaction(playerRace);

  while (currentGuideName) {
    const guideModule = await import(`@/lib/guides/${faction}/${currentGuideName}.json`);
    const guide: ZoneGuide = guideModule.default;

    // FILTER 1: Remove steps that don't apply to this race/class
    const validSteps = guide.steps.filter(
      (step: Step) =>
        shouldShowForRace(step.races, playerRace) && shouldShowForClass(step.classes, playerClass)
    );

    // FILTER 2: For each valid step, filter its tips
    const processedSteps = validSteps.map((step: Step) => {
      const filteredTips =
        step.tips?.filter((tip) =>
          shouldShowForClass(tip.class ? [tip.class] : null, playerClass)
        ) ?? [];

      return {
        ...step,
        tips: filteredTips,
        levelRange: guide.levelRange,
        faction: guide.faction,
        compositeId: `${currentGuideName}:${step.id}`,
        zoneName: currentGuideName!,
        originalId: step.id,
        globalIndex: globalIndex++,
      };
    });

    allSteps.push(...processedSteps);
    currentGuideName = guide.next;
  }

  return allSteps;
}
