import React, { useEffect, useState } from "react";
import ProbabilityBar from "./ProbabilityBar";

interface BetInfoProps {
  betTitle: string;
  imageUrl: string;
  volume: string;
  endTime: number;
  probability: number;
  createdBy: string;
  bet: string;
  setBet: (bet: string) => void;
  startAt: number;
  createdAt: number;
  totalBetAmount: number;
}

const BetInfo: React.FC<BetInfoProps> = ({
  bet,
  setBet,
  betTitle,
  imageUrl,
  volume,
  endTime,
  probability,
  createdBy,
  startAt,
  createdAt,
  totalBetAmount
}) => {
  const thirtyMinutesMs = 30 * 60 * 1000;
  const durationMs = endTime * 60 * 60 * 1000; // duration in hours converted to milliseconds


  // State to track the dynamic timeLeft
  const [time, setTimeLeft] = useState("");
  // Function to calculate the remaining time
  const calculateRemainingTime = () => {
    const currentTimeMs = Date.now();
    const startTimeMs = createdAt * 1000;

    let remainingTimeMs;

    // Check if 30 minutes have passed since createdAt
    const timeElapsedMs = currentTimeMs - startTimeMs;
    if (timeElapsedMs > thirtyMinutesMs) {
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
  }, [createdAt, startAt, endTime]);
  return (
    <section className="flex flex-col p-3 w-full rounded-xl bg-white bg-opacity-0">
      <div className="flex gap-2 items-start w-full">
        <div className="flex gap-2 w-16 min-h-[64px]">
          <div className="flex flex-1 shrink basis-0 size-full">
            <div className="flex flex-1 shrink justify-center items-center w-16 h-16 bg-gray-500 rounded-lg border border-solid basis-0 border-white border-opacity-10">
              <img
                src={imageUrl}
                alt={betTitle}
                className="object-contain flex-1 shrink w-16 rounded-lg aspect-square basis-0"
              />
            </div>
          </div>
        </div>
        <h3 className="flex-1 shrink text-xl font-semibold leading-none text-white min-w-[240px]">
          {betTitle}
        </h3>
      </div>
      <div className="flex gap-3 items-center mt-3 w-full min-h-[44px]">
        <div className="flex flex-col flex-1 shrink self-stretch my-auto text-base font-semibold tracking-normal leading-none text-white basis-0 min-w-[240px]">
          <div className="flex flex-col items-start w-full">
            <div className="flex gap-1 items-center w-[150px]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.1424 3.04746H10.6674V3.80746H11.4274V4.57246H12.1924V6.09746H12.9524V9.90246H12.1924V11.4275H11.4274V12.1925H10.6674V12.9525H9.1424V13.7125H5.3324V14.4775H10.6674V13.7125H12.1924V12.9525H12.9524V12.1925H13.7174V11.4275H14.4774V9.90246H15.2374V6.09746H14.4774V4.57246H13.7174V3.80746H12.9524V3.04746H12.1924V2.28746H10.6674V1.52246H5.3324V2.28746H9.1424V3.04746Z" fill="#F3EFE0" />
                <path d="M12.1925 6.09766H11.4275V9.90266H12.1925V6.09766Z" fill="#F3EFE0" />
                <path d="M11.4275 9.90234H10.6675V10.6673H11.4275V9.90234Z" fill="#F3EFE0" />
                <path d="M11.4275 5.33252H10.6675V6.09752H11.4275V5.33252Z" fill="#F3EFE0" />
                <path d="M10.6675 10.6675H9.90747V11.4275H10.6675V10.6675Z" fill="#F3EFE0" />
                <path d="M10.6675 4.57227H9.90747V5.33227H10.6675V4.57227Z" fill="#F3EFE0" />
                <path d="M9.90746 11.4272H9.14246V12.1922H9.90746V11.4272Z" fill="#F3EFE0" />
                <path d="M9.90746 3.80762H9.14246V4.57262H9.90746V3.80762Z" fill="#F3EFE0" />
                <path d="M9.1424 12.1924H5.3324V12.9524H9.1424V12.1924Z" fill="#F3EFE0" />
                <path d="M9.14245 8.38232H8.38245V9.90232H9.14245V8.38232Z" fill="#F3EFE0" />
                <path d="M9.14245 6.09766H8.38245V6.85766H9.14245V6.09766Z" fill="#F3EFE0" />
                <path d="M9.1424 3.04736H5.3324V3.80736H9.1424V3.04736Z" fill="#F3EFE0" />
                <path d="M6.85741 10.6673V11.4273H7.61741V10.6673H8.38241V9.90227H7.61741V8.38226H8.38241V7.61726H7.61741V6.09727H8.38241V5.33227H7.61741V4.57227H6.85741V5.33227H6.09741V6.09727H6.85741V7.61726H6.09741V8.38226H6.85741V9.90227H6.09741V10.6673H6.85741Z" fill="#F3EFE0" />
                <path d="M6.0974 9.14258H5.3324V9.90258H6.0974V9.14258Z" fill="#F3EFE0" />
                <path d="M6.0974 6.09766H5.3324V7.61766H6.0974V6.09766Z" fill="#F3EFE0" />
                <path d="M5.3325 12.9526H3.8125V13.7126H5.3325V12.9526Z" fill="#F3EFE0" />
                <path d="M5.33251 11.4272H4.57251V12.1922H5.33251V11.4272Z" fill="#F3EFE0" />
                <path d="M5.33251 3.80762H4.57251V4.57262H5.33251V3.80762Z" fill="#F3EFE0" />
                <path d="M5.3325 2.2876H3.8125V3.0476H5.3325V2.2876Z" fill="#F3EFE0" />
                <path d="M4.5725 10.6675H3.8125V11.4275H4.5725V10.6675Z" fill="#F3EFE0" />
                <path d="M4.5725 4.57227H3.8125V5.33227H4.5725V4.57227Z" fill="#F3EFE0" />
                <path d="M3.81249 12.1924H3.04749V12.9524H3.81249V12.1924Z" fill="#F3EFE0" />
                <path d="M3.81249 9.90234H3.04749V10.6673H3.81249V9.90234Z" fill="#F3EFE0" />
                <path d="M3.81249 5.33252H3.04749V6.09752H3.81249V5.33252Z" fill="#F3EFE0" />
                <path d="M3.81249 3.04736H3.04749V3.80736H3.81249V3.04736Z" fill="#F3EFE0" />
                <path d="M3.04748 11.4272H2.28748V12.1922H3.04748V11.4272Z" fill="#F3EFE0" />
                <path d="M3.04748 6.09766H2.28748V9.90266H3.04748V6.09766Z" fill="#F3EFE0" />
                <path d="M3.04748 3.80762H2.28748V4.57262H3.04748V3.80762Z" fill="#F3EFE0" />
                <path d="M2.28746 9.90234H1.52246V11.4273H2.28746V9.90234Z" fill="#F3EFE0" />
                <path d="M2.28746 4.57227H1.52246V6.09727H2.28746V4.57227Z" fill="#F3EFE0" />
                <path d="M1.52245 6.09766H0.762451V9.90266H1.52245V6.09766Z" fill="#F3EFE0" />
              </svg>
              <span className="self-stretch my-auto">Volume: {volume}</span>
            </div>
          </div>
          <div className="flex flex-col items-start mt-2 w-full">
            <div className="flex gap-1 items-center w-[250px]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6667 2H3.33333V3.33333H2V12.6667H3.33333V14H12.6667V12.6667H14V3.33333H12.6667V2ZM12.6667 3.33333V12.6667H3.33333V3.33333H12.6667ZM7.33333 4.66667H8.66667V8.66667H11.3333V10H7.33333V4.66667Z" fill="white" />
              </svg>
              <span className="self-stretch my-auto">Ends in: {time}</span>
            </div>
          </div>
        </div>
        <ProbabilityBar probability={probability} />
      </div>
      <div className="flex gap-10 justify-between items-center mt-3 w-full">
        <span className="gap-2.5 self-stretch my-auto text-base font-semibold tracking-normal leading-none text-gray-400">
          Created By:{" "}
        </span>
        <div className="flex gap-1 items-center self-stretch my-auto">
          <div className="flex overflow-hidden flex-col self-stretch my-auto rounded-xl w-[18px]">
            <div className="flex shrink-0 h-[18px]" />
          </div>
          <span className="gap-2.5 self-stretch my-auto text-base font-semibold tracking-normal leading-none whitespace-nowrap text-stone-200">
            {createdBy}
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-3 w-full text-base font-semibold leading-none whitespace-nowrap min-h-[57px]">
        <div className="flex flex-1 gap-2 size-full">
          <button
            onClick={() => setBet("YES")}
            className={`flex-1 shrink gap-2.5 self-stretch p-2.5 h-full rounded-lg border border-solid 
        ${bet === "YES" ? "bg-lime-500 border-lime-500 text-black" : "bg-neutral-500 bg-opacity-30 border-lime-400 border-opacity-60 text-lime-300"}`}
          >
            YES
          </button>

          <button
            onClick={() => setBet("NO")}
            className={`flex-1 shrink gap-2.5 self-stretch p-2.5 h-full text-center rounded-lg 
        ${bet === "NO" ? "bg-red-500 text-white" : "bg-zinc-600 bg-opacity-30 text-gray-400 text-opacity-40"}`}
          >
            NO
          </button>
        </div>
      </div>
      <div className="flex gap-2 items-start mt-3 w-full text-base text-center whitespace-nowrap text-stone-500">
        <div className="flex-1 shrink basis-0">$1/share</div>
        <div className="flex-1 shrink basis-0">$0.3/share</div>
      </div>
    </section>
  );
};

export default BetInfo;
