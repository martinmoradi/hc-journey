// components/guide/VirtualizedStepList.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ProcessedStep } from '@/lib/types';
import { StepItem } from '@/components/guide/step-item';
import { useGuide } from '@/lib/providers/guide-provider';

interface VirtualizedStepListProps {
  steps: ProcessedStep[];
  currentStepIndex: number;
  onMarkComplete: () => void;
}

export const VirtualizedStepList: React.FC<VirtualizedStepListProps> = ({
  steps,
  currentStepIndex,
  onMarkComplete,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const previousStepIndexRef = useRef(currentStepIndex);
  const hasScrolledToInitialStep = useRef(false);
  const { scrollTrigger } = useGuide();

  const virtualizer = useVirtualizer({
    count: steps.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
    scrollPaddingStart: 200,
  });

  // Listen to scrollTrigger from TopBar Eye button
  useEffect(() => {
    if (scrollTrigger > 0) {
      virtualizer.scrollToIndex(currentStepIndex, {
        align: 'start',
        behavior: 'smooth',
      });
    }
  }, [scrollTrigger, currentStepIndex, virtualizer]);

  // Initial scroll to current step on mount
  useEffect(() => {
    if (!hasScrolledToInitialStep.current && currentStepIndex > 0) {
      setTimeout(() => {
        virtualizer.scrollToIndex(currentStepIndex, {
          align: 'start',
          behavior: 'auto',
        });
        hasScrolledToInitialStep.current = true;
      }, 100);
    }
  }, [virtualizer, currentStepIndex]);

  // Auto-scroll to current step when it changes
  useEffect(() => {
    const previousIndex = previousStepIndexRef.current;

    if (
      previousIndex !== currentStepIndex &&
      previousIndex >= 0 &&
      hasScrolledToInitialStep.current
    ) {
      setTimeout(() => {
        virtualizer.scrollToIndex(currentStepIndex, {
          align: 'start',
          behavior: 'smooth',
        });
      }, 100);
    }

    previousStepIndexRef.current = currentStepIndex;
  }, [currentStepIndex, virtualizer]);

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-auto bg-linear-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419]"
      style={{
        contain: 'strict',
        /* Custom scrollbar styling */
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const step = steps[virtualItem.index];
          const isCurrentStep = virtualItem.index === currentStepIndex;
          const isCompleted = virtualItem.index < currentStepIndex;
          const isLastStep = virtualItem.index === steps.length - 1;

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <StepItem
                step={step}
                stepNumber={virtualItem.index + 1}
                isCurrentStep={isCurrentStep}
                isCompleted={isCompleted}
                isLastStep={isLastStep}
                onMarkComplete={onMarkComplete}
              />
            </div>
          );
        })}
      </div>

      {/* Custom scrollbar styles for webkit browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};
