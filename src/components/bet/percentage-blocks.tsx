import { cn } from '@/shadcn/lib/utils';
import React from 'react';

interface PercentageBlocksProps {
  percentage: number;
  className?: string;
  totalBlocks?: number;
}

const PercentageBlocks: React.FC<PercentageBlocksProps> = ({
  percentage,
  className,
  totalBlocks = 10, // Default to 10 blocks
}) => {
  // Calculate how many blocks should be active
  const activeBlocks = Math.round((percentage / 100) * totalBlocks);

  return (
    <div className={cn('flex flex-col items-start gap-2', className)}>
      {/* Percentage text */}
      <span className="text-[#95DE64] text-md  font-bold">{percentage}%</span>

      {/* Blocks container */}
      <div className="flex gap-1">
        {Array.from({ length: totalBlocks }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-1 h-3 rounded-full transition-colors duration-200',
              index < activeBlocks
                ? 'bg-[#95DE64]' // Active block color
                : 'bg-[#1E1E1E]', // Inactive block color
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default PercentageBlocks;
