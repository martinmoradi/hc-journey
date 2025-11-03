import { ClassPicker } from '@/components/class-picker';
import { RacePicker } from '@/components/race-picker';
import { Button } from '@/components/ui/button';
import { getClassImage, getRaceImage } from '@/lib/get-images';
import { PlayerClass, PlayerRace } from '@/lib/types';
import { useState } from 'react';

interface OptionsPickerProps {
  initialRace?: PlayerRace | null;
  initialClass?: PlayerClass | null;
  onSave: (race: PlayerRace, playerClass: PlayerClass) => void;
  onSkip?: () => void;
  mode?: 'create' | 'edit';
}

export function OptionsPicker({
  initialRace = null,
  initialClass = null,
  onSave,
  onSkip,
  mode = 'create',
}: OptionsPickerProps) {
  // Local draft state - doesn't affect global context until saved
  const [draftRace, setDraftRace] = useState<PlayerRace | null>(initialRace);
  const [draftClass, setDraftClass] = useState<PlayerClass | null>(
    initialClass,
  );

  const handleSave = () => {
    if (draftRace && draftClass) {
      onSave(draftRace, draftClass);
    }
  };

  const isComplete = draftRace && draftClass;

  return (
    <div className='w-[90%] mx-auto'>
      <h1 className='text-2xl font-bold mb-6 text-center text-white'>
        {mode === 'create'
          ? 'Create Your Character'
          : 'Choose your race and class'}
      </h1>

      <div className='flex flex-row w-full items-center gap-4'>
        <div className='flex-1 flex justify-start'>
          <RacePicker selectedRace={draftRace} onSelectRace={setDraftRace} />
        </div>

        {/* Centered image display section */}
        <div className='flex flex-row gap-4 justify-center items-center'>
          <div className='w-32 h-32 flex items-center justify-center border-2 border-white/20 rounded-lg bg-black/30'>
            {draftRace ? (
              <img
                src={getRaceImage(draftRace)}
                alt={draftRace}
                className='w-full h-full object-cover rounded-lg'
              />
            ) : (
              <span className='text-white/50 text-sm text-center px-2'>
                Select a race
              </span>
            )}
          </div>

          <div className='w-32 h-32 flex items-center justify-center border-2 border-white/20 rounded-lg bg-black/30'>
            {draftClass ? (
              <img
                src={getClassImage(draftClass)}
                alt={draftClass}
                className='w-full h-full object-cover rounded-lg'
              />
            ) : (
              <span className='text-white/50 text-sm text-center px-2'>
                Select a class
              </span>
            )}
          </div>
        </div>

        <div className='flex-1 flex justify-end'>
          <ClassPicker
            selectedClass={draftClass}
            onSelectClass={setDraftClass}
          />
        </div>
      </div>

      <div className='flex flex-col justify-center mt-6 mx-auto max-w-xs gap-4'>
        <Button
          variant='default'
          size='lg'
          disabled={!isComplete}
          onClick={handleSave}
          className='bg-green-600 font-bold text-white hover:bg-green-700 disabled:opacity-50'>
          {mode === 'create' ? 'Continue' : 'Save Changes'}
        </Button>

        {onSkip && mode === 'create' && (
          <Button
            variant='outline'
            size='default'
            onClick={onSkip}
            className='text-white font-bold border-white/30 hover:bg-white/10'>
            Browse Without Saving
          </Button>
        )}
      </div>
    </div>
  );
}
