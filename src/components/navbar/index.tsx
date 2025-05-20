'use client';

import { APP_ROUTES } from '@/constants/app/appRoutes';
import { Button } from '@/shadcn/components/ui/button';
import { RootState } from '@/store';
import { fetchAssetType, setCryptoAsset } from '@/store/slices/priceSlice';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import axios from 'axios';
import { FC, useEffect, useState, useRef } from 'react';
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
  const { chainId, isChainSupported, switchToSupportedNetwork, getSupportedNetworks } =
    useNetworkConfig();
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const supportedNetworks = getSupportedNetworks();
  // const { isTradingEnabled = false } = useAppSelector((state: RootState) => state.user || {}, shallowEqual);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const apiClient = useApiClient(chainId ?? 0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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

  // console.log('Navbar chainId:', chainId, 'isChainSupported:', isChainSupported(chainId));

  // Add a mapping for network icons (use placeholder for now)
  const networkIcons: Record<number, string> = {
    8453: '/chain-icons/base.png', // Base Mainnet
    1329: '/chain-icons/sei.png', // Sei Mainnet
    1328: '/chain-icons/sei.png', // Sei Testnet
  };
  const defaultIcon = '/chain-icons/base.png';

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
          <>
            {/* Top-right network badge */}
            {chainId !== undefined && isChainSupported(chainId) && (
              <div className="fixed top-8.5 right-2 z-50">
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center gap-2 bg-glass p-2 rounded-lg border border-zinc-800 shadow-lg focus:outline-none hover:border-pink-600 hover:bg-pink-500/20 transition-colors cursor-pointer"
                  aria-label="Switch Network"
                >
                  <img
                    src={networkIcons[chainId] || defaultIcon}
                    alt="Network Icon"
                    className="w-5 h-5 mr-1 inline rounded-full border border-zinc-700"
                  />
                  <svg className="w-3 h-3 text-pink-300" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-32 bg-black border border-pink-300 rounded shadow-lg text-xs"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    {supportedNetworks.map((net) => (
                      <button
                        key={net.id}
                        className={`flex items-center justify-between w-full px-2 py-1.5 text-xs ${
                          net.id === chainId
                            ? 'bg-pink-500/30 text-pink-300'
                            : 'hover:bg-pink-800/50'
                        }`}
                        onClick={async () => {
                          setDropdownOpen(false);
                          setIsSwitchingNetwork(true);
                          try {
                            await switchToSupportedNetwork(net.id);
                            toast({
                              title: 'Network Connected',
                              description: `Successfully connected to ${net.name}`,
                              variant: 'default',
                              duration: 3000,
                            });
                          } finally {
                            setIsSwitchingNetwork(false);
                          }
                        }}
                        disabled={isSwitchingNetwork}
                      >
                        <div className="flex items-center">
                          <img
                            src={networkIcons[net.id] || defaultIcon}
                            alt="Network Icon"
                            className="w-4 h-4 mr-1 rounded-full"
                          />
                          <span>{net.name}</span>
                        </div>
                        {net.id === chainId && (
                          <svg
                            className="w-4 h-4 text-pink-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
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
                    <Button className="rounded-default bg-glass hover:bg-glass-hover border border-zinc-800 transition-colors duration-200 hover:shadow-lg flex items-center gap-2 mr-7">
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="rounded border px-1.5 py-0.5 bg-black text-xs text-white border-pink-300 flex items-center min-h-7"
                    disabled={isSwitchingNetwork}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                  >
                    <span className="mr-1">Switch Network</span>
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute z-50 mt-1 w-35 bg-black border border-pink-300 rounded shadow-lg text-xs">
                      {supportedNetworks.map((net) => (
                        <button
                          key={net.id}
                          className={`flex items-center justify-between w-full px-2 py-1.5 text-xs ${
                            net.id === chainId
                              ? 'bg-pink-500/30 text-pink-300'
                              : 'hover:bg-pink-800/50'
                          }`}
                          onClick={async () => {
                            setDropdownOpen(false);
                            setIsSwitchingNetwork(true);
                            try {
                              await switchToSupportedNetwork(net.id);
                              toast({
                                title: 'Network Connected',
                                description: `Successfully connected to ${net.name}`,
                                variant: 'default',
                                duration: 3000,
                              });
                            } finally {
                              setIsSwitchingNetwork(false);
                            }
                          }}
                          disabled={isSwitchingNetwork}
                        >
                          <div className="flex items-center">
                            <img
                              src={networkIcons[net.id] || defaultIcon}
                              alt="Network Icon"
                              className="w-4 h-4 mr-1 rounded-full"
                            />
                            <span>{net.name}</span>
                          </div>
                          {net.id === chainId && (
                            <svg
                              className="w-4 h-4 text-pink-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
