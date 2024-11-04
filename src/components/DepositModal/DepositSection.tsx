// src/components/DepositSection.tsx

import { copyToClipboard, shortenAddress } from "@/utils/helper";
// import { usePrivy } from "@privy-io/react-auth";
import React, { useState } from "react";
import { useAccount } from "wagmi";

const DepositSection = ({text}: {text:string}) => {
  // const { user } = usePrivy();
  const {address} = useAccount()
  const [isCopied, setIsCopied] = useState(false); // State to track copy status

  // Handle copy action
  const handleCopy = async () => {
    const success = await copyToClipboard(address as string);
    if (success) {
      setIsCopied(true); // Update state to show tick
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <section className="flex flex-col flex-1 justify-center mt-4 w-full">
      <div className="flex flex-col w-full h-24">
        <div className="flex flex-col w-full min-h-[128px]">
          <h2 className="flex gap-1 items-center w-full text-base tracking-normal text-white">
            <span className="gap-1 self-stretch text-sm my-auto min-w-[240px] w-[284px]">
              {text}
            </span>
          </h2>
          <div className="flex overflow-hidden items-center mt-2 w-full rounded-lg border border-solid shadow-sm bg-white bg-opacity-0 border-white border-opacity-10">
            <div className="flex flex-1 shrink items-center self-stretch my-auto text-base leading-none text-white whitespace-nowrap basis-8 min-w-[240px]">
              <div className="flex flex-1 shrink gap-2.5 items-start self-stretch px-4 py-2 my-auto w-full basis-0 min-w-[240px]">
                <div className="flex-1 shrink w-full min-w-[240px]">
                  {shortenAddress(address || '')}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 self-stretch w-px bg-zinc-800 h-[54px]" />
            <div className="flex gap-2.5 items-center self-stretch py-3.5 pr-5 pl-3 my-auto w-[58px]">
              <button onClick={handleCopy} className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                {isCopied ? (
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/your-tick-mark-image-url-here" // Replace with your tick mark icon URL
                    alt="Copied"
                    className="object-contain aspect-square"
                  />
                ) : (
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/6d53b90aba36f4daa7a7550385d72e42dfdeb995f6c6f1533e43f5e4e2a16204?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
                    alt="Copy"
                    className="object-contain aspect-square"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepositSection;
