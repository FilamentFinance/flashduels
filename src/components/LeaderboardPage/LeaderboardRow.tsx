import React from "react";

interface LeaderboardRowProps {
  rank: number;
  account: string;
  profitLoss: string;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ rank, account, profitLoss }) => {
  return (
    <div className="flex items-center px-4 py-2 border-b border-white border-opacity-10">
      <div className="flex h-[40px] py-[12px] px-[20px] items-center gap-[10px] self-stretch w-[82px] text-base text-stone-200">
        {rank}
      </div>


      <div className="flex h-[40px] py-[12px] px-[20px] items-center gap-[10px] self-stretch flex-1 min-w-[240px] text-base text-stone-200">
        {account}
      </div>

      <div className="flex h-[40px] py-[12px] px-[20px] justify-end items-center gap-[10px] self-stretch min-w-[393px] min-h-[16px] text-base text-lime-300">
        {profitLoss}
      </div>
    </div>
  );
};

export default LeaderboardRow;
