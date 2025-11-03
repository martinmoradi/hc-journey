import { PlayerRace } from '@/lib/types';

export function getFaction(playerRace: PlayerRace): string {
  switch (playerRace) {
    case PlayerRace.Human:
      return 'alliance';
    case PlayerRace.Dwarf:
      return 'alliance';
    case PlayerRace.Gnome:
      return 'alliance';
    case PlayerRace.NightElf:
      return 'alliance';
    case PlayerRace.Orc:
      return 'horde';
    case PlayerRace.Troll:
      return 'horde';
    case PlayerRace.Undead:
      return 'horde';
    case PlayerRace.Tauren:
      return 'horde';
    default:
      throw new Error('Invalid player race');
  }
}
