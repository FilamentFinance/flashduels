'use client';

import { baseApiClient } from '@/config/api-client';
import { TRANSACTION_STATUS } from '@/constants/app';
import { COIN_DUAL_ASSETS, DUAL_DURATION } from '@/constants/dual';
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
import { DualDuration } from '@/types/dual';
import { getTransactionStatusMessage, mapDurationToNumber } from '@/utils/transaction';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import DuelInfo from '../dual-info';

interface CoinDualFormProps {
  onBack: () => void;
}

export interface CoinDualFormData {
  token: string;
  triggerPrice: string;
  winCondition: 'above' | 'below';
  duration: DualDuration;
}

const CoinDualForm: FC<CoinDualFormProps> = ({ onBack }) => {
  const [selectedDuration, setSelectedDuration] = useState<DualDuration>(DUAL_DURATION.THREE_HOURS);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const { prices } = useSelector((state: RootState) => state.price);
  const [formData, setFormData] = useState<CoinDualFormData | null>(null);
  const { address } = useAccount();
  const { createCoinDuel, status, error, txHash, isApprovalMining, isDuelMining, isDuelSuccess } =
    useCreateCoinDuel();
  const { toast } = useToast();
  const isTransactionInProgress =
    status === TRANSACTION_STATUS.APPROVAL_PENDING ||
    status === TRANSACTION_STATUS.APPROVAL_MINING ||
    status === TRANSACTION_STATUS.CREATING_DUEL ||
    status === TRANSACTION_STATUS.DUEL_MINING ||
    isApprovalMining ||
    isDuelMining;

  const handleCreateDuel = async () => {
    if (!formData) return;
    const durationNumber = mapDurationToNumber(selectedDuration);

    const triggerPrice = Number(formData.triggerPrice) * 10 ** 8;
    const minWager = Number(formData.triggerPrice) * 10 ** 6;
    const options = ['YES', 'NO'];
    const triggerType = 0;
    const symbol = formData.token;
    const winCondition = formData.winCondition === 'above' ? 0 : 1;

    const dualData = {
      symbol,
      options,
      minWager,
      triggerPrice,
      triggerType,
      winCondition,
      durationNumber,
    };
    console.log({symbol})
    try {
      const result = await createCoinDuel(dualData);
      console.log({ result,selectedToken });
      
      // If the duel creation was successful, make the API call
      if (result.success) {
        const durations = [3, 6, 12];
        const assetImages = [
          {
            symbol: 'BTC',
            image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/BTC.svg',
          },
          {
            symbol: 'ETH',
            image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/ETH.svg',
          },
          {
            symbol: 'SOL',
            image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/SOL.svg',
          },
        ];

        const getAssetImage = (symbol: string) => {
          const asset = assetImages.find((item) => item.symbol === symbol);
          return asset ? asset.image : null;
        };

        const duelData = {
          type: 'COIN_DUEL',
          token: selectedToken,
          category: 'Crypto',
          betIcon: getAssetImage(selectedToken),
          triggerPrice: formData.triggerPrice,
          minimumWager: 0,
          winCondition: winCondition,
          endsIn: durations[durationNumber],
        };

        try {
          await baseApiClient.post('http://localhost:3004/flashduels/duels/approve', {
            ...duelData,
            twitterUsername: '',
            address: address?.toLowerCase(),
          });
          toast({
            title: 'Success',
            description: 'Duel created and approved successfully',
          });
        } catch (apiError) {
          console.error('API Error:', apiError);
          toast({
            title: 'API Error',
            description: 'Failed to approve duel. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error creating duel:', error);
      toast({
        title: 'Error',
        description: 'Failed to create duel. Please try again.',
        variant: 'destructive',
      });
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
            onValueChange={setSelectedToken}
            disabled={isTransactionInProgress}
          >
            <SelectTrigger className="bg-zinc-900 border-zinc-700">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-[#1C1C1C] border-zinc-700">
              {Object.values(COIN_DUAL_ASSETS).map((asset) => (
                <SelectItem
                  key={asset.symbol}
                  value={asset.symbol}
                  className="text-white focus:bg-zinc-800 focus:text-white"
                >
                  {asset.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex justify-between items-center">
          <Label className="text-zinc-400">Mark Price</Label>
          {selectedToken ? `$${prices[selectedToken as keyof typeof prices]}` : '--'}
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
              const value = e.target.value;
              if (value === '' || !isNaN(Number(value))) {
                setFormData((prevData) => ({
                  ...prevData,
                  triggerPrice: value,
                  token: prevData?.token || '',
                  winCondition: prevData?.winCondition || 'above',
                  duration: prevData?.duration || DUAL_DURATION.THREE_HOURS,
                }));
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="winCondition" className="text-zinc-400">
            Win Condition
          </Label>
          <Select name="winCondition" defaultValue="above" disabled={isTransactionInProgress}>
            <SelectTrigger className="bg-[#1C1C1C] border-none h-10 w-64 text-base rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1C1C1C] border-zinc-700">
              <SelectItem value="above" className="text-white focus:bg-zinc-800 focus:text-white">
                ABOVE
              </SelectItem>
              <SelectItem value="below" className="text-white focus:bg-zinc-800 focus:text-white">
                BELOW
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label className="text-zinc-400">Ends in</Label>
          <div className="inline-flex bg-[#1C1C1C] rounded-lg w-64 p-1 gap-1">
            {Object.values(DUAL_DURATION).map((duration) => (
              <Button
                key={duration}
                type="button"
                onClick={() => setSelectedDuration(duration)}
                variant="ghost"
                disabled={isTransactionInProgress}
                className={cn(
                  'flex-1 h-8 rounded-md text-sm font-medium transition-colors',
                  selectedDuration === duration
                    ? 'bg-[#F19ED2] text-black hover:bg-[#F19ED2]/90'
                    : 'text-white hover:bg-zinc-800',
                )}
              >
                {duration}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {formData && (
        <p className="text-xs text-zinc-400">
          {formData.winCondition === 'above' ? 'Yes' : 'No'} wins if mark price is{' '}
          {formData.winCondition === 'above' ? 'above' : 'below'} $
          {prices[formData.token as keyof typeof prices]} after {formData.duration}
        </p>
      )}

      <DuelInfo />

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
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
          onClick={handleCreateDuel}
          disabled={isTransactionInProgress}
          className={cn(
            'flex-1 bg-gradient-pink text-black',
            isTransactionInProgress ? 'opacity-50 cursor-not-allowed' : '',
          )}
        >
          {isTransactionInProgress ? getTransactionStatusMessage(status, error) : 'Create Duel'}
        </Button>
      </div>
    </div>
  );
};

export default CoinDualForm;
