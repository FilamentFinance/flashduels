import React, { useEffect, useState } from "react";
import DuelCard from "./DuelCard";
import BettingModal from "./BettingModal/BettingModal";
import axios from "axios";
import { Duel, NewDuelItem, NEXT_PUBLIC_API } from "@/utils/consts";
import { shortenAddress } from "@/utils/helper";
import { useAccount } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
import { ethers } from "ethers";

// const duelsss = [
//   {
//     title: "Will $MOO Hit $1.00",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/e3ac4032ea3429b9ee6d0ca925ce870ed2196eda711c1907b1a57f9a8ec662a0?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
//     volume: "$200K",
//     duelId:"123423",
//     duelType:"COIN_DUEL",
//     timeLeft: "00:00:00:00",
//     percentage: 60,
//     createdBy: "KZED",
//   },
//   {
//     title: "Will Trump Win US Election",
//     duelId:"123",
//     duelType:"COIN_DUEL",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/1cfaac372977c7618b3defdf7cf28aae9ed011aed4ad383d715249b393640dd7?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
//     volume: "$2.6M",
//     timeLeft: "48:34:12:34",
//     percentage: 90,
//     createdBy: "Flash Bets",
//     creatorImageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/c0a4d07254fa06a32fdb38bf8aa989597281af399c617799bd40943089b11929?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
//   },
//   {
//     title: "Will Kamala Harris Win US Election",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/19068b41746d013f2a674974e7fad13301a7e14278b7c2f53c9b843e92f7cf79?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
//     volume: "$2.6M",
//     timeLeft: "48:34:12:34",
//     duelId:"12453",
//     duelType:"FLASH_DUEL",
//     percentage: 10,
//     createdBy: "Flash Bets",
//     creatorImageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/b95f06706a2ad76467cb4e4c13d0d5779aace055d82bf2b897ebd25f68e3c51b?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
//   },
//   {
//     title: "Will GAM win Worlds 2024",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/3d3daf7118a44d548c62652774658d2a279004198d6e03464b6cdbca756d1d51?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
//     volume: "$10.45K",
//     timeLeft: "48:34:12:34",
//     duelId:"1235",
//     duelType:"COIN_DUEL",
//     percentage: 60,
//     createdBy: "0x4743..69fc",
//   },
//   {
//     title: "Will GAM win Worlds 2024",
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/3d3daf7118a44d548c62652774658d2a279004198d6e03464b6cdbca756d1d51?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
//     volume: "$10.45K",
//     timeLeft: "48:34:12:34",
//     duelId:"213",
//     duelType:"FLASH_DUEL",
//     percentage: 60,
//     createdBy: "0x4743..69fc",
//   },
//   // {
//   //   title: "Will GAM win Worlds 2024",
//   //   imageSrc:
//   //     "https://cdn.builder.io/api/v1/image/assets/TEMP/3d3daf7118a44d548c62652774658d2a279004198d6e03464b6cdbca756d1d51?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
//   //   volume: "$10.45K",
//   //   timeLeft: "48:34:12:34",
//   //   percentage: 60,
//   //   createdBy: "0x4743..69fc",
//   // },


// ];

const DuelGrid: React.FC = () => {
  const [specialCategoryIndex, setSpecialCategoryIndex] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Duel>();
  const { address } = useAccount();
  const { balance } = useBalance(address as string);
  const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));

  const [duels, setDuels] = useState<Duel[]>()

  const getDuels = async () => {
    const response = await axios.get(`${NEXT_PUBLIC_API}/duels/getAll`);
    const duel = response.data.allDuels.map((item: NewDuelItem) => ({
      title: item.betString || `Will ${item.token} be ${item.winCondition} ${item.triggerPrice}`,
      imageSrc: item.betIcon || "empty-string",
      volume: "$200K",  // Assuming this is a static value for now
      category: item.category,
      duelId: item.duelId,
      duelType: item.duelType,
      timeLeft: item.endsIn,
      startAt: item.startAt || 0,
      createdAt: item.createdAt,
      percentage: 100,  // Assuming this is static or based on some logic
      createdBy: item.user.twitterUsername || shortenAddress(item.user.address)
    }));
    setDuels(duel)
  }

  useEffect(() => {
    getDuels()
  }, [])

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
      />
    </>
  );
};

export default DuelGrid;
