import { base, baseSepolia, sei, seiTestnet } from 'viem/chains';
// import { base, sei } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SERVER_CONFIG } from './server-config';

// Get all supported chains
// const selectedChain = sei;
// const selectedChains = [base, baseSepolia, sei, seiTestnet];

export const config = createConfig({
  // chains: [selectedChain],
  chains: [sei, seiTestnet, base, baseSepolia],
  // chains: [seiTestnet, baseSepolia],
  // chains: [sei, base],
  transports: {
    [sei.id]: http(SERVER_CONFIG.getRpcUrl(sei.id)),
    [seiTestnet.id]: http(SERVER_CONFIG.getRpcUrl(seiTestnet.id)),
    [base.id]: http(SERVER_CONFIG.getRpcUrl(base.id)),
    // [base.id]: http(base.rpcUrls.default.http[0]),
    [baseSepolia.id]: http(SERVER_CONFIG.getRpcUrl(baseSepolia.id)),
    // [baseSepolia.id]: http(baseSepolia.rpcUrls.default.http[0]),
  },
  connectors: [injected()],
});
