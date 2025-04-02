import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import useCancelOrder from '@/hooks/useCancelOrders';
import WebSocketManager from '@/hooks/useWebSocket';
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

interface OrdersTableProps {
  duelId: string;
}

export interface OrderData {
  sellId: number;
  betOptionIndex: number;
  price: number;
  amount: number;
  duelTitle: string;
  id: string;
  quantity: number;
}

// The message type now expects openOrders as an array of OrderData
interface OpenOrdersMessage {
  openOrders?: OrderData[];
}

export const OrdersHistory = ({ duelId }: OrdersTableProps) => {
  const [openOrders, setOpenOrders] = useState<OrderData[]>([]);
  const { address } = useAccount();
  const { toast } = useToast();
  const { cancelSell } = useCancelOrder();
  // const [wsManager, setWsManager] = useState<WebSocketManager<OpenOrdersMessage> | null>(null);

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
      await baseApiClient.delete(`${SERVER_CONFIG.API_URL}/user/betOption/cancel`, {
        data: {
          duelId,
          betOptionMarketId: order.id,
          userAddress: address?.toLowerCase(),
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
    if (!address) {
      return null;
    }
    // const token = localStorage.getItem(`Bearer_${address!.toLowerCase()}`);
    // Create an instance of WebSocketManager by passing the address.
    const manager = new WebSocketManager<OpenOrdersMessage>({
      address, // The manager will retrieve the token automatically.
      url: `${SERVER_CONFIG.API_WS_URL}/openOrdersWebSocket`,
      onMessage: (message: OpenOrdersMessage) => {
        if (message.openOrders) {
          setOpenOrders(message.openOrders);
        }
      },
      onOpen: () => console.info('Connected to the WebSocket server'),
      onError: (error) => console.error('WebSocket Error:', error),
      onClose: () => console.info('Disconnected from the WebSocket server'),
    });

    manager.connect();
    return manager;
  }, [address]);

  useEffect(() => {
    const manager = setupWebSocket();
    // setWsManager(manager);

    // Cleanup on component unmount: close the WebSocket connection
    return () => {
      if (manager) {
        manager.close();
      }
    };
  }, [setupWebSocket]);

  return (
    <Card className="mt-4 bg-neutral-900 border-2 border-neutral-800">
      <CardHeader className="p-0 space-y-0">
        <div className="flex border-b border-zinc-800">
          <div className="relative">
            <div className="px-3 py-2 text-xs font-semibold text-pink-300">Open Orders</div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-pink-300" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[200px]">
          {openOrders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs font-medium text-stone-300">No open orders</span>
            </div>
          ) : (
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              <Table>
                <TableHeader className="sticky top-0 bg-neutral-900 z-10">
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
                      <TableCell className="py-3 text-xs font-medium text-white">
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 rounded text-[10px]">{order.duelTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`py-3 text-xs font-medium text-center
                          ${order.betOptionIndex === 0 ? 'text-lime-300' : 'text-red-400'}`}
                      >
                        {order.betOptionIndex === 0 ? 'LONG' : 'SHORT'}
                      </TableCell>
                      <TableCell className="py-3 text-xs font-medium text-white text-center">
                        {Number(order.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell className="py-3 text-xs font-medium text-white text-center">
                        {Number(order.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="py-3 text-center">
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
