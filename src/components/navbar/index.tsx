'use client';

import { APP_ROUTES } from '@/constants/app/appRoutes';
import { Button } from '@/shadcn/components/ui/button';
import { RootState } from '@/store';
import { fetchAssetType, setCryptoAsset } from '@/store/slices/priceSlice';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import axios from 'axios';
import { FC, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import ClaimFaucet from '../claim-faucet';
import ClaimFunds from '../claim-funds';
import CreateDuel from '../create-duel';
import Balance from './balance';
import { ConnectButton } from './connectButton';
import EnableTrading from './enableTrading';
import Logo from './logo';
import NavLink from './navLink';
import { WalletModal } from './wallet-modal';

const Navbar: FC = () => {
  const { address, isConnected } = useAccount();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth, shallowEqual);
  const dispatch = useDispatch();
  const fetchCryptoAssets = async () => {
    try {
      const response = await axios.get(
        'https://orderbookv3.filament.finance/flashduels/assets/list',
      );
      const assetsWithImages = response.data
        .filter((asset: fetchAssetType) => asset.symbol.startsWith('Crypto.')) // Filter for crypto assets
        .map((asset: fetchAssetType) => {
          const symbol = asset.symbol.split('/')[0].replace('Crypto.', '').toLowerCase();
          return {
            ...asset,
            image: `/crypto-icons/light/crypto-${symbol}-usd.inline.svg`,
          };
        });
      dispatch(setCryptoAsset(assetsWithImages));
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  useEffect(() => {
    fetchCryptoAssets();
  }, []);
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

            {isAuthenticated && <CreateDuel />}
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
