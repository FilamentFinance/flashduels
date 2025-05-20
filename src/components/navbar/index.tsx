'use client';

import { APP_ROUTES } from '@/constants/app/appRoutes';
import { Button } from '@/shadcn/components/ui/button';
import { RootState } from '@/store';
import { fetchAssetType, setCryptoAsset } from '@/store/slices/priceSlice';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAccount, useChainId } from 'wagmi';
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
import { setCreatorStatus } from '@/store/slices/authSlice';
import { useApiClient } from '@/config/api-client';
import { useNetworkConfig } from '@/hooks/useNetworkConfig';
// import { getSupportedChainIds } from '@/config/contract-config';
import { useToast } from '@/shadcn/components/ui/use-toast';
// import { sei } from 'viem/chains';

const Navbar: FC = () => {
  const { address, isConnected } = useAccount();
  const { isAuthenticated, isCreator } = useAppSelector(
    (state: RootState) => state.auth,
    shallowEqual,
  );
  const { balance, symbol, decimals, isLoading } = useBalance(address ?? undefined);
  const { chainId, isChainSupported, switchToSupportedNetwork, getCurrentNetworkName } =
    useNetworkConfig();
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  // const { isTradingEnabled = false } = useAppSelector((state: RootState) => state.user || {}, shallowEqual);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const apiClient = useApiClient(chainId ?? 0);

  // const getChainName = (chainId: number): string => {
  //   switch (chainId) {
  //     case base.id:
  //       return base.name;
  //     // case baseSepolia.id:
  //     //   return baseSepolia.name;
  //     case sei.id:
  //       return sei.name;
  //     case seiTestnet.id:
  //       return seiTestnet.name;
  //     default:
  //       return 'Unsupported Network';
  //   }
  // };

  const fetchCryptoAssets = async (currentChainId: number) => {
    try {
      const response = await axios.get(`${SERVER_CONFIG.getApiUrl(currentChainId)}/assets/list`);

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
    if (chainId !== undefined) {
      fetchCryptoAssets(chainId);
    }
  }, [chainId]);

  useEffect(() => {
    if (isConnected && address && chainId !== undefined) {
      apiClient
        .get(`${SERVER_CONFIG.getApiUrl(chainId)}/user/creator/status`, {
          params: { address: address.toLowerCase() },
        })
        .then((res) => {
          dispatch(setCreatorStatus(res.data.isCreator));
        })
        .catch(() => {
          dispatch(setCreatorStatus(false));
        });
    }
  }, [isConnected, address, dispatch, apiClient, chainId]);

  const formattedBalance =
    balance && decimals
      ? Number(formatUnits(balance, decimals)).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : '0';

  console.log('Navbar chainId:', chainId, 'isChainSupported:', isChainSupported(chainId));

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
            {chainId !== undefined && isChainSupported(chainId) ? (
              <>
                <ClaimFunds />
                <ClaimAirdropButton />
                <EnableTrading />
                <GetGas />
                {isAuthenticated && (
                  <div className="flex items-center gap-2">
                    <CreateDuel />
                  </div>
                )}
                <WalletModal>
                  <Button className="rounded-default bg-glass hover:bg-glass-hover border border-zinc-800 transition-colors duration-200 hover:shadow-lg flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <span className="text-gray-300">
                        {formattedBalance} {symbol}
                      </span>
                    )}
                    <span className="border-l border-zinc-700 pl-2 flex flex-col items-center">
                      <span>{truncateAddress(address)}</span>
                      {isCreator ? (
                        <span className="text-xs text-center font-medium text-green-500 mt-1">
                          ✓ Verified Creator
                        </span>
                      ) : (
                        <span className="text-xs text-center font-medium text-yellow-500 mt-1">
                          ⚠️ Not Verified Creator
                        </span>
                      )}
                    </span>
                  </Button>
                </WalletModal>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  setIsSwitchingNetwork(true);
                  try {
                    await switchToSupportedNetwork();
                    toast({
                      title: 'Network Connected',
                      description: `Successfully connected to a supported network`,
                      variant: 'default',
                    });
                  } finally {
                    setIsSwitchingNetwork(false);
                  }
                }}
                disabled={isSwitchingNetwork}
                className="text-sm border-pink-300 text-pink-300 hover:bg-pink-400/10 hover:text-pink-400 hover:border-pink-400"
              >
                {isSwitchingNetwork ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <>Switch Network</>
                )}
              </Button>
            )}
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
