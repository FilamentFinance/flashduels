import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Position } from '@/types/dual';
import { cn } from '@/shadcn/lib/utils';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';

interface PlaceOrderProps {
  availableBalance?: number;
  onPlaceOrder: (position: Position, amount: string, orderType: 'buy' | 'sell') => void;
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
  // const [price, setPrice] = useState('0.15');
  const [showMarketOrders, setShowMarketOrders] = useState(false);

  const calculateShares = () => {
    return Number(amount) / Number('0.15');
  };

  const handlePlaceOrder = () => {
    if (!selectedPosition) return;
    onPlaceOrder(selectedPosition, amount, orderType);
  };

  return (
    <div className="bg-[#141217] rounded-xl w-full max-w-md p-6">
      {/* Buy/Sell Tabs */}
      <Tabs
        value={orderType}
        onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-transparent">
          <TabsTrigger
            value="buy"
            className={cn(
              'data-[state=active]:text-[#F19ED2] data-[state=active]:border-b-2 data-[state=active]:border-[#F19ED2] text-zinc-400',
            )}
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className={cn(
              'data-[state=active]:text-[#F19ED2] data-[state=active]:border-b-2 data-[state=active]:border-[#F19ED2] text-zinc-400',
            )}
          >
            Sell
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* YES/NO Buttons with Prices */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setSelectedPosition('YES')}
            variant="ghost"
            className={cn(
              'h-12 rounded-xl font-medium text-lg transition-all',
              selectedPosition === 'YES'
                ? 'bg-[#95DE64] text-black hover:bg-[#95DE64]/90'
                : 'bg-[#1E2C1E] text-zinc-400 hover:bg-[#1E2C1E]/90',
            )}
          >
            YES
          </Button>
          <span className="text-white text-center">$1</span>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setSelectedPosition('NO')}
            variant="ghost"
            className={cn(
              'h-12 rounded-xl font-medium text-lg transition-all',
              selectedPosition === 'NO'
                ? 'bg-[#E84749] text-white hover:bg-[#E84749]/90'
                : 'bg-[#2C1E1E] text-zinc-400 hover:bg-[#2C1E1E]/90',
            )}
          >
            NO
          </Button>
          <span className="text-white text-center">$0.3</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-zinc-400">Amount</span>
          <span className="text-zinc-400">
            Available: {availableBalance} <span className="text-[#F19ED2] cursor-pointer">Max</span>
          </span>
        </div>
        <div className="relative">
          <Input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#1B1B1B] rounded-xl p-4 text-white border border-zinc-800 focus:border-[#F19ED2]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <img src="/usdc-icon.svg" alt="USDC" className="w-6 h-6" />
            <span className="text-white">USDC</span>
          </div>
          <span className="text-zinc-500 text-sm mt-1 block">
            {calculateShares().toFixed(0)} Shares
          </span>
        </div>
      </div>

      {/* Market Orders Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          checked={showMarketOrders}
          onCheckedChange={(checked) => setShowMarketOrders(checked as boolean)}
          className="border-zinc-600"
        />
        <span className="text-zinc-400">Match Market Orders</span>
      </div>

      {/* Order Details */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-zinc-400">Avg. Price</span>
          <span className="text-white">$0.56</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Order</span>
          <span className="text-white">
            {calculateShares().toFixed(0)} {selectedPosition}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Potential Return</span>
          <span className="text-[#95DE64]">$2500(40%)</span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={handlePlaceOrder}
        disabled={!selectedPosition}
        className={cn(
          'w-full py-6 rounded-xl font-medium transition-colors',
          selectedPosition
            ? 'bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white'
            : 'bg-zinc-800 text-zinc-400 cursor-not-allowed',
        )}
      >
        Place Order
      </Button>
    </div>
  );
};

export default PlaceOrder;
