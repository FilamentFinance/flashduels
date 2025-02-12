'use client';

import { CATEGORIES } from '@/constants/markets';
import { cn } from '@/shadcn/lib/utils';
import Image from 'next/image';
import { FC, useState } from 'react';

const Categories: FC = () => {
  const [activeCategory, setActiveCategory] = useState('TRENDING');

  return (
    <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-xl">
      {Object.entries(CATEGORIES).map(([key, { title, icon }]) => {
        const isActive = key === activeCategory;
        return (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
              isActive ? 'bg-gradient-pink text-black' : 'text-zinc-400 hover:bg-zinc-800/50',
            )}
          >
            <Image
              src={icon}
              alt={title}
              width={16}
              height={16}
              className={cn('opacity-80', isActive && 'opacity-100')}
            />
            <span className="text-sm font-medium">{title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Categories;
