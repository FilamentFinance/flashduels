'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { FAUCET_LOGOS } from '@/constants/app/logos';
import { CLAIM_FAUCET } from '@/constants/content/claim-faucent';
import { Button } from '@/shadcn/components/ui/button';
import { useToast } from '@/shadcn/components/ui/use-toast';
import CopyToClipboard from '@/utils/general/copy-to-clipboard';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { openExternalLinkInNewTab } from '@/utils/general/open-external-link';
import { ArrowUpRight, Check, Copy, Info } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useAccount } from 'wagmi';

const ClaimFaucet: FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();

  const handleCopy = async () => {
    await CopyToClipboard(SERVER_CONFIG.FLASH_USDC);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };
  const handleClaimFaucet = async () => {
    if (!address) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please connect your wallet first',
      });
      return;
    }

    try {
      setMintLoading(true);
      const data = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/api/mint`, {
        address: address.toLowerCase(),
      });
      toast({
        title: 'Success',
        description: 'Tokens minted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mint tokens. Please try again.',
      });
      console.error('Mint error:', error);
    } finally {
      setMintLoading(false);
    }
  };

  return (
    <Dialog
      title={CLAIM_FAUCET.DIALOG.TITLE}
      maxWidth="max-w-md"
      trigger={
        <Button className="bg-gradient-pink">
          <Image
            src={FAUCET_LOGOS.TRIGGER.icon}
            alt={FAUCET_LOGOS.TRIGGER.alt}
            width={FAUCET_LOGOS.TRIGGER.width}
            height={FAUCET_LOGOS.TRIGGER.height}
            className="mr-2"
          />
        </Button>
      }
    >
      <div className="flex flex-col items-center w-full space-y-4">
        {/* Token Icon */}
        <Image
          src={FAUCET_LOGOS.MAIN.icon}
          alt={FAUCET_LOGOS.MAIN.alt}
          width={FAUCET_LOGOS.MAIN.width}
          height={FAUCET_LOGOS.MAIN.height}
        />

        {/* Token Address */}
        <div className="flex items-center justify-between w-full bg-[#1C1C1C] rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400">{CLAIM_FAUCET.TOKEN_ADDRESS.LABEL}</span>
            <span className="text-sm">{truncateAddress(SERVER_CONFIG.FLASH_USDC)}</span>
          </div>
          <button
            className="flex items-center justify-center hover:bg-zinc-800/50 rounded transition-colors"
            onClick={handleCopy}
          >
            <div className="relative w-5 h-5">
              {isCopied ? (
                <div className="text-[#F19ED2]">
                  <Check className="w-5 h-5" />
                </div>
              ) : (
                <div className="text-[#F19ED2]/80">
                  <Copy className="w-5 h-5 stroke-[1.5]" />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-4">
          <Button
            variant="pink"
            className="flex-1 h-12 text-base font-medium text-black"
            onClick={handleClaimFaucet}
            disabled={mintLoading}
          >
            {mintLoading
              ? CLAIM_FAUCET.ACTION_BUTTONS.CLAIM_BUTTON.LOADING_TEXT
              : CLAIM_FAUCET.ACTION_BUTTONS.CLAIM_BUTTON.TEXT}
          </Button>
          <Button
            variant="pinkOutline"
            className="flex-1 h-12 text-base font-medium"
            onClick={() => openExternalLinkInNewTab(CLAIM_FAUCET.ACTION_BUTTONS.SEI_BUTTON.URL)}
          >
            {CLAIM_FAUCET.ACTION_BUTTONS.SEI_BUTTON.TEXT}
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ClaimFaucet;
