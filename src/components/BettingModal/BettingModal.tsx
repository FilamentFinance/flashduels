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
  asset?: string;
  totalBetAmount: number;
  triggerPrice?: string;
  status: number;
  setIsModalOpen: (arg0: boolean)=>void;
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
  createdAt,
  status,
  asset,
  totalBetAmount,
  triggerPrice,
  setIsModalOpen
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
          status={status}
          createdAt={createdAt}
          asset={asset}
          totalBetAmount={totalBetAmount} 
          endsIn={timeLeft}
          triggerPrice={triggerPrice}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default BettingModal;
