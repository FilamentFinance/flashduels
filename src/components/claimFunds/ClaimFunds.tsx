import * as React from "react";
import { AmountInput } from "./AmountInput";
import { ClaimButton } from "./ClaimButton";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CHAIN_ID, NEXT_PUBLIC_DIAMOND } from "@/utils/consts";
// import { FLASHDUELSABI } from "@/abi/FLASHUSDC";
import { ethers } from "ethers";
import { useAtom } from "jotai";
import { GeneralNotificationAtom } from "../GeneralNotification";
import { useBalance } from "@/blockchain/useBalance";
import { FLASHDUELS_VIEWFACET } from "@/abi/FlashDuelsViewFacet";
import { FLASHDUELS_CORE_ABI } from "@/abi/FlashDuelsCoreFacet";

export function ClaimFundsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [amount, setAmount] = React.useState("1000");
  const [loading, setLoading] = React.useState(false);
  const [notification,setNotification] = useAtom(GeneralNotificationAtom);
  const [refetchToggle, setRefetchToggle] = React.useState(false);
  const { address} = useAccount();
  const {refetch: refetchAccountBalance} = useBalance(address as string);
  const {
    writeContractAsync: lpTokenSecondFunctionAsyncLocal,
  } = useWriteContract({});
  const {
    data: available,
    refetch
  } = useReadContract({
    abi: FLASHDUELS_VIEWFACET,
    functionName: "getAllTimeEarnings",
    address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
    chainId: CHAIN_ID,
    args: [address],
    // refetc: refetchToggle,
  });
  console.log(notification, "notification")

  React.useEffect(() => {
    // Trigger re-fetch whenever refetchTrigger changes
    if (refetch) refetch();
  }, [refetchToggle, refetch]);

  const availableAmount = Number(ethers.formatUnits(
    String((available) || 0),
    6
  ));


  const handleMaxClick = () => {
    setAmount(availableAmount.toString());
  };

  const handleClaim = async () => {
    setLoading(true);
    try{
      await lpTokenSecondFunctionAsyncLocal({
        abi: FLASHDUELS_CORE_ABI,
        address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
        functionName: "withdrawEarnings",
        chainId: CHAIN_ID,
        args: [parseFloat(amount) * 10 ** 6],
      });
      setNotification({
        isOpen: true,
        success: true,
        massage: "Claimed Successfully",
      })
    }catch(e){
      console.log(e);
      setNotification({
        isOpen: true,
        success: false,
        massage: "Failed to Claim Earnings",
      })
    }finally{
      setLoading(false);
      onClose();
      setRefetchToggle(!refetchToggle);
      refetchAccountBalance();
    }
   
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex overflow-hidden flex-col rounded-lg border border-solid shadow-sm bg-zinc-900 border-zinc-700 max-w-[438px] relative">

      <div className="relative flex items-center py-6 w-full text-2xl font-semibold tracking-normal text-white">
  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">Claim Funds</div>
  <button onClick={onClose} className="ml-auto pr-3">
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/c8454ace92408c5f78a561826e30af0ccb24a17e06e7bdcde242966a7eca23a8?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
      alt=""
      className="object-contain w-7 h-7"
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
            <ClaimButton onClick={async () => await handleClaim()} loading={loading}/>
          </div>
        </div>
      </div>
    </div>
  );
}
