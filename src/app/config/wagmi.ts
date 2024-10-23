import {createConfig} from '@privy-io/wagmi';
import { seiTestnet, sei } from "@wagmi/core/chains";
import { http } from 'wagmi'


export const config = createConfig({
  chains: [sei, seiTestnet],
  transports: {
    [sei.id]: http(),
    [seiTestnet.id]: http()
  },
});