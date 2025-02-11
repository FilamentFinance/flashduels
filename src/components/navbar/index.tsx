'use client';
import { Button } from '@/shadcn/components/ui/button';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { FC } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from './connectButton';
import Logo from './logo';
import { WalletModal } from './wallet-modal';

const Navbar: FC = () => {
  const { address, isConnected } = useAccount();
  return (
    <nav className="w-full border-b border-gray-800 h-navbar-height px-navbar-padding flex items-center">
      <div className="mx-auto w-full max-w-7xl flex items-center justify-between">
        <Logo />
        {isConnected && address ? (
          <WalletModal>
            <Button className="rounded-default bg-glass hover:bg-glass-hover transition-colors duration-200 hover:shadow-lg">
              {truncateAddress(address)}
            </Button>
          </WalletModal>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
