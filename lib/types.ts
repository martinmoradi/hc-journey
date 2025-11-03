export const PlayerRace = {
  Dwarf: 'Dwarf',
  Gnome: 'Gnome',
  Human: 'Human',
  NightElf: 'NightElf',
  Orc: 'Orc',
  Troll: 'Troll',
  Undead: 'Undead',
  Tauren: 'Tauren',
} as const;

export const PlayerClass = {
  Druid: 'Druid',
  Hunter: 'Hunter',
  Mage: 'Mage',
  Paladin: 'Paladin',
  Priest: 'Priest',
  Rogue: 'Rogue',
  Shaman: 'Shaman',
  Warlock: 'Warlock',
  Warrior: 'Warrior',
} as const;

export type PlayerRace = (typeof PlayerRace)[keyof typeof PlayerRace];
export type PlayerClass = (typeof PlayerClass)[keyof typeof PlayerClass];

/**
 * Overall guide object from JSON file
 */
export interface ZoneGuide {
  zone: string; // Primary zone for this guide section (e.g., "Elwynn Forest")
  levelRange: string; // e.g., "6-11" or "11-13"
  faction: 'Alliance' | 'Horde';
  name: string;
  next: string | null;
  steps: Step[];
}

type Tip =
  | {
      type: 'warning' | 'tip' | 'info';
      class?: PlayerClass | null;
      text: string;
    }
  | {
      type: 'link';
      class?: PlayerClass | null;
      text: string;
      url: string;
    };

type StepType =
  | 'quest_accept'
  | 'quest_turnin'
  | 'kill'
  | 'loot'
  | 'travel'
  | 'grind'
  | 'fly'
  | 'info';

/**
 * Step object from JSON file
 */
export interface Step {
  id: string; // Format: "guidename_###" (e.g., "elwynn_001", "lochmodan_042")
  type: StepType;
  description: string; // Clean instruction text
  classes: PlayerClass[] | null;
  races: PlayerRace[] | null;
  coords: [number, number] | null; // [x, y] or null
  zone: string | null; // Actual zone where this step takes place (lowercase, underscores). Empty string if no coordinates.
  tips: Tip[] | null; // can be empty
  quests: { id: number; name: string }[] | null; // can be empty
  npc: string | null; // can be empty
  mobs: string[] | null; // can be empty
}

/**
 * Step object after processing
 */
export interface ProcessedStep extends Step {
  compositeId: string; // "11-13_loch_modan_dwarf_gnome:lochmodan_001"
  zoneName: string; // "11-13_loch_modan_dwarf_gnome" (the guide name)
  originalId: string; // "lochmodan_001" (original step id)
  globalIndex: number; // Position in the full chain (0, 1, 2, ...)
}
