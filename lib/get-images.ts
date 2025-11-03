import type { PlayerClass, PlayerRace } from '@/lib/types';

export const getClassImage = (className: PlayerClass): string => {
  return `/assets/classes/${className.toLowerCase()}.png`;
};

export const getRaceImage = (raceName: PlayerRace): string => {
  return `/assets/races/${raceName.toLowerCase()}.png`;
};
