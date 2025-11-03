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
    const target =
      step.npc || (step.mobs && step.mobs.length > 0 ? step.mobs[0] : '');

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
    <div className='px-5 pb-5 pt-3'>
      {/* Two-column layout */}
      <div
        className={`grid gap-5 ${
          hasMap ? 'lg:grid-cols-[1fr_1.5fr]' : 'grid-cols-1'
        }`}>
        {/* Details section */}
        <div className='space-y-4'>
          {/* Tips section */}
          {step.tips && step.tips.length > 0 && (
            <div className='animate-slide-in'>
              <StepTips tips={step.tips} />
            </div>
          )}

          {/* Mobs section */}
          {step.mobs && step.mobs.length > 0 && (
            <div className='animate-slide-in animation-delay-100'>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-2'>
                <span className='w-1 h-4 bg-red-500 rounded-full'></span>
                Targets
              </h3>
              <div className='space-y-2'>
                {step.mobs.map((mob, index) => (
                  <div
                    key={index}
                    className='group flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm hover:bg-red-500/15 transition-all duration-300 hover:scale-[1.02]'>
                    <div className='w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center'>
                      <img
                        src='/assets/misc/battle.png'
                        alt='Battle'
                        className='w-5 h-5'
                      />
                    </div>
                    <span className='font-medium text-gray-200 text-sm'>
                      {mob}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quests section */}
          {step.quests && step.quests.length > 0 && (
            <div className='animate-slide-in animation-delay-200 relative'>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-2'>
                <span className='w-1 h-4 bg-yellow-500 rounded-full'></span>
                Quests
              </h3>
              <div className='space-y-2 '>
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
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-sm hover:bg-yellow-500/15 transition-all duration-300 hover:scale-[1.02]'>
                      <div className='w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center'>
                        <img
                          src={
                            isTurnIn
                              ? '/assets/misc/turnin_quest.png'
                              : '/assets/misc/available_quest.png'
                          }
                          alt={isTurnIn ? 'Turn In Quest' : 'Available Quest'}
                          width={20}
                          height={20}
                          className='object-contain'
                        />
                      </div>
                      <span className='font-medium text-gray-200 text-sm flex-1'>
                        {quest.name}
                      </span>
                      <svg
                        className='w-4 h-4 text-gray-400 transition-opacity'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                        />
                      </svg>
                    </a>
                  );
                })}
              </div>
              <p className='absolute right-0 text-[11px] text-gray-500 italic mr-4'>
                Click to open on Wowhead
              </p>
            </div>
          )}

          {/* NPC */}
          {step.npc && (
            <div className='animate-slide-in animation-delay-300'>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-2'>
                <span className='w-1 h-4 bg-blue-500 rounded-full'></span>
                NPC
              </h3>
              <div className='flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm'>
                <div className='w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center'>
                  <span className='text-lg'>💬</span>
                </div>
                <span className='font-medium text-gray-200 text-sm'>
                  {step.npc}
                </span>
              </div>
            </div>
          )}

          {/* Location */}
          {step.coords && step.zone && step.zone !== '' && (
            <div className='animate-slide-in animation-delay-400'>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-2'>
                <span className='w-1 h-4 bg-purple-500 rounded-full'></span>
                Location
              </h3>
              <div className='relative pb-5'>
                <button
                  onClick={handleCopyWaypoint}
                  className='group w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm hover:bg-purple-500/15 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'>
                  <div className='w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center'>
                    <span className='text-lg'>📍</span>
                  </div>
                  <span className='font-medium text-gray-200 text-sm capitalize flex-1 text-left'>
                    {step.zone.replace(/_/g, ' ')}: {step.coords[0]},{' '}
                    {step.coords[1]}
                  </span>
                  {waypointCopied && (
                    <span className='text-xs text-green-400 font-semibold animate-fade-in'>
                      Copied!
                    </span>
                  )}
                  <ClipboardList className='w-4 h-4 text-gray-400 transition-opacity' />
                </button>
                <p className='absolute right-0 text-[11px] text-gray-500 italic mr-4'>
                  Click to copy TomTom macro
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map section */}
        {hasMap && (
          <div className='space-y-2 animate-slide-in animation-delay-500'>
            <Map zone={step.zone!} x={step.coords![0]} y={step.coords![1]} />
          </div>
        )}
      </div>

      {/* Mark Complete button */}
      {isCurrentStep && onMarkComplete && !isCompleted && (
        <div className='mt-6 pt-5 border-t border-white/10 animate-slide-in animation-delay-600 flex flex-row items-end justify-end'>
          {isLastStep ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete();
              }}
              className='group relative w-full px-8 py-5 rounded-xl overflow-hidden
                bg-linear-to-r from-green-500 via-emerald-500 to-blue-500
                hover:from-green-400 hover:via-emerald-400 hover:to-blue-400
                transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]
                shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40'>
              {/* Animated shimmer effect */}
              <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />

              <div className='relative flex items-center justify-center gap-3'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2.5}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <span className='text-lg font-bold text-white tracking-wide min-w-3xs'>
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
              className='group relative overflow-hidden rounded-xl px-6 py-2.5 font-medium text-white transition-all duration-500 flex items-center gap-2'
              style={{
                background:
                  'linear-gradient(to right, #FEAC5E 0%, #C779D0 51%, #FEAC5E 100%)',
                backgroundSize: '200% auto',
                boxShadow: '0 0 20px rgba(254, 172, 94, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundPosition = 'right center';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundPosition = 'left center';
              }}>
              {/* Animated shimmer effect */}
              <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />

              <div className='relative flex items-center justify-center gap-3'>
                <span className='text-lg font-bold text-white tracking-wide min-w-3xs'>
                  Next
                </span>
                <ChevronsRight />
              </div>
            </button>
          )}
        </div>
      )}

      {/* Completion message for last step */}
      {isLastStep && isCompleted && (
        <div className='mt-6 pt-5 border-t border-white/10 animate-fade-in'>
          <div className='relative rounded-2xl overflow-hidden p-8 text-center backdrop-blur-xl bg-linear-to-br from-green-500/20 via-emerald-500/20 to-blue-500/20 border border-green-400/30 shadow-xl shadow-green-500/20'>
            <div className='absolute inset-0 bg-linear-to-r from-green-500/10 via-blue-500/10 to-green-500/10 animate-pulse-slow' />
            <div className='relative'>
              <div className='text-6xl mb-4 animate-bounce-slow'>🎉</div>
              <h3 className='text-3xl font-bold text-white mb-3 bg-linear-to-r from-green-400 to-blue-400 bg-clip-text'>
                Guide Complete!
              </h3>
              <p className='text-gray-300 text-lg'>
                Congratulations on completing this leveling guide!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
