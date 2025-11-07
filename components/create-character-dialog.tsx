'use client';

import { ClassPicker } from '@/components/class-picker';
import { RacePicker } from '@/components/race-picker';
import { SaveCharacterDialog } from '@/components/save-character-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getClassImage, getRaceImage } from '@/lib/get-images';
import { PlayerClass, PlayerRace } from '@/lib/types';
import { useState } from 'react';

interface CreateCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCharacter: (name: string, race: PlayerRace, playerClass: PlayerClass) => void;
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
      setDraftRace(null);
      setDraftClass(null);
      setShowNameDialog(false);
      onOpenChange(false);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
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
        <DialogContent className="w-[90%] sm:max-w-6xl bg-linear-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] text-white border-white/10 backdrop-blur-xl">
          <div className="py-8 px-4">
            {/* Title with gradient */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Create New Character
              </h2>
              <p className="text-gray-400">Choose your race and class</p>
            </div>

            {/* Main selection area */}
            <div className="flex flex-row w-full items-center justify-between gap-6">
              {/* Left: Race Picker */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-3 bg-linear-to-br from-blue-500/10 to-red-500/10 rounded-2xl blur-xl" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 text-center">
                      Race
                    </h3>
                    <RacePicker selectedRace={draftRace} onSelectRace={setDraftRace} />
                  </div>
                </div>
              </div>

              {/* Center: Preview Images */}
              <div className="flex flex-col gap-5 items-center">
                {/* Race Preview */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden backdrop-blur-xl border-2 border-white/20 bg-black/40 transition-all duration-500 hover:scale-105">
                    {draftRace ? (
                      <>
                        <img
                          src={getRaceImage(draftRace)}
                          alt={draftRace}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                          <p className="text-white font-bold text-xs tracking-wide">{draftRace}</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="text-2xl mb-2 opacity-30">👤</div>
                        <span className="text-white/40 text-xs font-medium px-2 text-center">
                          Select race
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-12 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

                {/* Class Preview */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden backdrop-blur-xl border-2 border-white/20 bg-black/40 transition-all duration-500 hover:scale-105">
                    {draftClass ? (
                      <>
                        <img
                          src={getClassImage(draftClass)}
                          alt={draftClass}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                          <p className="text-white font-bold text-xs tracking-wide">{draftClass}</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="text-2xl mb-2 opacity-30">⚔️</div>
                        <span className="text-white/40 text-xs font-medium px-2 text-center">
                          Select class
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Class Picker */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-3 bg-linear-to-br from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 text-center">
                      Class
                    </h3>
                    <ClassPicker selectedClass={draftClass} onSelectClass={setDraftClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center mt-10">
              <button
                disabled={!isComplete}
                onClick={handleContinue}
                className={`
                  group relative px-10 py-4 rounded-xl overflow-hidden
                  transition-all duration-500 min-w-[240px]
                  ${
                    isComplete
                      ? 'bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:scale-105 active:scale-95 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40'
                      : 'bg-gray-600/50 cursor-not-allowed opacity-50'
                  }
                `}
              >
                {/* Shimmer effect */}
                {isComplete && (
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                <span className="relative text-lg font-bold text-white tracking-wide">
                  Continue
                </span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SaveCharacterDialog
        open={showNameDialog}
        onOpenChange={(isOpen) => {
          setShowNameDialog(isOpen);
          if (!isOpen && !open) {
            setDraftRace(null);
            setDraftClass(null);
          }
        }}
        onSave={handleSaveName}
        title="Name Your Character"
      />
    </>
  );
}
