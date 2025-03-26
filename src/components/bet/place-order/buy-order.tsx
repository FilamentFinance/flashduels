import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { LOGOS } from '@/constants/app/logos';
import { OPTIONS_TYPE } from '@/constants/duel';
import { useBalance } from '@/hooks/useBalance';
import useJoinDuel from '@/hooks/useJoinDuel';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { cn } from '@/shadcn/lib/utils';
import { RootState } from '@/store';
import { OptionsType } from '@/types/duel';
import { handleTransactionError, useTokenApproval } from '@/utils/token';
import Image from 'next/image';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatUnits, parseUnits } from 'viem/utils';
import { useAccount } from 'wagmi';
import { NewDuelItem } from '@/types/duel';

import PositionSelector from './position-selector';
import { calculateTimeLeft } from '@/utils/time';

interface BuyOrderProps {
  duelId: string;
  duelType: string;
  asset: string | undefined;
  winCondition: number | undefined;
  endsIn: number;
  triggerPrice?: string;
  token: string | undefined;
  yesPrice: number | undefined;
  noPrice: number | undefined;
}

const BuyOrder: FC<BuyOrderProps> = ({
  duelId,
  duelType,
  asset,
  winCondition,
  // endsIn,
  // triggerPrice,
  // token,
  yesPrice,
  noPrice,
}) => {
  const selectedPosition = useSelector((state: RootState) => state.bet.selectedPosition);
  const [localPosition, setLocalPosition] = useState<OptionsType | null>(() => {
    if (selectedPosition === 'YES') return OPTIONS_TYPE.YES;
    if (selectedPosition === 'NO') return OPTIONS_TYPE.NO;
    return null;
  });

  // Update local position when Redux state changes
  useEffect(() => {
    if (selectedPosition === 'YES') setLocalPosition(OPTIONS_TYPE.YES);
    else if (selectedPosition === 'NO') setLocalPosition(OPTIONS_TYPE.NO);
  }, [selectedPosition]);

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isJoiningDuel, setIsJoiningDuel] = useState(false);
  const [isMarketBuying, setIsMarketBuying] = useState(false);
  const [marketBuyEnabled, setMarketBuyEnabled] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [duel, setDuel] = useState<NewDuelItem | null>(null);

  // Combined loading state for disabling both buttons
  const isLoading = isJoiningDuel || isMarketBuying;

  const { address } = useAccount();
  const { balance } = useBalance(address);
  const { joinDuel } = useJoinDuel();
  const { toast } = useToast();
  // const { prices } = useSelector((state: RootState) => state.price, shallowEqual);
  // const { totalBetYes, totalBetNo } = useTotalBets(duelId);

  const handlePositionSelect = useCallback((position: OptionsType) => {
    setLocalPosition(position);
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
    if (!localPosition || !amount) return 0;
    const price = localPosition === OPTIONS_TYPE.YES ? yesPrice : noPrice;
    return Number(amount) / Number(price || 0.15);
  }, [amount, localPosition, yesPrice, noPrice]);

  const handleMaxClick = useCallback(() => {
    const maxAmount = formatUnits((balance ?? 0) as bigint, 6);
    validateAndSetAmount(maxAmount);
  }, [balance, validateAndSetAmount]);

  const handleJoinDuel = useCallback(async () => {
    if (!localPosition || !amount) {
      setError('Please select a position and enter an amount');
      return;
    }

    setIsJoiningDuel(true);
    try {
      const parsedAmount = parseUnits(amount, 6);
      const { success } = await joinDuel(parsedAmount);

      if (success) {
        await baseApiClient.post(`${SERVER_CONFIG.API_URL}/user/bets/create`, {
          twitterUsername: '',
          bet: localPosition,
          address: address?.toLowerCase(),
          betAmount: Number(amount),
          optionIndex: localPosition === OPTIONS_TYPE.YES ? 0 : 1,
          duelId,
          duelType,
          asset,
          winCondition,
        });

        // Reset form after successful submission
        setAmount('');
        setLocalPosition(null);
        setError('');

        toast({
          title: 'Success!',
          description: `Successfully placed ${localPosition} bet for ${amount} USDC`,
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
      setIsJoiningDuel(false);
    }
  }, [localPosition, amount, duelId, duelType, asset, winCondition, address, joinDuel, toast]);

  const isFormValid = useMemo(
    () => localPosition && amount && Number(amount) > 0 && !error,
    [localPosition, amount, error],
  );

  // Import the token approval hook
  // const { checkAllowance, requestAllowance } = useTokenApproval(address);
  const { requestAllowance } = useTokenApproval(address);

  // Updated market buy function with error handling
  const handleMarketBuy = useCallback(async () => {
    if (!localPosition || !amount) {
      setError('Please select a position and enter an amount');
      return;
    }

    setIsMarketBuying(true);
    try {
      const optionIndex = localPosition === OPTIONS_TYPE.YES ? 0 : 1;

      // Check token allowance first
      // const hasAllowance = await checkAllowance();
      // console.log({ localPosition, optionIndex, amount, error, hasAllowance });
      const hasAllowance = false;

      // if (!hasAllowance) {
      if (!hasAllowance) {
        // Request token approval if needed
        await requestAllowance(BigInt(amount));
        toast({
          title: 'Approval Successful',
          description: 'Token approval completed. You can now place your order.',
        });
      } else {
        // Place the market buy order
        const response = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/user/betOption/buy`, {
          duelId,
          betAmount: amount,
          index: optionIndex,
          userAddress: address?.toLowerCase(),
        });

        // Show success message
        toast({
          title: 'Success',
          description: response.data.message || 'Market buy order placed successfully',
        });

        // Reset form after successful submission
        setAmount('');
        setLocalPosition(null);
        setError('');
      }
    } catch (error) {
      console.error('Error in market buy:', error);

      // Use the error handler to get appropriate error message
      const errorDetails = handleTransactionError(error);

      setError(`Failed to place market buy order: ${errorDetails.message}`);
      toast({
        title: 'Error',
        description: errorDetails.message,
        variant: 'destructive',
      });
    } finally {
      setIsMarketBuying(false);
    }
  // }, [localPosition, amount, duelId, checkAllowance, requestAllowance, toast, setError]);
  }, [localPosition, amount, duelId, requestAllowance, toast, setError]);

  useEffect(() => {
    const fetchDuel = async () => {
      try {
        // console.log('Fetching duel data...');
        const response = await baseApiClient.get(
          `${SERVER_CONFIG.API_URL}/user/duels/get-duel-by-id/${duelId}`,
          {
            params: {
              userAddress: address?.toLowerCase(), // Add the address from useAccount() to the request params
            },
          },
        );
        // console.log('Duel data fetched:', response.data);
        setDuel(response.data);
        // if (response.data.endsIn < 0.5) {
        //   console.log("in")
        //   if (response.data.status === 3 || 4) {
        //     return;
        //   }
        //   setMarketBuyEnabled(true);
        //   console.log("s",marketBuyEnabled);
        //   return;
        // }
      } catch (error) {
        console.error('Error fetching duel:', error);
      }
    };

    fetchDuel();
  }, [address, duelId]);

  useEffect(() => {
    if (duel) {
      const updateTime = () => {
        if (duel.endsIn < 0.5) {
          setMarketBuyEnabled(true);
          return;
        }
        const timeleftForEnd = calculateTimeLeft(duel.status === -1 ? duel.createdAt : duel.startAt || 0, duel.endsIn);
        // console.log(timeleftForEnd);

        // Extract hours, minutes, and seconds using regex
        const timeMatch = timeleftForEnd.match(/(?:(\d+)h\s)?(?:(\d+)m\s)?(\d+)s/);
        // console.log(timeMatch);
        if (timeMatch) {
          const hours = timeMatch[1] ? parseInt(timeMatch[1], 10) : 0;
          const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
          const seconds = parseInt(timeMatch[3], 10);

          // Convert the extracted time to milliseconds
          const timeInMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
          const isShortDuel = duel.endsIn === 0.5;
          const shortDuelThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
          const longDuelThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds

          if ((isShortDuel && timeInMilliseconds <= shortDuelThreshold) ||
              (!isShortDuel && timeInMilliseconds <= longDuelThreshold)) {
            setMarketBuyEnabled(true);
          } else {
            setMarketBuyEnabled(false);
            const timeLeft = timeInMilliseconds - (isShortDuel ? shortDuelThreshold : longDuelThreshold);
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            setCountdown(isShortDuel ? `${minutes}m ${seconds}s` : `${hours}h ${minutes}m ${seconds}s`);
          }
        }
      };

      updateTime();
      const timer = setInterval(updateTime, 1000);

      return () => clearInterval(timer);
    }
  }, [duel]);

  return (
    <Card className="bg-transparent border-none space-y-6">
      <CardContent className="p-0 space-y-6">
        {/* YES/NO Buttons */}
        <PositionSelector
          selectedPosition={localPosition}
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
                {calculateShares().toFixed(2)} {localPosition}
              </div>
              <div className="text-sm text-gray-400">
                ${localPosition === OPTIONS_TYPE.YES ? yesPrice?.toFixed(2) : noPrice?.toFixed(2)}
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
          {isJoiningDuel ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Joining Duel...</span>
            </div>
          ) : (
            'Join Duel'
          )}
        </Button>
        <Button
          onClick={handleMarketBuy}
          disabled={!isFormValid || isLoading || !marketBuyEnabled}
          className={cn(
            'w-full py-6 text-lg font-medium',
            isFormValid && !isLoading && marketBuyEnabled
              ? 'bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white'
              : 'bg-zinc-800 text-zinc-400',
          )}
        >
          {isMarketBuying ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Processing Order...</span>
            </div>
          ) : (
            marketBuyEnabled ? 'Market Buy' : `Market Buy ${countdown ? 'in' : ''} ${countdown}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BuyOrder;
