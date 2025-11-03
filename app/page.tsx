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
  const showFirstTimeExperience = useMemo(() => {
    const hasCharacters = getAllCharacters().length > 0;
    const hasSelection = playerRace && playerClass;
    return !hasCharacters && !hasSelection;
  }, [getAllCharacters, playerRace, playerClass]);

  return (
    <div className='min-h-screen bg-linear-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419]'>
      <TopBar />

      <main className='mx-auto'>
        {showFirstTimeExperience ? (
          <div className='flex items-center justify-center min-h-[calc(100vh-80px)] container px-4'>
            <div className='w-full max-w-6xl animate-fade-in'>
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
