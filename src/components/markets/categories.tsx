'use client';

import { CATEGORIES } from '@/constants/markets';
import { cn } from '@/shadcn/lib/utils';
import { FC, useState } from 'react';

const Categories: FC = () => {
  const [activeCategory, setActiveCategory] = useState('TRENDING');

  return (
    <div className="flex items-center gap-4 p-4">
      {Object.entries(CATEGORIES).map(([key, { title, icon }]) => {
        const isActive = key === activeCategory;
        return (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'group flex items-center transition-all duration-200 rounded-md p-4',
              isActive
                ? 'bg-[#F19ED2]/20 border border-[#F19ED2]  '
                : 'bg-[#44464933]  hover:bg-zinc-800/50',
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-md',
                isActive ? 'bg-[#F19ED2]' : 'bg-zinc-900',
              )}
            >
              <span className="text-xl">{icon}</span>
            </div>
            <span className="text-xl font-medium whitespace-nowrap ">{title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Categories;
