import * as React from "react";
import { TableHeader } from "./TableHeader";
import { OrderRow } from "./OrderRow";
import type { OrderData } from "./types";
import { NEXT_PUBLIC_WS_URL } from "@/utils/consts";
import { useAccount } from "wagmi";


export const OrdersTable = ({duelId}: {duelId:string}) => {
  const [openOrders, setOpenOrders] = React.useState<OrderData[]>([]);
  const { address } = useAccount();
  React.useEffect(() => {
    const token = localStorage.getItem(`Bearer_${address!.toLowerCase()}`);

    if (!token) {
      console.error("Authorization token is missing");
      return;
    }

    // Create a WebSocket connection with headers
    const socket = new WebSocket(`${NEXT_PUBLIC_WS_URL}/openOrdersWebSocket?token=${token}`);

    socket.onopen = function () {
      console.log('Connected to the WebSocket server');
    };

    socket.onmessage = function (event) {
      console.log('Message received:', event.data);
      const message = JSON.parse(event.data);
      console.log(message, "message-openOrders")
      if (message.openOrders) {
        console.log(message.openOrders, "message.openOrders")

        setOpenOrders(message.openOrders);
      }
    };

    socket.onerror = function (error) {
      console.log('WebSocket Error:', error);
    };

    socket.onclose = function () {
      console.log('Disconnected from the WebSocket server');
    };

    // Cleanup WebSocket on unmount
    return () => {
      socket.close();
    };
  }, []);
  return (
    <div className="flex flex-col rounded-lg border-2 border-solid shadow-sm bg-neutral-900 border-neutral-800 w-[65.5%]">
      <div className="flex flex-col items-start pt-2 w-full border-b border-neutral-800">
        <div className="flex gap-2.5 items-start border-b border-zinc-800">
          <div className="flex flex-col justify-center text-xs font-semibold tracking-normal leading-none text-pink-300 rounded-lg min-h-[33px] w-[99px]">
            <div className="flex gap-2 items-center px-3 py-2">
              <div className="gap-2 self-stretch my-auto">Open Orders</div>
            </div>
            <div className="flex w-full bg-pink-300 min-h-[1px]" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full min-h-[250px]">
        {openOrders.length != 0 ? <> <div className="flex w-full text-xs font-medium tracking-normal leading-none whitespace-nowrap text-stone-300">
          <TableHeader label="Bet" width="w-[187px]" />
          <TableHeader label="Direction" width="w-[88px]" />
          <TableHeader label="Quantity" width="w-[82px]" />
          <TableHeader label="Price" width="w-[112px]" />
        </div>
          <div className="flex flex-col w-full">
            {openOrders.map((order) => (
              <OrderRow key={order.id} order={order} duelId={duelId} />
            ))}
          </div> </> : <span className="flex justify-center w-full text-xs font-medium tracking-normal leading-none text-stone-300">No open orders</span>
        }
      </div>

    </div>
  );
};
