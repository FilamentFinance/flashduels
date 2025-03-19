import { useTotalBets } from '@/hooks/useTotalBets';
import { Card } from '@/shadcn/components/ui/card';
import { Duel, Position } from '@/types/duel';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import ChanceProgress from './chance-progress';
import YesNoButton from './yes-no-button';

interface Props {
  data: Duel;
  onClick: () => void;
  onPositionSelect: (duelId: string, position: Position) => void;
}

const DuelRow: FC<Props> = ({ data, onClick, onPositionSelect }) => {
  const { title, volume, status, winner } = data;
  const { totalBetYes, totalBetNo } = useTotalBets(data.duelId);
  const [timeLeft, setTimeLeft] = useState<string>('');
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (status === -1) {
        const waitingPeriod = 30 * 60 * 1000; // 30 minutes in milliseconds
        const createdAtMs = data.createdAt * 1000;
        const now = Date.now();
        const elapsed = now - createdAtMs;
        const remaining = waitingPeriod - elapsed;

        if (remaining <= 0) {
          return '00:00';
        }

        const minutes = Math.floor(remaining / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        const endTime = (data.startAt + data.timeLeft * 60 * 60) * 1000;
        const now = Date.now();
        const remaining = endTime - now;

        if (remaining <= 0) {
          return '00:00:00';
        }

        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    };

    const updateTime = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [data.createdAt, data.timeLeft, status]);

  const calculatedPercentage =
    ((totalBetYes as number) / (Number(totalBetYes) + Number(totalBetNo))) * 100;
  const displayPercentage = isNaN(calculatedPercentage)
    ? data.percentage
    : Number(calculatedPercentage.toFixed(2));

  // Extract symbol from title (e.g., "BTC Price" -> "BTC")
  const symbol = title.split(' ')[1];
  const iconPath = `/crypto-icons/light/crypto-${symbol.toLowerCase()}-usd.inline.svg`;
  return (
    <Card
      className="flex items-center justify-between p-3 bg-zinc-900 border-zinc-800 hover:bg-zinc-900/90 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14">
          <Image
            src={iconPath}
            alt={symbol}
            fill
            className="rounded-full "
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
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
              <div className="flex items-center gap-1">
                <span>{timeLeft}</span>
              </div>
            </div>
          </div>
        </div>

        <ChanceProgress percentage={displayPercentage} className="ml-4" />
      </div>

      {(status == -1 || status == 0) && (
        <div className="flex gap-2">
          <YesNoButton
            position="YES"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onPositionSelect(data.duelId, 'YES');
            }}
            // disabled={status === -1}
          />
          <YesNoButton
            position="NO"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onPositionSelect(data.duelId, 'NO');
            }}
            // disabled={status === -1}
          />
        </div>
      )}
      {(winner === 0 || winner === 1) && (
        <div className="px-16 text-left">
          <p className="text-zinc-400">
            Winner:{' '}
            {winner === 0 ? (
              <span className="text-green-500 font-bold ">YES</span>
            ) : (
              <span className="text-red-500 font-bold ">NO</span>
            )}
          </p>
        </div>
      )}
    </Card>
  );
};

export default DuelRow;
