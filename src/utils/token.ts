/* eslint-disable @typescript-eslint/no-unused-vars */
// import { FLASHUSDC } from '@/abi/FLASHUSDC';
import { CREDITS } from '@/abi/CREDITS';
import { SERVER_CONFIG } from '@/config/server-config';
// import { SEI_TESTNET_CHAIN_ID } from '@/constants/app';
import { Hex, parseUnits, formatUnits } from 'viem';
import { sei, seiTestnet } from 'viem/chains';
import { useWriteContract, useChainId } from 'wagmi';

// export const REQUIRED_ALLOWANCE = BigInt(5 * 10 ** 6);

export const useTokenApproval = () => {
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();

  // const { data: allowance } = useReadContract({
  //   abi: FLASHUSDC,
  //   address: SERVER_CONFIG.FLASH_USDC as Hex,
  //   functionName: 'allowance',
  //   args: [address, SERVER_CONFIG.DIAMOND as Hex],
  //   chainId: SEI_TESTNET_CHAIN_ID,
  // }) as { data: bigint | undefined };

  // const checkAllowance = async () => {
  //   const currentAllowance = allowance || BigInt(0);
  //   return currentAllowance >= (amount || REQUIRED_ALLOWANCE);
  // };

  const requestAllowance = async (amount: bigint) => {
    // for flashUSDC
    //   const tx = await writeContractAsync({
    //     abi: FLASHUSDC,
    //     address: SERVER_CONFIG.FLASH_USDC as Hex,
    //     functionName: 'increaseAllowance',
    //     chainId: SEI_TESTNET_CHAIN_ID,
    //     // args: [SERVER_CONFIG.DIAMOND as Hex, amount || REQUIRED_ALLOWANCE],
    //     args: [SERVER_CONFIG.DIAMOND as Hex, amount],
    //   });

    //   if (!tx) throw new Error('Failed to send approval transaction');
    //   return tx;
    // };


    // for CRD use
    const tx = await writeContractAsync({
      abi: CREDITS,
      address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
      functionName: 'approve',
      chainId: chainId,
      // args: [SERVER_CONFIG.DIAMOND as Hex, amount || REQUIRED_ALLOWANCE],
      args: [SERVER_CONFIG.DIAMOND as Hex, amount],
    });

    if (!tx) throw new Error('Failed to send approval transaction');
    return tx;
  };


  return {
    // allowance,
    // checkAllowance,
    requestAllowance,
  };
};

export const handleTransactionError = (error: unknown): { message: string; type: string } => {
  if (error instanceof Error) {
    if (error.message.includes('rejected') || error.message.includes('user declined')) {
      return {
        message: 'Transaction was rejected by user',
        type: 'user_rejected',
      };
    }

    if (error.message.includes('insufficient funds')) {
      return {
        message: 'Insufficient funds for transaction',
        type: 'insufficient_funds',
      };
    }

    if (error.message.includes('network') || error.message.includes('connection')) {
      return {
        message: 'Network error occurred. Please try again',
        type: 'network_error',
      };
    }

    return {
      message: error.message,
      type: 'unknown',
    };
  }

  return {
    message: 'An unknown error occurred',
    type: 'unknown',
  };
};

// Token decimal configuration per chain
export const TOKEN_DECIMALS: Record<number, Record<string, number>> = {
  [sei.id]: {
    USDC: 6,
    CRD: 18,
  },
  // Add other chains here
};

// Default token decimals for tokens not in specific chains
export const DEFAULT_TOKEN_DECIMALS: Record<string, number> = {
  USDC: 6,
  CRD: 18,
  FDCRD: 18,
};

// Default token symbol from env or fallback to USDC
export const DEFAULT_TOKEN_SYMBOL = SERVER_CONFIG.DEFAULT_TOKEN_SYMBOL || 'USDC';

/**
 * Get token decimals based on chain ID and symbol
 * @param chainId - The chain ID
 * @param symbol - Optional token symbol
 * @returns number of decimals for the token
 */
export const getTokenDecimals = (chainId: number, symbol?: string): number => {
  if (symbol) {
    // First check chain-specific decimals
    const chainDecimals = TOKEN_DECIMALS[chainId]?.[symbol];
    if (chainDecimals !== undefined) {
      return chainDecimals;
    }
    // Fall back to default decimals
    return DEFAULT_TOKEN_DECIMALS[symbol] || 18;
  }

  // If no symbol provided, use chain default or env default
  const defaultSymbol = chainId === sei.id ? 'CRD' : DEFAULT_TOKEN_SYMBOL;
  return getTokenDecimals(chainId, defaultSymbol);
};

/**
 * Parse token amount with correct decimals
 * @param amount - Amount as string
 * @param chainId - The chain ID
 * @param symbol - Optional token symbol
 * @returns parsed amount as bigint
 */
export const parseTokenAmount = (amount: string, chainId: number, symbol?: string): bigint => {
  const decimals = getTokenDecimals(chainId, symbol);
  return parseUnits(amount, decimals);
};

/**
 * Format token amount with correct decimals
 * @param amount - Amount as bigint
 * @param chainId - The chain ID
 * @param symbol - Optional token symbol
 * @returns formatted amount as string
 */
export const formatTokenAmount = (amount: bigint, chainId?: number, symbol?: string): string => {
  const decimals = chainId ? getTokenDecimals(chainId, symbol) : 18;
  return formatUnits(amount, decimals);
};
