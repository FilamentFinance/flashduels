import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import DuelCard from "./DuelCard";
import BettingModal from "./BettingModal/BettingModal";
import { Duel, NewDuelItem, NEXT_PUBLIC_API } from "@/utils/consts";
import { useAccount } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { ethers } from "ethers";
import { shortenAddress } from "@/utils/helper";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PortfolioGrid = ({ activeButton, specialCategoryIndex }: { activeButton: string, setActiveButton: (activeButton: string) => void, specialCategoryIndex: number | null, setSpecialCategoryIndex: (specialCategoryIndex: number | null) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Duel>();
  const { address } = useAccount();
  const { balance } = useBalance(address as string);
  const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));

  const [duels, setDuels] = useState<Duel[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchDuels = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const response = await fetch(`${NEXT_PUBLIC_API}/portfolio/duels`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAddress: address,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch duels");
        }

        const data = await response.json();
        if (data.allDuels) {
          const filteredDuels = data.allDuels
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
              totalBetAmount: item.totalBetAmount,
            }));

          setDuels(filteredDuels);
        }
      } catch (error) {
        console.error("Error fetching duels:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchDuels();
  }, [address, activeButton, specialCategoryIndex]);

  const handleDuelClick = (index: number) => {
    setModalData(duels[index]);
    setIsModalOpen(true);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height={200} />
          ))}
        </div>
      ) : duels.length > 0 ? (
        <Slider {...sliderSettings}>
          {duels.map((duel, index) => (
            <DuelCard key={index} {...duel} onClick={() => handleDuelClick(index)} />
          ))}
        </Slider>
      ) : (
        <p className="text-center text-white mt-4">No duels available</p>
      )}
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
