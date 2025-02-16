import { SERVER_CONFIG } from '@/config/server-config';
import { POSITION_TYPE } from '@/constants/dual';
import useSellOrder from '@/hooks/useSellOrder';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { cn } from '@/shadcn/lib/utils';
import { PositionType } from '@/types/dual';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { baseApiClient } from '@/config/api-client';
import PositionSelector from './position-selector';
import { TRANSACTION_STATUS } from '@/constants/app';
// import { TRANSACTION_STATUS } from '@/constants/transaction-status';

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
  const { toast } = useToast();

  const { sellOrder, status, isApprovalMining, isSellMining } = useSellOrder(
    duelId,
    selectedBet?.index ?? 0,
    amount,
    price,
  );

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
      const result = await sellOrder();
      console.log('Sell order result:', result);
      if (!result.success) {
        throw new Error(result.error || 'Failed to place sell order');
      }

      // Update backend
      await baseApiClient.post(`${SERVER_CONFIG.API_URL}/betOption/sell`, {
        duelId,
        address,
        position: selectedPosition,
        amount,
        price,
        betOptionId,
        // amount: result.amount,
        sellId: result.sellId,
      });

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
      const response = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/bets/getByUser`, {
        duelId,
        address,
      });
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
        <PositionSelector
          selectedPosition={selectedPosition}
          onPositionSelect={handlePositionSelect}
        />

        <div className="flex justify-between px-1">
          <Label className="text-zinc-500 text-sm">$/share</Label>
          <Label className="text-zinc-500 text-sm">$/share</Label>
        </div>

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
          {status === TRANSACTION_STATUS.CHECKING_ALLOWANCE && 'Checking Allowance...'}
          {status === TRANSACTION_STATUS.APPROVAL_NEEDED && 'Approval Needed...'}
          {status === TRANSACTION_STATUS.APPROVAL_MINING && 'Approving...'}
          {status === TRANSACTION_STATUS.APPROVAL_COMPLETE && 'Approved! Creating Order...'}
          {status === TRANSACTION_STATUS.CREATING_DUEL && 'Creating Order...'}
          {status === TRANSACTION_STATUS.DUEL_MINING && 'Confirming Order...'}
          {status === TRANSACTION_STATUS.DUEL_COMPLETE && 'Order Complete!'}
          {status === TRANSACTION_STATUS.FAILED && 'Failed - Try Again'}
          {status === TRANSACTION_STATUS.IDLE && 'Sell Bet'}
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
