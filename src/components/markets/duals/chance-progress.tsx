import { cn } from '@/shadcn/lib/utils';
import React from 'react';

interface ChanceProgressProps {
  percentage: number;
  className?: string;
}

const ChanceProgress: React.FC<ChanceProgressProps> = ({ percentage, className }) => {
  const size = 90; // Smaller size
  const strokeWidth = 6; // Thinner stroke
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const progressOffset = ((100 - percentage) / 100) * circumference;

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform p-1">
        {/* Background Arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} a ${radius} ${radius} 0 0 1 ${size - strokeWidth} 0`}
          fill="none"
          stroke="#1E1E1E"
          strokeWidth={strokeWidth}
          className="transition-all duration-500 ease-in-out"
        />

        {/* Progress Arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} a ${radius} ${radius} 0 0 1 ${size - strokeWidth} 0`}
          fill="none"
          stroke="#95DE64"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>

      {/* Percentage Text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-base font-bold text-[#95DE64] ">{percentage}%</span>
        <span className="text-zinc-400 text-xs mt-0.5">Chance</span>
      </div>
    </div>
  );
};

export default ChanceProgress;
