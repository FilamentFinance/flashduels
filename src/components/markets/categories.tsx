'use client';

import { CATEGORIES } from '@/constants/markets';
import { cn } from '@/shadcn/lib/utils';
import { FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';

interface CategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const Categories: FC<CategoriesProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="flex items-center gap-4 py-4">
      {Object.entries(CATEGORIES)
        .filter(([, cat]) => !cat.hidden)
        .map(([key, { title, icon, comingSoon }]) => {
          const isActive = title === activeCategory;
          const isComingSoon = Boolean(comingSoon);

          // Create the button content
          const buttonContent = (
            <button
              key={`button-${key}`}
              onClick={() => !isComingSoon && setActiveCategory(title)}
              className={cn(
                'group flex items-center transition-all duration-200 rounded-md p-2 gap-1',
                isActive
                  ? 'bg-[#F19ED2]/20 border border-[#F19ED2]'
                  : 'bg-[#44464933] hover:bg-zinc-800/50',
                isComingSoon && 'opacity-60 cursor-not-allowed',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-md',
                  isActive ? 'bg-[#F19ED2]' : 'bg-zinc-900',
                )}
              >
                <span className="text-md">{icon}</span>
              </div>
              <span className="text-md font-medium whitespace-nowrap">{title}</span>
            </button>
          );

          // If coming soon, wrap in tooltip
          if (isComingSoon) {
            return (
              <TooltipProvider key={`tooltip-${key}`}>
                <Tooltip>
                  <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          // Otherwise return the button directly
          return buttonContent;
        })}
    </div>
  );
};

export default Categories;
