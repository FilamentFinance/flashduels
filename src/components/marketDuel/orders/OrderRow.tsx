import * as React from "react";
import type { OrderData } from "./types";
import { apiClient } from "@/utils/apiClient";
import { NEXT_PUBLIC_API } from "@/utils/consts";
import { useAtom } from "jotai";
import { GeneralNotificationAtom } from "@/components/GeneralNotification";

interface OrderRowProps {
  order: OrderData;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order }) => {
  const [notification, setNotification] = useAtom(GeneralNotificationAtom); // Move this inside the component
  console.log(notification)
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
          <div className="text-xs font-semibold">{order.sellerId}</div>
        </div>

        {/* Direction */}
        <div className={`flex items-center justify-center w-[88px] text-xs font-medium ${order.betOption.index === 0 ? "text-lime-300" : "text-red-400"}`}>
          {order.betOption.index === 0 ? "YES" : "NO"}
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
                const response = await apiClient.delete(`${NEXT_PUBLIC_API}/betOption/cancel`, {
                  data: {
                    betOptionMarketId: order.id,
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
