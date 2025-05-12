import { cn } from '@/shadcn/lib/utils';
import React from 'react';
import Arc from './Arc';

interface ChanceProgressProps {
  totalYesAmount: number | string;
  totalNoAmount: number | string;
  className?: string;
}

const ChanceProgress: React.FC<ChanceProgressProps> = ({
  totalYesAmount,
  totalNoAmount,
  className,
}) => {
  const yes = typeof totalYesAmount === 'string' ? parseFloat(totalYesAmount) : totalYesAmount;
  const no = typeof totalNoAmount === 'string' ? parseFloat(totalNoAmount) : totalNoAmount;
  const total = yes + no;
  let percentage = 0;
  if (total !== 0) {
    percentage = Math.round(((yes - no) / total) * 100);
  }
  let color = '#A1A1AA'; // gray
  let sentimentLabel = 'NEUTRAL';
  if (percentage > 0) {
    color = '#95DE64'; // green
    sentimentLabel = 'YES';
  } else if (percentage < 0) {
    color = '#F87171'; // red
    sentimentLabel = 'NO';
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Arc percentage={percentage} color={color} label="Sentiment" labelClassName="-mt-6" />
      <span className="ml-4 text-lg font-bold uppercase opacity-70" style={{ color }}>
        {sentimentLabel}
      </span>
    </div>
  );
};

export default ChanceProgress;
