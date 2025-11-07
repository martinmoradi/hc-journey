/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Maximize2, Minimize2, Footprints } from 'lucide-react';
import { ProcessedStep } from '@/lib/types';
import { StepDescription } from '@/components/guide/step-description';
import { StepDetails } from '@/components/guide/step-details';

interface StepItemProps {
  step: ProcessedStep;
  stepNumber: number;
  isCurrentStep: boolean;
  isCompleted: boolean;
  isLastStep?: boolean;
  onMarkComplete?: () => void;
}

/**
 * StepItem - Modern glassmorphism design with smooth animations
 */
export const StepItem: React.FC<StepItemProps> = ({
  step,
  stepNumber,
  isCurrentStep,
  isCompleted,
  isLastStep = false,
  onMarkComplete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsHeight, setDetailsHeight] = useState(0);

  // Auto-expand when becoming current step (intentional setState in effect)
  useEffect(() => {
    if (isCurrentStep) {
      setIsExpanded(true);
    }
  }, [isCurrentStep]);

  // Measure details height for animation
  useEffect(() => {
    if (isExpanded && detailsRef.current) {
      const height = detailsRef.current.scrollHeight;
      setDetailsHeight(height);
    } else {
      setDetailsHeight(0);
    }
  }, [isExpanded, step]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkComplete = () => {
    setIsExpanded(false);
    onMarkComplete?.();
  };

  const getStepIcon = (type: string, description: string): string => {
    // Special case: Hearthstone usage (not setting hearthstone location)
    if (
      type === 'info' &&
      description.includes('Hearth to') &&
      !description.includes('Hearthstone to')
    ) {
      return '/assets/misc/hearthstone.png';
    }

    const iconMap: Record<string, string> = {
      quest_accept: '/assets/misc/available_quest.png',
      quest_turnin: '/assets/misc/turnin_quest.png',
      kill: '/assets/misc/battle.png',
      grind: '/assets/misc/battle.png',
      loot: '/assets/misc/loot.png',
      travel: '/assets/misc/footprints.png',
      fly: '/assets/misc/fly.png',
      info: '/assets/misc/gossip.png',
    };
    return iconMap[type] || '/assets/misc/gossip.png';
  };

  return (
    <div
      className={`mx-4 my-3 rounded-2xl transition-all duration-500 ease-out ${
        isCurrentStep
          ? 'scale-[1.02] shadow-2xl shadow-blue-500/20'
          : isCompleted
            ? 'scale-[0.98] opacity-70'
            : 'scale-100'
      } `}
    >
      {/* Glassmorphism card with glow effect for current step */}
      <div
        className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl ${
          isCurrentStep
            ? 'border-blue-400/30 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 shadow-lg shadow-blue-500/30'
            : isCompleted
              ? 'border-white/10 bg-white/5'
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
        } transition-all duration-500`}
      >
        {/* Animated glow for current step */}
        {isCurrentStep && (
          <div className="animate-pulse-slow pointer-events-none absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" />
        )}

        {/* Header Row */}
        <div
          onClick={handleToggle}
          className={` ${isCompleted ? 'p-3' : 'p-5'} relative z-10 cursor-pointer transition-all duration-300 hover:bg-white/5 active:scale-[0.99]`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          aria-expanded={isExpanded}
          aria-label={`Step ${stepNumber}: ${step.description}`}
        >
          <div className="flex items-center gap-4">
            {/* Step Icon or Checkmark */}
            <div className="shrink-0">
              {isCompleted ? (
                <div className="animate-check-pop flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/30">
                  <svg
                    className="h-5 w-5 text-white"
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
              ) : (
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-all duration-300 ${
                    isCurrentStep
                      ? 'border border-blue-400/30 bg-linear-to-br from-blue-500/30 to-purple-500/30 shadow-blue-500/50'
                      : 'border border-white/20 bg-white/10'
                  } `}
                >
                  {step.type === 'travel' ? (
                    <Footprints className="h-7 w-7" style={{ color: 'white' }} />
                  ) : (
                    <Image
                      src={getStepIcon(step.type, step.description)}
                      alt={step.type}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="min-w-0 flex-1">
              <StepDescription
                step={step}
                className={`leading-relaxed transition-all duration-300 ${
                  isCompleted && !isExpanded
                    ? 'text-sm text-gray-400'
                    : isCurrentStep
                      ? 'text-lg font-medium text-white'
                      : 'text-base text-gray-300'
                } `}
              />
            </div>

            {/* Expand/Collapse Button */}
            <div className="shrink-0">
              <div
                className={`rounded-lg p-2 transition-all duration-300 ${
                  isCurrentStep
                    ? 'bg-blue-500/20 hover:bg-blue-500/30'
                    : 'bg-white/10 hover:bg-white/20'
                } `}
              >
                {isExpanded ? (
                  <Minimize2
                    className={`h-5 w-5 transition-all duration-300 ${isCurrentStep ? 'text-blue-300' : 'text-gray-400'} `}
                  />
                ) : (
                  <Maximize2
                    className={`h-5 w-5 transition-all duration-300 ${isCurrentStep ? 'text-blue-300' : 'text-gray-400'} `}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section - Smooth Animated Expansion */}
        <div
          style={{
            height: isExpanded ? `${detailsHeight}px` : '0px',
            opacity: isExpanded ? 1 : 0,
          }}
          className="overflow-hidden transition-all duration-500 ease-out"
        >
          <div ref={detailsRef}>
            <div className="border-t border-white/10">
              <StepDetails
                step={step}
                isCurrentStep={isCurrentStep}
                isCompleted={isCompleted}
                isLastStep={isLastStep}
                onMarkComplete={handleMarkComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
