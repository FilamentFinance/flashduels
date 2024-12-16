import * as React from "react";
import { PriceDisplay } from "./PriceDisplay";
import { ClaimButton } from "./ClaimButton";
import { useAccount, useReadContract } from "wagmi";
import { CHAIN_ID, NEXT_PUBLIC_DIAMOND } from "@/utils/consts";
// import { FLASHDUELSABI } from "@/abi/FLASHUSDC";
import { ethers } from "ethers";
import { FLASHDUELS_VIEWFACET } from "@/abi/FlashDuelsViewFacet";

export const RewardCard: React.FC = () => {

  const {address} = useAccount();

  const {
    data: available,
  } = useReadContract({
    abi: FLASHDUELS_VIEWFACET,
    functionName: "getAllTimeEarnings",
    address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
    chainId: CHAIN_ID,
    args: [address],
  });

  const availableAmount = Number(ethers.formatUnits(
    String((available) || 0),
    6
  ));

  return (
    <div className="flex gap-2 items-center py-1 pl-2 whitespace-nowrap rounded-lg border-2 border-solid bg-white bg-opacity-0 border-white border-opacity-10 shadow-[0px_2px_10px_rgba(0,0,0,0.25)]">
      <PriceDisplay
        amount={availableAmount}
        iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/427d45b45afa37b1eb87be276dafef70bc14ecf23817ee21e7de77d5a21bc791?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
      />
      <ClaimButton>Claim</ClaimButton>
    </div>
  );
};
