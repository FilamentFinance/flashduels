"use client"
import React, { useState } from "react";
import { AccountCard } from "./accountCard";
import { DuelsHeader } from "./duels/DuelsHeader";
import { DuelsDashboard } from "./duelsDashboard/DuelsDashboard";
// import DuelGrid from "./DuelGrid";
// import PorfolioGrid from "./PortfolioPageDuelCard";
import PortfolioGrid from "./PortfolioPageDuelCard";
// import { useAccount } from "wagmi";
import { useAccount } from "wagmi";
import { shortenAddress } from "@/utils/helper";
import { useBalance } from "@/blockchain/useBalance";
import { ethers } from "ethers";
import { NEXT_PUBLIC_API } from "@/utils/consts";

const PortfolioPage: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string>("liveDuels");
    const [specialCategoryIndex, setSpecialCategoryIndex] = useState<number | null>(0);

 
    const {address} = useAccount();
    const {balance} = useBalance(address as string);
    const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));
  
    interface AccountData {
        positionValue: string;
        pnl: string;
        totalBets: number;
        totalDuelCreated: number;
    }

    const [accountData, setAccountData] = React.useState<AccountData | null>(null);

  
    React.useEffect(() => {
      const fetchAccountData = async () => {
        const response = await fetch(
          `${NEXT_PUBLIC_API}/portfolio/accountDetails`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userAddress: address,
            }),
          }
        );
        const data = await response.json();
        setAccountData(data.portfolioData);
      };
      fetchAccountData();
    }, []);
    // console.log(account)
    return (
        <div className="flex justify-center">
            {/* Parent container now a row */}
            <div className="flex flex-row items-start justify-center max-w-full gap-x-[9px]">
                <div className="flex flex-col max-w-[884px]">
                    <DuelsHeader activeButton={activeButton} setActiveButton={setActiveButton} />
                    <div className="min-h-[227px] my-[12px]">
                    <PortfolioGrid activeButton={activeButton} setActiveButton={setActiveButton} specialCategoryIndex={specialCategoryIndex} setSpecialCategoryIndex={setSpecialCategoryIndex} />
    
                    </div>
                    <DuelsDashboard />
                </div>
                {accountData && <AccountCard
                    shortenAddress={shortenAddress(address as string) as string}
                    accountValue={balance ? balanceNum.toString() : "0"}
                    stats={[
                        {
                            label: "Positions Value",
                            value: accountData.positionValue,
                            valueColor: "white",
                        },
                        {
                            label: "Total P/L",
                            value: accountData.pnl,
                            valueColor: "red-500",
                        },
                        {
                            label: "Duels Joined",
                            value: (accountData.totalBets).toString(),
                            valueColor: "white",
                        },
                        {
                            label: "Duels Created",
                            value: (accountData.totalDuelCreated).toString(),
                            valueColor: "white",
                        },
                    ]}
                />}
            </div>
        </div>
    );
};

export default PortfolioPage;
