'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { LOGOS } from '@/constants/app/logos';
import { CLAIM_FUNDS } from '@/constants/content/claim-funds';
import { Button } from '@/shadcn/components/ui/button';
import Image from 'next/image';
import { FC } from 'react';

const ClaimFunds: FC = () => {
  return (
    <Dialog
      title={CLAIM_FUNDS.DIALOG.TITLE}
      maxWidth="max-w-md"
      trigger={
        <div className="inline-flex items-center gap-2 px-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <Image src="/logo/dollar.svg" alt="Funds" width={12} height={12} className="mr-2" />
          <span>{CLAIM_FUNDS.TRIGGER.DEFAULT_AMOUNT}</span>
          <Button variant="pink" size="sm" className="text-black font-bold">
            {CLAIM_FUNDS.TRIGGER.CLAIM_TEXT}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-lg">{CLAIM_FUNDS.AMOUNT_SECTION.LABEL}</span>
          <span className="text-zinc-400">
            {CLAIM_FUNDS.AMOUNT_SECTION.AVAILABLE.LABEL}{' '}
            <span className="text-white">{CLAIM_FUNDS.AMOUNT_SECTION.AVAILABLE.DEFAULT_VALUE}</span>{' '}
            <span className="text-pink-300">{CLAIM_FUNDS.AMOUNT_SECTION.AVAILABLE.MAX_TEXT}</span>
          </span>
        </div>

        {/* Amount Input */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <input
            type="text"
            placeholder={CLAIM_FUNDS.AMOUNT_SECTION.INPUT.PLACEHOLDER}
            className="flex-1 bg-transparent outline-none"
          />
          <div className="flex items-center gap-2">
            <Image
              src={LOGOS.USDC.icon}
              alt={LOGOS.USDC.alt}
              width={LOGOS.USDC.width}
              height={LOGOS.USDC.height}
            />
            <span>{CLAIM_FUNDS.AMOUNT_SECTION.INPUT.CURRENCY}</span>
          </div>
        </div>

        {/* Claim Button */}
        <Button variant="pink" size="lg" className="w-full">
          {CLAIM_FUNDS.CLAIM_BUTTON.TEXT}
        </Button>
      </div>
    </Dialog>
  );
};

export default ClaimFunds;
