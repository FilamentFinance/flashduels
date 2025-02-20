import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { LOGOS } from '@/constants/app/logos';
import { OPTIONS_TYPE } from '@/constants/dual';
import { useBalance } from '@/hooks/useBalance';
import useJoinDuel from '@/hooks/useJoinDuel';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { useTotalBets } from '@/hooks/useTotalBets';
import { useWebSocketPrices } from '@/hooks/useWebSocketPrices';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { cn } from '@/shadcn/lib/utils';
import { RootState } from '@/store';
import { OptionsType } from '@/types/dual';
import Image from 'next/image';
import { FC, useCallback, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { formatUnits, parseUnits } from 'viem/utils';
import { useAccount } from 'wagmi';
import PositionSelector from './position-selector';
// import { PositionSelector } from './PositionSelector';

interface BuyOrderProps {
  duelId: string;
  duelType: string;
  asset: string | undefined;
  winCondition: number | undefined;
  endsIn: number;
  triggerPrice?: string;
  token: string | undefined;
}

const BuyOrder: FC<BuyOrderProps> = ({
  duelId,
  duelType,
  asset,
  winCondition,
  endsIn,
  triggerPrice,
  token,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<OptionsType | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();
  const { balance } = useBalance(address);
  const { joinDuel } = useJoinDuel();
  const { toast } = useToast();
  const { prices } = useSelector((state: RootState) => state.price, shallowEqual);
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

  const handlePositionSelect = useCallback((position: OptionsType) => {
    setSelectedPosition(position);
    setError('');
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

      const maxAmount = Number(formatUnits((balance ?? 0) as bigint, 6));
      if (Number(cleanValue) > maxAmount) {
        setError(`Cannot bet more than your available balance: ${maxAmount}`);
        return;
      }

      setAmount(cleanValue);
    },
    [balance],
  );

  const calculateShares = useCallback(() => {
    if (!selectedPosition || !amount) return 0;
    const price = selectedPosition === OPTIONS_TYPE.YES ? yesPrice : noPrice;
    return Number(amount) / Number(price || 0.15);
  }, [amount, selectedPosition, yesPrice, noPrice]);

  const handleMaxClick = useCallback(() => {
    const maxAmount = formatUnits((balance ?? 0) as bigint, 6);
    validateAndSetAmount(maxAmount);
  }, [balance, validateAndSetAmount]);

  const handleJoinDuel = useCallback(async () => {
    if (!selectedPosition || !amount) {
      setError('Please select a position and enter an amount');
      return;
    }

    setIsLoading(true);
    try {
      const parsedAmount = parseUnits(amount, 6);
      const { success } = await joinDuel(parsedAmount);

      if (success) {
        await baseApiClient.post(`${SERVER_CONFIG.API_URL}/bets/create`, {
          twitterUsername: '',
          bet: selectedPosition,
          address: address?.toLowerCase(),
          betAmount: Number(amount),
          optionIndex: selectedPosition === OPTIONS_TYPE.YES ? 0 : 1,
          duelId,
          duelType,
          asset,
          winCondition,
        });

        // Reset form after successful submission
        setAmount('');
        setSelectedPosition(null);
        setError('');

        toast({
          title: 'Success!',
          description: `Successfully placed ${selectedPosition} bet for ${amount} USDC`,
        });
      }
    } catch (error) {
      console.error('Error placing buy order:', error);
      setError('Failed to place buy order');
      toast({
        title: 'Error',
        description: 'Failed to place buy order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPosition, amount, duelId, duelType, asset, winCondition, address, joinDuel, toast]);

  const isFormValid = useMemo(
    () => selectedPosition && amount && Number(amount) > 0 && !error,
    [selectedPosition, amount, error],
  );
  return (
    <Card className="bg-transparent border-none space-y-6">
      <CardContent className="p-0 space-y-6">
        {/* YES/NO Buttons */}
        <PositionSelector
          selectedPosition={selectedPosition}
          onPositionSelect={handlePositionSelect}
          disabled={isLoading}
        />

        {/* Price per share */}
        <div className="flex justify-between px-1">
          <Label className="text-zinc-500 text-sm">${yesPrice?.toFixed(4)}/share</Label>
          <Label className="text-zinc-500 text-sm">${noPrice?.toFixed(4)}/share</Label>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="amount" className="text-zinc-400">
              Amount
            </Label>
            <div className="text-zinc-400 text-sm">
              Available: {formatUnits((balance ?? 0) as bigint, 6)}{' '}
              <button
                onClick={handleMaxClick}
                disabled={isLoading}
                className="text-[#F19ED2] hover:text-[#F19ED2]/90 disabled:opacity-50"
              >
                Max
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white">$</div>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => validateAndSetAmount(e.target.value)}
              disabled={isLoading}
              className={cn(
                'w-full bg-zinc-800 rounded-xl py-6 pl-8 pr-20 text-xl text-white border-none focus:border-none focus:ring-0 focus-visible:ring-0',
                error && 'border-red-500 ring-1 ring-red-500',
                isLoading && 'opacity-50',
              )}
              placeholder="0"
              autoComplete="off"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Image
                src={LOGOS.USDC.icon}
                alt="USDC"
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
              <span className="text-white text-lg font-medium">USDC</span>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm">{calculateShares().toFixed(0)} Shares</span>
          </div>
        </div>

        {/* Order Summary */}
        <Card className="bg-neutral-900 border border-white/10">
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {calculateShares().toFixed(2)} {selectedPosition}
              </div>
              <div className="text-sm text-gray-400">
                $
                {selectedPosition === OPTIONS_TYPE.YES ? yesPrice?.toFixed(2) : noPrice?.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handleJoinDuel}
          disabled={!isFormValid || isLoading}
          className={cn(
            'w-full py-6 text-lg font-medium',
            isFormValid && !isLoading
              ? 'bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white'
              : 'bg-zinc-800 text-zinc-400',
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Joining Duel...</span>
            </div>
          ) : (
            'Join Duel'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BuyOrder;
