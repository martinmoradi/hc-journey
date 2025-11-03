// components/guide/StepTips.tsx
'use client';

import React from 'react';
import { ExternalLink, Info, TriangleAlert, Lightbulb } from 'lucide-react';

type Tip =
  | {
      type: 'warning' | 'tip' | 'info';
      class?: string | null;
      text: string;
    }
  | {
      type: 'link';
      class?: string | null;
      text: string;
      url: string;
    };

interface StepTipsProps {
  tips: Tip[];
}

/**
 * StepTips - Modern card-based tips with glassmorphism
 */
export const StepTips: React.FC<StepTipsProps> = ({ tips }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <div className='space-y-3'>
      {tips.map((tip, index) => (
        <TipItem key={index} tip={tip} />
      ))}
    </div>
  );
};

const TipItem: React.FC<{ tip: Tip }> = ({ tip }) => {
  const tipStyles = {
    warning: {
      container: 'bg-red-500/10 border-red-500/40 hover:bg-red-500/15',
      iconBg: 'bg-red-500/20',
      icon: <TriangleAlert className='w-5 h-5 text-red-400' />,
      textColor: 'text-red-200',
    },
    tip: {
      container: 'bg-yellow-500/10 border-yellow-500/40 hover:bg-yellow-500/15',
      iconBg: 'bg-yellow-500/20',
      icon: <Lightbulb className='w-5 h-5 text-yellow-400' />,
      textColor: 'text-yellow-200',
    },
    info: {
      container: 'bg-blue-500/10 border-blue-500/40 hover:bg-blue-500/15',
      iconBg: 'bg-blue-500/20',
      icon: <Info className='w-5 h-5 text-blue-400' />,
      textColor: 'text-blue-200',
    },
    link: {
      container: 'bg-purple-500/10 border-purple-500/40 hover:bg-purple-500/15',
      iconBg: 'bg-purple-500/20',
      icon: <ExternalLink className='w-5 h-5 text-purple-400' />,
      textColor: 'text-purple-200',
    },
  };

  const style = tipStyles[tip.type];

  if (tip.type === 'link') {
    return (
      <a
        href={tip.url}
        target='_blank'
        rel='noopener noreferrer'
        className={`
          group flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm
          ${style.container}
          transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
          shadow-lg hover:shadow-xl
        `}>
        <div
          className={`shrink-0 w-9 h-9 rounded-lg ${style.iconBg} flex items-center justify-center`}>
          {style.icon}
        </div>
        <div className='flex-1 min-w-0'>
          <p
            className={`${style.textColor} font-medium text-sm leading-relaxed flex items-center gap-2`}>
            {tip.text}
            <svg
              className='w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity'
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
          </p>
        </div>
      </a>
    );
  }

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm
        ${style.container}
        transition-all duration-300 shadow-lg
      `}>
      <div
        className={`shrink-0 w-9 h-9 rounded-lg ${style.iconBg} flex items-center justify-center`}>
        {style.icon}
      </div>
      <p
        className={`${style.textColor} font-medium text-sm leading-relaxed flex-1 min-w-0`}>
        {tip.text}
      </p>
    </div>
  );
};
