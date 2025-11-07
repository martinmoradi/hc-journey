import { getRaceImage } from '@/lib/get-images';
import { PlayerRace } from '@/lib/types';

interface RacePickerProps {
  selectedRace: PlayerRace | null;
  onSelectRace: (race: PlayerRace) => void;
}

export function RacePicker({ selectedRace, onSelectRace }: RacePickerProps) {
  // Custom race ordering: Alliance first, then Horde
  const orderedRaces: PlayerRace[] = [
    PlayerRace.Human,
    PlayerRace.Orc,
    PlayerRace.NightElf,
    PlayerRace.Undead,
    PlayerRace.Dwarf,
    PlayerRace.Troll,
    PlayerRace.Gnome,
    PlayerRace.Tauren,
  ];

  // Faction colors for visual feedback
  const getFactionColor = (race: PlayerRace): string => {
    if (
      race === PlayerRace.Human ||
      race === PlayerRace.NightElf ||
      race === PlayerRace.Dwarf ||
      race === PlayerRace.Gnome
    ) {
      return 'blue';
    }
    return 'red';
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 w-fit">
        {orderedRaces.map((race) => {
          const isSelected = selectedRace === race;
          const factionColor = getFactionColor(race);

          return (
            <button
              key={race}
              onClick={() => onSelectRace(race)}
              className={`
                group relative w-20 h-20 rounded-xl overflow-hidden
                transition-all duration-500 ease-out
                ${isSelected ? 'scale-110 shadow-2xl' : 'scale-100 hover:scale-105'}
              `}
              title={race}
            >
              {/* Glassmorphism container */}
              <div
                className={`
                absolute inset-0 rounded-xl backdrop-blur-sm border-2
                transition-all duration-500
                ${
                  isSelected
                    ? factionColor === 'blue'
                      ? 'bg-blue-500/30 border-blue-400/60 shadow-lg shadow-blue-500/50'
                      : 'bg-red-500/30 border-red-400/60 shadow-lg shadow-red-500/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                }
              `}
              >
                {/* Image */}
                <img src={getRaceImage(race)} alt={race} className="w-full h-full object-cover" />

                {/* Selection glow overlay */}
                {isSelected && (
                  <div
                    className={`
                    absolute inset-0 pointer-events-none
                    ${
                      factionColor === 'blue'
                        ? 'bg-linear-to-br from-blue-400/20 via-transparent to-blue-600/20'
                        : 'bg-linear-to-br from-red-400/20 via-transparent to-red-600/20'
                    }
                    animate-pulse-slow
                  `}
                  />
                )}

                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div
                  className={`
                  absolute -top-1 -right-1 w-7 h-7 rounded-full
                  flex items-center justify-center z-10
                  ${
                    factionColor === 'blue'
                      ? 'bg-linear-to-br from-blue-400 to-blue-600'
                      : 'bg-linear-to-br from-red-400 to-red-600'
                  }
                  shadow-lg animate-check-pop
                `}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Race name tooltip on hover */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-20 border border-white/20">
                {race}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
