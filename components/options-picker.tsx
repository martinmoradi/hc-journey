import { ClassPicker } from '@/components/class-picker';
import { RacePicker } from '@/components/race-picker';
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
  const [draftRace, setDraftRace] = useState<PlayerRace | null>(initialRace);
  const [draftClass, setDraftClass] = useState<PlayerClass | null>(initialClass);

  const handleSave = () => {
    if (draftRace && draftClass) {
      onSave(draftRace, draftClass);
    }
  };

  const isComplete = draftRace && draftClass;

  return (
    <div className="w-full max-w-6xl mx-auto px-6">
      {/* Title with gradient */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
          {mode === 'create' ? 'Create Your Character' : 'Choose Your Path'}
        </h1>
        <p className="text-gray-400 text-lg animate-fade-in animation-delay-100">
          Select your race and class to begin your adventure
        </p>
      </div>

      {/* Main selection area */}
      <div className="flex flex-row w-full items-center justify-between gap-8 animate-slide-in animation-delay-200">
        {/* Left: Race Picker */}
        <div className="flex-1 flex justify-center animate-slide-in animation-delay-300">
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-br from-blue-500/10 to-red-500/10 rounded-2xl blur-2xl opacity-50" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 text-center">
                Choose Race
              </h3>
              <RacePicker selectedRace={draftRace} onSelectRace={setDraftRace} />
            </div>
          </div>
        </div>

        {/* Center: Preview Images */}
        <div className="flex flex-col gap-6 items-center animate-slide-in animation-delay-400">
          {/* Race Preview */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden backdrop-blur-xl border-2 border-white/20 bg-black/40 transition-all duration-500 hover:scale-105">
              {draftRace ? (
                <>
                  <img
                    src={getRaceImage(draftRace)}
                    alt={draftRace}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                    <p className="text-white font-bold text-sm tracking-wide">{draftRace}</p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="text-3xl mb-2 opacity-30">👤</div>
                  <span className="text-white/40 text-sm font-medium">Select a race</span>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

          {/* Class Preview */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden backdrop-blur-xl border-2 border-white/20 bg-black/40 transition-all duration-500 hover:scale-105">
              {draftClass ? (
                <>
                  <img
                    src={getClassImage(draftClass)}
                    alt={draftClass}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                    <p className="text-white font-bold text-sm tracking-wide">{draftClass}</p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="text-3xl mb-2 opacity-30">⚔️</div>
                  <span className="text-white/40 text-sm font-medium">Select a class</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Class Picker */}
        <div className="flex-1 flex justify-center animate-slide-in animation-delay-500">
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-br from-purple-500/10 to-blue-500/10 rounded-2xl blur-2xl opacity-50" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 text-center">
                Choose Class
              </h3>
              <ClassPicker selectedClass={draftClass} onSelectClass={setDraftClass} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4 mt-12 animate-fade-in animation-delay-600">
        <button
          disabled={!isComplete}
          onClick={handleSave}
          className={`
            group relative px-12 py-5 rounded-xl overflow-hidden
            transition-all duration-500 min-w-[280px]
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

          <div className="relative flex items-center justify-center gap-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-lg font-bold text-white tracking-wide">
              {mode === 'create' ? 'Continue' : 'Save Changes'}
            </span>
          </div>
        </button>

        {onSkip && mode === 'create' && (
          <button
            onClick={onSkip}
            className="group px-8 py-3 rounded-xl border-2 border-white/20 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="text-white/80 group-hover:text-white font-semibold text-sm tracking-wide transition-colors">
              Browse Without Saving
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
