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

  return (
    <div className='w-full'>
      <div className='grid grid-cols-2 gap-x-6 gap-y-4 w-fit'>
        {orderedRaces.map((race) => (
          <button
            key={race}
            onClick={() => onSelectRace(race)}
            className={`
              relative aspect-square rounded-lg overflow-hidden
              w-[64px] h-[64px]
              transition-all duration-200 ease-in-out
              hover:scale-110 hover:shadow-lg
              ${
                selectedRace === race
                  ? 'ring-4 ring-blue-500 scale-105'
                  : 'ring-2 ring-gray-300 hover:ring-gray-400'
              }
            `}
            title={race}>
            <img
              src={getRaceImage(race)}
              alt={race}
              className='w-full h-full object-cover'
            />
          </button>
        ))}
      </div>
    </div>
  );
}
