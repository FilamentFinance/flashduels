'use client';

import { Button } from '@/shadcn/components/ui/button';
import { NAVBAR } from '@/constants/content/navbar';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { FC } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useBalance } from '@/hooks/useBalance';
import { formatUnits } from 'viem';
import { Loader2 } from 'lucide-react';

export const WalletContent: FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance, symbol, decimals, isLoading, isError } = useBalance(address);

  if (!address) return null;

  const formattedBalance = balance && decimals
    ? Number(formatUnits(balance, decimals)).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })
    : '0';

  return (
    <div className="grid gap-6 py-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{NAVBAR.WALLET_MODAL.ADDRESS_LABEL}</span>
          <span>{truncateAddress(address)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{NAVBAR.WALLET_MODAL.BALANCE_LABEL}</span>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : isError ? (
            <span className="text-red-500">Error loading balance</span>
          ) : (
            <span className="font-medium">
              {formattedBalance} {symbol}
            </span>
          )}
        </div>
      </div>
      <Button variant="destructive" className="w-full" onClick={() => disconnect()}>
        {NAVBAR.WALLET_MODAL.DISCONNECT_BUTTON}
      </Button>
    </div>
  );
};
