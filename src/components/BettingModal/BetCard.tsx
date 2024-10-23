import React, { useState } from "react";
import BetInfo from "./BetInfo";
import BetAmount from "./BetAmount";
import TransactionOverview from "./TransactionOverview";
import PlaceBetButton from "./PlaceBetButton";

interface BetCardProps {
  betTitle: string;
  imageUrl: string;
  volume: string;
  endTime: number;
  percentage: number;
  createdBy: string;
  availableAmount: number;
  onClose: () => void,
  duelId: string,
  duelType: string,
  startAt: number,
  createdAt: number
}

const BetCard: React.FC<BetCardProps> = ({
  betTitle,
  imageUrl,
  volume,
  endTime,
  percentage,
  createdBy,
  availableAmount,
  onClose,
  duelId,
  duelType,
  startAt,
  createdAt
}) => {

  const [betAmount, setBetAmount] = useState("1000");
  const [bet, setBet] = useState<string>("YES");
  return (
    <article className="flex flex-col justify-center py-2.5 rounded-lg bg-zinc-900 max-w-[482px]">
      <header className="flex relative gap-2.5 justify-center items-start py-2 w-full text-xl font-semibold text-center text-white border-b border-zinc-700">
        <h2 className="z-0 flex-1 shrink my-auto w-full basis-0">Place Bet</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
          aria-label="Close modal"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="14" fill="white" fill-opacity="0.06" />
            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="white" stroke-opacity="0.04" />
            <path d="M9.34766 18.4278C9.76368 18.838 10.4844 18.8204 10.8652 18.4395L14 15.3048L17.1231 18.4337C17.5273 18.838 18.2246 18.838 18.6348 18.4219C19.0508 18.0059 19.0566 17.3087 18.6523 16.9044L15.5293 13.7755L18.6523 10.6524C19.0566 10.2481 19.0508 9.55084 18.6348 9.14069C18.2188 8.72467 17.5273 8.71881 17.1231 9.12311L14 12.2462L10.8652 9.11725C10.4844 8.73639 9.76368 8.71881 9.34766 9.13483C8.9375 9.55084 8.94922 10.2657 9.33594 10.6465L12.4707 13.7755L9.33594 16.9102C8.94922 17.2911 8.93164 18.0118 9.34766 18.4278Z" fill="#E0E8FF" fill-opacity="0.6" />
          </svg>
        </button>
      </header>
      <div className="flex flex-col px-4 mt-4 w-full">
        <BetInfo
          bet={bet}
          setBet={setBet}
          betTitle={betTitle}
          imageUrl={imageUrl}
          volume={volume}
          endTime={endTime}
          probability={percentage}
          createdBy={createdBy}
          startAt={startAt}
          createdAt={createdAt}
        />
        <BetAmount availableAmount={availableAmount} betAmount={betAmount} setBetAmount={setBetAmount} />
        <TransactionOverview betAmount={betAmount} />
        <PlaceBetButton betAmount={betAmount} duelId={duelId} duelType={duelType} bet={bet} />
      </div>
    </article>
  );
};

export default BetCard;
