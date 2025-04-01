import { FlashDuelsMarketplaceFacet } from '@/abi/FlashDuelsMarketplaceFacet';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { SERVER_CONFIG } from '@/config/server-config';
// import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { useState } from 'react';
import { Hex } from 'viem';
import { sei, seiTestnet } from 'viem/chains';
import { usePublicClient, useWriteContract } from 'wagmi';

interface UseOrderReturn {
  cancelSell: (
    duelId: string,
    betOptionIndex: number,
    sellId: number,
  ) => Promise<{ success: boolean; error?: string }>;
  txHash?: Hex;
  status: string;
  error: string | null;
}

const useCancelOrder = (): UseOrderReturn => {
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [status, setStatus] = useState<string>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const cancelSell = async (
    duelId: string,
    betOptionIndex: number,
    sellId: number,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setStatus(TRANSACTION_STATUS.PENDING);
      setError(null);

      // Get the option token address
      const optionTokenAddress = await publicClient?.readContract({
        abi: FlashDuelsViewFacetABI,
        address: SERVER_CONFIG.DIAMOND as Hex,
        functionName: 'getOptionIndexToOptionToken',
        args: [duelId, betOptionIndex],
      });

      if (!optionTokenAddress) {
        throw new Error('Option token address not available');
      }

      const tx = await writeContractAsync({
        abi: FlashDuelsMarketplaceFacet,
        address: SERVER_CONFIG.DIAMOND as Hex,
        functionName: 'cancelSell',
        chainId: SERVER_CONFIG.PRODUCTION ? sei.id : seiTestnet.id,
        args: [optionTokenAddress, sellId],
      });

      if (!tx) {
        throw new Error('Transaction failed to send');
      }

      setTxHash(tx);

      // Wait for transaction receipt.
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      });

      if (receipt?.status !== 'success') {
        throw new Error('Transaction did not succeed');
      }

      setStatus(TRANSACTION_STATUS.SUCCESS);
      toast({
        title: 'Order Cancelled',
        description: 'Order cancelled successfully.',
      });

      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('cancelSell error:', errorMessage);
      setError(errorMessage);
      setStatus(TRANSACTION_STATUS.FAILED);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    cancelSell,
    txHash,
    status,
    error,
  };
};

export default useCancelOrder;
