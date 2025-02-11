'use client';

import { Button } from '@/shadcn/components/ui/button';
import { NAVBAR } from '@/constants/content/navbar';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { FC } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

export const WalletContent: FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
  });

  if (!address) return null;

  return (
    <div className="grid gap-6 py-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{NAVBAR.WALLET_MODAL.ADDRESS_LABEL}</span>
          <span>{truncateAddress(address)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{NAVBAR.WALLET_MODAL.BALANCE_LABEL}</span>
          <span>
            {balance?.formatted ?? '0'} {balance?.symbol}
          </span>
        </div>
      </div>
      <Button variant="destructive" className="w-full" onClick={() => disconnect()}>
        {NAVBAR.WALLET_MODAL.DISCONNECT_BUTTON}
      </Button>
    </div>
  );
};
