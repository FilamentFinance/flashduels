import * as React from "react";
import { StatItem } from "./StatItem";
import { AccountCardProps } from "./types";
// import { useDisconnect } from "wagmi";

export function AccountCard({
  // username,
  address,
  accountValue,
  stats,
}: AccountCardProps) {
  // const {disconnect} = useDisconnect();
  return (
    <div className="flex flex-col items-center self-stretch pt-3 mt-[15px] pb-72 my-auto rounded-lg border border-solid bg-neutral-900 border-neutral-800 min-h-[567px] min-w-[240px] w-[287px] max-md:pb-24">
      <div className="flex relative flex-col max-w-full w-[263px]">
        <div className="flex z-0 gap-1 items-center self-start">
          <div className="flex items-start self-stretch my-auto w-[26px]">
            <div className="flex justify-center items-center bg-gray-500 rounded-lg h-[26px] min-h-[26px] w-[26px]">
              <div className="flex overflow-hidden flex-col self-stretch my-auto rounded-lg border border-solid border-white border-opacity-20 w-[26px]">
                <div className="flex shrink-0 h-[26px]" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center self-stretch my-auto text-right whitespace-nowrap">
            <div className="flex flex-col justify-center self-stretch my-auto">
              {/* <div className="text-xs font-medium tracking-normal leading-none text-left text-stone-200">
                {username}
              </div> */}
              <div className="text-xs tracking-normal leading-relaxed text-gray-500">
                {address}
              </div>
            </div>
          </div>
        </div>
        <div className="z-0 mt-3 text-base font-semibold tracking-normal leading-tight text-gray-400">
          Account Value
        </div>
        <div className="z-0 my-4 text-5xl font-semibold leading-none text-stone-200 max-md:text-4xl">
          ${accountValue}
        </div>
        <div className="flex z-0 flex-col mt-3 w-full text-base font-semibold leading-none whitespace-nowrap">
          <div className="flex gap-2 items-start w-full">
            <button className="flex-1 shrink gap-2.5 self-stretch p-2.5 text-gray-900 bg-pink-300 rounded-lg">
              Deposit
            </button>
            <button className="flex-1 shrink gap-2.5 self-stretch p-2.5 text-center text-pink-300 rounded-lg border border-solid border-pink-300 border-opacity-20">
              Withdraw
            </button>
          </div>
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/e40368f0edb67a1b3b5e6484642582a4b415e936668ed29022089c454c1bb894?apiKey=4bd09ea4570a4d12834637c604f75b6a&"
          alt=""
          className="object-contain absolute top-0 right-0 z-0 w-7 h-7 aspect-square"
        />
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/5764b060804d355aa9cf39a48aafe0c78eb85a9db79bb5317201b598a4f7784a?apiKey=4bd09ea4570a4d12834637c604f75b6a&"
        alt=""
        className="object-contain self-stretch mt-2.5 w-full aspect-[333.33]"
      />
      <div className="flex flex-col mt-2.5 w-full text-xs tracking-normal leading-none max-w-[268px]">
        {stats.map((stat, index) => (
          <StatItem key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
