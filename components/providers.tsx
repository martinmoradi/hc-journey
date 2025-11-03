'use client';

import { GuideProvider } from '@/lib/providers/guide-provider';
import { PlayerProvider } from '@/lib/providers/player-provider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PlayerProvider>
      <GuideProvider>{children}</GuideProvider>
    </PlayerProvider>
  );
}
