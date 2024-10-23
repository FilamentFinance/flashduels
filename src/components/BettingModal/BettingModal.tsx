import React from "react";
import BetCard from "./BetCard";

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageSrc: string;
  volume: string;
  timeLeft: number;
  percentage: number;
  createdBy: string;
  availableAmount: number;
  duelType: string;
  duelId: string;
  startAt:number;
  createdAt: number;
}

const BettingModal: React.FC<BettingModalProps> = ({
  isOpen,
  onClose,
  title,
  imageSrc,
  volume,
  timeLeft,
  percentage,
  createdBy,
  availableAmount,
  duelType,
  duelId,
  startAt,
  createdAt
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-zinc-900 rounded-lg shadow-xl max-w-md w-full">
        <BetCard
          betTitle={title}
          imageUrl={imageSrc}
          volume={volume}
          endTime={timeLeft}
          percentage={percentage}
          createdBy={createdBy}
          availableAmount={availableAmount}
          onClose={onClose}
          duelId={duelId}
          duelType={duelType}
          startAt={startAt}
          createdAt={createdAt}
        />
      </div>
    </div>
  );
};

export default BettingModal;
