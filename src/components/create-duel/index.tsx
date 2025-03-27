/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { DUEL_LOGOS } from '@/constants/app/logos';
import { CREATE_DUEL } from '@/constants/content/create-duel';
import { NAVBAR } from '@/constants/content/navbar';
import { DUEL } from '@/constants/duel';
import { Button } from '@/shadcn/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';
import { cn } from '@/shadcn/lib/utils';
import { DuelType } from '@/types/duel';
import { FC, useState } from 'react';
import { useAccount } from 'wagmi';
import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { toast } from '@/shadcn/components/ui/use-toast';
import CreateCoinDuel from './coin-duel';
import Duel from './duel';
import FlashDuelForm from './flash-duel';
import { CreatorVerify } from '../creator/verify';

const CreateDuel: FC = () => {
  const { address } = useAccount();
  const [selectedDuel, setSelectedDuel] = useState<DuelType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [creatorModalOpen, setCreatorModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDuelSelect = (type: DuelType) => {
    if (type === DUEL.FLASH) {
      if (!isCreator) {
        setIsOpen(true); // Open the modal for verification
        return;
      }
      return; // Prevent selection of Flash Duel if not a creator
    }
    setSelectedDuel(type);
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowForm(false);
    setSelectedDuel(null);
  };

  const handleCreateDuelClick = () => {
    if (!address) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to create a duel',
        variant: 'destructive',
      });
      return;
    }

    // Open the modal - the content will be determined by isCreator state
    setIsOpen(true);
  };

  // When the user successfully verifies as a creator
  const handleVerificationSuccess = () => {
    setIsCreator(true);
    // Reset the duel creation flow
    setShowForm(false);
    setSelectedDuel(null);
  };

  return (
    <Dialog
      title={
        !isCreator && selectedDuel == DUEL.FLASH ? (
          'Creator Verification Required'
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">{CREATE_DUEL.DIALOG.TITLE}</h2>
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
        )
      }
      trigger={
        <Button
          className="font-semibold bg-gradient-pink text-black"
          onClick={handleCreateDuelClick}
        >
          {NAVBAR.CREATE_DUEL.BUTTON_TEXT}
        </Button>
      }
      className="max-w-md"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      {(!isCreator && selectedDuel == DUEL.FLASH) || creatorModalOpen ? (
        <div className="space-y-4">
          {/* requestStatus ? (
            requestStatus.status === "pending" ? (
              <p className="text-sm text-muted-foreground">
                Creating a duel requires creator verification. Your request is being reviewed and you will be able to start creating duels once it&apos;s accepted.
              </p>
            ) : requestStatus.status === "rejected" ? (
              <p className="text-sm text-muted-foreground">
                Your creator verification request was rejected. Please try again. You have {REJECTION_LIMIT - requestStatus.rejectionCount} attempts left.
              </p>
            ) : null
          ) : (
            <p className="text-sm text-muted-foreground">
              You need to be a verified creator to create duels on the platform.
            </p>
          ) */}
          <div className="flex justify-center">
            <CreatorVerify onClose={() => setCreatorModalOpen(false)} />
          </div>
        </div>
      ) : !showForm ? (
        <div className="space-y-2">
          <h3 className="text-lg text-zinc-400">{CREATE_DUEL.MARKET_SECTION.HEADING}</h3>
          <div className="grid grid-cols-2 gap-4">
            <Duel
              logo={{
                active: DUEL_LOGOS.COIN.active,
                inactive: DUEL_LOGOS.COIN.inactive,
              }}
              title={CREATE_DUEL.MARKET_SECTION.COIN_DUEL.TITLE}
              description={CREATE_DUEL.MARKET_SECTION.COIN_DUEL.DESCRIPTION}
              isActive={selectedDuel === DUEL.COIN}
              onClick={() => handleDuelSelect(DUEL.COIN)}
            />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <div className="opacity-50 relative cursor-not-allowed">
                    <div className="pointer-events-none">
                      <Duel
                        logo={{
                          active: DUEL_LOGOS.FLASH.inactive,
                          inactive: DUEL_LOGOS.FLASH.inactive,
                        }}
                        title={CREATE_DUEL.MARKET_SECTION.FLASH_DUEL.TITLE}
                        description={CREATE_DUEL.MARKET_SECTION.FLASH_DUEL.DESCRIPTION}
                        isActive={false}
                        onClick={() => {}}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="bg-gradient-to-r from-[#F19ED2] to-[#F19ED2]/90 border-none text-black px-3 py-1.5 font-semibold rounded-md"
                >
                  <div className="flex flex-col items-center">
                    <span>Coming Soon!</span>
                    <Button
                      className="bg-gradient-pink text-black"
                      onClick={() => {
                        // setIsOpen(false);
                        setCreatorModalOpen(true);
                      }}
                    >
                      Verify as Creator
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            className="w-full font-semibold bg-gradient-pink text-black disabled:opacity-50 disabled:pointer-events-none"
            onClick={handleNext}
            disabled={!selectedDuel}
          >
            {CREATE_DUEL.BUTTONS.NEXT}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedDuel === DUEL.COIN && (
            <CreateCoinDuel onBack={handleBack} onComplete={handleClose} />
          )}
          {selectedDuel === DUEL.FLASH && (
            <FlashDuelForm
              onBack={handleBack}
              onComplete={handleClose}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          )}
        </div>
      )}
    </Dialog>
  );
};

export default CreateDuel;
