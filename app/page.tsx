'use client';

import { GuideViewer } from '@/components/guide/guide-viewer';
import { OptionsPicker } from '@/components/options-picker';
import { TopBar } from '@/components/top-bar';
import { usePlayer } from '@/lib/providers/player-provider';
import { useMemo } from 'react';

export default function Home() {
  const { playerClass, playerRace, getAllCharacters, startBrowsing } =
    usePlayer();

  // Calculate if we should show first-time experience
  // Using useMemo instead of useEffect to avoid setState in effect
  const showFirstTimeExperience = useMemo(() => {
    const hasCharacters = getAllCharacters().length > 0;
    const hasSelection = playerRace && playerClass;
    return !hasCharacters && !hasSelection;
  }, [getAllCharacters, playerRace, playerClass]);

  return (
    <div className='min-h-screen bg-background'>
      <TopBar />

      <main className='mx-auto'>
        {showFirstTimeExperience ? (
          <div className='flex items-center justify-center min-h-[calc(100vh-200px)] container'>
            <div className='w-full max-w-6xl'>
              <OptionsPicker
                mode='create'
                onSave={(race, cls) => {
                  startBrowsing(race, cls);
                }}
                onSkip={() => {
                  // Optional: handle skip if needed
                }}
              />
            </div>
          </div>
        ) : (
          <div className='h-screen w-full max-w-[calc(100vw-20px)] mx-auto'>
            <GuideViewer />
          </div>
        )}
      </main>
    </div>
  );
}
