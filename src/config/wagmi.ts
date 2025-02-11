import { sei } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

const selectedChain = sei;

export const config = createConfig({
  chains: [selectedChain],
  transports: {
    [selectedChain.id]: http(selectedChain.rpcUrls.default.http[0]),
  },
  connectors: [injected()],
});
