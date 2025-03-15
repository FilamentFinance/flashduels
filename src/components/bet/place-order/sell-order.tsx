import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { TRANSACTION_STATUS } from '@/constants/app';
import { OPTIONS_TYPE } from '@/constants/duel';
import useSellOrder from '@/hooks/useSellOrder';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { cn } from '@/shadcn/lib/utils';
import { OptionsType } from '@/types/duel';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import PositionSelector from './position-selector';

interface SellOrderProps {
  duelId: string;
  asset: string | undefined;
  yesPrice: number | undefined;
  noPrice: number | undefined;
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

const SellOrder: FC<SellOrderProps> = ({ duelId, yesPrice, noPrice }) => {
  const [selectedPosition, setSelectedPosition] = useState<OptionsType | null>(null);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('0');
  const [priceError, setPriceError] = useState('');
  const { address } = useAccount();
  const [betsData, setBetsData] = useState<OptionBetType[]>([]);
  const [betOptionId, setBetOptionId] = useState('');
  const [selectedBet, setSelectedBet] = useState<OptionBetType | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { sellOrder, status, isApprovalMining, isSellMining } = useSellOrder(
    duelId,
    selectedBet?.index ?? 0,
    amount,
    price,
  );

  const handlePositionSelect = useCallback(
    (position: OptionsType) => {
      setSelectedPosition(position);
      setError('');
      setAmount('');
      setPrice('0');
      setSelectedBet(null);

      // Auto-select the first bet that matches the position
      const matchingBets = betsData.filter(
        (bet) =>
          (position === OPTIONS_TYPE.YES && bet.index === 0) ||
          (position === OPTIONS_TYPE.NO && bet.index === 1),
      );

      if (matchingBets.length > 0) {
        handleBetSelect(matchingBets[0]);
      }
    },
    [betsData],
  );

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

  const setMaxAmount = useCallback(() => {
    if (selectedBet) {
      setAmount(selectedBet.quantity);
      setError('');
    }
  }, [selectedBet]);

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

    // if (Number(cleanValue) > 1) {
    //   setPriceError('Price cannot be greater than 1');
    //   return;
    // }

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

    // if (!price || Number(price) <= 0 || Number(price) > 1) {
    //   setPriceError('Please enter a valid price between 0 and 1');
    //   return;
    // }

    if (!price || Number(price) <= 0) {
      setPriceError('Please enter a valid price');
      return;
    }

    const inputAmount = Number(amount);
    const maxAmount = Number(selectedBet.quantity);

    if (inputAmount > maxAmount) {
      setError(`Cannot sell more than your available amount: ${maxAmount}`);
      return;
    }

    try {
      const result = await sellOrder();
      console.log('Sell order result:', result);
      if (!result.success) {
        throw new Error(result.error || 'Failed to place sell order');
      }
      console.log({
        duelId,
        address,
        position: selectedPosition,
        amount,
        price,
        betOptionId,
        // amount: result.amount,
        sellId: result.sellId,
      });
      // Update backend
      await baseApiClient.post(
        `${SERVER_CONFIG.API_URL}/user/betOption/sell`,
        {
          betOptionId,
          quantity: amount,
          price: price,
          duelId,
          amount: result?.amount,
          sellId: Number(result?.sellId),
          userAddress: address?.toLowerCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`Bearer_${address?.toLowerCase()}`)}`,
          },
        },
      );

      setAmount('');
      setPrice('0');
      setSelectedPosition(null);
      setSelectedBet(null);
      setError('');
      setPriceError('');
      setBetOptionId('');

      getBets();

      toast({
        title: 'Success',
        description: 'Sell order placed successfully',
      });
    } catch (error) {
      console.error('Error placing sell order:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to place sell order',
        variant: 'destructive',
      });
    }
  }, [
    selectedPosition,
    selectedBet,
    amount,
    price,
    betOptionId,
    duelId,
    address,
    sellOrder,
    toast,
  ]);

  const getBets = useCallback(async () => {
    try {
      const response = await baseApiClient.post(
        `${SERVER_CONFIG.API_URL}/user/bets/getByUser`,
        {
          duelId,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(`Bearer_${address?.toLowerCase()}`)}`,
          },
        },
      );
      setBetsData(response.data.bets[0].options);
    } catch (error) {
      console.error('Error fetching bet:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your bets',
        variant: 'destructive',
      });
    }
  }, [duelId, address, toast]);

  const handleBetSelect = useCallback((bet: OptionBetType) => {
    const position = bet.index === 0 ? OPTIONS_TYPE.YES : OPTIONS_TYPE.NO;
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

  const yesBets = useMemo(() => betsData.filter((bet) => bet.index === 0), [betsData]);
  const noBets = useMemo(() => betsData.filter((bet) => bet.index === 1), [betsData]);

  useEffect(() => {
    getBets();
  }, [getBets]);

  return (
    <Card className="bg-transparent border-none space-y-6">
      <CardContent className="p-0 space-y-6">
        <PositionSelector
          selectedPosition={selectedPosition}
          onPositionSelect={handlePositionSelect}
        />

        <div className="flex justify-between px-1">
          <Label className="text-zinc-500 text-sm">${yesPrice?.toFixed(4)}/share</Label>
          <Label className="text-zinc-500 text-sm">${noPrice?.toFixed(4)}/share</Label>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="quantity" className="text-zinc-400">
                Quantity
              </Label>
              {selectedBet && (
                <Button
                  variant="link"
                  className="text-[#F19ED2] p-0 h-auto text-sm"
                  onClick={setMaxAmount}
                >
                  MAX
                </Button>
              )}
            </div>
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

        <Card className="bg-transparent border-none">
          <CardHeader className="px-0 py-2">
            <CardTitle className="text-gray-400 text-base font-normal">Your Bets</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {yesBets.length > 0 && (
              <div className="space-y-2">
                {yesBets.map((bet) => (
                  <Button
                    key={bet.id}
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
                      {Number(bet.quantity).toFixed(4)} {OPTIONS_TYPE.YES}
                    </span>
                    <span>${bet.price}</span>
                  </Button>
                ))}
              </div>
            )}

            {noBets.length > 0 && (
              <div className="space-y-2">
                {noBets.map((bet) => (
                  <Button
                    key={bet.id}
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
                      {Number(bet.quantity).toFixed(4)} {OPTIONS_TYPE.NO}
                    </span>
                    <span>${bet.price}</span>
                  </Button>
                ))}
              </div>
            )}

            {betsData.length === 0 && (
              <p className="text-center text-gray-400 py-2">You don&apos;t have any bets yet</p>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={handlePlaceOrder}
          disabled={!isFormValid || status !== TRANSACTION_STATUS.IDLE}
          className={cn(
            'w-full py-6 text-lg font-medium',
            isFormValid && status === TRANSACTION_STATUS.IDLE
              ? 'bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white'
              : 'bg-zinc-800 text-zinc-400',
          )}
        >
          Sell Bet
        </Button>

        {/* Loading Indicators */}
        {(isApprovalMining || isSellMining) && (
          <div className="text-center text-sm text-gray-400">
            {isApprovalMining && (
              <p>Approving token transfer... Please wait for the transaction to be confirmed.</p>
            )}
            {isSellMining && (
              <p>Creating sell order... Please wait for the transaction to be confirmed.</p>
            )}
          </div>
        )}

        {/* Error Display */}
        {status === TRANSACTION_STATUS.FAILED && error && (
          <p className="text-center text-sm text-red-500 mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SellOrder;
