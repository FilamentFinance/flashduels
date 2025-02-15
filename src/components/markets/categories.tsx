'use client';

import { CATEGORIES } from '@/constants/markets';
import { cn } from '@/shadcn/lib/utils';
import { FC } from 'react';

interface CategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const Categories: FC<CategoriesProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="flex items-center gap-4 py-4">
      {Object.entries(CATEGORIES).map(([key, { title, icon }]) => {
        const isActive = title === activeCategory;
        return (
          <button
            key={key}
            onClick={() => setActiveCategory(title)}
            className={cn(
              'group flex items-center transition-all duration-200 rounded-md p-2 gap-1',
              isActive
                ? 'bg-[#F19ED2]/20 border border-[#F19ED2]'
                : 'bg-[#44464933] hover:bg-zinc-800/50',
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
      })}
    </div>
  );
};

export default Categories;
