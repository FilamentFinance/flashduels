'use client';
import { ORDER_LABELS, ORDER_TYPE } from '@/constants/duel';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { useTotalBets } from '@/hooks/useTotalBets';
import { useWebSocketPrices } from '@/hooks/useWebSocketPrices';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import { cn } from '@/shadcn/lib/utils';
import { RootState } from '@/store';
import { OrderType } from '@/types/duel';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import BuyOrder from './buy-order';
import SellOrder from './sell-order';

interface PlaceOrderProps {
  duelId: string;
  duelType: string;
  asset: string | undefined;
  triggerPrice?: string;
  endsIn: number;
  winCondition: number | undefined;
  token: string | undefined;
  category?: string;
}

const PlaceOrder: FC<PlaceOrderProps> = ({
  duelId,
  duelType,
  asset,
  endsIn,
  triggerPrice,
  winCondition,
  token,
  // category,
}) => {
  const [orderType, setOrderType] = useState<OrderType>(ORDER_TYPE.BUY);
  const { yesPrice, noPrice, ws } = useWebSocketPrices(asset);
  const { price } = useSelector((state: RootState) => state.price);
  const { totalBetYes, totalBetNo } = useTotalBets(duelId);

  usePriceCalculation({
    ws,
    asset,
    endsIn,
    priceFormatted: price,
    triggerPrice: Number(triggerPrice || 0),
    winCondition,
    totalBetYes,
    totalBetNo,
    duelId,
  });

  return (
    <Card className="bg-zinc-900 rounded-xl w-full max-w-md border-zinc-800 h-fit">
      <CardContent className="p-6">
        {/* Buy/Sell Tabs */}
        <Tabs
          value={orderType}
          onValueChange={(value) => setOrderType(value as OrderType)}
          className="w-full "
        >
          <TabsList className="w-full h-auto p-0 bg-transparent border-b border-zinc-800 flex items-start justify-start my-2">
            {Object.values(ORDER_TYPE).map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className={cn(
                  'pb-2 px-4 relative font-medium text-lg transition-colors data-[state=active]:shadow-none',
                  'data-[state=active]:text-[#F19ED2] data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-zinc-400',
                  'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5',
                  'after:bg-[#F19ED2] after:transition-transform',
                  'data-[state=active]:after:scale-x-100 data-[state=inactive]:after:scale-x-0',
                )}
              >
                {ORDER_LABELS[type]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Order Form */}
        {orderType === ORDER_TYPE.BUY ? (
          <BuyOrder
            duelId={duelId}
            duelType={duelType}
            asset={asset}
            winCondition={winCondition}
            endsIn={endsIn}
            triggerPrice={triggerPrice}
            token={token}
            yesPrice={yesPrice}
            noPrice={noPrice}
          />
        ) : (
          <SellOrder duelId={duelId} asset={asset} yesPrice={yesPrice} noPrice={noPrice} />
        )}
      </CardContent>
    </Card>
  );
};

export default PlaceOrder;
