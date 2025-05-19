'use client';

import { NAVBAR } from '@/constants/content/navbar';
import { Button } from '@/shadcn/components/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { FC } from 'react';
import { useNetworkConfig } from '@/hooks/useNetworkConfig';

export const ConnectButton: FC = () => {
  const { openConnectModal } = useConnectModal();
  const { chainId, isChainSupported, switchToSupportedNetwork } = useNetworkConfig();

  const handleConnect = async () => {
    if (chainId && !isChainSupported(chainId)) {
      await switchToSupportedNetwork();
    }
    if (openConnectModal) {
      openConnectModal();
    }
  };

  return (
    <Button
      onClick={handleConnect}
      variant="default"
      size="lg"
      className="font-semibold bg-gradient-pink text-black"
    >
      {NAVBAR.CONNECT_WALLET.BUTTON_TEXT}
    </Button>
  );
};
