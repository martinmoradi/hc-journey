import { getClassImage } from '@/lib/get-images';
import { PlayerClass } from '@/lib/types';

interface ClassPickerProps {
  selectedClass: PlayerClass | null;
  onSelectClass: (playerClass: PlayerClass) => void;
}

export function ClassPicker({
  selectedClass,
  onSelectClass,
}: ClassPickerProps) {
  // Get all class values from the enum
  const classes = Object.values(PlayerClass);

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-4 w-fit'>
      {classes.map((wowClass) => (
        <button
          key={wowClass}
          onClick={() => onSelectClass(wowClass)}
          className={`
            relative aspect-square rounded-lg overflow-hidden
            transition-all duration-200 ease-in-out
            w-[64px] h-[64px]
            hover:scale-110 hover:shadow-lg
            ${
              selectedClass === wowClass
                ? 'ring-4 ring-blue-500 scale-105'
                : 'ring-2 ring-gray-300 hover:ring-gray-400'
            }
          `}
          title={wowClass}>
          <img
            src={getClassImage(wowClass)}
            alt={wowClass}
            className='w-full h-full object-cover'
          />
        </button>
      ))}
    </div>
  );
}
