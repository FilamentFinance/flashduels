'use client';

// import { PrivyProvider } from '@privy-io/react-auth';
// import { NEXT_PUBLIC_PRIVY_APP_ID } from '@/utils/consts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { WagmiProvider } from '@privy-io/wagmi';
import { WagmiProvider } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '../config/wagmi';
// import { sei, seiTestnet } from 'wagmi/chains';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';

export default function RainbowKitProviders({ children }: { children: React.ReactNode }) {

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()} >
          {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
  );
}