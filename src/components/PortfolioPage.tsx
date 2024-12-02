"use client"
import React, { useState } from "react";
import { AccountCard } from "./accountCard";
import { DuelsHeader } from "./duels/DuelsHeader";
import { DuelsDashboard } from "./duelsDashboard/DuelsDashboard";
// import DuelGrid from "./DuelGrid";
// import PorfolioGrid from "./PortfolioPageDuelCard";
import PortfolioGrid from "./PortfolioPageDuelCard";
// import { useAccount, useDisconnect } from "wagmi";

const PortfolioPage: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string>("liveDuels");
    const [specialCategoryIndex, setSpecialCategoryIndex] = useState<number | null>(0);

 
    // const {account} = useAccount();
    // console.log(account)

    // console.log(account)
    return (
        <div className="flex justify-center">
            {/* Parent container now a row */}
            <div className="flex flex-row items-start justify-center max-w-full gap-x-[9px]">
                <div className="flex flex-col max-w-[884px]">
                    <DuelsHeader />
                    <div className="min-h-[227px] my-[12px]">
                    <PortfolioGrid activeButton={activeButton} setActiveButton={setActiveButton} specialCategoryIndex={specialCategoryIndex} setSpecialCategoryIndex={setSpecialCategoryIndex} />
    
                    </div>
                    <DuelsDashboard />
                </div>
                <AccountCard
                    address={"3482789042379087089" as string}
                    accountValue="324"
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
