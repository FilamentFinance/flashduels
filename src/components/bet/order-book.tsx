import { OPTIONS_TYPE } from '@/constants/dual';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';
import { OptionBetType, OptionsType } from '@/types/dual';
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
  const renderOrders = (orders: OptionBetType[], type: OptionsType) => (
    <TableBody>
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

  const OrderTable = ({ orders, type }: { orders: OptionBetType[]; type: OptionsType }) => (
    <div className="h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-neutral-900 z-10">
          <TableRow className="border-b-2 border-stone-900 hover:bg-transparent">
            <TableHead className="w-24 text-stone-200 py-3">Price</TableHead>
            <TableHead className="text-stone-200 py-3">
              {type === OPTIONS_TYPE.YES ? 'Quantity' : 'Amount'}
            </TableHead>
            <TableHead className="w-24 py-3" />
          </TableRow>
        </TableHeader>
        {renderOrders(orders, type)}
      </Table>
    </div>
  );

  return (
    <Card className="mt-4 bg-neutral-900 border-2 border-stone-900">
      <CardContent className="p-0">
        {yesBets.length === 0 && noBets.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-white">
            No Open Orders
          </div>
        ) : (
          <div className="flex h-[300px] divide-x-2 divide-stone-900">
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              <OrderTable orders={yesBets} type={OPTIONS_TYPE.YES} />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              <OrderTable orders={noBets} type={OPTIONS_TYPE.NO} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderBook;
