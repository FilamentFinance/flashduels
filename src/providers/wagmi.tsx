'use client';

import { SERVER_CONFIG } from '@/config/server-config';
import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  binanceWallet,
  bitgetWallet,
  bybitWallet,
  coinbaseWallet,
  compassWallet,
  ledgerWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { http } from 'viem';
// import { sei, base } from 'viem/chains';
import { base, baseSepolia, sei, seiTestnet } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import '@sei-js/sei-global-wallet/eip6963';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Flash Duels',
  projectId: SERVER_CONFIG.WALLET_CONNECT_PROJECT_ID,
  chains: [base, sei, baseSepolia, seiTestnet],
  // chains: [sei, base],
  // chains: [seiTestnet, baseSepolia],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        compassWallet,
        ledgerWallet,
        rabbyWallet,
        binanceWallet,
        bybitWallet,
        bitgetWallet,
        okxWallet,
      ],
    },
  ],
  transports: {
    [sei.id]: http(SERVER_CONFIG.getRpcUrl(sei.id)),
    [seiTestnet.id]: http(SERVER_CONFIG.getRpcUrl(seiTestnet.id)),
    [base.id]: http(SERVER_CONFIG.getRpcUrl(base.id)),
    [baseSepolia.id]: http(SERVER_CONFIG.getRpcUrl(baseSepolia.id)),
  },
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
