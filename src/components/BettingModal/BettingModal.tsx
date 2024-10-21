import React from "react";
import BetCard from "./BetCard";

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  betTitle: string;
  imageUrl: string;
  volume: string;
  endTime: string;
  probability: number;
  createdBy: string;
  availableAmount: number;
  duelType: string;
  duelId: string;
}

const BettingModal: React.FC<BettingModalProps> = ({
  isOpen,
  onClose,
  betTitle,
  imageUrl,
  volume,
  endTime,
  probability,
  createdBy,
  availableAmount,
  duelType,
  duelId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-zinc-900 rounded-lg shadow-xl max-w-md w-full">
        <BetCard
          betTitle={betTitle}
          imageUrl={imageUrl}
          volume={volume}
          endTime={endTime}
          probability={probability}
          createdBy={createdBy}
          availableAmount={availableAmount}
          onClose={onClose}
          duelId={duelId}
          duelType={duelType}
        />
      </div>
    </div>
  );
};

export default BettingModal;
