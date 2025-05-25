import { cn } from '@/shadcn/lib/utils';
import Image from 'next/image';
import React from 'react';

interface DuelRowProps {
  duelName: string;
  direction: string;
  avgPrice: string;
  resolvesIn: number;
  status: number;
  createdAt: number;
  startAt: number;
  icon: string;
  pnl: number;
  amount: string;
  activeTab: string;
  quantity: string;
  winner?: number;
  duelType?: string;
}

const getIconPath = (duelType?: string, title?: string): string => {
  // console.log('getIconPath inputs:', { duelType, title });

  if (title) {
    // Extract token name - works for both "Will AAVE be ABOVE 148" format
    const tokenMatch = title.match(/Will (\w+) be/);
    if (tokenMatch && tokenMatch[1]) {
      const symbol = tokenMatch[1];
      const path = `/crypto-icons/light/crypto-${symbol.toLowerCase()}-usd.inline.svg`;
      console.log('Generated icon path:', path);
      return path;
    }
  }
  console.log('No icon path generated, returning empty string');
  return '';
};

export const DuelRow: React.FC<DuelRowProps> = ({
  duelName,
  direction,
  avgPrice,
  resolvesIn,
  status,
  createdAt,
  startAt,
  icon,
  pnl,
  amount,
  activeTab,
  quantity,
  winner,
  duelType,
}) => {
  console.log('DuelRow props:', {
    duelName,
    direction,
    duelType,
    icon,
  });

  const thirtyMinutesMs = 30 * 60 * 1000;
  const durationMs = resolvesIn * 60 * 60 * 1000;
  const [time, setTimeLeft] = React.useState('');

  const calculateRemainingTime = () => {
    const currentTimeMs = Date.now();
    const startTimeMs = createdAt * 1000;
    let remainingTimeMs;
    const timeElapsedMs = currentTimeMs - startTimeMs;

    if (timeElapsedMs > thirtyMinutesMs || status === 0) {
      const startAtTimeMs = startAt * 1000;
      const timeSinceStartAt = currentTimeMs - startAtTimeMs;
      remainingTimeMs = Math.max(durationMs - timeSinceStartAt, 0);
    } else {
      remainingTimeMs = Math.max(thirtyMinutesMs - timeElapsedMs, 0);
    }

    return remainingTimeMs;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const padTime = (time: number) => time.toString().padStart(2, '0');
    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const remainingTimeMs = calculateRemainingTime();
      setTimeLeft(formatTime(remainingTimeMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt, startAt, resolvesIn]);

  // Always try to get icon path regardless of direction
  const iconPath = getIconPath(duelType, duelName) || icon;
  console.log('Final iconPath used:', iconPath);

  return (
    <div className="flex items-center px-4 py-2 text-sm text-stone-300 border-b border-neutral-800">
      <div className="w-[35%] flex items-center gap-2">
        {iconPath && (
          <Image
            src={iconPath}
            alt={`${duelName} icon`}
            width={24}
            height={24}
            className="rounded-full"
            onError={(e) => {
              console.error('Image failed to load:', iconPath);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
        <span>{duelName}</span>
      </div>
      <div
        className={`w-[15%] text-center ${direction === 'Yes' ? 'text-green-500' : 'text-red-500'}`}
      >
        {direction}
      </div>
      <div className="w-[15%] text-center">{Number(quantity).toFixed(2)}</div>
      <div className="w-[15%] text-center">${Number(avgPrice).toFixed(2)}</div>
      <div className="w-[15%] text-center">${Number(amount).toFixed(2)}</div>
      <div className="w-[20%] text-center">{activeTab === 'history' ? `${pnl ?? 0}` : time}</div>
      <div className={cn(winner !== undefined ? 'w-[20%] text-center ' : 'hidden')}>
        {winner === 0 || winner === 1 ? (
          winner === 0 ? (
            <span className="text-green-500">LONG</span>
          ) : (
            <span className="text-red-500">SHORT</span>
          )
        ) : status === 5 ? (
          <span className="text-neutral-400">CANCELLED</span>
        ) : null}
      </div>
    </div>
  );
};
