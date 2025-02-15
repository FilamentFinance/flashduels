import { FLASHUSDC } from '@/abi/FLASHUSDC';
import { SEI_TESTNET_CHAIN_ID } from '@/constants/app';
import { Hex } from 'viem';
import { useReadContracts } from 'wagmi';

const TOKEN_ADDRESS = '0x542938B5c37d082159C0933EC982E3585c94BD62' as const;

export const useBalance = (address: Hex | undefined) => {
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        abi: FLASHUSDC,
        address: TOKEN_ADDRESS as Hex,
        chainId: SEI_TESTNET_CHAIN_ID,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
      {
        abi: FLASHUSDC,
        address: TOKEN_ADDRESS as Hex,
        chainId: SEI_TESTNET_CHAIN_ID,
        functionName: 'symbol',
      },
      {
        abi: FLASHUSDC,
        address: TOKEN_ADDRESS as Hex,
        chainId: SEI_TESTNET_CHAIN_ID,
        functionName: 'decimals',
      },
      {
        abi: FLASHUSDC,
        address: TOKEN_ADDRESS as Hex,
        chainId: SEI_TESTNET_CHAIN_ID,
        functionName: 'name',
      },
    ],
  });

  const [balanceResult, symbolResult, decimalsResult, nameResult] = data || [];

  return {
    balance: balanceResult?.result as bigint | undefined,
    symbol: symbolResult?.result as string | undefined,
    decimals: decimalsResult?.result as number | undefined,
    name: nameResult?.result as string | undefined,
    isLoading,
    isError,
    refetch,
  };
};
