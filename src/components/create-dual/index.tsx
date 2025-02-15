'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { DUAL_LOGOS } from '@/constants/app/logos';
import { CREATE_DUAL } from '@/constants/content/create-dual';
import { NAVBAR } from '@/constants/content/navbar';
import { DUAL } from '@/constants/dual';
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import { DualType } from '@/types/dual';
import { FC, useState } from 'react';
import CreateCoinDuel from './coin-dual';
import Dual from './dual';
import FlashDualForm from './flash-dual';

const CreateDual: FC = () => {
  const [selectedDual, setSelectedDual] = useState<DualType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDualSelect = (type: DualType) => {
    setSelectedDual(type);
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  return (
    <Dialog
      title={
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">{CREATE_DUAL.DIALOG.TITLE}</h2>
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
          <h3 className="text-lg text-zinc-400">{CREATE_DUAL.MARKET_SECTION.HEADING}</h3>
          <div className="grid grid-cols-2 gap-4">
            <Dual
              logo={{
                active: DUAL_LOGOS.COIN.active,
                inactive: DUAL_LOGOS.COIN.inactive,
              }}
              title={CREATE_DUAL.MARKET_SECTION.COIN_DUAL.TITLE}
              description={CREATE_DUAL.MARKET_SECTION.COIN_DUAL.DESCRIPTION}
              isActive={selectedDual === DUAL.COIN}
              onClick={() => handleDualSelect(DUAL.COIN)}
            />
            <Dual
              logo={{
                active: DUAL_LOGOS.FLASH.active,
                inactive: DUAL_LOGOS.FLASH.inactive,
              }}
              title={CREATE_DUAL.MARKET_SECTION.FLASH_DUAL.TITLE}
              description={CREATE_DUAL.MARKET_SECTION.FLASH_DUAL.DESCRIPTION}
              isActive={selectedDual === DUAL.FLASH}
              onClick={() => handleDualSelect(DUAL.FLASH)}
            />
          </div>
          <Button
            className="w-full font-semibold bg-gradient-pink text-black disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={!selectedDual}
          >
            {CREATE_DUAL.BUTTONS.NEXT}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedDual === DUAL.COIN && <CreateCoinDuel onBack={handleBack} />}
          {selectedDual === DUAL.FLASH && <FlashDualForm onBack={handleBack} />}
        </div>
      )}
    </Dialog>
  );
};

export default CreateDual;
