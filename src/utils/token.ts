import { FLASHUSDC } from '@/abi/FLASHUSDC';
import { SERVER_CONFIG } from '@/config/server-config';
import { SEI_TESTNET_CHAIN_ID } from '@/constants/app';
import { Hex } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

export const REQUIRED_ALLOWANCE = BigInt(5 * 10 ** 6);

export const useTokenApproval = (address: Hex | undefined, amount?: bigint) => {
  const { writeContractAsync } = useWriteContract();

  const { data: allowance } = useReadContract({
    abi: FLASHUSDC,
    address: SERVER_CONFIG.FLASH_USDC as Hex,
    functionName: 'allowance',
    args: [address, SERVER_CONFIG.DIAMOND as Hex],
    chainId: SEI_TESTNET_CHAIN_ID,
  }) as { data: bigint | undefined };

  const checkAllowance = async () => {
    const currentAllowance = allowance || BigInt(0);
    return currentAllowance >= (amount || REQUIRED_ALLOWANCE);
  };

  const requestAllowance = async () => {
    const tx = await writeContractAsync({
      abi: FLASHUSDC,
      address: SERVER_CONFIG.FLASH_USDC as Hex,
      functionName: 'increaseAllowance',
      chainId: SEI_TESTNET_CHAIN_ID,
      args: [SERVER_CONFIG.DIAMOND as Hex, amount || REQUIRED_ALLOWANCE],
    });

    if (!tx) throw new Error('Failed to send approval transaction');
    return tx;
  };

  return {
    allowance,
    checkAllowance,
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
