'use client';
import { usePriceCalculation } from '@/hooks/usePriceCalculation'; // Import the new hook
import { useTotalBets } from '@/hooks/useTotalBets';
import { useWebSocketPrices } from '@/hooks/useWebSocketPrices';
import { cn } from '@/shadcn/lib/utils';
import { RootState } from '@/store';
import { Position } from '@/types/dual';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import BuyOrder from './buy-order';
import SellOrder from './sell-order';

interface PlaceOrderProps {
  duelId: string;
  availableBalance?: number;
  onPlaceOrder: (
    position: Position,
    amount: string,
    orderType: 'buy' | 'sell',
    price?: string,
  ) => void;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  selectedPosition: Position | null;
  setSelectedPosition: Dispatch<SetStateAction<Position | null>>;
  asset: string | undefined;
  triggerPrice?: string;
  endsIn: number;
  winCondition?: number;
  token: string | undefined;
  duelType: string;
}

const PlaceOrder: FC<PlaceOrderProps> = ({
  duelId,
  availableBalance = 1000,
  onPlaceOrder,
  amount,
  setAmount,
  selectedPosition,
  setSelectedPosition,
  asset,
  endsIn,
  triggerPrice,
  winCondition,
  token,
  duelType,
}) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const { prices } = useSelector((state: RootState) => state.price, shallowEqual);

  const handleSellOrder = (position: Position, amount: string, price: string) => {
    onPlaceOrder(position, amount, 'sell', price);
  };

  const { totalBetYes, totalBetNo } = useTotalBets(duelId);
  const { yesPrice, noPrice, ws } = useWebSocketPrices(asset);

  usePriceCalculation({
    ws,
    asset,
    endsIn,
    priceFormatted: prices[token as keyof typeof prices],
    triggerPrice: Number(triggerPrice || 0),
    winCondition,
    totalBetYes,
    totalBetNo,
  });

  return (
    <div className="bg-zinc-900 rounded-xl w-full max-w-md p-6 border border-zinc-800">
      {/* Buy/Sell Tabs */}
      <div className="flex items-center border-b border-zinc-800 mb-6">
        <button
          onClick={() => setOrderType('buy')}
          className={cn(
            'pb-2 px-4 relative font-medium text-lg',
            orderType === 'buy' ? 'text-[#F19ED2]' : 'text-zinc-500',
          )}
        >
          Buy
          {orderType === 'buy' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F19ED2]" />
          )}
        </button>
        <button
          onClick={() => setOrderType('sell')}
          className={cn(
            'pb-2 px-4 relative font-medium text-lg',
            orderType === 'sell' ? 'text-[#F19ED2]' : 'text-zinc-500',
          )}
        >
          Sell
          {orderType === 'sell' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F19ED2]" />
          )}
        </button>
      </div>

      {/* Order Form */}
      {orderType === 'buy' ? (
        <BuyOrder
          amount={amount}
          setAmount={setAmount}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          yesPrice={yesPrice}
          noPrice={noPrice}
          duelId={duelId}
          duelType={duelType}
          asset={asset}
          winCondition={winCondition}
        />
      ) : (
        <SellOrder
          availableBalance={availableBalance}
          onPlaceOrder={handleSellOrder}
          amount={amount}
          setAmount={setAmount}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />
      )}
    </div>
  );
};

export default PlaceOrder;
