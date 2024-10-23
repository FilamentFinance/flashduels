import { useBalance } from "@/blockchain/useBalance";
import React from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { shortenAddress } from "@/utils/helper";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

const WalletInfo = ({onClose}:{onClose:()=> void}) => {
  const {user} = usePrivy();
  const router = useRouter();
  const {address} = useAccount();
  const {balance} = useBalance(address as string);

  const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));
  
  return (
    <section onClick={()=> {router.push("/portfolio"); onClose()}} className="flex gap-4 items-center self-center mt-4 max-w-full w-[400px]">
      <div className="flex flex-1 shrink gap-10 justify-between items-center self-stretch px-2 py-1 my-auto w-full rounded-lg border-2 border-solid basis-0 bg-white bg-opacity-0 border-white border-opacity-10 min-w-[240px]">
        <div className="flex gap-1 items-center self-stretch my-auto w-[207px]">
          <div className="flex items-start self-stretch my-auto w-[26px]">
            <div className="flex justify-center items-center bg-gray-500 rounded h-[26px] min-h-[26px] w-[26px]">
              <div className="flex overflow-hidden flex-col self-stretch my-auto rounded border border-solid border-white border-opacity-20 w-[26px]">
                <div className="flex shrink-0 h-[26px]" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center self-stretch my-auto text-right whitespace-nowrap">
            <div className="flex flex-col justify-center self-stretch my-auto">
              <div className="text-xs font-medium tracking-normal leading-none text-stone-200">
                {user?.twitter?.username}
              </div>
              <div className="text-xs tracking-normal leading-relaxed text-stone-500">
               {shortenAddress(user?.wallet?.address || '')}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center self-stretch my-auto text-base whitespace-nowrap text-stone-200">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1cf26eff42d9c5cba2352f931c30871b766393354a3fa7b44a9582ca025d4567?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
          />
          <div className="self-stretch my-auto">{balanceNum}</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4a31119f3e4025713c364f993c934fcd0847a60ff8d0daa9ecfc065476e3bb4e?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-3 aspect-square"
          />
        </div>
      </div>
    </section>
  );
};

export default WalletInfo;
