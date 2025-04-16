'use client';

import { APP_ROUTES } from '@/constants/app/appRoutes';
import { Button } from '@/shadcn/components/ui/button';
import { RootState } from '@/store';
import { fetchAssetType, setCryptoAsset } from '@/store/slices/priceSlice';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import axios from 'axios';
import { FC, useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAccount } from 'wagmi';
// import ClaimFaucet from '../claim-faucet';
import ClaimFunds from '../claim-funds';
import CreateDuel from '../create-duel';
// import Balance from './balance';
import { ConnectButton } from './connectButton';
import EnableTrading from './enableTrading';
import Logo from './logo';
import NavLink from './navLink';
import { WalletModal } from './wallet-modal';
import GetGas from '../claim-faucet/get-gas';
import ClaimAirdropButton from './claimAirdrop';
import { useAppSelector } from '@/store/hooks';
import { useBalance } from '@/hooks/useBalance';
import { formatUnits } from 'viem';
import { Loader2 } from 'lucide-react';
import { SERVER_CONFIG } from '@/config/server-config';

const Navbar: FC = () => {
  const { address, isConnected } = useAccount();
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth, shallowEqual);
  const { balance, symbol, decimals, isLoading } = useBalance(address);
  // const { isTradingEnabled = false } = useAppSelector((state: RootState) => state.user || {}, shallowEqual);
  const dispatch = useDispatch();
  const fetchCryptoAssets = async () => {
    try {
      let response;
      if (SERVER_CONFIG.PRODUCTION) {
        // response = await axios.get(
        // 'https://orderbookv3.filament.finance/flashduels/assets/list',
        // );
        response = await axios.get(
          'https://testnetserver.flashduels.xyz/flashduels/assets/list',
        );
      } else {
        response = await axios.get(
          'http://localhost:3004/flashduels/assets/list',
        );
      }
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

  const formattedBalance =
    balance && decimals
      ? Number(formatUnits(balance, decimals)).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : '0';

  return (
    <nav className="w-full border-b border-gray-800 h-navbar-height px-navbar-padding flex items-center">
      <div className="mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="flex items-center gap-6">
            {Object.values(APP_ROUTES).map((route) => {
              if (route.path === APP_ROUTES.PORTFOLIO.path && !isAuthenticated) {
                return null;
              }
              return <NavLink key={route.path} {...route} />;
            })}
          </div>
        </div>
        {isConnected && address ? (
          <div className="flex gap-2">
            <ClaimFunds />
            {/* <Balance /> */}
            <ClaimAirdropButton />
            {/* <ClaimFaucet /> */}
            <EnableTrading />
            <GetGas />
            {isAuthenticated && <CreateDuel />}
            <WalletModal>
              <Button className="rounded-default bg-glass hover:bg-glass-hover border border-zinc-800 transition-colors duration-200 hover:shadow-lg flex items-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <span className="text-gray-300">{formattedBalance} {symbol}</span>
                )}
                <span className="border-l border-zinc-700 pl-2">{truncateAddress(address)}</span>
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
