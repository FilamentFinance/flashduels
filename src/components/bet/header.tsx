import Image from 'next/image';
import { FC } from 'react';
import DetailsAndRules from './details-and-rules';
import PercentageBlocks from './percentage-blocks';
import React from 'react';
interface Props {
  title: string;
  logo: string;
  triggerPrice: string;
  winCondition: number;
  token?: string;
  liquidity?: string;
  endsIn: string;
  yesPercentage?: number;
  noPercentage?: number;
  duelType?: 'COIN_DUEL' | 'FLASH_DUEL';
  imageSrc?: string;
  category?: string;
  currentPrice?: string;
  duelDuration?: number;
  duelStatus?: number;
  bootstrappingStartTime?: number;
  creator?: string;
  creatorTwitterImage?: string;
}

const Header: FC<Props> = ({
  title,
  triggerPrice,
  token,
  liquidity,
  endsIn,
  yesPercentage = 50,
  noPercentage = 50,
  duelType,
  imageSrc,
  currentPrice,
  duelDuration = 0,
  duelStatus = 0,
  bootstrappingStartTime,
  creator,
  creatorTwitterImage,
  // category,
}) => {
  let symbol, iconPath;
  if (duelType === 'COIN_DUEL') {
    symbol = title.split(' ')[1];
    iconPath = `/crypto-icons/light/crypto-${symbol.toLowerCase()}-usd.inline.svg`;
  }

  // Helper for dynamic 30-minute bootstrapping countdown
  const [bootstrappingTime, setBootstrappingTime] = React.useState(0);
  React.useEffect(() => {
    if (duelStatus === -1 && bootstrappingStartTime) {
      const normalizeTimestamp = (ts: number) => (ts > 1e12 ? Math.floor(ts / 1000) : ts);
      const update = () => {
        const now = Math.floor(Date.now() / 1000);
        const start = normalizeTimestamp(bootstrappingStartTime);
        const end = start + 1800;
        setBootstrappingTime(Math.max(end - now, 0));
      };
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }
  }, [duelStatus, bootstrappingStartTime]);
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex justify-between items-stretch w-full">
        {/* Back Button and Logo */}
        <div className="flex items-center gap-4 mx-2">
          <div className="relative w-12 h-12">
            {duelType === 'COIN_DUEL' && iconPath ? (
              <Image
                src={iconPath}
                alt={title}
                fill
                className="rounded-full object-cover"
                onError={(e) => {
                  console.error('Error loading crypto image:', iconPath);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : duelType === 'FLASH_DUEL' && imageSrc ? (
              <Image
                src={imageSrc}
                alt="Duel Image"
                fill
                className="rounded-full object-cover"
                onError={(e) => {
                  console.error('Error loading duel image:', imageSrc);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-400">?</span>
              </div>
            )}
          </div>
        </div>

        {/* Title and Details Button */}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col max-w-[70vw] md:max-w-lg">
            <h1 className="text-2xl font-bold text-white break-words">{title}</h1>
            {/* Created by info, client-only rendering to avoid hydration errors */}
            {typeof window !== 'undefined' && creator && (
              <span className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                Created by:
                <a
                  href={`https://x.com/${creator}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-blue-400 group"
                >
                  {creatorTwitterImage && (
                    <div className="relative w-5 h-5 mr-1">
                      <Image
                        src={creatorTwitterImage}
                        alt="Twitter Profile"
                        fill
                        sizes="20px"
                        className="rounded-full object-cover"
                        unoptimized={true}
                        onError={(e) => {
                          console.error('Error loading profile image:', creatorTwitterImage);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {/* <Image
                    src="/logo/x.png"
                    alt="X"
                    width={20}
                    height={20}
                    className="inline-block invert"
                  /> */}
                  @{creator}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 7l-10 10M17 7h-6m6 0v6"
                    />
                  </svg>
                </a>
              </span>
            )}
            {duelType === 'COIN_DUEL' && currentPrice && (
              <span className="text-zinc-400 text-sm mt-1">Market Price: ${currentPrice}</span>
            )}
          </div>
          <DetailsAndRules triggerPrice={triggerPrice} token={token} />
        </div>
      </div>

      <div className="w-full grid grid-cols-[minmax(80px,120px)_1fr_1fr_1.5fr] items-center px-4 py-2 rounded-lg">
        <div className="flex flex-col items-start justify-center">
          <span className="text-zinc-500 text-sm">Liquidity</span>
          <span className="text-white font-medium">${liquidity}</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-zinc-500 text-sm">Duration</span>
          <span className="text-white font-medium">
            {(() => {
              const dur = Number(duelDuration);
              if (isNaN(dur)) return '-';
              if (dur < 1) return `${Math.round(dur * 60)}m`;
              return `${dur}h`;
            })()}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center ml-8">
          <span className="text-zinc-500 text-sm">
            {duelStatus === -1 ? 'Bootstrapping' : 'Ends in'}
          </span>
          <span className="text-white font-medium">
            {duelStatus === -1 ? formatTime(bootstrappingTime) : endsIn}
          </span>
        </div>
        <div className="flex flex-col items-center ml-20">
          {/* <span className="text-zinc-500 text-sm">Sentiment</span> */}
          <PercentageBlocks yesAmount={yesPercentage} noAmount={noPercentage} />
        </div>
      </div>
    </div>
  );
};

export default Header;
