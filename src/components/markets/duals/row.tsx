import { useTotalBets } from '@/hooks/useTotalBets';
import { Duel, Position } from '@/types/dual';
import { Card } from '@/shadcn/components/ui/card';
import Image from 'next/image';
import { FC, useState } from 'react';
import ChanceProgress from './chance-progress';
import YesNoButton from './yes-no-button';

interface Props {
  data: Duel;
  onClick: () => void;
}

const DualRow: FC<Props> = ({ data, onClick }) => {
  const { title, volume, timeLeft } = data;
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { totalBetYes, totalBetNo } = useTotalBets(data.duelId);

  const handlePositionSelect = (position: Position) => {
    setSelectedPosition(position);
  };

  const calculatedPercentage =
    ((totalBetYes as number) / (Number(totalBetYes) + Number(totalBetNo))) * 100;
  const displayPercentage = isNaN(calculatedPercentage)
    ? data.percentage
    : Number(calculatedPercentage.toFixed(2));

  return (
    <Card
      className="flex items-center justify-between p-3 bg-zinc-900 border-zinc-800 hover:bg-zinc-900/90 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14">
          <Image
            src={data.imageSrc || '/empty-string.png'}
            alt={title}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-white font-medium text-base">{title}</span>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
              <Image src="/logo/markets/dollar.svg" alt="Volume" width={16} height={16} />
              <span>{volume}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
              <Image src="/logo/markets/timer.svg" alt="Time" width={14} height={14} />
              <span>{timeLeft}h</span>
            </div>
          </div>
        </div>

        <ChanceProgress percentage={displayPercentage} className="ml-4" />
      </div>

      <div className="flex gap-2">
        <YesNoButton
          position="YES"
          onClick={() => handlePositionSelect('YES')}
          isSelected={selectedPosition === 'YES'}
        />
        <YesNoButton
          position="NO"
          onClick={() => handlePositionSelect('NO')}
          isSelected={selectedPosition === 'NO'}
        />
      </div>
    </Card>
  );
};

export default DualRow;
