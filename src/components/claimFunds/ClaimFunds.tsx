import * as React from "react";
import { AmountInput } from "./AmountInput";
import { ClaimButton } from "./ClaimButton";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CHAIN_ID, NEXT_PUBLIC_FLASH_DUELS } from "@/utils/consts";
import { FLASHDUELSABI } from "@/abi/FlashDuelsABI";
import { ethers } from "ethers";

export function ClaimFundsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [amount, setAmount] = React.useState("1000");
  const {
    writeContractAsync: lpTokenSecondFunctionAsyncLocal,
  } = useWriteContract({});
  const { address } = useAccount();
  const {
    data: available,
  } = useReadContract({
    abi: FLASHDUELSABI,
    functionName: "getAllTimeEarnings",
    address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
    chainId: CHAIN_ID,
    args: [address],
  });

  const availableAmount = Number(ethers.formatUnits(
    String((available) || 0),
    6
  ));


  const handleMaxClick = () => {
    setAmount(availableAmount.toString());
  };

  const handleClaim = async () => {
    lpTokenSecondFunctionAsyncLocal({
      abi: FLASHDUELSABI,
      address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
      functionName: "withdrawEarnings",
      chainId: CHAIN_ID,
      args: [parseFloat(amount) * 10 ** 6],
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex overflow-hidden flex-col rounded-lg border border-solid shadow-sm bg-zinc-900 border-zinc-700 max-w-[438px] relative">

        <div className="flex relative gap-10 justify-between items-start py-6 w-full text-2xl font-semibold tracking-normal text-white">
          <div className="z-0 my-auto">Claim Funds</div>
          <button onClick={onClose}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c8454ace92408c5f78a561826e30af0ccb24a17e06e7bdcde242966a7eca23a8?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
              alt=""
              className="object-contain absolute right-4 top-2/4 z-0 shrink-0 self-start w-7 h-7 -translate-y-2/4 aspect-square fill-white fill-opacity-10 stroke-[1px] stroke-white stroke-opacity-0 translate-x-[0%]"
            />
          </button>
        </div>

        <div className="flex flex-col p-6 w-full text-base">
          <div className="flex flex-col w-full h-24">
            <AmountInput
              value={amount}
              available={availableAmount}
              onMaxClick={handleMaxClick}
              onChange={setAmount}
              tokenIcon={{
                src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a868042e1affa178175e67dc42ae2d0a682a2a544bc1a547225ef2193e263f2b?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d",
                alt: "USDC token icon",
              }}
              tokenSymbol="USDC"
            />
          </div>
          <div className="flex gap-2.5 mt-8 w-full font-semibold leading-none text-gray-900 min-h-[63px]">
            <ClaimButton onClick={async () => await handleClaim()} />
          </div>
        </div>
      </div>
    </div>
  );
}
