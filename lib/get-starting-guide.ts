import { PlayerRace } from '@/lib/types';

export function getStartingGuide(playerRace: PlayerRace) {
  switch (playerRace) {
    case PlayerRace.Human:
      return '1-6_northshire_human';
    case PlayerRace.Dwarf:
      return '1-6_coldridge_valley_dwarf_gnome';
    case PlayerRace.Gnome:
      return '1-6_coldridge_valley_dwarf_gnome';
    case PlayerRace.NightElf:
      return '1-6_shadowglen_NE';
    case PlayerRace.Orc:
      throw new Error('Orcs are not supported yet');
    case PlayerRace.Troll:
      throw new Error('Trolls are not supported yet');
    case PlayerRace.Undead:
      throw new Error('Undead are not supported yet');
    case PlayerRace.Tauren:
      throw new Error('Taurens are not supported yet');
    default:
      throw new Error('Invalid race');
  }
}
