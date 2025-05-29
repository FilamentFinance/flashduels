import { useTotalBetAmounts } from '@/hooks/useTotalBetAmounts';
import { useTotalBets } from '@/hooks/useTotalBets';
import { Card } from '@/shadcn/components/ui/card';
import { Duel } from '@/types/duel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';
import ChanceProgress from './duals/chance-progress';
import CopyLinkButton from './duals/copy-link-button';
import { ShareButton } from './duals/share-button';
import YesNoButton from './duals/yes-no-button';
import Link from 'next/link';

interface Props {
  duel: Duel;
}

const FullWidthDuel: FC<Props> = ({ duel }) => {
  const router = useRouter();
  const rowRef = useRef<HTMLDivElement>(null);
  const { yesPercentage, noPercentage } = useTotalBetAmounts(duel.duelId);
  const { uniqueParticipants } = useTotalBets(duel.duelId);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (duel.status === -1) {
        const waitingPeriod = 30 * 60 * 1000;
        const createdAtMs = duel.createdAt * 1000;
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
        const endTime = (duel.startAt + duel.timeLeft * 60 * 60) * 1000;
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
  }, [duel.createdAt, duel.timeLeft, duel.status]);

  return (
    <div className="w-4/5 mx-auto">
      <Card
        ref={rowRef}
        className={`flex p-2 w-full border-zinc-800 cursor-pointer relative z-20 transition-all duration-300 items-stretch bg-zinc-900 hover:bg-zinc-900/90 ${
          isHovered ? 'border-pink-300/50' : ''
        }`}
        onClick={() => router.push(`/bet?duelId=${duel.duelId}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left: Image/Logo, 30% width, fill area, clickable link */}
        <Link
          href="https://x.com/JamesWynnReal/status/1927922283596685515"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[50%] h-32 md:h-40 relative overflow-hidden rounded-l-2xl bg-zinc-900 group flex items-center justify-center mr-4 md:mr-6"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          {duel.duelType === 'COIN_DUEL' && duel.title ? (
            <Image
              src={`/crypto-icons/light/crypto-${duel.title.split(' ')[1].toLowerCase()}-usd.inline.svg`}
              alt={duel.title.split(' ')[1]}
              fill
              className="object-cover w-full h-full bg-zinc-900 transition-all duration-200 group-hover:brightness-75 group-hover:opacity-90 cursor-pointer"
              onError={(e) => {
                console.error('Error loading crypto image');
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : duel.imageSrc && duel.imageSrc.startsWith('http') ? (
            <Image
              src={duel.imageSrc}
              alt="Duel Image"
              fill
              className="object-cover w-full h-full bg-zinc-900 transition-all duration-200 group-hover:brightness-75 group-hover:opacity-90 cursor-pointer"
              onError={(e) => {
                console.error('Error loading duel image');
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-400 text-5xl">?</span>
            </div>
          )}
          {/* Optional overlay for hover effect */}
          <span className="absolute inset-0 transition-all duration-200 group-hover:bg-black/20 pointer-events-none rounded-l-2xl" />
        </Link>
        {/* Right: DuelRow-like content, 50% width */}
        <div className="w-[50%] flex items-center gap-2 min-w-0 h-full">
          <div className="flex flex-col min-w-0 flex-1">
            {/* Category Tag */}
            <span className="mb-1 inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 relative overflow-hidden group w-fit">
              <span className="flex items-center gap-1 relative">
                <span className="relative z-10 text-orange-500">🔥</span>
                <span className="relative z-10">
                  <span className="relative inline-block">
                    <span className="text-orange-400 drop-shadow-[0_0_8px_rgba(255,140,0,0.3)]">
                      Trending
                    </span>
                  </span>
                </span>
              </span>
              <span className="absolute inset-0 animate-[lightning-move_4s_linear_infinite] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent bg-[length:300%_100%] pointer-events-none"></span>
            </span>
            {/* Title */}
            <span className="text-white font-semibold text-base mb-1 break-words max-w-[60vw] md:max-w-xs whitespace-normal">
              {duel.title}
            </span>
            {/* Creator Info */}
            <span className="text-xs text-zinc-400 mb-1 truncate flex items-center gap-1">
              Created by:
              {duel.creatorTwitterImage && (
                <Image
                  src={duel.creatorTwitterImage}
                  alt="Twitter"
                  width={20}
                  height={20}
                  className="rounded-full"
                  style={{ display: 'inline-block' }}
                />
              )}
              @{duel.createdBy}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                <Image src="/logo/markets/dollar.svg" alt="Volume" width={16} height={16} />
                <span>{duel.volume}</span>
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
              <div className="flex items-center gap-1">
                <CopyLinkButton duelId={duel.duelId} tooltipPosition="top" />
                <ShareButton
                  duel={duel}
                  yesPercentage={yesPercentage}
                  noPercentage={noPercentage}
                  uniqueParticipants={uniqueParticipants}
                  timeLeft={timeLeft}
                  rowRef={rowRef as React.RefObject<HTMLDivElement>}
                />
              </div>
            </div>
          </div>
          {/* Right: Sentiment Arc and Winner/Buttons, shifted right */}
          <div className="flex flex-col items-center flex-shrink-0 min-w-[180px] ml-8 gap-2">
            {/* Sentiment Arc Centered */}
            <div className="flex flex-col items-center">
              <ChanceProgress totalYesAmount={yesPercentage} totalNoAmount={noPercentage} />
            </div>
            {/* Buttons or Status Centered Below Arc */}
            {(duel.status === 0 || duel.status === -1) && (
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
                        router.push(`/bet?duelId=${duel.duelId}`);
                      }}
                    />
                    <YesNoButton
                      position="SHORT"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        router.push(`/bet?duelId=${duel.duelId}`);
                      }}
                    />
                  </>
                )}
              </div>
            )}
            {/* Winner Centered Below Arc */}
            {(duel.winner === 0 || duel.winner === 1) && (
              <div className="px-4 text-center mt-2">
                <span className="text-xs text-zinc-400">Winner: </span>
                {duel.winner === 0 ? (
                  <span className="text-green-500 font-bold text-sm">LONG</span>
                ) : (
                  <span className="text-red-500 font-bold text-sm">SHORT</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FullWidthDuel;
