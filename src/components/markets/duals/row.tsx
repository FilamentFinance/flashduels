import { Duel } from '@/types/dual';
import { Timer } from 'lucide-react';
import { FC } from 'react';

type Props = {
  data: Duel;
  onClick: () => void;
};

const DualRow: FC<Props> = ({ data, onClick }) => {
  const { title, imageSrc, volume, timeLeft, percentage, createdBy } = data;

  // const handleButtonClick = (e: React.MouseEvent, action: 'YES' | 'NO') => {
  //   e.stopPropagation(); // Prevent row click when clicking buttons
  //   // Handle YES/NO actions here
  //   console.log(`${action} clicked for duel ${duelId}`);
  // };

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-4 p-4 rounded-2xl border border-zinc-800 bg-[#141217] hover:bg-zinc-900/30 cursor-pointer transition-colors"
    >
      {/* Title Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src={imageSrc || '/empty-string.png'}
            alt={title}
            width={24}
            height={24}
            className="rounded-full"
          />
          <h3 className="text-base font-semibold text-stone-200">{title}</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <Timer className="w-4 h-4" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Volume */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">Volume</span>
            <span className="text-sm font-medium text-stone-200">{volume}</span>
          </div>
          {/* Created By */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">Created by</span>
            <span className="text-sm font-medium text-stone-200">{createdBy}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <PositionSelector
          selectedPosition={selectedPosition}
          onPositionSelect={setSelectedPosition}
        /> */}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-flashDualPink rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default DualRow;
