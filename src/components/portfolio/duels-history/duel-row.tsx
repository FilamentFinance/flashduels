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
}

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
}) => {
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

  return (
    <div className="flex items-center px-4 py-2 text-sm text-stone-300 border-b border-neutral-800">
      <div className="w-[25%] flex items-center gap-2">
        <img src={icon} alt={duelName} className="w-6 h-6 rounded-full" />
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
      <div className="w-[20%] text-center">
        {activeTab === 'history' ? `$${pnl.toFixed(2)}` : time}
      </div>
    </div>
  );
};
