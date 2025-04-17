// import { FLASHUSDC } from '@/abi/FLASHUSDC';
import { SERVER_CONFIG } from '@/config/server-config';
import { sei, seiTestnet } from 'viem/chains';
import { Hex } from 'viem';
import { useReadContracts, useChainId } from 'wagmi';
import { CREDITS } from '@/abi/CREDITS';

export const useBalance = (address: Hex | undefined) => {
  const chainId = useChainId();

  // const { data, isLoading, isError, refetch } = useReadContracts({
  //   contracts: [
  //     {
  //       abi: FLASHUSDC,
  //       address: SERVER_CONFIG.FLASH_USDC as Hex,
  //       chainId: chainId,
  //       functionName: 'balanceOf',
  //       args: address ? [address] : undefined,
  //     },
  //     {
  //       abi: FLASHUSDC,
  //       address: SERVER_CONFIG.FLASH_USDC as Hex,
  //       chainId: chainId,
  //       functionName: 'symbol',
  //     },
  //     {
  //       abi: FLASHUSDC,
  //       address: SERVER_CONFIG.FLASH_USDC as Hex,
  //       chainId: chainId,
  //       functionName: 'decimals',
  //     },
  //     {
  //       abi: FLASHUSDC,
  //       address: SERVER_CONFIG.FLASH_USDC as Hex,
  //       chainId: chainId,
  //       functionName: 'name',
  //     },
  //   ],
  // });

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        abi: CREDITS,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        chainId: chainId,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
      {
        abi: CREDITS,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        chainId: chainId,
        functionName: 'symbol',
      },
      {
        abi: CREDITS,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        chainId: chainId,
        functionName: 'decimals',
      },
      {
        abi: CREDITS,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        chainId: chainId,
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
