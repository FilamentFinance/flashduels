import React from "react";
import DuelCard from "./DuelCard";

const duels = [
  {
    title: "Will $MOO Hit $1.00",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e3ac4032ea3429b9ee6d0ca925ce870ed2196eda711c1907b1a57f9a8ec662a0?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
    volume: "$200K",
    timeLeft: "00:00:00:00",
    percentage: 60,
    createdBy: "KZED",
  },
  {
    title: "Will Trump Win US Election",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1cfaac372977c7618b3defdf7cf28aae9ed011aed4ad383d715249b393640dd7?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
    volume: "$2.6M",
    timeLeft: "48:34:12:34",
    percentage: 90,
    createdBy: "Flash Bets",
    creatorImageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/c0a4d07254fa06a32fdb38bf8aa989597281af399c617799bd40943089b11929?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
  },
  {
    title: "Will Kamala Harris Win US Election",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/19068b41746d013f2a674974e7fad13301a7e14278b7c2f53c9b843e92f7cf79?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
    volume: "$2.6M",
    timeLeft: "48:34:12:34",
    percentage: 10,
    createdBy: "Flash Bets",
    creatorImageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b95f06706a2ad76467cb4e4c13d0d5779aace055d82bf2b897ebd25f68e3c51b?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
  },
  {
    title: "Will GAM win Worlds 2024",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/3d3daf7118a44d548c62652774658d2a279004198d6e03464b6cdbca756d1d51?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
    volume: "$10.45K",
    timeLeft: "48:34:12:34",
    percentage: 60,
    createdBy: "0x4743..69fc",
  },
  // {
  //   title: "Will GAM win Worlds 2024",
  //   imageSrc:
  //     "https://cdn.builder.io/api/v1/image/assets/TEMP/3d3daf7118a44d548c62652774658d2a279004198d6e03464b6cdbca756d1d51?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
  //   volume: "$10.45K",
  //   timeLeft: "48:34:12:34",
  //   percentage: 60,
  //   createdBy: "0x4743..69fc",
  // },
  // {
  //   title: "Will GAM win Worlds 2024",
  //   imageSrc:
  //     "https://cdn.builder.io/api/v1/image/assets/TEMP/3d3daf7118a44d548c62652774658d2a279004198d6e03464b6cdbca756d1d51?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
  //   volume: "$10.45K",
  //   timeLeft: "48:34:12:34",
  //   percentage: 60,
  //   createdBy: "0x4743..69fc",
  // },
  {
    title: "Will GAM win Worlds 2024",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/3d3daf7118a44d548c62652774658d2a279004198d6e03464b6cdbca756d1d51?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
    volume: "$10.45K",
    timeLeft: "48:34:12:34",
    percentage: 60,
    createdBy: "0x4743..69fc",
  },
  // {
  //   title: "Will GAM win Worlds 2024",
  //   imageSrc:
  //     "https://cdn.builder.io/api/v1/image/assets/TEMP/3d3daf7118a44d548c62652774658d2a279004198d6e03464b6cdbca756d1d51?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a",
  //   volume: "$10.45K",
  //   timeLeft: "48:34:12:34",
  //   percentage: 60,
  //   createdBy: "0x4743..69fc",
  // },
  

];

const DuelGrid: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center self-center px-[50px] w-full max-w-full w-full">
      {duels.map((duel, index) => (
        <DuelCard key={index} {...duel} />
      ))}
    </div>
  );
};

export default DuelGrid;
