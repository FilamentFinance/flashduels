'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { NAVBAR } from '@/constants/content/navbar';
import { DUAL } from '@/constants/dual';
import { Button } from '@/shadcn/components/ui/button';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { DualDuration, DualType } from '@/types/dual';
import { FC, useState } from 'react';
import CoinDualForm from './coin-dual';
import Dual from './dual';
import FlashDualForm from './flash-dual';
import FormFooter from './form-footer';

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
      // setIsLoading(true);
      // TODO: Implement form submission logic
      console.log('Form submitted:', formData);
      toast({
        title: 'Success',
        description: 'Dual created successfully',
      });
      handleBack(); // Return to dual selection
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to create dual',
        variant: 'destructive',
      });
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Dialog
      title={
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">Create a Dual</h2>
        </div>
      }
      trigger={
        <Button className="font-semibold bg-gradient-pink text-black">
          {NAVBAR.CREATE_DUAL.BUTTON_TEXT}
        </Button>
      }
      className="max-w-sm"
    >
      {!showForm ? (
        <div className="space-y-6">
          <h3 className="text-lg text-zinc-400">Choose a market</h3>
          <div className="grid grid-cols-2 gap-4">
            <Dual
              logo={{
                active: '/logo/coin-dual-active.svg',
                inactive: '/logo/coin-dual.svg',
              }}
              title="Coin Duel"
              description="Create Battles Based on Token Prices, resolved by Oracle price from Pyth"
              isActive={selectedDual === DUAL.COIN}
              onClick={() => handleDualSelect(DUAL.COIN)}
            />
            <Dual
              logo={{
                active: '/logo/flash-dual-battle-active.svg',
                inactive: '/logo/flash-dual-battle.svg',
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
          {selectedDual === DUAL.COIN && (
            <CoinDualForm onBack={handleBack} onSubmit={handleSubmit} />
          )}
          {selectedDual === DUAL.FLASH && <FlashDualForm onSubmit={handleSubmit} />}
          {selectedDual && <FormFooter onBack={handleBack} />}
        </div>
      )}
    </Dialog>
  );
};

export default CreateDual;
