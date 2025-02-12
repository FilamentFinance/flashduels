'use client';

import { DUAL_DURATION } from '@/constants/dual';
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
import { DualDuration } from '@/types/dual';
import { FC } from 'react';

interface CoinDualFormProps {
  onBack: () => void;
  onSubmit: (data: CoinDualFormData) => void;
}

export interface CoinDualFormData {
  token: string;
  triggerPrice: string;
  winCondition: 'above' | 'below';
  duration: DualDuration;
}

const CoinDualForm: FC<CoinDualFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      token: formData.get('token') as string,
      triggerPrice: formData.get('triggerPrice') as string,
      winCondition: formData.get('winCondition') as 'above' | 'below',
      duration: formData.get('duration') as DualDuration,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token" className="text-zinc-400">
            Token*
          </Label>
          <Select name="token" required>
            <SelectTrigger className="bg-zinc-900 border-zinc-700">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
              <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
              <SelectItem value="SOL">Solana (SOL)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-400">Mark Price</Label>
          <div className="text-2xl font-semibold">--</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="triggerPrice" className="text-zinc-400">
            Trigger Price*
          </Label>
          <Input
            id="triggerPrice"
            name="triggerPrice"
            type="number"
            placeholder="Enter Trigger Price"
            className="bg-zinc-900 border-zinc-700"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="winCondition" className="text-zinc-400">
            Win Condition
          </Label>
          <Select name="winCondition" defaultValue="above">
            <SelectTrigger className="bg-zinc-900 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Above</SelectItem>
              <SelectItem value="below">Below</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-400">Ends in</Label>
          <div className="inline-flex p-1 gap-1 bg-zinc-900 rounded-lg w-full">
            {Object.values(DUAL_DURATION).map((duration) => (
              <Button
                key={duration}
                type="button"
                name="duration"
                value={duration}
                variant="ghost"
                className={`flex-1 rounded-md ${duration === DUAL_DURATION.THREE_HOURS ? 'bg-pink-500 text-black hover:bg-pink-600' : 'hover:bg-zinc-800'}`}
              >
                {duration}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CoinDualForm;
