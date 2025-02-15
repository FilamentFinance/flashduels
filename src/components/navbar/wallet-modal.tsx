'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { NAVBAR } from '@/constants/content/navbar';
import { FC } from 'react';
import { WalletContent } from './wallet-content';

interface WalletModalProps {
  children: React.ReactNode;
}

export const WalletModal: FC<WalletModalProps> = ({ children }) => {
  return (
    <Dialog trigger={children} title={NAVBAR.WALLET_MODAL.TITLE} maxWidth="max-w-sm">
      <WalletContent />
    </Dialog>
  );
};
