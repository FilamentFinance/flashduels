// import { Card } from '@/shadcn/components/ui/card';
import Image from 'next/image';
import { FC } from 'react';
import { Duel } from '@/types/duel';
import ChanceProgress from './chance-progress';

interface DuelCardProps {
  data: Duel;
  volume: string | number;
  yesPercentage: number;
  noPercentage: number;
  uniqueParticipants: number;
  timeLeft: string;
  status: number;
  winner: number;
  duelType: string;
  duelId: string;
}

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

const DuelCard: FC<DuelCardProps> = ({
  data,
  volume,
  yesPercentage,
  noPercentage,
  uniqueParticipants,
  timeLeft,
  status,
  winner,
  // duelType,
  // duelId,
}) => {
  // Shaded background inspired by FlashDuels logo
  const background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
  const iconPath = data.imageSrc || '/logo/markets/dollar.svg';

  return (
    <div className="flex items-center p-2 rounded-xl" style={{ background, minWidth: 0 }}>
      {/* Left: Icon, Title, Volume, Time */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="relative w-16 h-16 flex-shrink-0">
          {iconPath && iconPath.startsWith('http') ? (
            <Image
              src={iconPath}
              alt="Duel Image"
              fill
              className="rounded-full object-cover"
              onError={(e) => {
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
            className={`mb-1 inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(
              data.category,
            )} w-fit`}
          >
            {formatCategoryDisplay(data.category)}
          </span>
          {/* Duel Title Below */}
          <span className="text-white font-semibold text-base mb-1 break-words max-w-[60vw] md:max-w-xs whitespace-normal">
            {data.title}
          </span>
          {/* Creator Info Below Title */}
          <span className="text-xs text-zinc-400 mb-1 truncate flex items-center gap-1">
            Created by:
            {data.creatorTwitterImage && (
              <Image
                src={data.creatorTwitterImage}
                alt="Twitter"
                width={20}
                height={20}
                className="rounded-full"
                style={{ display: 'inline-block' }}
              />
            )}
            @{data.createdBy}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
              <Image src="/logo/markets/dollar.svg" alt="Volume" width={16} height={16} />
              <span>{volume}</span>
              <div className="flex items-center gap-1 ml-2 mr-2">
                <Image
                  src="/logo/markets/users.png"
                  alt="Participants"
                  width={13}
                  height={10}
                  className="invert brightness-0 opacity-60"
                />
                <span>
                  {Number(uniqueParticipants).toLocaleString('en-US', {
                    notation: 'compact',
                  })}
                </span>
              </div>
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
      {/* Right: Sentiment Arc and Winner/Status */}
      <div className="flex flex-col items-center flex-shrink-0 min-w-[180px] ml-4 gap-2">
        {/* Sentiment Arc Centered */}
        <div className="flex flex-col items-center">
          <ChanceProgress totalYesAmount={yesPercentage} totalNoAmount={noPercentage} />
        </div>
        {/* Winner/Status Centered Below Arc */}
        {(status == -1 || status == 0) && (
          <div className="flex gap-2 mt-2 justify-center">
            {timeLeft === '00:00:00' || timeLeft === '00:00' ? (
              <div className="px-4 py-2 text-xs text-zinc-400 bg-zinc-800/50 rounded-xl">
                Pending Resolution
              </div>
            ) : null}
          </div>
        )}
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
    </div>
  );
};

export default DuelCard;