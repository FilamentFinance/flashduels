import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import useOrder from '@/hooks/useOrders';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { OrderData } from '@/types/dual';
import * as React from 'react';

interface OrderRowProps {
  order: OrderData;
  duelId: string;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, duelId }) => {
  const { cancelSell } = useOrder(duelId, order.betOptionIndex);

  const { toast } = useToast();

  const handleCancel = async () => {
    if (order.sellId === undefined) {
      toast({
        title: 'Error',
        description: 'Sell ID is not available',
        variant: 'destructive',
      });
      return;
    }

    const result = await cancelSell(order.sellId);
    const response = await baseApiClient.delete(`${SERVER_CONFIG.API_URL}/betOption/cancel`, {
      data: {
        betOptionMarketId: order.id,
        duelId,
      },
    });

    if (response.data.message && result) {
      toast({
        title: 'Success',
        description: 'Order cancelled successfully',
      });
      // Optionally, you can add additional logic to update your UI here.
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to cancel order',
        variant: 'destructive',
      });
    }
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
        <div
          className={`flex items-center justify-center w-[88px] text-xs font-medium ${order.betOptionIndex === 0 ? 'text-lime-300' : 'text-red-400'}`}
        >
          {order.betOptionIndex === 0 ? 'YES' : 'NO'}
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
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
