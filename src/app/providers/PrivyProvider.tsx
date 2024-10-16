'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import { NEXT_PUBLIC_PRIVY_APP_ID } from '@/utils/consts';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}