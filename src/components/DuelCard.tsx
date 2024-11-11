
import { useTotalBets } from "@/app/optionPricing";
import { Duel } from "@/utils/consts";
import React, { useEffect, useState } from "react";

export interface DuelCardProps {
  title: string;
  imageSrc: string;
  volume: string;
  timeLeft: string;
  percentage: number;
  createdBy: string;
  creatorImageSrc?: string;
  onClick?: () => void;
  duelType: string;
  duelId: string;

}

const DuelCard: React.FC<Duel> = ({
  title,
  imageSrc,
  volume,
  timeLeft,
  percentage,
  createdBy,
  duelId,
  startAt,
  createdAt,
  // creatorImageSrc,
  onClick,
  status
}) => {
  const thirtyMinutesMs = 30 * 60 * 1000;
  const durationMs = timeLeft * 60 * 60 * 1000; // duration in hours converted to milliseconds
  console.log(percentage)
  const { totalBetYes, totalBetNo } = useTotalBets(duelId);
  const calculatedPercentage = (totalBetYes as number / (totalBetYes as number + Number(totalBetNo))) * 100;
  const [time, setTimeLeft] = useState("");
  const calculateRemainingTime = () => {
    const currentTimeMs = Date.now();
    const startTimeMs = createdAt * 1000;

    let remainingTimeMs;

    // Check if 30 minutes have passed since createdAt
    const timeElapsedMs = currentTimeMs - startTimeMs;
    if (timeElapsedMs > thirtyMinutesMs || status === 0) {
      // Use startAt if 30 minutes have passed
      const startAtTimeMs = startAt * 1000;
      const timeSinceStartAt = currentTimeMs - startAtTimeMs;
      remainingTimeMs = Math.max(durationMs - timeSinceStartAt, 0); // Calculate remaining time from startAt
    } else {
      // Use createdAt if 30 minutes have not passed
      remainingTimeMs = Math.max(thirtyMinutesMs - timeElapsedMs, 0); // Calculate remaining time from createdAt
    }

    return remainingTimeMs;
  };

  // Function to format time in HH:MM:SS format
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const padTime = (time: number) => time.toString().padStart(2, '0');
    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  };

  // Update timeLeft every second
  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTimeMs = calculateRemainingTime();
      setTimeLeft(formatTime(remainingTimeMs)); // Update state with formatted time
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [createdAt, startAt, timeLeft]);
  

  const isPositive = calculatedPercentage >= 50;
  const colorClass = isPositive ? "text-lime-300" : "text-red-500";
  const bgColorClass = isPositive ? "bg-lime-300" : "bg-red-500";

  return (
    <article onClick={onClick} className="flex flex-col flex-1 shrink self-stretch p-3 my-auto rounded-xl shadow basis-0 bg-zinc-900 min-w-[240px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[400px]">
      <div className="flex flex-col self-center max-w-full min-h-[114px] w-full">
        <div className="flex gap-2 items-start w-full max-w-[227px]">
          <div className="flex gap-2 w-16 min-h-[64px]">
            <div className="flex flex-1 shrink basis-0 size-full">
              <div className="flex flex-1 shrink justify-center items-center w-16 h-16 bg-gray-500 rounded-full border border-solid basis-0 border-white border-opacity-10">
                <img
                  loading="lazy"
                  src={imageSrc}
                  alt={title}
                  className="object-contain flex-1 shrink w-16 rounded-full aspect-square basis-0"
                />
              </div>
            </div>
          </div>
          <h3 className="flex-1 shrink gap-2.5 self-stretch text-base font-semibold leading-none text-stone-200 w-[150px]">
            {title}
          </h3>
        </div>
        <div className="flex gap-3 mt-3 w-full">
          <div className="flex flex-col flex-1 shrink items-start self-start basis-0">
            <div className="flex gap-1 justify-center items-start text-xs tracking-normal leading-relaxed text-stone-200">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c6ce0714e0c999e8165254577c818af834576f42aac0d4273ddb19b1fc91a45?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a"
                alt=""
                className="object-contain shrink-0 w-4 aspect-square"
              />
              <div>Volume: {volume}</div>
            </div>
            <div className="flex gap-1 mt-1 w-[87px]">
              <div className="flex gap-2.5 justify-center items-center py-0.5 w-4 h-full">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/20361b316e74c0a39ae0d9cfa0e04464d0ba3456555360296ff22210ea9118ca?placeholderIfAbsent=true&apiKey=4bd09ea4570a4d12834637c604f75b6a"
                  alt=""
                  className="object-contain self-stretch my-auto aspect-[0.92] w-[11px]"
                />
              </div>
              <div className="my-auto text-xs tracking-normal leading-relaxed text-stone-200">
                {time}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-[87px]">
            <div
              className={`text-base font-semibold leading-none ${colorClass}`}
            >
              {calculatedPercentage} %
            </div>
            <div className="flex gap-0.5 mt-1 min-h-[13px] w-[62px]">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className={`flex flex-1 shrink ${
                    index < calculatedPercentage / 10
                      ? bgColorClass
                      : "bg-gray-500 bg-opacity-30"
                  } rounded-xl basis-0 h-[13px] ${
                    index % 3 === 0 ? "w-[5px]" : "w-1"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-3 w-full text-base font-semibold leading-none whitespace-nowrap">
        <div className="flex gap-2 items-start w-full">
          <button className="flex-1 shrink gap-2.5 self-stretch p-2.5 text-lime-300 rounded-lg shadow-sm bg-lime-500 bg-opacity-30">
            YES
          </button>
          <button className="flex-1 shrink gap-2.5 self-stretch p-2.5 text-center text-red-500 rounded-lg shadow-sm bg-red-600 bg-opacity-20 w-[29px]">
            NO
          </button>
        </div>
      </div>
      <div className="flex gap-10 justify-between items-center mt-3 w-full">
        <div className="gap-2.5 self-stretch my-auto text-xs tracking-normal leading-relaxed text-gray-400">
          Created By:{" "}
        </div>
        <div className="flex gap-1 items-center self-stretch my-auto">
          {/* {creatorImageSrc && (
            <img
              loading="lazy"
              src={creatorImageSrc}
              alt={`${createdBy}'s profile`}
              className="object-contain shrink-0 self-stretch my-auto rounded-xl aspect-square w-[18px]"
            />
          )} */}
          <div className="gap-2.5 self-stretch my-auto text-xs tracking-normal leading-relaxed whitespace-nowrap text-stone-200">
            {createdBy}
          </div>
        </div>
      </div>
    </article>
  );
};

export default DuelCard;
