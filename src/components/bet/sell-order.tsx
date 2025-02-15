import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { cn } from '@/shadcn/lib/utils';
import { Position } from '@/types/dual';
import { Dispatch, FC, SetStateAction, useState } from 'react';

interface SellOrderProps {
  availableBalance?: number;
  onPlaceOrder: (position: Position, amount: string, price: string) => void;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  selectedPosition: Position | null;
  setSelectedPosition: Dispatch<SetStateAction<Position | null>>;
}

const SellOrder: FC<SellOrderProps> = ({
  availableBalance = 1000,
  onPlaceOrder,
  amount,
  setAmount,
  selectedPosition,
  setSelectedPosition,
}) => {
  const [price, setPrice] = useState('0.15');

  const handlePositionSelect = (position: Position) => {
    setSelectedPosition(position);
  };

  const handlePlaceOrder = () => {
    if (!selectedPosition) return;
    onPlaceOrder(selectedPosition, amount, price);
  };

  return (
    <div>
      {/* YES/NO Buttons */}
      <div className="flex gap-2 mb-1">
        <button
          onClick={() => handlePositionSelect('YES')}
          className={cn(
            'flex-1 py-4 rounded-xl text-center font-medium text-lg transition-colors',
            selectedPosition === 'YES' ? 'bg-[#95DE64] text-black' : 'bg-zinc-800 text-zinc-500',
          )}
        >
          YES
        </button>
        <button
          onClick={() => handlePositionSelect('NO')}
          className={cn(
            'flex-1 py-4 rounded-xl text-center font-medium text-lg transition-colors',
            selectedPosition === 'NO' ? 'bg-[#E84749] text-white' : 'bg-zinc-800 text-zinc-500',
          )}
        >
          NO
        </button>
      </div>

      {/* Price per share */}
      <div className="flex justify-between mb-6 px-1">
        <span className="text-zinc-500 text-sm">$/share</span>
        <span className="text-zinc-500 text-sm">$/share</span>
      </div>

      {/* Quantity Input */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-zinc-400">Quantity</span>
          <span className="text-zinc-400">
            Available: {availableBalance} <span className="text-[#F19ED2] cursor-pointer">Max</span>
          </span>
        </div>
        <div className="relative">
          <Input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-800 rounded-xl py-6 px-4 text-xl text-white border-none focus:border-none focus:ring-0 focus-visible:ring-0"
            placeholder="0"
          />
        </div>
      </div>

      {/* Price Input */}
      <div className="mb-4">
        <span className="text-zinc-400 block mb-2">Price</span>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white">$</div>
          <Input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-zinc-800 rounded-xl py-6 pl-8 pr-4 text-xl text-white border-none focus:border-none focus:ring-0 focus-visible:ring-0"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Your Bets */}
      <div className="mb-4">
        <span className="text-zinc-400 block mb-2">Your Bets</span>
        <div className="flex justify-between p-4 bg-zinc-800 rounded-xl">
          <span className="text-white">400 Yes</span>
          <span className="text-white">$0.06</span>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-zinc-400">Order</span>
          <span className="text-white">{amount} → 0 YES</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Potential Profit</span>
          <span className="text-[#95DE64]">$2500(40%)</span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handlePlaceOrder}
        disabled={!selectedPosition}
        className={cn(
          'w-full py-6 rounded-xl font-medium transition-colors text-lg',
          selectedPosition
            ? 'bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white'
            : 'bg-zinc-800 text-zinc-400 cursor-not-allowed',
        )}
      >
        Sell Bet
      </Button>
    </div>
  );
};

export default SellOrder;
