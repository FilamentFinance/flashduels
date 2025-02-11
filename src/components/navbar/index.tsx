'use client';

import { APP_ROUTES } from '@/constants/app/appRoutes';
import { Button } from '@/shadcn/components/ui/button';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { FC } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from './connectButton';
import Logo from './logo';
import NavLink from './navLink';
import { WalletModal } from './wallet-modal';
import EnableTrading from './enableTrading';

const Navbar: FC = () => {
  const { address, isConnected } = useAccount();

  return (
    <nav className="w-full border-b border-gray-800 h-navbar-height px-navbar-padding flex items-center">
      <div className="mx-auto w-full max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="flex items-center gap-6">
            {Object.values(APP_ROUTES).map((route) => {
              return <NavLink key={route.path} {...route} />;
            })}
          </div>
        </div>
        {isConnected && address ? (
          <div className="flex gap-2">
            <WalletModal>
              <Button className="rounded-default bg-glass hover:bg-glass-hover transition-colors duration-200 hover:shadow-lg">
                {truncateAddress(address)}
              </Button>
            </WalletModal>
            <EnableTrading />
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
