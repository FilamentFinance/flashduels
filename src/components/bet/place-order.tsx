import { Position } from '@/types/dual';
import { cn } from '@/shadcn/lib/utils';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import BuyOrder from './buy-order';
import SellOrder from './sell-order';

interface PlaceOrderProps {
  availableBalance?: number;
  onPlaceOrder: (position: Position, amount: string, orderType: 'buy' | 'sell', price?: string) => void;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  selectedPosition: Position | null;
  setSelectedPosition: Dispatch<SetStateAction<Position | null>>;
}

const PlaceOrder: FC<PlaceOrderProps> = ({
  availableBalance = 1000,
  onPlaceOrder,
  amount,
  setAmount,
  selectedPosition,
  setSelectedPosition,
}) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');

  const handleBuyOrder = (position: Position, amount: string) => {
    onPlaceOrder(position, amount, 'buy');
  };

  const handleSellOrder = (position: Position, amount: string, price: string) => {
    onPlaceOrder(position, amount, 'sell', price);
  };

  return (
    <div className="bg-zinc-900 rounded-xl w-full max-w-md p-6 border border-zinc-800">
      {/* Buy/Sell Tabs */}
      <div className="flex items-center border-b border-zinc-800 mb-6">
        <button
          onClick={() => setOrderType('buy')}
          className={cn(
            'pb-2 px-4 relative font-medium text-lg',
            orderType === 'buy' ? 'text-[#F19ED2]' : 'text-zinc-500'
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
            orderType === 'sell' ? 'text-[#F19ED2]' : 'text-zinc-500'
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
          availableBalance={availableBalance}
          onPlaceOrder={handleBuyOrder}
          amount={amount}
          setAmount={setAmount}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
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
