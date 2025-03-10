'use client';

import { APP_ROUTES } from '@/constants/app/appRoutes';
import { Button } from '@/shadcn/components/ui/button';
import { RootState } from '@/store';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { FC } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import ClaimFaucet from '../claim-faucet';
import ClaimFunds from '../claim-funds';
import CreateDual from '../create-dual';
import Balance from './balance';
import { ConnectButton } from './connectButton';
import EnableTrading from './enableTrading';
import GenerateInvite from '../invite-only/generate-invite';
import Logo from './logo';
import NavLink from './navLink';
import { WalletModal } from './wallet-modal';

const Navbar: FC = () => {
  const { address, isConnected } = useAccount();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth, shallowEqual);
  return (
    <nav className="w-full border-b border-gray-800 h-navbar-height px-navbar-padding flex items-center">
      <div className="mx-auto w-full flex items-center justify-between">
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
            <ClaimFunds />
            <Balance />
            <ClaimFaucet />
            <EnableTrading />

            {isAuthenticated && <CreateDual />}
            <WalletModal>
              <Button className="rounded-default bg-glass hover:bg-glass-hover border border-zinc-800 transition-colors duration-200 hover:shadow-lg">
                {truncateAddress(address)}
              </Button>
            </WalletModal>
            {/* <GenerateInvite /> */}
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
