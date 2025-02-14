import PositionSelector from '@/components/position-selector';
import { Duel, Position } from '@/types/dual';
import { FC, useState } from 'react';
import ChanceProgress from './chance-progress';
import Image from 'next/image';
import YesNoButton from './yes-no-button';

interface Props {
  data: Duel;
  onClick: () => void;
}

const DualRow: FC<Props> = ({ data, onClick }) => {
  const { title, volume, timeLeft } = data;
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const handlePositionSelect = (position: Position) => {
    // Stop propagation to prevent row click
    setSelectedPosition(position);
  };
  return (
    <div
      className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-900/60"
      onClick={onClick}
    >
      <div className="flex justify-center items-center gap-3">
        <img
          src={data.imageSrc || '/empty-string.png'}
          alt={title}
          className="w-14 h-14 rounded-full"
        />

        <div className="flex flex-col">
          <span className="text-white font-medium text-md">{title}</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-400 flex items-center gap-1">
              <Image src="/logo/markets/dollar.svg" alt="dollar" width={20} height={20} />
              {volume}
            </span>
            <div className="flex items-center gap-1 text-zinc-400">
              <span className="text-zinc-400 flex items-center gap-1">
                <Image src="/logo/markets/timer.svg" alt="dollar" width={10} height={10} />
                {timeLeft}
              </span>
            </div>
          </div>
        </div>
        <ChanceProgress percentage={60} size={30} strokeWidth={10} className="mx-2" />
      </div>

      {/* Right Section - Position Selector */}
      {/* Right Section - Yes/No Buttons */}
      <div className="flex gap-2" role="group" aria-label="Yes or No options">
        <YesNoButton
          text="YES"
          color="lime"
          onClick={() => handlePositionSelect('YES')}
          isSelected={selectedPosition === 'YES'}
        />
        <YesNoButton
          text="NO"
          color="red"
          onClick={() => handlePositionSelect('NO')}
          isSelected={selectedPosition === 'NO'}
        />
      </div>
    </div>
  );
};

export default DualRow;
