'use client';

import { NAVBAR } from '@/constants/content/navbar';
import { Button } from '@/shadcn/components/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { FC } from 'react';

export const ConnectButton: FC = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <Button
      onClick={openConnectModal}
      variant="default"
      size="lg"
      className="font-semibold bg-gradient-pink text-black"
    >
      {NAVBAR.CONNECT_WALLET.BUTTON_TEXT}
    </Button>
  );
};
