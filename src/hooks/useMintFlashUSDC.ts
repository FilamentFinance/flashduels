import { FLASHUSDC } from '@/abi/FLASHUSDC';
import { SERVER_CONFIG } from '@/config/server-config';
import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError } from '@/utils/token';
import { useState } from 'react';
import { createWalletClient, Hex, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { seiTestnet } from 'viem/chains';
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

interface UseMintFlashUSDCReturn {
  mintFlashUSDC: () => Promise<{ success: boolean; error?: string }>;
  txHash?: Hex;
  status: string;
  error: string | null;
  isMinting: boolean;
  isMintSuccess: boolean;
}

const useMintFlashUSDC = (): UseMintFlashUSDCReturn => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const account = privateKeyToAccount(SERVER_CONFIG.BOT_PRIVATE_KEY as Hex);
  const walletClient = createWalletClient({
    account,
    chain: seiTestnet, // Or any other chain you want to use
    transport: http(),
  });

  const { toast } = useToast();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  // Watch mint transaction
  const { isLoading: isMinting, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: SEI_TESTNET_CHAIN_ID,
  });

  const handleError = (error: unknown) => {
    const { message, type } = handleTransactionError(error);
    console.error('Transaction error:', { message, type });
    setError(message);
    setStatus(TRANSACTION_STATUS.FAILED);
    toast({
      title: type === 'user_rejected' ? 'Transaction rejected' : 'Error',
      description: message,
      variant: 'destructive',
    });
    return { success: false, error: message };
  };

  const waitForTransaction = async (hash: Hex): Promise<boolean> => {
    try {
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });
      return receipt?.status === 'success';
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      return false;
    }
  };

  const mintFlashUSDC = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setStatus(TRANSACTION_STATUS.PENDING);
      setError(null);
      setTxHash(undefined);

      // Execute mint transaction
      const tx = await walletClient.writeContract({
        abi: FLASHUSDC,
        address: SERVER_CONFIG.FLASH_USDC as Hex,
        functionName: 'faucetMint',
        args: [address],
      });

      // If you need the transaction receipt
      if (!tx) {
        throw new Error('Failed to send mint transaction');
      }

      setTxHash(tx);
      setStatus(TRANSACTION_STATUS.MINTING);

      // Wait for mint transaction to be mined
      const isMintSuccess = await waitForTransaction(tx);
      if (!isMintSuccess) {
        throw new Error('Mint transaction failed');
      }

      setStatus(TRANSACTION_STATUS.SUCCESS);
      toast({
        title: 'Mint Successful',
        description: 'FlashUSDC tokens minted successfully',
      });

      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  };

  return {
    mintFlashUSDC,
    status,
    error,
    txHash,
    isMinting,
    isMintSuccess,
  };
};

export default useMintFlashUSDC;
