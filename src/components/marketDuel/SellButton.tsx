// import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
// import { FLASHDUELSABI } from "@/abi/FlashDuelsABI";
// import { config } from "@/app/config/wagmi";
// import { postPricingData, useTotalBets } from "@/app/optionPricing";
import { useBalance } from "@/blockchain/useBalance";
// import { CHAIN_ID, NEXT_PUBLIC_API, NEXT_PUBLIC_FLASH_DUELS, NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";
// import { calculateFlashDuelsOptionPrice } from "@/utils/flashDuelsOptionPricing";
// import axios from "axios";
import React, { useState } from "react";
import { useAccount } from "wagmi";
// import { waitForTransactionReceipt } from "wagmi/actions";
import { GeneralNotificationAtom } from "../GeneralNotification";
import { useAtom } from "jotai";
import { estConnection } from "@/utils/atoms";
import usePopup from "@/app/providers/PopupProvider";
import { apiClient } from "@/utils/apiClient";
import { NEXT_PUBLIC_API } from "@/utils/consts";

interface SellButtonProps {
  quantity: string;
  price: string;
  betOptionId: string
//   setIsModalOpen: (arg0: boolean) => void;
}

const SellButton: React.FC<SellButtonProps> = ({
  quantity, price, betOptionId
}) => {
  const { address } = useAccount();
  const [establishConnection] = useAtom(estConnection)
 const {showPopup} = usePopup()
  const [notification, setNotification] = useAtom(GeneralNotificationAtom);
  const { refetch } = useBalance(address as string);
//   const { totalBetYes, totalBetNo } = useTotalBets(duelId);
  const [loading, setLoading] = useState(false); // Add loading state
  console.log(notification)
//   const {
//     writeContractAsync: lpTokenApproveAsyncLocal,
//   } = useWriteContract({});
//   const {
//     writeContractAsync: lpTokenSecondFunctionAsyncLocal,
//   } = useWriteContract({});

//   const lpTokenApproveAsync = (amount: number) =>
//     lpTokenApproveAsyncLocal({
//       abi: FLASHUSDCABI,
//       address: NEXT_PUBLIC_FLASH_USDC as `0x${string}`,
//       functionName: "increaseAllowance",
//       chainId: CHAIN_ID,
//       args: [NEXT_PUBLIC_FLASH_DUELS, amount],
//     });

//   const joinCryptoDuel = async (duelId: string, option: string, asset: string, optionIndex: number, optionPrice: number, amount: number) => {
//     return lpTokenSecondFunctionAsyncLocal({
//       abi: FLASHDUELSABI,
//       address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
//       functionName: "joinCryptoDuel",
//       chainId: CHAIN_ID,
//       args: [duelId, option, asset, optionIndex, optionPrice, amount],
//     });
//   };

//   const joinFlashDuel = async (duelId: string, option: string, optionIndex: number, optionPrice: number, amount: number) =>
//     lpTokenSecondFunctionAsyncLocal({
//       abi: FLASHDUELSABI,
//       address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
//       functionName: "joinDuel",
//       chainId: CHAIN_ID,
//       args: [duelId, option, optionIndex, optionPrice, amount],
//     });

  const handleClick = async () => {
    setLoading(true); // Start loading

    try {
    //   const amount = Number(betAmount) * 10 ** 6;
    //   const hash = await lpTokenApproveAsync(amount);
    //   const receipt = await waitForTransactionReceipt(config, { hash });

    //   console.log(receipt, "approve-hash");

    //   const optionIndex = bet === "YES" ? 0 : 1;
    //   const timePeriod = endsIn && endsIn / (365 * 24);

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
   {establishConnection ?   <button
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
