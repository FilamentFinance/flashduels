import { base, baseSepolia, sei, seiTestnet } from 'viem/chains';
import { type Chain } from 'viem';

export const wagmiChainsById: Record<number, Chain> = {
  [sei.id]: sei,
  [seiTestnet.id]: seiTestnet,
  [base.id]: base,
  // [baseSepolia.id]: baseSepolia,
};
