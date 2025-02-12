import { Dispatch, FC, SetStateAction, useState } from 'react';
import PositionSelector from '@/components/position-selector';
import { Position } from '@/types/dual';

interface PlaceOrderProps {
  availableBalance?: number;
  onPlaceOrder: (position: Position, amount: string) => void;
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
  const [price, setPrice] = useState('0.15');

  const calculateShares = () => {
    return Number(amount) / Number(price);
  };

  const calculatePotentialReturn = () => {
    const shares = calculateShares();
    return {
      amount: shares * 2.5, // This is a placeholder calculation
      percentage: 40,
    };
  };

  const handlePlaceOrder = () => {
    if (!selectedPosition) return;
    onPlaceOrder(selectedPosition, amount);
  };

  return (
    <div className="bg-[#141217] p-6 rounded-xl">
      {/* Buy/Sell Tabs */}
      <div className="flex gap-4 mb-6 text-sm">
        <button className="text-white border-b-2 border-white pb-2">Buy</button>
        <button className="text-zinc-400 pb-2">Sell</button>
      </div>

      {/* Yes/No Buttons */}
      <PositionSelector
        selectedPosition={selectedPosition}
        onPositionSelect={setSelectedPosition}
        className="mb-6"
      />

      {/* Amount Input */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-400">Quantity</span>
            <span className="text-sm text-zinc-400">
              Available: {availableBalance} <span className="text-xs">Max</span>
            </span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#90EE90]"
          />
        </div>

        {/* Price Input */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-400">Price</span>
          </div>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#90EE90]"
          />
        </div>

        {/* Your Bets */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-400">Your Bets</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>400 Yes</span>
            <span>$0.06</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Order</span>
          <span>
            {calculateShares()} × {selectedPosition || ''}
          </span>
        </div>

        {/* Potential Return */}
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Potential Profit</span>
          <span className="text-[#90EE90]">
            ${calculatePotentialReturn().amount.toFixed(2)} ({calculatePotentialReturn().percentage}
            %)
          </span>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedPosition}
          className={`w-full py-3 rounded-xl font-medium transition-colors ${
            selectedPosition
              ? 'bg-[#FF69B4] hover:bg-opacity-90 text-white'
              : 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
