import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { POSITION_COLORS, POSITION_TYPE } from '@/constants/dual';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { cn } from '@/shadcn/lib/utils';
import { PositionType } from '@/types/dual';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

interface SellOrderProps {
  duelId: string;
}

type OptionBetType = {
  id: string;
  quantity: string;
  amount: string;
  index: number;
  price: string;
  sellId: number;
  betOption?: { index: number };
};

const SellOrder: FC<SellOrderProps> = ({ duelId }) => {
  const [selectedPosition, setSelectedPosition] = useState<PositionType | null>(null);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('0');
  const [priceError, setPriceError] = useState('');
  const { address } = useAccount();
  const [betsData, setBetsData] = useState<OptionBetType[]>([]);
  const [betOptionId, setBetOptionId] = useState('');
  const [selectedBet, setSelectedBet] = useState<OptionBetType | null>(null);
  const [error, setError] = useState('');

  const handlePositionSelect = useCallback((position: PositionType) => {
    setSelectedPosition(position);
    setError('');
    setAmount('');
    setPrice('0');
    setSelectedBet(null);
  }, []);

  const validateAndSetAmount = useCallback(
    (value: string) => {
      setError('');

      if (value === '') {
        setAmount('');
        return;
      }

      const cleanValue = Number(value).toString();

      if (isNaN(Number(cleanValue))) {
        setError('Please enter a valid number');
        return;
      }

      if (Number(cleanValue) < 0) {
        setError('Amount cannot be negative');
        return;
      }

      if (selectedBet) {
        const maxAmount = Number(selectedBet.quantity);
        if (Number(cleanValue) > maxAmount) {
          setError(`Cannot sell more than your available amount: ${maxAmount}`);
          return;
        }
      }

      setAmount(cleanValue);
    },
    [selectedBet],
  );

  const validateAndSetPrice = useCallback((value: string) => {
    setPriceError('');

    if (value === '') {
      setPrice('');
      return;
    }

    const cleanValue = Number(value).toString();

    if (isNaN(Number(cleanValue))) {
      setPriceError('Please enter a valid number');
      return;
    }

    if (Number(cleanValue) <= 0) {
      setPriceError('Price must be greater than 0');
      return;
    }

    if (Number(cleanValue) > 1) {
      setPriceError('Price cannot be greater than 1');
      return;
    }

    setPrice(cleanValue);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedPosition || !selectedBet) {
      setError('Please select a position and bet');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!price || Number(price) <= 0 || Number(price) > 1) {
      setPriceError('Please enter a valid price between 0 and 1');
      return;
    }

    const inputAmount = Number(amount);
    const maxAmount = Number(selectedBet.quantity);

    if (inputAmount > maxAmount) {
      setError(`Cannot sell more than your available amount: ${maxAmount}`);
      return;
    }

    try {
      const response = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/bets/sell`, {
        duelId,
        address,
        position: selectedPosition,
        amount,
        price,
        betOptionId,
      });
      console.log('Sell order placed:', response.data);

      setAmount('');
      setPrice('0');
      setSelectedPosition(null);
      setSelectedBet(null);
      setError('');
      setPriceError('');
      setBetOptionId('');

      getBets();
    } catch (error) {
      console.error('Error placing sell order:', error);
      setError('Failed to place sell order');
    }
  }, [selectedPosition, selectedBet, amount, price, betOptionId, duelId, address]);

  const getBets = useCallback(async () => {
    try {
      const response = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/bets/getByUser`, {
        duelId,
        address,
      });
      setBetsData(response.data.bets[0].options);
    } catch (error) {
      console.error('Error fetching bet:', error);
    }
  }, [duelId, address]);

  const handleBetSelect = useCallback((bet: OptionBetType) => {
    const position = bet.index === 0 ? POSITION_TYPE.YES : POSITION_TYPE.NO;
    setSelectedPosition(position);
    setAmount(bet.quantity);
    setPrice(bet.price);
    setBetOptionId(bet.id);
    setSelectedBet(bet);
    setError('');
    setPriceError('');
  }, []);

  const isFormValid = useMemo(
    () => selectedPosition && amount && price && !error && !priceError,
    [selectedPosition, amount, price, error, priceError],
  );

  useEffect(() => {
    getBets();
  }, [getBets]);

  return (
    <Card className="bg-transparent border-none space-y-6">
      <CardContent className="p-0 space-y-6">
        {/* YES/NO Buttons */}
        <div className="flex gap-2">
          {Object.values(POSITION_TYPE).map((position) => (
            <Button
              key={position}
              onClick={() => handlePositionSelect(position)}
              variant="ghost"
              className={cn(
                'flex-1 py-6 text-lg font-medium transition-colors rounded-2xl border-0',
                selectedPosition === position
                  ? POSITION_COLORS[position].active
                  : POSITION_COLORS[position].inactive,
              )}
            >
              {position}
            </Button>
          ))}
        </div>

        {/* Price per share */}
        <div className="flex justify-between px-1">
          <Label className="text-zinc-500 text-sm">$/share</Label>
          <Label className="text-zinc-500 text-sm">$/share</Label>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-zinc-400">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="text"
              value={amount}
              onChange={(e) => validateAndSetAmount(e.target.value)}
              className={cn(
                'bg-zinc-800 rounded-xl py-6 px-4 text-xl text-white border-none focus:border-none focus:ring-0 focus-visible:ring-0',
                error && 'border-red-500 ring-1 ring-red-500',
              )}
              placeholder="0"
              autoComplete="off"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-zinc-400">
              Price
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white">$</div>
              <Input
                id="price"
                type="text"
                value={price}
                onChange={(e) => validateAndSetPrice(e.target.value)}
                className={cn(
                  'w-full bg-zinc-800 rounded-xl py-6 pl-8 pr-4 text-xl text-white border-none focus:border-none focus:ring-0 focus-visible:ring-0',
                  priceError && 'border-red-500 ring-1 ring-red-500',
                )}
                placeholder="0.00"
              />
            </div>
            {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
          </div>
        </div>

        {/* Your Bets */}
        <Card className="bg-transparent border-none">
          <CardHeader className="px-0 py-2">
            <CardTitle className="text-gray-400 text-base font-normal">Your Bets</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            {betsData.map((bet, index) => (
              <Button
                key={index}
                onClick={() => handleBetSelect(bet)}
                variant="outline"
                className={cn(
                  'w-full justify-between h-auto p-3 text-sm hover:bg-neutral-800 border border-neutral-700',
                  selectedBet?.id === bet.id
                    ? 'bg-neutral-800 border-[#F19ED2] text-white'
                    : 'bg-neutral-900 text-gray-400',
                )}
              >
                <span>
                  {Number(bet.quantity).toFixed(4)}{' '}
                  {bet.index === 0 ? POSITION_TYPE.YES : POSITION_TYPE.NO}
                </span>
                <span>${bet.price}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={!isFormValid}
          className={cn(
            'w-full py-6 text-lg font-medium',
            isFormValid
              ? 'bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white'
              : 'bg-zinc-800 text-zinc-400',
          )}
        >
          Sell Bet
        </Button>
      </CardContent>
    </Card>
  );
};

export default SellOrder;
