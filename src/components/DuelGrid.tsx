import React, { useEffect, useState } from "react";
import DuelCard from "./DuelCard";
import BettingModal from "./BettingModal/BettingModal";
import axios from "axios";
import { Duel, NewDuelItem, NEXT_PUBLIC_API } from "@/utils/consts";
import { useAccount } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
import { ethers } from "ethers";
import { shortenAddress } from "@/utils/helper";

const DuelGrid = ({ activeButton, specialCategoryIndex, setSpecialCategoryIndex }: { activeButton: string, setActiveButton: (activeButton: string) => void, specialCategoryIndex: number | null, setSpecialCategoryIndex: (specialCategoryIndex: number | null) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Duel>();
  const { address } = useAccount();
  const { balance } = useBalance(address as string);
  const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));

  const [duels, setDuels] = useState<Duel[]>()

  const categoryMap = [
    'Any',
    'Politics',
    'Crypto',
  ];
  console.log(categoryMap)

  const getDuels = async () => {
    const response = await axios.get(`${NEXT_PUBLIC_API}/duels/getAll`);
    console.log("allduels", response.data.allDuels);
  
    const duel = response.data.allDuels
      .filter((item: NewDuelItem) => {
        // Filtering based on `activeButton`
        if (activeButton === "liveDuels") {
          return item.status === 0;   // live duels
        } else if (activeButton === "bootstraping") {
          return item.status === -1;  // bootstraping duels
        } else if (activeButton === "completed") {
          return item.status === 1;   // completed duels
        }
        return true;
      })
      .map((item: NewDuelItem) => ({
        title: item.betString || `Will ${item.token} be ${item.winCondition === 0 ? "ABOVE" : "BELOW"} ${item.triggerPrice}`,
        imageSrc: item.betIcon || "empty-string",
        volume: `$${item.totalBetAmount}`,
        category: item.category,
        status: item.status,
        duelId: item.duelId,
        duelType: item.duelType,
        timeLeft: item.endsIn,
        startAt: item.startAt || 0,
        createdAt: item.createdAt,
        percentage: 50,  // Assuming this is static or based on some logic
        createdBy: item.user.twitterUsername || shortenAddress(item.user.address),
        token: item.token,
        triggerPrice: item.triggerPrice,
        totalBetAmount: item.totalBetAmount  // Added this field
      }));
  
    console.log("Filtered duels:", duel);
    setDuels(duel);
  }
  

  useEffect(() => {
    getDuels()
  }, [activeButton])

  const handleCategoryClick = (index: number) => {
    const selectedDuel = duels![index];
    setModalData(selectedDuel);
    setIsModalOpen(true);
    setSpecialCategoryIndex(specialCategoryIndex === index ? null : index);
  };
  return (
    <>
      <div className="flex flex-wrap gap-4 items-center self-center px-[50px] w-full max-w-full w-full">
        {duels && duels.map((duel, index) => (
          <DuelCard key={index} {...duel} onClick={() => handleCategoryClick(index)} />
        ))}
      </div>
      <BettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalData?.title as string}
        imageSrc={modalData?.imageSrc as string}
        volume={modalData?.volume as string}
        timeLeft={modalData?.timeLeft as number}
        percentage={modalData?.percentage as number}
        createdBy={modalData?.createdBy as string}
        availableAmount={balanceNum as number}
        duelType={modalData?.duelType as string}
        duelId={modalData?.duelId as string}
        startAt={modalData?.startAt as number}
        createdAt={modalData?.createdAt as number}
        asset={modalData?.token as string}
        totalBetAmount={modalData?.totalBetAmount as number}
        triggerPrice={modalData?.triggerPrice as string}
      />
    </>
  );
};

export default DuelGrid;
