import * as React from "react";
import { AmountInputProps } from "./types";
import { TokenIcon } from "./TokenIcon";

export function AmountInput({
  value,
  available,
  onMaxClick,
  onChange,
  tokenIcon,
  tokenSymbol,
}: AmountInputProps) {
  return (
    <div className="flex flex-col w-full min-h-[128px]">
      <div className="flex justify-between w-full">
        <div className="gap-1 self-stretch my-auto tracking-normal text-white whitespace-nowrap min-w-[240px] w-[284px]">
          Amount
        </div>
        <div className="flex items-center h-full text-gray-400 w-[139px]">
          <div className="self-stretch my-auto tracking-normal w-[68px]">
            Available:{" "}
          </div>
          <div className="self-stretch my-auto tracking-normal">
            {available}{" "}
          </div>
          <div className="flex gap-2 items-start self-stretch my-auto font-semibold leading-none text-center text-pink-300 whitespace-nowrap">
            <div className="flex items-start">
              <button
                onClick={onMaxClick}
                className="overflow-hidden gap-2 self-stretch px-2 py-1 rounded hover:opacity-80"
              >
                Max
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex overflow-hidden items-center mt-2 w-full text-white whitespace-nowrap rounded-lg border border-solid shadow-sm bg-white bg-opacity-0 border-white border-opacity-10">
        <div className="flex flex-1 shrink items-center self-stretch my-auto leading-none basis-8 min-w-[240px]">
          <div className="flex flex-1 shrink gap-2.5 items-start self-stretch px-4 py-2 my-auto w-full basis-0 min-w-[240px]">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 shrink w-full min-w-[240px] bg-transparent border-none focus:outline-none"
              aria-label="Amount input"
            />
          </div>
        </div>
        <div className="flex shrink-0 self-stretch w-px bg-zinc-800 h-[54px]" />
        <div className="flex gap-2.5 items-center self-stretch py-3.5 pr-5 pl-3 my-auto tracking-normal text-center">
          <TokenIcon src={tokenIcon.src} alt={tokenIcon.alt} />
          <div className="self-stretch my-auto">{tokenSymbol}</div>
        </div>
      </div>
    </div>
  );
}
