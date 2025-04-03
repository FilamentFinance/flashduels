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
import { FC, useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  const checkCreatorStatus = async () => {
    if (!address) {
      setIsCreator(null);
      setRequestStatus(null);
      return;
    }
    try {
      setLoading(true);
      const response = await baseApiClient.get(`${SERVER_CONFIG.API_URL}/user/creator/status`, {
        params: {
          address: address.toLowerCase()
        }
      });
      console.log("response", response);
      setIsCreator(response.data.isCreator);
      setRequestStatus(response.data.request);
    } catch (error) {
      console.error("Error checking creator status:", error);
      setIsCreator(false);
      setRequestStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Call checkCreatorStatus when the component mounts or address changes
  useEffect(() => {
    checkCreatorStatus();
  }, [address]);

  const handleDuelSelect = (type: DuelType) => {
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
      {(!isCreator && selectedDuel == DUEL.FLASH && showForm) || creatorModalOpen ? (
        <div className="space-y-4">
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
            <Duel
              logo={{
                active: DUEL_LOGOS.FLASH.active,
                inactive: DUEL_LOGOS.FLASH.inactive,
              }}
              title={CREATE_DUEL.MARKET_SECTION.FLASH_DUEL.TITLE}
              description={CREATE_DUEL.MARKET_SECTION.FLASH_DUEL.DESCRIPTION}
              isActive={selectedDuel === DUEL.FLASH}
              onClick={() => handleDuelSelect(DUEL.FLASH)}
            />
          </div>
          <Button
            className="w-full font-semibold bg-gradient-pink text-black disabled:opacity-50 disabled:pointer-events-none"
            onClick={!isCreator && selectedDuel === DUEL.FLASH ? () => setCreatorModalOpen(true) : handleNext}
            disabled={!selectedDuel}
          >
            {!isCreator && selectedDuel === DUEL.FLASH 
              ? "Verify as Creator" 
              : CREATE_DUEL.BUTTONS.NEXT}
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
