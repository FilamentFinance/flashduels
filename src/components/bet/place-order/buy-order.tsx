import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
// import { LOGOS } from '@/constants/app/logos';
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
// import Image from 'next/image';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatUnits, parseUnits } from 'viem/utils';
import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { NewDuelItem } from '@/types/duel';
import { mapCategoryToEnumIndex } from '@/utils/general/create-duels';

import PositionSelector from './position-selector';
import { calculateTimeLeft } from '@/utils/time';
// import { base, baseSepolia, sei, seiTestnet } from 'viem/chains';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
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
    if (selectedPosition === 'LONG') return OPTIONS_TYPE.LONG;
    if (selectedPosition === 'SHORT') return OPTIONS_TYPE.SHORT;
    return null;
  });

  // Update local position when Redux state changes
  useEffect(() => {
    if (selectedPosition === 'LONG') setLocalPosition(OPTIONS_TYPE.LONG);
    else if (selectedPosition === 'SHORT') setLocalPosition(OPTIONS_TYPE.SHORT);
  }, [selectedPosition]);

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isJoiningDuel, setIsJoiningDuel] = useState(false);
  const [isMarketBuying, setIsMarketBuying] = useState(false);
  const [marketBuyEnabled, setMarketBuyEnabled] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [duel, setDuel] = useState<NewDuelItem | null>(null);
  const [showMarketBuyMessage, setShowMarketBuyMessage] = useState(false);

  // Combined loading state for disabling both buttons
  const isLoading = isJoiningDuel || isMarketBuying;

  const { address } = useAccount();
  const { balance } = useBalance(address);
  const { joinDuel } = useJoinDuel();
  const { toast } = useToast();
  const chainId = useChainId();
  const symbol = 'CRD'; // Using CRD for all chains now
  // const { prices } = useSelector((state: RootState) => state.price, shallowEqual);
  // const { totalBetYes, totalBetNo } = useTotalBets(duelId);

  // Add contract read for total protocol liquidity
  const { data: totalProtocolLiquidity } = useReadContracts({
    contracts: [
      {
        abi: FlashDuelsViewFacetABI,
        address: SERVER_CONFIG.getContractAddresses(chainId).DIAMOND as `0x${string}`,
        functionName: 'getTotalProtocolLiquidity',
      },
    ],
  });

  // Add function to format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const validateAndSetAmount = useCallback(
    (value: string) => {
      setError('');

      if (value === '') {
        setAmount('');
        return;
      }

      // Handle trailing decimal point
      if (value.endsWith('.')) {
        setAmount(value);
        return;
      }

      // Don't clean the value during typing - allow user to enter any number of decimals
      if (isNaN(Number(value))) {
        setError('Please enter a valid number');
        return;
      }

      if (Number(value) < 0) {
        setError('Amount cannot be negative');
        return;
      }

      // const maxAmount = Number(formatUnits((balance ?? 0) as bigint, 6));
      const maxAmount = Number(formatUnits((balance ?? 0) as bigint, 18)); // CRD is 18 dec
      if (Number(value) > maxAmount) {
        setError(`Cannot bet more than your available balance: ${maxAmount}`);
        return;
      }

      // Check liquidity cap
      const currentLiquidity = duel?.totalBetAmount ? Number(duel.totalBetAmount) : 0;
      const newLiquidity = currentLiquidity + Number(value);
      if (newLiquidity > 20000) {
        setError(
          `Max liquidity cap for duel is $20,000. You can add up to ${formatCurrency(20000 - currentLiquidity)}`,
        );
        return;
      }
      // Check protocol-wide liquidity cap
      const currentProtocolLiquidity = totalProtocolLiquidity
        ? Number(formatUnits(totalProtocolLiquidity[0].result as bigint, 18))
        : 0;
      const newProtocolLiquidity = currentProtocolLiquidity + Number(value);
      if (newProtocolLiquidity > 200000) {
        setError(
          `Max protocol liquidity cap is ${formatCurrency(200000)}. Current liquidity is ${formatCurrency(currentProtocolLiquidity)}. You can add up to ${formatCurrency(200000 - currentProtocolLiquidity)}`,
        );
        return;
      }

      // Only show minimum amount error if the value is complete (no decimal point at end)
      if (Number(value) > 0 && Number(value) < 5 && !value.endsWith('.')) {
        setError(`Minimum trade size is 5 ${symbol}`);
      }

      // Store the full value in state without trimming
      setAmount(value);
    },
    [balance, symbol, duel?.totalBetAmount, totalProtocolLiquidity],
  );

  const handlePositionSelect = useCallback(
    (position: OptionsType) => {
      setLocalPosition(position);
      // Validate current amount when switching positions
      if (amount) {
        if (amount.endsWith('.')) {
          setError('Please enter a valid amount');
        } else {
          const numAmount = Number(amount);
          if (isNaN(numAmount)) {
            setError('Please enter a valid number');
          } else if (numAmount < 0) {
            setError('Amount cannot be negative');
          } else if (numAmount > 0 && numAmount < 5) {
            setError(`Minimum trade size is 5 ${symbol}`);
          } else {
            setError('');
          }
        }
      } else {
        setError('');
      }
    },
    [amount, symbol],
  );

  const handleBlur = useCallback(() => {
    if (amount.endsWith('.')) {
      setError('Please enter a valid amount');
    }
  }, [amount]);

  const calculateShares = useCallback(() => {
    if (!localPosition || !amount) return 0;
    const price = localPosition === OPTIONS_TYPE.LONG ? yesPrice : noPrice;
    return Number(amount) / Number(price || 0.15);
  }, [amount, localPosition, yesPrice, noPrice]);

  const handleMaxClick = useCallback(() => {
    // const maxAmount = formatUnits((balance ?? 0) as bigint, 6);
    const maxAmount = formatUnits((balance ?? 0) as bigint, 18); // CRD is 18 decimal

    // Trim to 4 decimal places without rounding
    const trimmedAmount = String(maxAmount).includes('.')
      ? maxAmount.toString().split('.')[0] + '.' + maxAmount.toString().split('.')[1].slice(0, 4)
      : maxAmount;

    validateAndSetAmount(trimmedAmount);
  }, [balance, validateAndSetAmount]);

  const handleJoinDuel = useCallback(async () => {
    if (!localPosition || !amount) {
      setError('Please select a position and enter an amount');
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 5) {
      setError(`Minimum trade size is 5 ${symbol}`);
      return;
    }

    setIsJoiningDuel(true);
    try {
      // Format the amount to avoid scientific notation and ensure it's a valid BigInt string
      const formattedAmount = numAmount.toLocaleString('fullwide', {
        useGrouping: false,
        maximumFractionDigits: 18,
      });

      const parsedAmount = parseUnits(formattedAmount, 18); // crd, todo @need to convert back to 6 for usdc

      const { success } = await joinDuel(parsedAmount);

      if (success) {
        await baseApiClient.post(`${SERVER_CONFIG.API_URL}/user/bets/create`, {
          twitterUsername: '',
          bet: localPosition,
          address: address?.toLowerCase(),
          betAmount: Number(amount),
          optionIndex: localPosition === OPTIONS_TYPE.LONG ? 0 : 1,
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
          description: `Successfully placed ${localPosition} bet for ${amount} ${symbol}`,
        });

        // Auto refresh page after successful transaction and API call
        setTimeout(() => {
          window.location.reload();
        }, 150); // 0.15 milliseconds (150ms)
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
  }, [
    localPosition,
    amount,
    duelId,
    duelType,
    asset,
    winCondition,
    address,
    joinDuel,
    toast,
    symbol,
  ]);

  const isFormValid = useMemo(() => {
    if (!localPosition || !amount) return false;
    const numAmount = Number(amount);
    return !isNaN(numAmount) && numAmount >= 5 && !error;
  }, [localPosition, amount, error]);

  // Import the token approval hook
  // const { checkAllowance, requestAllowance } = useTokenApproval(address);
  const { requestAllowance } = useTokenApproval();

  // Updated market buy function with error handling
  const handleMarketBuy = useCallback(async () => {
    if (!localPosition || !amount) {
      setError('Please select a position and enter an amount');
      return;
    }

    setIsMarketBuying(true);
    try {
      const optionIndex = localPosition === OPTIONS_TYPE.LONG ? 0 : 1;

      // Check token allowance first
      // const hasAllowance = await checkAllowance();
      // console.log({ localPosition, optionIndex, amount, error, hasAllowance });
      // const hasAllowance = false;

      // if (!hasAllowance) {
      // if (!hasAllowance) {
      // Request token approval if needed
      // await requestAllowance(parseUnits(amount, 6));
      await requestAllowance(parseUnits(amount, 18)); // CRD is 18 decimals
      toast({
        title: 'Approval Successful',
        description: 'Token approval completed. Placing your order.',
      });
      // } else {
      // Place the market buy order
      console.log('duelCategory: ', duel?.category);
      console.log('Market buy: ', {
        duelId,
        betAmount: amount,
        index: optionIndex,
        userAddress: address?.toLowerCase(),
        duelCategory: mapCategoryToEnumIndex(duel?.category || ''),
      });
      const response = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/user/betOption/buy`, {
        duelId,
        betAmount: amount,
        index: optionIndex,
        userAddress: address?.toLowerCase(),
        duelCategory: mapCategoryToEnumIndex(duel?.category || ''),
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
      // }
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
        const response = await baseApiClient.get(
          `${SERVER_CONFIG.API_URL}/user/duels/get-duel-by-id/${duelId}`,
          {
            params: {
              userAddress: address?.toLowerCase(),
            },
          },
        );
        setDuel(response.data);
      } catch (error) {
        console.error('Error fetching duel:', error);
      }
    };

    fetchDuel();
  }, [address, duelId]);

  useEffect(() => {
    if (duel) {
      const updateTime = () => {
        // If duel is in Bootstrapping stage, don't show timer
        if (duel.status === -1) {
          setMarketBuyEnabled(false);
          setCountdown('');
          return;
        }

        if (duel.endsIn < 0.5) {
          setMarketBuyEnabled(true);
          return;
        }
        const timeleftForEnd = calculateTimeLeft(
          duel.status === -1 ? duel.createdAt : duel.startAt || 0,
          duel.endsIn,
        );

        // Extract hours, minutes, and seconds using regex
        const timeMatch = timeleftForEnd.match(/(?:(\d+)h\s)?(?:(\d+)m\s)?(\d+)s/);
        if (timeMatch) {
          const hours = timeMatch[1] ? parseInt(timeMatch[1], 10) : 0;
          const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
          const seconds = parseInt(timeMatch[3], 10);

          // Convert the extracted time to milliseconds
          const timeInMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
          const isShortDuel = duel.endsIn === 0.5;
          const shortDuelThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
          const longDuelThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds

          if (
            (isShortDuel && timeInMilliseconds <= shortDuelThreshold) ||
            (!isShortDuel && timeInMilliseconds <= longDuelThreshold)
          ) {
            setMarketBuyEnabled(true);
          } else {
            setMarketBuyEnabled(false);
            const timeLeft =
              timeInMilliseconds - (isShortDuel ? shortDuelThreshold : longDuelThreshold);
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            setCountdown(
              isShortDuel ? `${minutes}m ${seconds}s` : `${hours}h ${minutes}m ${seconds}s`,
            );
          }
        }
      };

      updateTime();
      const timer = setInterval(updateTime, 1000);

      return () => clearInterval(timer);
    }
  }, [duel]);

  const isShortDurationDuel = useMemo(() => {
    return duel?.endsIn !== undefined && duel.endsIn < 0.5;
  }, [duel?.endsIn]);

  return (
    <Card className="bg-transparent border-none space-y-6">
      <CardContent className="p-0 space-y-6">
        {/* LONG/SHORT Buttons */}
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
              Available:{' '}
              {Number(formatUnits((balance ?? 0) as bigint, 18))
                .toString()
                .includes('.')
                ? Number(formatUnits((balance ?? 0) as bigint, 18))
                    .toString()
                    .split('.')[0] +
                  '.' +
                  (Number(formatUnits((balance ?? 0) as bigint, 18))
                    .toString()
                    .split('.')[1]
                    ?.slice(0, 4) || '0000')
                : Number(formatUnits((balance ?? 0) as bigint, 18)).toString()}{' '}
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
            {/* <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white">$</div> */}
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => validateAndSetAmount(e.target.value)}
              onBlur={handleBlur}
              disabled={isLoading}
              className={cn(
                // 'w-full bg-zinc-800 rounded-xl py-6 pl-8 pr-20 text-xl text-white border-none focus:border-none focus:ring-0 focus-visible:ring-0',
                'w-full bg-zinc-800 rounded-xl py-6 pl-3 pr-20 text-xl text-white border-none focus:border-none focus:ring-0 focus-visible:ring-0',
                error && 'border-red-500 ring-1 ring-red-500',
                isLoading && 'opacity-50',
              )}
              placeholder="0"
              autoComplete="off"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* <Image
                src={LOGOS.USDC.icon}
                alt="USDC"
                width={28}
                height={28}
                className="rounded-full object-cover"
              /> */}
              <span className="text-white text-lg font-medium">{symbol}</span>
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
                ${localPosition === OPTIONS_TYPE.LONG ? yesPrice?.toFixed(2) : noPrice?.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Win Condition Message for Crypto Duels */}
        {duelType === 'COIN_DUEL' && winCondition !== undefined && (
          <p className="text-xs text-zinc-400 flex items-center gap-2">
            {duel?.token && (
              <img
                src={
                  duelType === 'COIN_DUEL'
                    ? `/crypto-icons/light/crypto-${duel.token.toLowerCase()}-usd.inline.svg`
                    : duel.betIcon || '/empty-string.png'
                }
                alt={duel.token}
                width={32}
                height={32}
                className="mt-0.5"
                onError={(e) => {
                  console.error('Error loading image');
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span>
              <strong className="text-green-500">LONG</strong> wins if mark price is{' '}
              {winCondition === 0 ? <strong>ABOVE</strong> : <strong>BELOW</strong>} $
              {duel?.triggerPrice}, or <strong className="text-red-500">SHORT</strong> wins if{' '}
              {winCondition === 0 ? <strong>BELOW</strong> : <strong>ABOVE</strong>} after{' '}
              <strong>{duel?.endsIn} hours</strong>
            </span>
          </p>
        )}

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
        <div
          className="relative"
          onMouseEnter={() => isShortDurationDuel && setShowMarketBuyMessage(true)}
          onMouseLeave={() => setShowMarketBuyMessage(false)}
        >
          {/* Add informative message */}
          <div className="text-zinc-500 text-xs italic mb-2 px-1">
            (Note: <span className="font-semibold">Market Buy</span> will be available when the duel
            is in <span className="font-semibold">Live</span> stage. For{' '}
            <span className="font-semibold">30 min</span> duels, it opens{' '}
            <span className="font-semibold">10 mins</span> before the duel resolves. For duels
            longer than <span className="font-semibold">1 hour</span>, it opens{' '}
            <span className="font-semibold">30 mins</span> before the duel resolves.)
          </div>
          <Button
            onClick={handleMarketBuy}
            disabled={!isFormValid || isLoading || !marketBuyEnabled || isShortDurationDuel}
            className={cn(
              'w-full py-6 text-lg font-medium',
              isFormValid && !isLoading && marketBuyEnabled && !isShortDurationDuel
                ? 'bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white'
                : 'bg-zinc-800 text-zinc-400',
            )}
          >
            {isMarketBuying ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Processing Order...</span>
              </div>
            ) : duel?.status === -1 ? (
              'Market Buy'
            ) : marketBuyEnabled && !isShortDurationDuel ? (
              'Market Buy'
            ) : isShortDurationDuel ? (
              'Market Buy'
            ) : (
              `Market Buy ${countdown ? 'in' : ''} ${countdown}`
            )}
          </Button>

          {/* Hover Message Box */}
          {showMarketBuyMessage && isShortDurationDuel && (
            <div
              className="absolute top-full left-0 right-0 mt-2 p-4 
                         bg-zinc-900 border border-zinc-800 rounded-lg
                         text-center text-red-400 text-sm
                         shadow-lg z-50"
            >
              Market Buy is unavailable for 5 and 15 mins duration duels
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyOrder;
