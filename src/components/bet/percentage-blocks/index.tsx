import { cn } from '@/shadcn/lib/utils';
import React from 'react';

interface PercentageBlocksProps {
  leftPercentage?: number; // NO
  rightPercentage?: number; // YES
  className?: string;
}

const PercentageBlocks: React.FC<PercentageBlocksProps> = ({
  leftPercentage = 50,
  rightPercentage = 50,
  className,
}) => {
  const blocksPerSide = 5;
  const leftBlocks = Math.round((leftPercentage / 100) * blocksPerSide);
  const rightBlocks = Math.round((rightPercentage / 100) * blocksPerSide);

  return (
    <div className={cn('flex items-center w-full justify-center gap-1', className)}>
      <span className="text-red-400 text-sm font-bold min-w-[28px] text-center self-center flex items-center justify-center">
        {leftPercentage}%
      </span>
      <div className="flex gap-0.5 mx-1 justify-center items-center">
        {/* NO blocks: from center to left */}
        {Array.from({ length: blocksPerSide }).map((_, idx) => (
          <div
            key={`no-${idx}`}
            className={
              'w-1.5 h-3 rounded-full ' +
              (idx >= blocksPerSide - leftBlocks ? 'bg-red-400' : 'bg-neutral-800')
            }
          />
        ))}
        {/* YES blocks: from center to right */}
        {Array.from({ length: blocksPerSide }).map((_, idx) => (
          <div
            key={`yes-${idx}`}
            className={
              'w-1.5 h-3 rounded-full ' + (idx < rightBlocks ? 'bg-lime-300' : 'bg-neutral-800')
            }
          />
        ))}
      </div>
      <span className="text-lime-300 text-sm font-bold min-w-[28px] text-center self-center flex items-center justify-center ml-2">
        {rightPercentage}%
      </span>
    </div>
  );
};

export default PercentageBlocks;
