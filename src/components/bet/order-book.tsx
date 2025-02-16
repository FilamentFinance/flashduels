import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';
import { OptionBetType } from '@/types/dual';
import { FC } from 'react';
import { OrderItem } from './OrderItem';

interface OrderBookProps {
  yesBets: OptionBetType[];
  noBets: OptionBetType[];
  handleBuyOrders: (
    betOptionMarketId: string,
    quantity: string,
    index: number,
    sellId: number,
    amount: string,
  ) => void;
}

const OrderBook: FC<OrderBookProps> = ({ yesBets, noBets, handleBuyOrders }) => {
  const renderOrders = (orders: OptionBetType[], type: 'YES' | 'NO') => (
    <TableBody className="overflow-y-auto">
      {orders.map((order, index) => (
        <OrderItem
          key={`${type}-${index}`}
          price={order.price}
          amount={order.quantity}
          type={type}
          onBuy={() =>
            handleBuyOrders(
              order.id,
              order.quantity,
              order.betOption?.index as number,
              order.sellId,
              order.amount,
            )
          }
        />
      ))}
    </TableBody>
  );

  const OrderTable = ({ orders, type }: { orders: OptionBetType[]; type: 'YES' | 'NO' }) => (
    <div className="flex-1">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-stone-900 hover:bg-transparent">
            <TableHead className="w-24 text-stone-200">Price</TableHead>
            <TableHead className="text-stone-200">
              {type === 'YES' ? 'Quantity' : 'Amount'}
            </TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        {renderOrders(orders, type)}
      </Table>
    </div>
  );

  return (
    <Card className="mt-7 bg-neutral-900 border-2 border-stone-900">
      <CardContent className="p-0">
        {yesBets.length === 0 && noBets.length === 0 ? (
          <div className="flex items-center justify-center h-[441px] text-white">
            No Open Orders
          </div>
        ) : (
          <div className="flex h-[441px] divide-x-2 divide-stone-900">
            <div className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              <OrderTable orders={yesBets} type="YES" />
            </div>
            <div className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              <OrderTable orders={noBets} type="NO" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderBook;
