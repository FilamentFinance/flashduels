'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { LOGOS } from '@/constants/app/logos';
import { Button } from '@/shadcn/components/ui/button';
import Image from 'next/image';
import { FC } from 'react';

const ClaimFunds: FC = () => {
  return (
    <Dialog
      title="Claim Funds"
      maxWidth="max-w-md"
      trigger={
        <div className="inline-flex items-center gap-2 px-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <Image src="/logo/dollar.svg" alt="Funds" width={12} height={12} className="mr-2" />
          <span>$0.00</span>
          <Button variant="pink" size="sm" className="text-black">
            Claim
          </Button>
        </div>
      }
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-lg">Amount</span>
          <span className="text-zinc-400">
            Available: <span className="text-white">0.00</span>{' '}
            <span className="text-pink-300">Max</span>
          </span>
        </div>

        {/* Amount Input */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <input type="text" placeholder="0.00" className="flex-1 bg-transparent outline-none" />
          <div className="flex items-center gap-2">
            <Image
              src={LOGOS.USDC.icon}
              alt={LOGOS.USDC.alt}
              width={LOGOS.USDC.width}
              height={LOGOS.USDC.height}
            />
            <span>USDC</span>
          </div>
        </div>

        {/* Claim Button */}
        <Button variant="pink" size="lg" className="w-full">
          Claim Funds
        </Button>
      </div>
    </Dialog>
  );
};

export default ClaimFunds;
