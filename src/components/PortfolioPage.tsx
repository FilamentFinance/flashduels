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

const PortfolioPage: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string>("liveDuels");
    const [specialCategoryIndex, setSpecialCategoryIndex] = useState<number | null>(0);

 
    const {address} = useAccount();
    const {balance} = useBalance(address as string);
    const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));
  

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
                <AccountCard
                    address={shortenAddress(address as string) as string}
                    accountValue={balance ? balanceNum.toString() : "0"}
                    stats={[
                        {
                            label: "Positions Value",
                            value: "$2000",
                            valueColor: "white",
                        },
                        {
                            label: "Total P/L",
                            value: "$250",
                            valueColor: "red-500",
                        },
                        {
                            label: "Duels Joined",
                            value: "5",
                            valueColor: "white",
                        },
                        {
                            label: "Duels Created",
                            value: "10",
                            valueColor: "white",
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default PortfolioPage;
