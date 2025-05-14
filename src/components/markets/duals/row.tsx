// import { useTotalBets } from '@/hooks/useTotalBets';
import { useTotalBetAmounts } from '@/hooks/useTotalBetAmounts';
import { Card } from '@/shadcn/components/ui/card';
import { Duel, Position } from '@/types/duel';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import ChanceProgress from './chance-progress';
import YesNoButton from './yes-no-button';

interface Props {
  data: Duel;
  onClick: () => void;
  onPositionSelect: (duelId: string, position: Position, status: number) => void;
}

const DuelRow: FC<Props> = ({ data, onClick, onPositionSelect }) => {
  const { title, volume, status, winner, duelType, duelId } = data;
  // const { totalBetYes, totalBetNo } = useTotalBets(data.duelId);
  // const { totalYesAmount, totalNoAmount } = useTotalBetAmounts(data.duelId);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { yesPercentage, noPercentage } = useTotalBetAmounts(duelId);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crypto':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'politics':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'sports':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'twitter':
        return 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
      case 'nfts':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'news':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'formula_one':
        return 'bg-red-500/20 text-rose-400 border border-red-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  const formatCategoryDisplay = (category: string) => {
    switch (category.toLowerCase()) {
      case 'formula_one':
        return 'Formula One (F1)';
      case 'crypto':
        return 'Crypto';
      case 'politics':
        return 'Politics';
      case 'sports':
        return 'Sports';
      case 'twitter':
        return 'Twitter';
      case 'nfts':
        return 'NFTs';
      case 'news':
        return 'News';
      default:
        return category || 'Other';
    }
  };

  const getIconPath = () => {
    if (duelType === 'COIN_DUEL' && title) {
      const symbol = title.split(' ')[1];
      return symbol ? `/crypto-icons/light/crypto-${symbol.toLowerCase()}-usd.inline.svg` : null;
    }
    return null;
  };

  const iconPath = getIconPath();

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

  return (
    <Card
      className="flex items-center p-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-900/90 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Left: Icon, Title, Volume, Time */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="relative w-16 h-16 flex-shrink-0">
          {duelType === 'COIN_DUEL' && iconPath && iconPath.startsWith('/') ? (
            <Image
              src={iconPath}
              alt={title.split(' ')[1]}
              fill
              className="rounded-full"
              onError={(e) => {
                console.error('Error loading crypto image:', iconPath);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : data.imageSrc && data.imageSrc.startsWith('http') ? (
            <Image
              src={data.imageSrc}
              alt="Duel Image"
              fill
              className="rounded-full object-cover"
              onError={(e) => {
                console.error('Error loading duel image:', data.imageSrc);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-400">?</span>
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          {/* Duel Category Tag First */}
          <span
            className={`mb-1 inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(data.category)} w-fit`}
          >
            {formatCategoryDisplay(data.category)}
          </span>
          {/* Duel Title Below */}
          <span className="text-white font-semibold text-base mb-1 truncate">{title}</span>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
              <Image src="/logo/markets/dollar.svg" alt="Volume" width={16} height={16} />
              <span>{volume}</span>
            </div>
            {timeLeft !== '00:00:00' && timeLeft !== '00:00' && (
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                <Image src="/logo/markets/timer.svg" alt="Time" width={14} height={14} />
                <div className="flex items-center gap-1">
                  <span>{timeLeft}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Sentiment Arc and Winner/Buttons */}
      <div className="flex flex-col items-center flex-shrink-0 min-w-[180px] ml-4 gap-2">
        {/* Sentiment Arc Centered */}
        <div className="flex flex-col items-center">
          <ChanceProgress totalYesAmount={yesPercentage} totalNoAmount={noPercentage} />
          {/* <span className="text-xs text-zinc-400 mt-1">Sentiment</span> */}
        </div>
        {/* Buttons or Status Centered Below Arc */}
        {(status == -1 || status == 0) && (
          <div className="flex gap-2 mt-2 justify-center">
            {timeLeft === '00:00:00' || timeLeft === '00:00' ? (
              <div className="px-4 py-2 text-xs text-zinc-400 bg-zinc-800/50 rounded-xl">
                Pending Resolution
              </div>
            ) : (
              <>
                <YesNoButton
                  position="LONG"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onPositionSelect(duelId, 'LONG', status);
                  }}
                />
                <YesNoButton
                  position="SHORT"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onPositionSelect(duelId, 'SHORT', status);
                  }}
                />
              </>
            )}
          </div>
        )}
        {/* Winner Centered Below Arc */}
        {(winner === 0 || winner === 1) && (
          <div className="px-4 text-center mt-2">
            <span className="text-xs text-zinc-400">Winner: </span>
            {winner === 0 ? (
              <span className="text-green-500 font-bold text-sm">LONG</span>
            ) : (
              <span className="text-red-500 font-bold text-sm">SHORT</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DuelRow;
