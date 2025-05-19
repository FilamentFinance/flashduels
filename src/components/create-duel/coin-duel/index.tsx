'use client';

import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { TRANSACTION_STATUS } from '@/constants/app';
import {
  // DUEL_DURATION,
  DUEL_TYPE,
  DURATIONS,
  OPTIONS,
  WIN_CONDITIONS,
  COIN_DUEL_DURATION,
} from '@/constants/duel';
import useCreateCoinDuel from '@/hooks/useCreateCoinDuel';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { cn } from '@/shadcn/lib/utils';
import { RootState } from '@/store';
import { selectedCryptoAsset } from '@/store/slices/priceSlice';
import { DuelDuration, WinCondition } from '@/types/duel';
import { mapDurationToNumber } from '@/utils/general/create-duels';
import { getTransactionStatusMessage } from '@/utils/transaction';
import { FC, useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import DuelInfo from '../duel-info';
import { CREDITS } from '@/abi/CREDITS';
import { formatUnits, Hex } from 'viem';
// import { base, baseSepolia, sei, seiTestnet } from 'viem/chains';
import { Loader2 } from 'lucide-react';

interface CoinDuelFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export interface CreateCoinDuelData {
  token: string;
  triggerPrice: string;
  winCondition: WinCondition;
  duration: DuelDuration;
}

const CreateCoinDuel: FC<CoinDuelFormProps> = ({ onBack, onComplete }) => {
  const [selectedDuration, setSelectedDuration] = useState<DuelDuration>(
    COIN_DUEL_DURATION.THREE_HOURS,
  );
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const { price } = useSelector((state: RootState) => state.price);
  const [formData, setFormData] = useState<CreateCoinDuelData | null>(null);
  const { cryptoAsset, selectedCryptoAsset: selectedAsset } = useSelector(
    (state: RootState) => state.price,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { createCoinDuel, status, error, isApprovalMining, isDuelMining } = useCreateCoinDuel();
  const { toast } = useToast();
  const isTransactionInProgress =
    status === TRANSACTION_STATUS.APPROVAL_PENDING ||
    status === TRANSACTION_STATUS.APPROVAL_MINING ||
    status === TRANSACTION_STATUS.CREATING_DUEL ||
    status === TRANSACTION_STATUS.DUEL_MINING ||
    isApprovalMining ||
    isDuelMining;
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState<string>('0');
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const symbol = 'CRD';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<{ token?: string; triggerPrice?: string }>({});

  // Add useEffect to check user's CRD balance
  useEffect(() => {
    const checkCreditsBalance = async () => {
      if (!address || !publicClient) return;

      try {
        const balance = await publicClient.readContract({
          abi: CREDITS,
          address: SERVER_CONFIG.getContractAddresses(chainId).CREDIT_CONTRACT as Hex,
          functionName: 'balanceOf',
          args: [address.toLowerCase()],
        });

        setCreditsBalance(balance?.toString() || '0');
      } catch (error) {
        console.error('Error fetching credits balance:', error);
      }
    };

    checkCreditsBalance();
  }, [address, publicClient]);

  const handleCreateDuel = async () => {
    // Validation for required fields
    if (!selectedToken) {
      setFormError({ token: 'Please select a token to create a duel.' });
      return;
    }
    if (
      !formData?.triggerPrice ||
      isNaN(Number(formData.triggerPrice)) ||
      Number(formData.triggerPrice) <= 0
    ) {
      setFormError({ triggerPrice: 'Please enter a valid trigger price.' });
      return;
    }
    setFormError({}); // Clear errors if all good
    if (!formData || isTransactionInProgress || isButtonClicked) return;
    setIsButtonClicked(true);
    setIsSubmitting(true);

    try {
      // Check if user has enough CRD tokens (at least 5)
      const balanceInEther = parseFloat(formatUnits(BigInt(creditsBalance), 18));
      if (balanceInEther < 5) {
        toast({
          title: `Insufficient ${symbol} Balance`,
          description: `You need at least 5 ${symbol} to create a duel. Your current balance is ${balanceInEther.toFixed(2)} ${symbol}.`,
          variant: 'destructive',
        });
        setIsButtonClicked(false);
        setIsSubmitting(false);
        return;
      }

      // Continue with existing code
      const durationNumber = mapDurationToNumber(selectedDuration, 'coin');
      const triggerPrice = Number(formData.triggerPrice) * 10 ** 8;
      const minWager = Number(formData.triggerPrice) * 10 ** 6;

      const triggerType = 0;
      const winCondition = formData.winCondition === WIN_CONDITIONS.ABOVE ? 0 : 1;
      const duelData = {
        symbol: selectedAsset?.symbol || '',
        options: OPTIONS,
        minWager,
        triggerPrice,
        triggerType,
        winCondition,
        durationNumber,
      };
      console.log('creating coin duel', duelData);
      const result = await createCoinDuel(duelData);

      if (result.success) {
        const duelData = {
          duelId: result.duelId,
          duelType: DUEL_TYPE.COIN_DUEL,
          token: selectedToken,
          createdAt: result.createdAt,
          category: 'Crypto',
          betIcon: '',
          triggerPrice: formData.triggerPrice,
          minimumWager: '',
          winCondition: winCondition,
          endsIn: DURATIONS[durationNumber],
        };
        try {
          await baseApiClient.post(`${SERVER_CONFIG.API_URL}/user/duels/createCoinDuel`, {
            ...duelData,
            twitterUsername: '',
            address: address?.toLowerCase(),
          });
          toast({
            title: 'Success',
            description: 'Duel created and approved successfully',
          });
          onComplete();
        } catch (apiError) {
          console.error('API Error:', apiError);
          // toast({
          //   title: 'API Error',
          //   description: 'Failed to approve duel. Please try again.',
          //   variant: 'destructive',
          // });
          onComplete();
        }
      }
    } catch (error) {
      console.error('Error creating duel:', error);
      toast({
        title: 'Error',
        description: 'Failed to create duel. Please try again.',
        variant: 'destructive',
      });
      onComplete();
    } finally {
      setIsButtonClicked(false);
      setIsSubmitting(false);
    }
  };

  const handleTokenSelect = (value: string) => {
    setSelectedToken(value);
    // Clear token error if a token is selected
    setFormError((prev) => ({ ...prev, token: value ? undefined : prev.token }));
    const selectedAsset = cryptoAsset.find((asset) => {
      const symbol = asset.symbol.split('/')[0].replace('Crypto.', '');
      return symbol === value;
    });
    if (selectedAsset) {
      dispatch(selectedCryptoAsset(selectedAsset));
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token" className="text-zinc-400">
            Token*
          </Label>
          <Select
            name="token"
            required
            onValueChange={handleTokenSelect}
            onOpenChange={(open) => {
              if (!open) {
                setSearchQuery('');
              }
            }}
            disabled={isTransactionInProgress}
          >
            <SelectTrigger className="bg-zinc-900 border-zinc-700">
              <SelectValue placeholder="Select token">
                {selectedToken && (
                  <div className="flex items-center space-x-2 py-1">
                    <div className="w-5 h-5 inline-flex items-center justify-center">
                      <img
                        src={`/crypto-icons/light/crypto-${selectedToken.toLowerCase()}-usd.inline.svg`}
                        alt={selectedToken}
                        className="w-5 h-5"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="inline-block leading-none">{selectedToken}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#1C1C1C] border-zinc-700">
              <div
                className="p-2 sticky top-0 bg-[#1C1C1C] z-10 border-b border-zinc-700"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-400"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto py-1">
                {cryptoAsset
                  .filter((asset) => {
                    const symbol = asset.symbol.split('/')[0].replace('Crypto.', '');
                    return symbol.toLowerCase().includes(searchQuery.toLowerCase());
                  })
                  .map((asset) => {
                    const displaySymbol = asset.symbol.split('/')[0].replace('Crypto.', '');
                    return (
                      <SelectItem
                        key={asset.symbol}
                        value={displaySymbol}
                        className="text-white focus:bg-zinc-800 focus:text-white"
                      >
                        <div className="flex items-center space-x-2 py-1">
                          <div className="w-5 h-5 inline-flex items-center justify-center">
                            <img
                              src={`/crypto-icons/light/crypto-${displaySymbol.toLowerCase()}-usd.inline.svg`}
                              alt={displaySymbol}
                              className="w-5 h-5"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                          <span className="inline-block leading-none">{displaySymbol}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
              </div>
            </SelectContent>
          </Select>
          {formError.token && <p className="text-red-500 text-xs mt-1">{formError.token}</p>}
        </div>

        <div className="space-y-2 flex justify-between items-center">
          <Label className="text-zinc-400">Mark Price</Label>
          {selectedToken ? (
            <div className="flex items-center gap-2">
              {/* {selectedAsset && <img src={selectedAsset.image} alt={selectedToken} width={20} height={20} />} */}
              ${price || '--'}
            </div>
          ) : (
            '--'
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="triggerPrice" className="text-zinc-400 shrink-0">
            Trigger Price*
          </Label>
          <Input
            id="triggerPrice"
            name="triggerPrice"
            type="number"
            placeholder="Enter Trigger Price"
            className="bg-[#1C1C1C] text-sm border-none h-8 w-64 rounded-lg placeholder:text-zinc-500"
            required
            autoComplete="off"
            disabled={isTransactionInProgress}
            onChange={(e) => {
              e.preventDefault();
              const value = e.target.value;
              if (value === '' || !isNaN(Number(value))) {
                setFormData((prevData) => ({
                  ...prevData,
                  triggerPrice: value,
                  token: prevData?.token || '',
                  winCondition: prevData?.winCondition || WIN_CONDITIONS.ABOVE,
                  duration: prevData?.duration || COIN_DUEL_DURATION.THREE_HOURS,
                }));
                // Clear triggerPrice error if valid
                if (value && !isNaN(Number(value)) && Number(value) > 0) {
                  setFormError((prev) => ({ ...prev, triggerPrice: undefined }));
                }
              }
            }}
          />
        </div>
        {formError.triggerPrice && (
          <p className="text-red-500 text-xs mt-1">{formError.triggerPrice}</p>
        )}

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="winCondition" className="text-zinc-400">
            Win Condition
          </Label>
          <Select
            name="winCondition"
            defaultValue={WIN_CONDITIONS.ABOVE}
            disabled={isTransactionInProgress}
            onValueChange={(value) => {
              setFormData((prevData) => ({
                ...prevData,
                winCondition: value as WinCondition,
                token: prevData?.token || '',
                triggerPrice: prevData?.triggerPrice || '',
                duration: prevData?.duration || COIN_DUEL_DURATION.THREE_HOURS,
              }));
            }}
          >
            <SelectTrigger className="bg-[#1C1C1C] border-none h-10 w-64 text-base rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1C1C1C] border-zinc-700">
              {Object.values(WIN_CONDITIONS).map((condition) => (
                <SelectItem
                  key={condition}
                  value={condition}
                  className="text-white focus:bg-zinc-800 focus:text-white capitalize"
                >
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label className="text-zinc-400">Ends in</Label>
          <div className="w-32">
            <Select
              value={selectedDuration}
              onValueChange={(value) => setSelectedDuration(value as DuelDuration)}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-700 ">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-zinc-700">
                {Object.values(COIN_DUEL_DURATION).map((duration) => (
                  <SelectItem
                    key={duration}
                    value={duration}
                    className="text-white focus:bg-zinc-800 focus:text-white"
                  >
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {formData && (
        <p className="text-xs text-zinc-400 flex items-center gap-2">
          {selectedAsset && (
            <img src={selectedAsset.image} alt={selectedToken} width={16} height={16} />
          )}
          <span>
            <strong>LONG</strong> wins if mark price is{' '}
            {formData.winCondition === WIN_CONDITIONS.ABOVE ? (
              <strong>ABOVE</strong>
            ) : (
              <strong>BELOW</strong>
            )}{' '}
            ${formData.triggerPrice} after <strong>{selectedDuration}</strong>
          </span>
        </p>
      )}

      <DuelInfo />

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          disabled={isTransactionInProgress}
          className={cn(
            'flex-1 border-zinc-700',
            isTransactionInProgress ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-900',
          )}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleCreateDuel();
          }}
          disabled={isTransactionInProgress || isButtonClicked}
          className={cn(
            'flex-1 bg-gradient-pink text-black relative overflow-hidden group',
            isTransactionInProgress || isButtonClicked ? 'opacity-50 cursor-not-allowed' : '',
          )}
        >
          <span
            className={cn('relative z-10 flex items-center gap-2', isSubmitting && 'opacity-0')}
          >
            {isTransactionInProgress ? getTransactionStatusMessage(status, error) : 'Create Duel'}
          </span>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Coin Duel...</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F19ED2] to-[#F19ED2]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>
    </div>
  );
};

export default CreateCoinDuel;
