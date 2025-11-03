'use client';

import { ClassPicker } from '@/components/class-picker';
import { RacePicker } from '@/components/race-picker';
import { SaveCharacterDialog } from '@/components/save-character-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getClassImage, getRaceImage } from '@/lib/get-images';
import { PlayerClass, PlayerRace } from '@/lib/types';
import { useState } from 'react';

interface CreateCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCharacter: (
    name: string,
    race: PlayerRace,
    playerClass: PlayerClass,
  ) => void;
}

export function CreateCharacterDialog({
  open,
  onOpenChange,
  onCreateCharacter,
}: CreateCharacterDialogProps) {
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [draftRace, setDraftRace] = useState<PlayerRace | null>(null);
  const [draftClass, setDraftClass] = useState<PlayerClass | null>(null);

  const handleContinue = () => {
    if (draftRace && draftClass) {
      setShowNameDialog(true);
    }
  };

  const handleSaveName = (name: string) => {
    if (draftRace && draftClass) {
      onCreateCharacter(name, draftRace, draftClass);
      // Clean up
      setDraftRace(null);
      setDraftClass(null);
      setShowNameDialog(false);
      onOpenChange(false);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when dialog closes
      setDraftRace(null);
      setDraftClass(null);
      setShowNameDialog(false);
    }
    onOpenChange(isOpen);
  };

  const isComplete = draftRace && draftClass;

  return (
    <>
      <Dialog open={open && !showNameDialog} onOpenChange={handleDialogClose}>
        <DialogContent className='w-[80%] sm:max-w-6xl bg-foreground text-white'>
          <div className='py-6'>
            <h2 className='text-2xl font-bold mb-8 text-center'>
              Create New Character
            </h2>

            {/* Horizontal Layout - Same as full page */}
            <div className='flex flex-row w-full items-center gap-6'>
              {/* Left: Race Picker */}
              <div className='flex-1 flex justify-start'>
                <RacePicker
                  selectedRace={draftRace}
                  onSelectRace={setDraftRace}
                />
              </div>

              {/* Center: Preview Images */}
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

              {/* Right: Class Picker */}
              <div className='flex-1 flex justify-end'>
                <ClassPicker
                  selectedClass={draftClass}
                  onSelectClass={setDraftClass}
                />
              </div>
            </div>

            {/* Bottom: Action Button */}
            <div className='flex justify-center mt-8'>
              <Button
                variant='default'
                size='lg'
                disabled={!isComplete}
                onClick={handleContinue}
                className='bg-green-600 font-bold text-white hover:bg-green-700 disabled:opacity-50 min-w-[200px]'>
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SaveCharacterDialog
        open={showNameDialog}
        onOpenChange={(isOpen) => {
          setShowNameDialog(isOpen);
          if (!isOpen && !open) {
            // If both dialogs are closing, reset draft state
            setDraftRace(null);
            setDraftClass(null);
          }
        }}
        onSave={handleSaveName}
        title='Name Your Character'
      />
    </>
  );
}
