'use client';

import React, { useState } from 'react';
import { ProcessedStep } from '@/lib/types';
import { Map } from '@/components/guide/map';
import { StepTips } from '@/components/guide/step-tips';
import { ChevronsRight, ClipboardList } from 'lucide-react';

interface StepDetailsProps {
  step: ProcessedStep;
  isCurrentStep: boolean;
  isCompleted: boolean;
  isLastStep?: boolean;
  onMarkComplete?: () => void;
}

/**
 * StepDetails - Modern detailed view with glassmorphism cards
 */
export const StepDetails: React.FC<StepDetailsProps> = ({
  step,
  isCurrentStep,
  isCompleted,
  isLastStep = false,
  onMarkComplete,
}) => {
  const hasMap = step.zone && step.zone !== '' && step.coords;
  const [waypointCopied, setWaypointCopied] = useState(false);

  const handleCopyWaypoint = async () => {
    if (!step.zone || !step.coords) return;

    const zone = step.zone.replace(/_/g, ' ');
    const [x, y] = step.coords;
    const target = step.npc || (step.mobs && step.mobs.length > 0 ? step.mobs[0] : '');

    const macro = `/way ${zone} ${x} ${y} ${target}`.trim();

    try {
      await navigator.clipboard.writeText(macro);
      setWaypointCopied(true);
      setTimeout(() => setWaypointCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy waypoint:', err);
    }
  };

  return (
    <div className="px-5 pt-3 pb-5">
      {/* Two-column layout */}
      <div className={`grid gap-5 ${hasMap ? 'lg:grid-cols-[1fr_1.5fr]' : 'grid-cols-1'}`}>
        {/* Details section */}
        <div className="space-y-4">
          {/* Tips section */}
          {step.tips && step.tips.length > 0 && (
            <div className="animate-slide-in">
              <StepTips tips={step.tips} />
            </div>
          )}

          {/* Mobs section */}
          {step.mobs && step.mobs.length > 0 && (
            <div className="animate-slide-in animation-delay-100">
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                <span className="h-4 w-1 rounded-full bg-red-500"></span>
                Targets
              </h3>
              <div className="space-y-2">
                {step.mobs.map((mob, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-red-500/15"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                      <img src="/assets/misc/battle.png" alt="Battle" className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">{mob}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quests section */}
          {step.quests && step.quests.length > 0 && (
            <div className="animate-slide-in animation-delay-200 relative">
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                <span className="h-4 w-1 rounded-full bg-yellow-500"></span>
                Quests
              </h3>
              <div className="space-y-2">
                {step.quests.map((quest, index) => {
                  // Check if this quest name appears later in the array
                  const isDuplicate = step
                    .quests!.slice(index + 1)
                    .some((q) => q.name === quest.name);
                  const isTurnIn = isDuplicate;

                  return (
                    <a
                      key={`${quest.id}-${index}`}
                      href={`https://www.wowhead.com/classic/quest=${quest.id}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-yellow-500/15"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20">
                        <img
                          src={
                            isTurnIn
                              ? '/assets/misc/turnin_quest.png'
                              : '/assets/misc/available_quest.png'
                          }
                          alt={isTurnIn ? 'Turn In Quest' : 'Available Quest'}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-200">{quest.name}</span>
                      <svg
                        className="h-4 w-4 text-gray-400 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  );
                })}
              </div>
              <p className="absolute right-0 mr-4 text-[11px] text-gray-500 italic">
                Click to open on Wowhead
              </p>
            </div>
          )}

          {/* NPC */}
          {step.npc && (
            <div className="animate-slide-in animation-delay-300">
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                <span className="h-4 w-1 rounded-full bg-blue-500"></span>
                NPC
              </h3>
              <div className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                  <span className="text-lg">💬</span>
                </div>
                <span className="text-sm font-medium text-gray-200">{step.npc}</span>
              </div>
            </div>
          )}

          {/* Location */}
          {step.coords && step.zone && step.zone !== '' && (
            <div className="animate-slide-in animation-delay-400">
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                <span className="h-4 w-1 rounded-full bg-purple-500"></span>
                Location
              </h3>
              <div className="relative pb-5">
                <button
                  onClick={handleCopyWaypoint}
                  className="group flex w-full items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-purple-500/15 active:scale-[0.98]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                    <span className="text-lg">📍</span>
                  </div>
                  <span className="flex-1 text-left text-sm font-medium text-gray-200 capitalize">
                    {step.zone.replace(/_/g, ' ')}: {step.coords[0]}, {step.coords[1]}
                  </span>
                  {waypointCopied && (
                    <span className="animate-fade-in text-xs font-semibold text-green-400">
                      Copied!
                    </span>
                  )}
                  <ClipboardList className="h-4 w-4 text-gray-400 transition-opacity" />
                </button>
                <p className="absolute right-0 mr-4 text-[11px] text-gray-500 italic">
                  Click to copy TomTom macro
                </p>
              </div>
            </div>
          )}

          {/* Level range */}

          <div className="animate-slide-in animation-delay-500">
            <h3 className="mb-2.5 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
              <span className="h-4 w-1 rounded-full bg-green-500"></span>
              {step.zone} : {step.levelRange}
            </h3>
          </div>
        </div>

        {/* Map section */}
        {hasMap && (
          <div className="animate-slide-in animation-delay-500 space-y-2">
            <Map zone={step.zone!} x={step.coords![0]} y={step.coords![1]} />
          </div>
        )}
      </div>

      {/* Mark Complete button */}
      {isCurrentStep && onMarkComplete && !isCompleted && (
        <div className="animate-slide-in animation-delay-600 mt-6 flex flex-row items-end justify-end border-t border-white/10 pt-5">
          {isLastStep ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete();
              }}
              className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-green-500 via-emerald-500 to-blue-500 px-8 py-5 shadow-xl shadow-green-500/30 transition-all duration-500 hover:scale-[1.02] hover:from-green-400 hover:via-emerald-400 hover:to-blue-400 hover:shadow-2xl hover:shadow-green-500/40 active:scale-[0.98]"
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

              <div className="relative flex items-center justify-center gap-3">
                <svg
                  className="h-6 w-6 text-white"
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
                <span className="min-w-3xs text-lg font-bold tracking-wide text-white">
                  Complete Guide! 🎉
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete();
              }}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 font-medium text-white transition-all duration-500"
              style={{
                background: 'linear-gradient(to right, #FEAC5E 0%, #C779D0 51%, #FEAC5E 100%)',
                backgroundSize: '200% auto',
                boxShadow: '0 0 20px rgba(254, 172, 94, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundPosition = 'right center';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundPosition = 'left center';
              }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

              <div className="relative flex items-center justify-center gap-3">
                <span className="min-w-3xs text-lg font-bold tracking-wide text-white">Next</span>
                <ChevronsRight />
              </div>
            </button>
          )}
        </div>
      )}

      {/* Completion message for last step */}
      {isLastStep && isCompleted && (
        <div className="animate-fade-in mt-6 border-t border-white/10 pt-5">
          <div className="relative overflow-hidden rounded-2xl border border-green-400/30 bg-linear-to-br from-green-500/20 via-emerald-500/20 to-blue-500/20 p-8 text-center shadow-xl shadow-green-500/20 backdrop-blur-xl">
            <div className="animate-pulse-slow absolute inset-0 bg-linear-to-r from-green-500/10 via-blue-500/10 to-green-500/10" />
            <div className="relative">
              <div className="animate-bounce-slow mb-4 text-6xl">🎉</div>
              <h3 className="mb-3 bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-3xl font-bold text-white">
                Guide Complete!
              </h3>
              <p className="text-lg text-gray-300">
                Congratulations on completing this leveling guide!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
