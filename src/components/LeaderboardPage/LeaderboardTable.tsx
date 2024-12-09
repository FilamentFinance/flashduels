import React, { useEffect } from "react";
import LeaderboardRow from "./LeaderboardRow";
import axios from "axios";
import { NEXT_PUBLIC_API } from "@/utils/consts";

interface LeaderboardData {
  rank: number;
  address: string;
  pnl: string;
}

// const leaderboardData: LeaderboardData[] = [
//   { rank: 23, address: "KZED", pnl: "+$4500 (45%)" },
//   { rank: 1, address: "KZED", pnl: "+$4500 (45%)" },
//   // ... add more data as needed
// ];

const LeaderboardTable = ({ activeButton}: { activeButton: string }) => {
  const [data, setData] = React.useState<LeaderboardData[]>([])

  console.log("result", activeButton)
  
  const getCreatorsData = async () => {
    // fetch creators data
    const response = await axios.get(`${NEXT_PUBLIC_API}/leaderboard/creators`)
    const result = response.data.userProfits
    setData(result)
    // console.log("result", result)
  };

  const getTradersData = async () => {
    const response = await axios.get(`${NEXT_PUBLIC_API}/leaderboard/traders`)
    const result = response.data.userProfits
    setData(result)
    // console.log(result)
  }

  useEffect(() => {
    if (activeButton === 'creators') {
      // fetch creators data
      getCreatorsData()
    }
    if (activeButton === 'traders') {
      // fetch traders data
      getTradersData()
    }
  }, [activeButton])
  
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
          Profit%
        </div>

      </div>
      {data.map((data, index) => (
        <LeaderboardRow key={index} {...data} />
      ))}
    </div>
  );
};

export default LeaderboardTable;
