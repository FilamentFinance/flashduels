import React, { useEffect, useState } from "react";
import DuelCard from "./DuelCard";
import BettingModal from "./BettingModal/BettingModal";
import { Duel, NewDuelItem, NEXT_PUBLIC_WS_URL } from "@/utils/consts";
import { useAccount } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
import { ethers } from "ethers";
import { shortenAddress } from "@/utils/helper";
import { useRouter } from "next/navigation";

const DuelGrid = ({ activeButton, specialCategoryIndex }: { activeButton: string, setActiveButton: (activeButton: string) => void, specialCategoryIndex: number | null, setSpecialCategoryIndex: (specialCategoryIndex: number | null) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Duel>();
  const { address } = useAccount();
  const { balance } = useBalance(address as string);
  const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));
  const router = useRouter();
  const [duels, setDuels] = useState<Duel[]>([]);

  const categoryMap = [
    'Any',
    'Crypto',
    'Politics',
    'Sports',
  ];
  console.log(setModalData)

  // WebSocket setup to get duels in real-time
  useEffect(() => {
    const socket = new WebSocket(`${NEXT_PUBLIC_WS_URL}/ws`);
    
    socket.onopen = function() {
      console.log('Connected to the WebSocket server');
    };

    socket.onmessage = function(event) {
      console.log('Message received:', event.data);
      const message = JSON.parse(event.data);
      console.log(message,"message")
      if (message.allDuels) {
        const filteredDuels = message.allDuels
          .filter((item: NewDuelItem) => {
            if (specialCategoryIndex === 0 || specialCategoryIndex === null) {
              return true;
            } else {
              return item.category === categoryMap[specialCategoryIndex];
            }
          })
          .filter((item: NewDuelItem) => {
            console.log(`Filtering duel with status ${item.status} for activeButton: ${activeButton}`);
            if (activeButton === "liveDuels") {
              console.log(`Live duels filter: ${item.status === 0}`);
              return item.status === 0;  
            } else if (activeButton === "bootstrapping") {
              console.log(`Bootstrapping duels filter: ${item.status === -1}`);
              return item.status === -1;  // Only bootstrapping duels
            } else if (activeButton === "completed") {
              console.log(`Completed duels filter: ${item.status === 1}`);
              return item.status === 1;  // Only completed duels
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
            percentage: 50,
            createdBy: item.user.twitterUsername || shortenAddress(item.user.address),
            token: item.token,
            triggerPrice: item.triggerPrice,
            totalBetAmount: item.totalBetAmount
          }));

        setDuels(filteredDuels);
      }
    };

    socket.onerror = function(error) {
      console.log('WebSocket Error:', error);
    };

    socket.onclose = function() {
      console.log('Disconnected from the WebSocket server');
    };

    // Cleanup WebSocket on unmount
    return () => {
      socket.close();
    };
  }, [activeButton, specialCategoryIndex]);

  // Opens modal for a specific duel without updating category
  // const handleDuelClick = (index: number) => {
  //   const selectedDuel = duels[index];
  //   setModalData(selectedDuel);
  //   setIsModalOpen(true);
  // };

  const handleDuelClick = (duelId: string) => {
    router.push(`/bet?duelId=${duelId}`);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center self-center px-[50px] w-full max-w-full w-full">
        {duels && duels.map((duel, index) => (
          <DuelCard key={index} {...duel} onClick={() => handleDuelClick(duel.duelId)} />
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
        status={modalData?.status as number}
        createdBy={modalData?.createdBy as string}
        availableAmount={balanceNum as number}
        duelType={modalData?.duelType as string}
        duelId={modalData?.duelId as string}
        startAt={modalData?.startAt as number}
        createdAt={modalData?.createdAt as number}
        asset={modalData?.token as string}
        totalBetAmount={modalData?.totalBetAmount as number}
        triggerPrice={modalData?.triggerPrice as string}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default DuelGrid;
