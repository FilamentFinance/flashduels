'use client';

import { SERVER_CONFIG } from '@/config/server-config';
import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { http } from 'viem';
import { sei, seiTestnet } from 'viem/chains';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Filament Web-App',
  projectId: SERVER_CONFIG.WALLET_CONNECT_PROJECT_ID,
  chains: [sei, seiTestnet],
  transports: {
    [sei.id]: http(),
    [seiTestnet.id]: http(SERVER_CONFIG.RPC_URL),
  },
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
