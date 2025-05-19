import { base, sei, seiTestnet } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SERVER_CONFIG } from './server-config';

// const selectedChain = sei;
// Get all supported chains

// const selectedChains = [base, baseSepolia, sei, seiTestnet];

export const config = createConfig({
  // chains: [selectedChain],
  chains: [sei, seiTestnet, base],
  transports: {
    [sei.id]: http(sei.rpcUrls.default.http[0]),
    [seiTestnet.id]: http(seiTestnet.rpcUrls.default.http[0]),
    // [base.id]: http(base.rpcUrls.default.http[0]),
    [base.id]: http(SERVER_CONFIG.getRpcUrl(base.id)),
    // [baseSepolia.id]: http(baseSepolia.rpcUrls.default.http[0]),
  },
  connectors: [injected()],
});
