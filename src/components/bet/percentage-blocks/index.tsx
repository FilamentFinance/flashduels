import { cn } from '@/shadcn/lib/utils';
import React from 'react';
import Arc from '../../markets/duals/Arc';

interface PercentageBlocksProps {
  yesAmount: number | string;
  noAmount: number | string;
  className?: string;
}

const PercentageBlocks: React.FC<PercentageBlocksProps> = ({ yesAmount, noAmount, className }) => {
  const yes = typeof yesAmount === 'string' ? parseFloat(yesAmount) : yesAmount;
  const no = typeof noAmount === 'string' ? parseFloat(noAmount) : noAmount;
  const total = yes + no;
  let percentage = 0;
  let sentimentLabel = 'NEUTRAL';
  let color = '#A1A1AA'; // gray
  if (total !== 0) {
    percentage = Math.round(((yes - no) / total) * 100);
    if (percentage > 0) {
      sentimentLabel = 'LONG';
      color = '#95DE64'; // green
    } else if (percentage < 0) {
      sentimentLabel = 'SHORT';
      color = '#F87171'; // red
    }
  }

  // const blocks = 10;
  // let filledBlocks = 0;
  // if (total !== 0) {
  //   filledBlocks = Math.round((Math.abs(percentage) / 100) * blocks);
  // }
  // // Center is between 4 and 5 (0-based index)
  // const centerLeft = 4;
  // const centerRight = 5;

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Arc percentage={percentage} color={color} label="Sentiment" labelClassName="-mt-6" />
      {/* <div className="flex items-center justify-center mt-2">
        {/* Center-outwards blocks visualization */}
        {/* <div className="flex gap-0.5 mr-4 justify-center items-center">
          {Array.from({ length: blocks }).map((_, idx) => {
            if (sentimentLabel === 'SHORT') {
              // Fill from center to left
              return (
                <div
                  key={`block-${idx}`}
                  className={
                    'w-2 h-4 rounded-full ' +
                    (idx <= centerLeft && idx >= centerLeft - filledBlocks + 1
                      ? 'bg-red-400'
                      : 'bg-neutral-800')
                  }
                />
              );
            } else if (sentimentLabel === 'LONG') { */}
              {/* // Fill from center to right */}
              {/* return (
                <div
                  key={`block-${idx}`}
                  className={
                    'w-2 h-4 rounded-full ' +
                    (idx >= centerRight && idx < centerRight + filledBlocks
                      ? 'bg-lime-300'
                      : 'bg-neutral-800')
                  }
                />
              );
            } else {
              // Neutral */}
              {/* return <div key={`block-${idx}`} className={'w-2 h-4 rounded-full bg-neutral-800'} />;
            }
          })}
        </div> */}
        {/* <span className="text-lg font-bold uppercase opacity-70" style={{ color }}>
          {sentimentLabel}
        </span>
        <span className="ml-2 text-lg font-bold" style={{ color }}>
          {Math.abs(percentage)}%
        </span> */}
      {/* </div> */}
    </div>
  );
};

export default PercentageBlocks;
