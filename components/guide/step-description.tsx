// components/guide/StepDescription.tsx
'use client';

import React from 'react';
import { ProcessedStep } from '@/lib/types';

interface StepDescriptionProps {
  step: ProcessedStep;
  className?: string;
}

/**
 * StepDescription - Renders step description with highlighted names
 *
 * Bolds:
 * - NPC names
 * - Mob names
 * - Quest names
 */
export const StepDescription: React.FC<StepDescriptionProps> = ({
  step,
  className = '',
}) => {
  const highlightDescription = (description: string): React.ReactNode => {
    const namesToHighlight: string[] = [];

    // Collect NPC name
    if (step.npc) {
      namesToHighlight.push(step.npc);
    }

    // Collect mob names
    if (step.mobs && step.mobs.length > 0) {
      namesToHighlight.push(...step.mobs);
    }

    // Collect quest names
    if (step.quests && step.quests.length > 0) {
      namesToHighlight.push(...step.quests.map((q) => q.name));
    }

    // If no names to highlight, return as-is
    if (namesToHighlight.length === 0) {
      return description;
    }

    // Sort by length (longest first) to avoid partial replacements
    namesToHighlight.sort((a, b) => b.length - a.length);

    // Build regex pattern - escape special characters
    const pattern = namesToHighlight
      .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');

    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = description.split(regex);

    return parts.map((part, index) => {
      // Check if this part matches any of our names (case-insensitive)
      const isMatch = namesToHighlight.some(
        (name) => name.toLowerCase() === part.toLowerCase(),
      );

      if (isMatch) {
        return (
          <strong key={index} className='font-semibold'>
            {part}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <span className={className}>{highlightDescription(step.description)}</span>
  );
};
