import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import DuelCard from "./DuelCard";
import BettingModal from "./BettingModal/BettingModal";
import { Duel, NewDuelItem, NEXT_PUBLIC_WS_URL } from "@/utils/consts";
import { useAccount } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { ethers } from "ethers";
import { shortenAddress } from "@/utils/helper";

const PortfolioGrid = ({ activeButton, specialCategoryIndex }: { activeButton: string, setActiveButton: (activeButton: string) => void, specialCategoryIndex: number | null, setSpecialCategoryIndex: (specialCategoryIndex: number | null) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Duel>();
  const { address } = useAccount();
  const { balance } = useBalance(address as string);
  const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));

  const [duels, setDuels] = useState<Duel[]>([]);

  const categoryMap = [
    'Any',
    'Crypto',
    'Politics',
    'Sports',
  ];

  // WebSocket setup to get duels in real-time
  useEffect(() => {
    const socket = new WebSocket(NEXT_PUBLIC_WS_URL);
    
    socket.onopen = () => console.log('Connected to the WebSocket server');
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
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
            if (activeButton === "liveDuels") return item.status === 0;
            if (activeButton === "bootstrapping") return item.status === -1;
            if (activeButton === "completed") return item.status === 1;
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
    socket.onerror = (error) => console.error('WebSocket Error:', error);
    socket.onclose = () => console.log('Disconnected from the WebSocket server');
    return () => socket.close();
  }, [activeButton, specialCategoryIndex]);

  const handleDuelClick = (index: number) => {
    setModalData(duels[index]);
    setIsModalOpen(true);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Number of cards visible
    slidesToScroll: 1, // How many cards to scroll at a time
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <Slider {...sliderSettings} >
        {duels && duels.map((duel, index) => (
          <DuelCard key={index} {...duel} onClick={() => handleDuelClick(index)} />
        ))}
      </Slider>
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

export default PortfolioGrid;
