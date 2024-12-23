// import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
// import { FLASHDUELSABI } from "@/abi/FlashDuelsABI";
// import { config } from "@/app/config/wagmi";
// import { postPricingData, useTotalBets } from "@/app/optionPricing";
import { useBalance } from "@/blockchain/useBalance";
// import { CHAIN_ID, NEXT_PUBLIC_API, NEXT_PUBLIC_FLASH_DUELS, NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";
// import { calculateFlashDuelsOptionPrice } from "@/utils/flashDuelsOptionPricing";
// import axios from "axios";
import React, { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import { waitForTransactionReceipt } from "wagmi/actions";
import { GeneralNotificationAtom } from "../GeneralNotification";
import { useAtom } from "jotai";
import { estConnection } from "@/utils/atoms";
import usePopup from "@/app/providers/PopupProvider";
import { apiClient } from "@/utils/apiClient";
import { CHAIN_ID, NEXT_PUBLIC_API, NEXT_PUBLIC_DIAMOND } from "@/utils/consts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OPTION_TOKEN_ABI } from "@/abi/OptionToken";
import { FLASHDUELS_VIEWFACET } from "@/abi/FlashDuelsViewFacet";
import { FLASHDUELS_MARKETPLACE } from "@/abi/FlashDuelsMarketplaceFacet";
// import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/app/config/wagmi";

interface SellButtonProps {
  quantity: string;
  price: string;
  betOptionId: string;
  optionIndex: number;
  duelId:string;
//   setIsModalOpen: (arg0: boolean) => void;
}

const SellButton: React.FC<SellButtonProps> = ({
  quantity, price, betOptionId, optionIndex, duelId
}) => {
  const { address, isConnected } = useAccount();
  const [establishConnection] = useAtom(estConnection)
 const {showPopup} = usePopup()
  const [notification, setNotification] = useAtom(GeneralNotificationAtom);
  const { refetch } = useBalance(address as string);
//   const { totalBetYes, totalBetNo } = useTotalBets(duelId);
  const [loading, setLoading] = useState(false); // Add loading state
  console.log(notification)
  const {
    writeContractAsync: lpTokenApproveAsyncLocal,
  } = useWriteContract({});
  const {
    writeContractAsync: lpTokenSecondFunctionAsyncLocal,
  } = useWriteContract({});

  const {
    data: optionTokenAddress,
} = useReadContract({
    abi: FLASHDUELS_VIEWFACET,
    functionName: "getOptionIndexToOptionToken",
    address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
    chainId: CHAIN_ID,
    args: [duelId, optionIndex],
});


//sell

  const lpTokenApproveAsync = () =>
    lpTokenApproveAsyncLocal({
      abi: OPTION_TOKEN_ABI,
      address: optionTokenAddress as `0x${string}`,
      functionName: "approve",
      chainId: CHAIN_ID,
      args: [NEXT_PUBLIC_DIAMOND, Number(quantity) * 10 ** 18],
    });

  const sellBet = async () => {
    return lpTokenSecondFunctionAsyncLocal({
      abi: FLASHDUELS_MARKETPLACE,
      address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
      functionName: "sell",
      chainId: CHAIN_ID,
      args: [optionTokenAddress, duelId, optionIndex, Number(quantity) * 10 ** 18, (Number(price) * Number(quantity) * 10 ** 6)],
    });
  };

  const handleClick = async () => {
    setLoading(true); // Start loading

    try {
      const hash = await lpTokenApproveAsync();
      await waitForTransactionReceipt(config, { hash });

      const sellHash = await sellBet()
      await waitForTransactionReceipt(config, { hash: sellHash });

   
      await apiClient.post(
        `${NEXT_PUBLIC_API}/betOption/sell`,
        {
         betOptionId,
         quantity,
         price
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      setNotification({
        isOpen: true,
        success: true,
        massage: "Placed Sell Order Successfully",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        success: false,
        massage: "Failed to Place Sell Order",
      });
      console.error("Error placing bet:", error);
    } finally {
      setLoading(false); // Stop loading
    //   setIsModalOpen(false);
      refetch()
    }
  };

  return (
    <div>
   {!isConnected ? <ConnectButton/> : establishConnection ?   <button
   className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
   onClick={showPopup}
   >
     Enable Trading
   </button>:
    <button
      className="flex flex-col mt-4 w-full text-base font-semibold leading-none text-gray-900"
    //   disabled={!betAmount}
      onClick={handleClick}
    >
      <div className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]">
        {loading ? (
          <div className="spinner"></div>  // Add the spinner here
        ) : (
          <span>Sell Bet</span>
        )}
      </div>
    </button>}
    </div>

  );
};

export default SellButton;
