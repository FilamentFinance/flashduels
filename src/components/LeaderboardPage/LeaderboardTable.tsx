import React from "react";
import LeaderboardRow from "./LeaderboardRow";

interface LeaderboardData {
  rank: number;
  account: string;
  profitLoss: string;
}

const leaderboardData: LeaderboardData[] = [
  { rank: 23, account: "KZED", profitLoss: "+$4500 (45%)" },
  { rank: 1, account: "KZED", profitLoss: "+$4500 (45%)" },
  // ... add more data as needed
];

const LeaderboardTable: React.FC = () => {
  return (
    <div className="flex flex-col mt-0 w-full max-w-[980px] rounded-xl border border-solid bg-zinc-900 border-white border-opacity-10">
      <div className="flex justify-between px-4 py-2 w-full text-base text-gray-500 border-b border-white border-opacity-10">
        <div className="flex h-[40px] py-[12px] px-[20px] items-center gap-[10px] self-stretch w-[82px]">
          Rank
        </div>


        <div className="flex h-[40px] py-[12px] px-[20px] items-center gap-[10px] self-stretch flex-1 min-w-[240px]">
          Account
        </div>

        <div className="flex h-[40px] py-[12px] px-[20px] justify-end items-center gap-[10px] self-stretch min-w-[393px] min-h-[16px] text-base">
          Profit/ Loss%
        </div>

      </div>
      {leaderboardData.map((data, index) => (
        <LeaderboardRow key={index} {...data} />
      ))}
    </div>
  );
};

export default LeaderboardTable;
