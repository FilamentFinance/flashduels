import { FlashDuelsMarketplaceFacet } from '@/abi/FlashDuelsMarketplaceFacet';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { SERVER_CONFIG } from '@/config/server-config';
// import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { mapCategoryToEnumIndex } from '@/utils/general/create-duels';
import { useState } from 'react';
import { Hex } from 'viem';
import { usePublicClient, useWriteContract, useAccount, useChainId } from 'wagmi';

interface UseBuyOrderReturn {
  buyOrder: (
    sellId: number,
    index: number,
    betOptionIndex: number,
  ) => Promise<{ success: boolean; error?: string }>;
  txHash?: Hex;
  status: string;
  error: string | null;
  isReading: boolean;
}

const useBuyOrder = (duelId: string, category: string): UseBuyOrderReturn => {
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [status, setStatus] = useState<string>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const chainId = useChainId();

  const buyOrder = async (
    sellId: number,
    index: number,
    betOptionIndex: number,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      setStatus(TRANSACTION_STATUS.PENDING);
      setError(null);
      const DIAMOND_ADDRESS = SERVER_CONFIG.getContractAddresses(chainId).DIAMOND;
      // Get option token address using publicClient instead of hook
      const optionTokenAddress = await publicClient?.readContract({
        abi: FlashDuelsViewFacetABI,
        functionName: 'getOptionIndexToOptionToken',
        address: DIAMOND_ADDRESS as Hex,
        args: [duelId, index],
      });

      if (!optionTokenAddress) {
        throw new Error('Option token address not available');
      }

      const tx = await writeContractAsync({
        abi: FlashDuelsMarketplaceFacet,
        address: DIAMOND_ADDRESS as Hex,
        functionName: 'buy',
        chainId: chainId,
        args: [
          duelId,
          address,
          mapCategoryToEnumIndex(category),
          optionTokenAddress,
          betOptionIndex,
          [sellId],
          [1],
        ],
      });

      if (!tx) {
        throw new Error('Transaction failed to send');
      }

      setTxHash(tx);

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      });

      if (receipt?.status !== 'success') {
        throw new Error('Transaction did not succeed');
      }

      setStatus(TRANSACTION_STATUS.SUCCESS);
      toast({
        title: 'Order Purchased',
        description: 'Buy order placed successfully.',
      });
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Buy order error:', errorMessage);
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
    buyOrder,
    txHash,
    status,
    error,
    isReading: false,
  };
};

export default useBuyOrder;
