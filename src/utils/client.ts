import { type PublicClient } from 'viem';
import ClientProvider from '@/providers/clientProvider';

export const getPublicClient = ({
  rpcUrls,
  chainId,
}: {
  rpcUrls: string[];
  chainId: number;
}): PublicClient => ClientProvider.getInstance().getPublicClient({ rpcUrls, chainId });
