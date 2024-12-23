import { NEXT_PUBLIC_RPC_URL } from '@/utils/consts';
// import {createConfig} from '@privy-io/wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { seiTestnet } from "@wagmi/core/chains";
import { http } from 'wagmi'


// export const config = createConfig({
//   chains: [sei, seiTestnet],
//   transports: {
//     [sei.id]: http(),
//     [seiTestnet.id]: http(NEXT_PUBLIC_RPC_URL)
//   },
// });

export const config = getDefaultConfig({
  appName: 'Filament Web-App',
  projectId: 'a6a36fb7d48ef6daf3b987126183a32a',
  chains: [seiTestnet],
  transports: {
    // [sei.id]: http(),
    [seiTestnet.id]: http(NEXT_PUBLIC_RPC_URL)
  },
  ssr: true,
});