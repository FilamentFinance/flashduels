import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { config } from "@/app/config/wagmi";
import { useTotalBets } from "@/app/optionPricing";
import { useBalance } from "@/blockchain/useBalance";
import { CHAIN_ID, NEXT_PUBLIC_API, NEXT_PUBLIC_DIAMOND, NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";
// import axios from "axios";
import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { GeneralNotificationAtom } from "../GeneralNotification";
import { useAtom } from "jotai";
import { estConnection } from "@/utils/atoms";
import usePopup from "@/app/providers/PopupProvider";
import { apiClient } from "@/utils/apiClient";
// import { FLASHDUELS_CORE_ABI } from "@/abi/FlashDuelsCoreFacet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useSwitchNetwork from "@/blockchain/useSwitchNetwork";

interface PlaceBetButtonProps {
  betAmount: string;
  bet: string;
  duelId: string;
  duelType: string;
  asset?: string;
  triggerPrice?: string;
  endsIn?: number;
  markPrice: number;
  setIsModalOpen: (arg0: boolean) => void;
  winCondition?:number
}

const PlaceBetButton: React.FC<PlaceBetButtonProps> = ({
  betAmount, bet, duelId, duelType, asset,setIsModalOpen, winCondition
}) => {
  const { address, isConnected, chainId } = useAccount();
  const [establishConnection] = useAtom(estConnection)
 const {showPopup} = usePopup()
 const {handleNetworkChange} = useSwitchNetwork()
  const [notification, setNotification] = useAtom(GeneralNotificationAtom);
  const { refetch } = useBalance(address as string);
  const { refetchTotalBets } = useTotalBets(duelId);
  const [loading, setLoading] = useState(false); // Add loading state
  console.log(notification)
  const {
    writeContractAsync: lpTokenApproveAsyncLocal,
  } = useWriteContract({});
  const lpTokenApproveAsync = (amount: number) =>
    lpTokenApproveAsyncLocal({
      abi: FLASHUSDCABI,
      address: NEXT_PUBLIC_FLASH_USDC as `0x${string}`,
      functionName: "increaseAllowance", //@note - mainnet - approve
      chainId: CHAIN_ID,
      args: [NEXT_PUBLIC_DIAMOND, amount],
    });

  const handleClick = async () => {
    setLoading(true); // Start loading

    try {
      const amount = Number(betAmount) * 10 ** 6;
      const hash = await lpTokenApproveAsync(amount);
      const receipt = await waitForTransactionReceipt(config, { hash });

      console.log(receipt, "approve-hash");

      const optionIndex = bet === "YES" ? 0 : 1;
      // const timePeriod = endsIn && endsIn / (365 * 24);

      // let secondHash;
      // let backendValue;
      // let indexValue;

      // if (duelType === "COIN_DUEL" && asset) {
        // backendValue = await postPricingData(
        //   markPrice,
        //   Number(triggerPrice),
        //   asset,
        //   timePeriod as number,
        //   totalBetYes || 0,
        //   totalBetNo || 0
        // );
        // indexValue = bet === "YES" ? backendValue["Yes Price"] : backendValue["No Price"];
        // const optionPrice = Math.floor(indexValue * 10 ** 6);
        // await apiClient.post(
        //   `${NEXT_PUBLIC_API}/blockchain/joinCryptoDuel`,
        //   {
        //     duelId,
        //     bet,
        //     optionIndex,
        //     amount,
        //     address: address?.toLowerCase(),
        //     asset
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     }
        //   }
        // );
          //  } 
     
      await apiClient.post(
        `${NEXT_PUBLIC_API}/bets/create`,
        {
          twitterUsername: "",
          bet,
          address: address?.toLowerCase(),
          betAmount: Number(betAmount),
          optionIndex,
          duelId,
          duelType,
          asset,
          winCondition
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
        massage: "Duel Joined Successfully",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        success: false,
        massage: "Failed to Join Duel",
      });
      console.error("Error placing bet:", error);
    } finally {
      setLoading(false); // Stop loading
      setIsModalOpen(false);
      refetch()
      refetchTotalBets()
    }
  };

  return (
    <div>
   {!isConnected ? (
  <ConnectButton />
) : establishConnection ? (
  <button
    className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
    onClick={showPopup}
  >
    Enable Trading
  </button>
) : chainId !== CHAIN_ID ? ( // Check if the user is on the correct network
  <button
  className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
  onClick={handleNetworkChange}
>
  Switch Network
</button>
) : (
  <button
    className="flex flex-col mt-4 w-full text-base font-semibold leading-none text-gray-900"
    disabled={!betAmount}
    onClick={handleClick}
  >
    <div className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]">
      {loading ? (
        <div className="spinner"></div> // Add the spinner here
      ) : (
        <span>Join Duel</span>
      )}
    </div>
  </button>
)}

    </div>

  );
};

export default PlaceBetButton;
