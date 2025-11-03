// components/guide/GuideViewer.tsx
'use client';

import React from 'react';
import { useGuide } from '@/lib/providers/guide-provider';
import { VirtualizedStepList } from './virtualized-step-list';
import { Progress } from '@/components/ui/progress';

export const GuideViewer: React.FC = () => {
  const {
    allSteps,
    totalSteps,
    isLoading,
    error,
    currentStepIndex,
    markStepAsCompleted,
  } = useGuide();

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full p-8 bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419]'>
        <div className='text-center'>
          {/* Modern loading spinner with gradient */}
          <div className='relative w-16 h-16 mx-auto mb-6'>
            <div className='absolute inset-0 rounded-full border-4 border-white/10'></div>
            <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin'></div>
          </div>
          <p className='text-gray-300 text-lg font-medium'>Loading guide...</p>
          <p className='text-gray-500 text-sm mt-2'>Preparing your adventure</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex items-center justify-center h-full p-8 bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419]'>
        <div className='text-center max-w-md'>
          <div className='relative mb-6'>
            <div className='w-20 h-20 mx-auto rounded-full bg-red-500/10 border border-red-500/30 backdrop-blur-sm flex items-center justify-center'>
              <span className='text-4xl'>⚠️</span>
            </div>
          </div>
          <h2 className='text-2xl font-bold text-white mb-3'>
            Failed to Load Guide
          </h2>
          <p className='text-gray-400 mb-6 leading-relaxed'>{error}</p>
          <div className='px-6 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm'>
            <p className='text-sm text-gray-400'>
              Try refreshing the page or selecting a different race/class
              combination.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No steps loaded yet
  if (totalSteps === 0) {
    return (
      <div className='flex items-center justify-center h-full p-8 bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419]'>
        <div className='text-center max-w-md'>
          <div className='relative mb-6'>
            <div className='w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30 backdrop-blur-sm flex items-center justify-center'>
              <span className='text-5xl'>📋</span>
            </div>
            {/* Subtle glow effect */}
            <div className='absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-r from-blue-500 to-purple-500'></div>
          </div>
          <h2 className='text-2xl font-bold text-white mb-3'>
            No Guide Loaded
          </h2>
          <p className='text-gray-400 leading-relaxed'>
            Select a race and class to load your leveling guide.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-1 overflow-hidden'>
        <VirtualizedStepList
          steps={allSteps}
          currentStepIndex={currentStepIndex}
          onMarkComplete={markStepAsCompleted}
        />
      </div>
    </div>
  );
};
