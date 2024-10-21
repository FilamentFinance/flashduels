import { usePrivy } from "@privy-io/react-auth";
import React from "react";

interface PlaceBetButtonProps {
  betAmount: string;
  bet:number
  duelId: string;
  duelType: string;
}

const PlaceBetButton: React.FC<PlaceBetButtonProps> = ({ betAmount, bet, duelId, duelType }) => {
  const {user} = usePrivy();
  const handleClick = () => {
    console.log("Call BE", user?.twitter?.username, betAmount, bet, duelId, duelType);
  }
  
  return (
    <button
      className="flex flex-col mt-4 w-full text-base font-semibold leading-none text-gray-900"
      disabled={!betAmount} 
      onClick={handleClick}
    >
      <div className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]">
        Place Bet
      </div>
    </button>
  );
};

export default PlaceBetButton;
