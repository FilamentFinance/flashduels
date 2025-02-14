'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { DUAL_LOGOS } from '@/constants/app/logos';
import { NAVBAR } from '@/constants/content/navbar';
import { DUAL } from '@/constants/dual';
import { Button } from '@/shadcn/components/ui/button';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { cn } from '@/shadcn/lib/utils';
import { DualDuration, DualType } from '@/types/dual';
import { FC, useState } from 'react';
import CoinDualForm from './coin-dual';
import Dual from './dual';
import FlashDualForm from './flash-dual';

const CreateDual: FC = () => {
  const [selectedDual, setSelectedDual] = useState<DualType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleDualSelect = (type: DualType) => {
    setSelectedDual(type);
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleSubmit = async (
    formData:
      | {
          category: string;
          duelText: string;
          betIcon: File | null;
          duration: DualDuration;
        }
      | {
          token: string;
          triggerPrice: string;
          winCondition: 'above' | 'below';
          duration: DualDuration;
        },
  ) => {
    try {
      console.log('Form submitted:', formData);
      toast({
        title: 'Success',
        description: 'Dual created successfully',
      });
      handleBack();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to create dual',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog
      title={
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">Create a Dual</h2>
          <div className="flex w-full gap-2 px-6">
            <div
              className={cn(
                'h-1 rounded-full flex-1 transition-all',
                !showForm ? 'bg-[#F19ED2]' : 'bg-zinc-700',
              )}
            />
            <div
              className={cn(
                'h-1 rounded-full flex-1 transition-all',
                showForm ? 'bg-[#F19ED2]' : 'bg-zinc-700',
              )}
            />
          </div>
        </div>
      }
      trigger={
        <Button className="font-semibold bg-gradient-pink text-black">
          {NAVBAR.CREATE_DUAL.BUTTON_TEXT}
        </Button>
      }
      className="max-w-md"
    >
      {!showForm ? (
        <div className="space-y-2">
          <h3 className="text-lg text-zinc-400">Choose a market</h3>
          <div className="grid grid-cols-2 gap-4">
            <Dual
              logo={{
                active: DUAL_LOGOS.COIN.active,
                inactive: DUAL_LOGOS.COIN.inactive,
              }}
              title="Coin Duel"
              description="Create Battles Based on Token Prices, resolved by Oracle price from Pyth"
              isActive={selectedDual === DUAL.COIN}
              onClick={() => handleDualSelect(DUAL.COIN)}
            />
            <Dual
              logo={{
                active: DUAL_LOGOS.FLASH.active,
                inactive: DUAL_LOGOS.FLASH.inactive,
              }}
              title="Flash Duel"
              description="Create Duel Based on Sports, News, pop Culture, bets are settled by Flash Duels"
              isActive={selectedDual === DUAL.FLASH}
              onClick={() => handleDualSelect(DUAL.FLASH)}
            />
          </div>
          <Button
            className="w-full font-semibold bg-gradient-pink text-black disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={!selectedDual}
          >
            Next
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedDual === DUAL.COIN && <CoinDualForm onBack={handleBack} />}
          {selectedDual === DUAL.FLASH && <FlashDualForm  onBack={handleBack} />}
        </div>
      )}
    </Dialog>
  );
};

export default CreateDual;
