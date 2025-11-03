import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ProcessedStep } from '@/lib/types';
import { loadGuideChain } from '@/lib/load-guide-chain';
import { usePlayer } from '@/lib/providers/player-provider';

interface GuideState {
  allSteps: ProcessedStep[];
  currentStepIndex: number;
  isLoading: boolean;
  error: string | null;
  scrollTrigger: number; // Incrementing counter to trigger scroll
}

interface GuideContextType extends GuideState {
  // Computed values
  currentStep: ProcessedStep | null;
  totalSteps: number;
  progressPercentage: number;

  // Navigation
  markStepAsCompleted: () => void;
  jumpToStep: (index: number) => void;
  scrollToCurrentStep: () => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export const GuideProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    playerRace,
    playerClass,
    currentStepIndex: savedStepIndex,
    setCurrentStepIndex,
    isBrowsingMode,
  } = usePlayer();

  const [guideState, setGuideState] = useState<GuideState>({
    allSteps: [],
    currentStepIndex: 0,
    isLoading: false,
    error: null,
    scrollTrigger: 0,
  });

  // Load guide when race/class are available
  useEffect(() => {
    // Don't load if no race/class selected
    if (!playerRace || !playerClass) {
      return;
    }

    let isCancelled = false;

    const loadGuide = async () => {
      if (!isCancelled) {
        setGuideState((prev) => ({ ...prev, isLoading: true, error: null }));
      }

      try {
        const steps = await loadGuideChain(playerRace, playerClass);

        if (!isCancelled) {
          // Validate savedStepIndex is within bounds
          // Extra safeguard: ensure it's a valid number
          const validIndex =
            typeof savedStepIndex === 'number' && !isNaN(savedStepIndex)
              ? savedStepIndex
              : 0;

          const safeIndex = Math.max(0, Math.min(validIndex, steps.length - 1));

          setGuideState({
            allSteps: steps,
            currentStepIndex: safeIndex,
            isLoading: false,
            error: null,
            scrollTrigger: 0,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading guide:', error);
          setGuideState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Failed to load guide',
          }));
        }
      }
    };

    loadGuide();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isCancelled = true;
    };
  }, [playerRace, playerClass, savedStepIndex]);

  // Mark current step as complete and move to next
  const markStepAsCompleted = () => {
    const nextIndex = guideState.currentStepIndex + 1;

    // Don't go past the end
    if (nextIndex >= guideState.allSteps.length) {
      return;
    }

    // Update local state
    setGuideState((prev) => ({
      ...prev,
      currentStepIndex: nextIndex,
    }));

    // Persist to PlayerProvider if NOT in browse mode
    if (!isBrowsingMode) {
      setCurrentStepIndex(nextIndex);
    }
  };

  // Jump to specific step (for navigation features later)
  const jumpToStep = (index: number) => {
    if (index < 0 || index >= guideState.allSteps.length) {
      return;
    }

    setGuideState((prev) => ({
      ...prev,
      currentStepIndex: index,
    }));

    if (!isBrowsingMode) {
      setCurrentStepIndex(index);
    }
  };

  // Trigger scroll to current step
  const scrollToCurrentStep = () => {
    setGuideState((prev) => ({
      ...prev,
      scrollTrigger: prev.scrollTrigger + 1,
    }));
  };

  // Computed values
  const currentStep = guideState.allSteps[guideState.currentStepIndex] ?? null;
  const totalSteps = guideState.allSteps.length;
  const progressPercentage =
    totalSteps > 0 ? (guideState.currentStepIndex / totalSteps) * 100 : 0;

  const value: GuideContextType = {
    ...guideState,
    currentStep,
    totalSteps,
    progressPercentage,
    markStepAsCompleted,
    jumpToStep,
    scrollToCurrentStep,
  };

  return (
    <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
  );
};

export const useGuide = () => {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
};
