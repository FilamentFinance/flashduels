import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import useCancelOrder from '@/hooks/useCancelOrders';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
// import { baseApiClient } from '@/lib/axios';

interface OrdersTableProps {
  duelId: string;
}

interface OrderData {
  sellId: number;
  betOptionIndex: number;
  price: number;
  amount: number;
  duelTitle: string;
  id: string;
  quantity: number;
}

export const OrdersTable = ({ duelId }: OrdersTableProps) => {
  const [openOrders, setOpenOrders] = useState<OrderData[]>([]);
  const { address } = useAccount();
  const { toast } = useToast();
  const { cancelSell } = useCancelOrder();

  const handleCancel = async (order: OrderData) => {
    if (order.sellId === undefined) {
      toast({
        title: 'Error',
        description: 'Invalid order ID',
        variant: 'destructive',
      });
      return;
    }

    const result = await cancelSell(duelId, order.betOptionIndex, order.sellId);

    if (result.success) {
      // Update backend
      await baseApiClient.delete(`${SERVER_CONFIG.API_URL}/betOption/cancel`, {
        data: {
          duelId,
          address,
          position: order.betOptionIndex,
          sellId: order.sellId,
        },
      });

      // Remove the cancelled order from the UI
      setOpenOrders((prevOrders) => prevOrders.filter((o) => o.sellId !== order.sellId));

      toast({
        title: 'Success',
        description: 'Order cancelled successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to cancel order',
        variant: 'destructive',
      });
    }
  };

  const setupWebSocket = useCallback(() => {
    const token = localStorage.getItem(`Bearer_${address?.toLowerCase()}`);
    if (!token) {
      console.error('Authorization token is missing');
      return null;
    }

    const socket = new WebSocket(`${SERVER_CONFIG.API_WS_URL}/openOrdersWebSocket?token=${token}`);

    socket.onopen = () => console.log('Connected to the WebSocket server');
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.openOrders) {
        setOpenOrders(message.openOrders);
      }
    };
    socket.onerror = (error) => console.log('WebSocket Error:', error);
    socket.onclose = () => console.log('Disconnected from the WebSocket server');

    return socket;
  }, [address]);

  useEffect(() => {
    const socket = setupWebSocket();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [setupWebSocket]);

  return (
    <Card className="bg-neutral-900 border-2 border-neutral-800">
      <CardHeader className="p-0 space-y-0">
        <div className="flex border-b border-zinc-800">
          <div className="relative">
            <div className="px-3 py-2 text-xs font-semibold text-pink-300">Open Orders</div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-pink-300" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="min-h-[250px]">
          {openOrders.length === 0 ? (
            <div className="flex items-center justify-center h-[250px]">
              <span className="text-xs font-medium text-stone-300">No open orders</span>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-neutral-800">
                    <TableHead className="text-xs font-medium text-stone-500 py-2">Bet</TableHead>
                    <TableHead className="text-xs font-medium text-stone-500 text-center py-2">
                      Direction
                    </TableHead>
                    <TableHead className="text-xs font-medium text-stone-500 text-center py-2">
                      Quantity
                    </TableHead>
                    <TableHead className="text-xs font-medium text-stone-500 text-center py-2">
                      Price
                    </TableHead>
                    <TableHead className="text-xs font-medium text-stone-500 text-center py-2">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-neutral-800/50 border-b border-neutral-800"
                    >
                      <TableCell className="py-4 text-xs font-medium text-white">
                        <div className="flex items-center gap-2">
                          <div className=" px-2 py-1 rounded text-[10px]">{order.duelTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`py-4 text-xs font-medium text-center
                          ${order.betOptionIndex === 0 ? 'text-lime-300' : 'text-red-400'}`}
                      >
                        {order.betOptionIndex === 0 ? 'YES' : 'NO'}
                      </TableCell>
                      <TableCell className="py-4 text-xs font-medium text-white text-center">
                        {Number(order.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell className="py-4 text-xs font-medium text-white text-center">
                        {Number(order.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Button
                          variant="outline"
                          className="px-5 py-1 text-xs font-bold text-red-500 border-red-500 bg-red-600/10 hover:bg-red-600/20 hover:text-red-400"
                          onClick={() => handleCancel(order)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
