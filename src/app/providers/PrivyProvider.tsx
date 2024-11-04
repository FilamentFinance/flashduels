// 'use client';

// import { PrivyProvider } from '@privy-io/react-auth';
// import { NEXT_PUBLIC_PRIVY_APP_ID } from '@/utils/consts';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { WagmiProvider } from '@privy-io/wagmi';
// import { config } from '../config/wagmi';
// import { sei, seiTestnet } from 'wagmi/chains';

// export default function Providers({ children }: { children: React.ReactNode }) {

//   const queryClient = new QueryClient();

//   return (
//     <PrivyProvider
//       appId={NEXT_PUBLIC_PRIVY_APP_ID}
//       config={{
//         appearance: {
//           theme: 'dark',
//           accentColor: '#676FFF',
//           logo: 'https://your-logo-url',
//           walletChainType: 'ethereum-only'
//         },
//         defaultChain: seiTestnet, //NOTE: SEI
//         supportedChains: [sei, seiTestnet],
//         loginMethods: ['twitter', 'wallet'] ,
//         embeddedWallets: {
//            createOnLogin: 'users-without-wallets'
//           // priceDisplay: false
//         },
//       }}
//     >
//       <QueryClientProvider client={queryClient}>
//         <WagmiProvider config={config}>
//           {children}
//         </WagmiProvider>
//       </QueryClientProvider>
//     </PrivyProvider>
//   );
// }