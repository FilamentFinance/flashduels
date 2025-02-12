'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { Button } from '@/shadcn/components/ui/button';
import CopyToClipboard from '@/utils/general/copy-to-clipboard';
import { openExternalLinkInNewTab } from '@/utils/general/open-external-link';
import { ArrowUpRight, Check, Copy, Info } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';

const TOKEN_ADDRESS = '0x62A14B05Db18f...0390';

const ClaimFaucet: FC = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await CopyToClipboard(TOKEN_ADDRESS);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <Dialog
      title="Claim Faucet"
      maxWidth="max-w-md"
      trigger={
        <Button className="bg-gradient-pink">
          <Image src="/logo/faucet.svg" alt="Faucet" width={12} height={12} className="mr-2" />
        </Button>
      }
    >
      <div className="flex flex-col items-center space-y-12 px-6 py-8 w-full">
        {/* Token Icon */}
        <Image src="/logo/claim-faucet.svg" alt="Token" width={300} height={300} className="p-8" />

        {/* Token Address */}
        <div className="flex items-center justify-between w-full rounded-2xl  border border-solid border-[rgba(255,255,255,0.02)] bg-[rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-zinc-400" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Token Address:</span>
              <span className="text-white font-medium">{TOKEN_ADDRESS}</span>
            </div>
          </div>
          <button
            className="hover:bg-zinc-800/50 p-2 rounded-lg transition-colors"
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className="w-5 h-5 text-gradient-pink" strokeWidth={2.5} />
            ) : (
              <Copy className="w-5 h-5 text-gradient-pink" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-4">
          <Button variant="pink" className="flex-1 h-12 text-base font-medium text-black">
            Claim Faucet
          </Button>
          <Button
            variant="pinkOutline"
            className="flex-1 h-12 text-base font-medium"
            onClick={() => openExternalLinkInNewTab('https://atlantic-2.app.sei.io/faucet/')}
          >
            SEI Faucet
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ClaimFaucet;
