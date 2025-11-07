'use client';
import { CharacterDropdown } from '@/components/character-dropdown';
import { CreateCharacterDialog } from '@/components/create-character-dialog';
import { SaveCharacterDialog } from '@/components/save-character-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getClassImage, getRaceImage } from '@/lib/get-images';
import { usePlayer } from '@/lib/providers/player-provider';
import { useGuide } from '@/lib/providers/guide-provider';
import { PlayerClass, PlayerRace } from '@/lib/types';
import { CircleAlert, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';

export function TopBar() {
  const {
    playerClass,
    playerRace,
    charName,
    getAllCharacters,
    loadCharacter,
    deleteCharacter,
    createNewCharacter,
    saveCharacter,
    isBrowsingMode,
  } = usePlayer();

  const { currentStepIndex, totalSteps, scrollToCurrentStep } = useGuide();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const isPlayerSet = playerClass && playerRace;
  const allCharacters = getAllCharacters();

  // Get character data with race/class info from localStorage
  const charactersData = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('savedCharacters');
      const characters: Record<
        string,
        {
          playerRace: PlayerRace;
          playerClass: PlayerClass;
          charName: string;
          currentStepIndex: number;
          isBrowsingMode: boolean;
        }
      > = saved ? JSON.parse(saved) : {};

      return Object.entries(characters).map(([name, data]) => ({
        name,
        race: data.playerRace,
        playerClass: data.playerClass,
      }));
    } catch (error) {
      console.error('Error getting character data:', error);
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCharacters]);

  // Calculate progress percentage
  const progressPercentage = totalSteps > 0 ? (currentStepIndex / totalSteps) * 100 : 0;

  const handleCreateCharacter = (name: string, race: PlayerRace, playerClass: PlayerClass) => {
    createNewCharacter(name, race, playerClass);
    setCreateDialogOpen(false);
  };

  const handleSaveCurrentCharacter = (name: string) => {
    saveCharacter(name);
    setSaveDialogOpen(false);
  };

  const handleDeleteCharacter = (name: string) => {
    deleteCharacter(name);

    // If we deleted the current character, autoload the next one
    if (name === charName) {
      const remainingCharacters = allCharacters.filter((char) => char !== name);
      if (remainingCharacters.length > 0) {
        loadCharacter(remainingCharacters[0]);
      }
    }
  };

  return (
    <>
      {/* Glass morphism top bar */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-[60%] min-w-[600px]">
        <div
          className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-4xl shadow-2xl border border-white/40 px-6 py-3"
          style={{
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          }}
        >
          <div className="flex items-center justify-between gap-6">
            {/* Left: Character Management */}
            <div className="shrink-0">
              {isBrowsingMode ? (
                // Browse mode: Gradient save button with race/class icons
                <button
                  onClick={() => setSaveDialogOpen(true)}
                  className="group relative overflow-hidden rounded-xl px-6 py-2.5 font-medium text-white transition-all duration-500 flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(to right, #FEAC5E 0%, #C779D0 51%, #FEAC5E 100%)',
                    backgroundSize: '200% auto',
                    boxShadow: '0 0 20px rgba(254, 172, 94, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundPosition = 'right center';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundPosition = 'left center';
                  }}
                >
                  {isPlayerSet && (
                    <div className="flex items-center gap-1">
                      <img src={getRaceImage(playerRace)} alt={playerRace} className="w-5 h-5" />
                      <img src={getClassImage(playerClass)} alt={playerClass} className="w-5 h-5" />
                    </div>
                  )}
                  <span className="text-sm font-semibold flex flex-row gap-3 items-center">
                    Save progress ! <CircleAlert className="w-5 h-5" />
                  </span>
                </button>
              ) : allCharacters.length > 0 ? (
                // Has saved characters, show dropdown
                <CharacterDropdown
                  currentCharacter={charName}
                  currentRace={playerRace}
                  currentClass={playerClass}
                  charactersData={charactersData}
                  onLoadCharacter={loadCharacter}
                  onDeleteCharacter={handleDeleteCharacter}
                  onCreateCharacter={() => setCreateDialogOpen(true)}
                />
              ) : (
                // No characters, show create button
                <Button
                  variant="default"
                  onClick={() => setCreateDialogOpen(true)}
                  className="rounded-xl"
                >
                  Create Character
                </Button>
              )}
            </div>

            {/* Center: Progress Bar with Percentage */}
            <div className="flex-1 flex items-center gap-3 max-w-md">
              <Progress
                value={progressPercentage}
                className="h-3 flex-1"
                style={{
                  background: 'rgba(254, 172, 94, 0.2)',
                }}
              />
              <div
                className="text-lg font-bold min-w-14 text-right"
                style={{
                  background: 'linear-gradient(to right, #FEAC5E, #C779D0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {Math.round(progressPercentage)}%
              </div>
            </div>

            {/* Right: Center Viewport Button */}
            <div className="shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollToCurrentStep}
                className="rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50"
                title="Center on current step"
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Character Dialog */}
      <CreateCharacterDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateCharacter={handleCreateCharacter}
      />

      {/* Save Character Dialog (for browse mode) */}
      <SaveCharacterDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveCurrentCharacter}
        title="Save Your Character"
      />
    </>
  );
}
