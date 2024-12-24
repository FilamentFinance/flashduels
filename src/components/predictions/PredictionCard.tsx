import * as React from "react";
import { PredictionButton } from "./PredictionButton";
import { Duel } from "@/utils/consts";
import { useTotalBets } from "@/app/optionPricing";
import { useState, useEffect } from "react";
import CircularProgressBar from "./CircularProgressBar";

export const PredictionCard: React.FC<Duel> = ({
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
  console.log(createdBy)
  const thirtyMinutesMs = 30 * 60 * 1000;
  const durationMs = timeLeft * 60 * 60 * 1000; // duration in hours converted to milliseconds

  const { totalBetYes, totalBetNo } = useTotalBets(duelId);
  const calculatedPercentage = (totalBetYes as number / (Number(totalBetYes) + Number(totalBetNo))) * 100;
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
  console.log(percentage, calculatedPercentage, "Calculated Percentage", totalBetYes, totalBetNo, duelId)
  return (
    <div
    onClick={onClick}
    className="flex flex-col shadow-[0px_4px_9px_rgba(0,0,0,0.25)]">
      <div className="flex flex-wrap gap-3 items-center p-3 w-full rounded-xl shadow bg-zinc-900 max-md:max-w-full">
        <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
          <div className="flex flex-wrap gap-3 items-center w-full max-md:max-w-full">
            <div className="flex gap-2 self-stretch my-auto min-h-[59px] w-[59px]">
              <div className="flex flex-1 shrink basis-0 size-full">
                <div className="flex flex-1 shrink justify-center items-center bg-gray-500 rounded-full border border-solid basis-0 border-white border-opacity-10 h-[59px] w-[59px]">
                  <img
                    loading="lazy"
                    src={imageSrc}
                    alt="Prediction thumbnail"
                    className="object-contain flex-1 shrink rounded-full aspect-square basis-0 w-[59px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-6 items-center self-stretch my-auto min-w-[240px]">
              <div className="flex flex-col justify-center self-stretch my-auto min-w-[240px] w-[259px]">
                <div className="gap-2.5 self-stretch w-full text-base font-semibold h-[26px] text-stone-200">
                  {title}
                </div>
                <div className="flex flex-col justify-center w-full max-w-[250px] min-h-[28px]">
                  <div className="flex gap-3 items-center w-full">
                    <div className="flex gap-1 items-center rounded-full self-stretch my-auto text-base font-semibold leading-none text-gray-400 whitespace-nowrap">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/27a76fcf1122911f64181cf4887be4a7b82ca876770df9f4af86cf00b4ec6ac1?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
                        alt="Currency icon"
                        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[22px]"
                      />
                      <div className="self-stretch my-auto">{volume}</div>
                    </div>
                    <div className="flex flex-1 shrink gap-1 items-center self-stretch my-auto basis-0">
                      <div className="flex gap-2.5 justify-center items-center self-stretch py-0.5 my-auto w-4 min-h-[19px]">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/869528590505389529a78df1f5349e36d775adf4ad6429074da4f4fc52ffaff3?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
                          alt="Timer icon"
                          className="object-contain self-stretch my-auto w-3.5 aspect-[0.93]"
                        />
                      </div>
                      <div className="self-stretch my-auto text-base font-semibold leading-none text-gray-400">
                        {time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-col self-stretch my-auto text-xs font-semibold text-center whitespace-nowrap text-zinc-500 w-[59px]"> */}
              <CircularProgressBar percentage={Number((calculatedPercentage).toFixed(2)) || percentage}/>
                {/* <div>Chance</div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center self-stretch my-auto text-base font-semibold leading-none whitespace-nowrap min-h-[36px] min-w-[300px] w-[440px]">
          <div className="flex flex-1 gap-2 size-full">
            <PredictionButton label="YES" variant="yes" />
            <PredictionButton label="NO" variant="no" />
          </div>
        </div>
      </div>
    </div>
  );
};
