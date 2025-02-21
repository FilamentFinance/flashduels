import * as React from "react";
import type { OrderData } from "./types";
import { apiClient } from "@/utils/apiClient";
import { CHAIN_ID, NEXT_PUBLIC_API, NEXT_PUBLIC_DIAMOND } from "@/utils/consts";
import { useAtom } from "jotai";
import { GeneralNotificationAtom } from "@/components/GeneralNotification";
import { FLASHDUELS_MARKETPLACE } from "@/abi/FlashDuelsMarketplaceFacet";
import { FLASHDUELS_VIEWFACET } from "@/abi/FlashDuelsViewFacet";
import { useReadContract, useWriteContract } from "wagmi";

interface OrderRowProps {
  order: OrderData;
  duelId: string;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, duelId }) => {
  const [notification, setNotification] = useAtom(GeneralNotificationAtom); // Move this inside the component
  console.log(notification)
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
    args: [duelId, order.betOptionIndex],
  });

  const cancelSell = async (sellId: number) => {
  return lpTokenSecondFunctionAsyncLocal({
    abi: FLASHDUELS_MARKETPLACE,
    address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
    functionName: "cancelSell",
    chainId: CHAIN_ID,
    args: [optionTokenAddress, sellId],
  });
};

  return (
    <div className="flex items-center w-full">
      <div className="flex text-white items-center border-b border-neutral-800">
        {/* Icon and Title */}
        <div className="flex items-center p-4 gap-x-1 w-[187px]">
          {/* <div className="flex items-center justify-center h-[18px] bg-gray-500 rounded-md border border-white border-opacity-10">
            <img
              loading="lazy"
              src={order.icon}
              alt=""
              className="object-contain rounded-md aspect-square"
            />
          </div> */}
          <div className="text-xs font-semibold">{order.duelTitle}</div>
        </div>

        {/* Direction */}
        <div className={`flex items-center justify-center w-[88px] text-xs font-medium ${order.betOptionIndex === 0 ? "text-lime-300" : "text-red-400"}`}>
          {order.betOptionIndex === 0 ? "YES" : "NO"}
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-center w-[82px] text-xs font-medium">
          {Number(order.quantity).toFixed(2)}
        </div>

        {/* Price */}
        <div className="flex items-center justify-center w-[60px] text-xs font-medium">
          {Number(order.price).toFixed(2)}
        </div>

        {/* Cancel Button */}
        <div className="flex items-center justify-center w-[318px]">
          <button
            className="gap-2.5 px-5 py-1 rounded-lg border border-red-500 border-solid bg-red-600 bg-opacity-10 text-xs font-bold text-red-500"
            onClick={async () => {
              try {
                await cancelSell(order.sellId)
                const response = await apiClient.delete(`${NEXT_PUBLIC_API}/user/betOption/cancel`, {
                  data: {
                    betOptionMarketId: order.id,
                    duelId
                  },
                });
                
                if (response.data.message) {
                  console.log("Order cancelled successfully");
                  setNotification({
                    isOpen: true,
                    success: true,
                    massage: response.data.message,
                  });
                }
              } catch (error) {
                console.error("Error fetching account data:", error);
                setNotification({
                  isOpen: true,
                  success: false,
                  massage: "Failed to Cancel Bet",
                });
              }
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
