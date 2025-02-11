'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { sei, seiTestnet } from 'viem/chains';
import { http } from 'viem';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Filament Web-App',
  projectId: 'a6a36fb7d48ef6daf3b987126183a32a',
  chains: [sei, seiTestnet],
  transports: {
    [sei.id]: http(),
    [seiTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
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
