import { useToast } from '@/shadcn/components/ui/use-toast';
import { useState } from 'react';
import { decodeEventLog, formatUnits, Hex, Log, parseUnits } from 'viem';
import { usePublicClient, useReadContract, useWriteContract } from 'wagmi';

import { FlashDuelsMarketplaceFacet } from '@/abi/FlashDuelsMarketplaceFacet';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { SERVER_CONFIG } from '@/config/server-config';
import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';

interface UseSellOrderReturn {
  sellOrder: () => Promise<{ success: boolean; sellId?: number; amount?: number; error?: string }>;
  txHash?: Hex;
  status: string;
  error: string | null;
  isReading: boolean;
}

type SaleCreatedEventArgs = [
  saleId: bigint,
  seller: Hex,
  token: Hex,
  quantity: bigint,
  totalPrice: bigint,
  saleTime: bigint,
];

const useSellOrder = (
  duelId: string,
  optionIndex: number,
  quantity: string,
  price: string,
): UseSellOrderReturn => {
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [status, setStatus] = useState<string>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const publicClient = usePublicClient();

  const { data: optionTokenAddress, isLoading: isReading } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getOptionIndexToOptionToken',
    address: SERVER_CONFIG.DIAMOND as Hex,
    chainId: SEI_TESTNET_CHAIN_ID,
    args: [duelId, optionIndex],
  });

  const { writeContractAsync: sellAsync } = useWriteContract();

  const sellOrder = async (): Promise<{
    success: boolean;
    sellId?: number;
    amount?: number;
    error?: string;
  }> => {
    try {
      setStatus(TRANSACTION_STATUS.PENDING);
      setError(null);
      if (!optionTokenAddress) {
        throw new Error('Option token address not available');
      }
      const quantityInWei = parseUnits(quantity, 18).toString();
      const totalValue = Number(price) * Number(quantity);
      const totalUSDCFormatted = parseUnits(totalValue.toString(), 6).toString();
      const tx = await sellAsync({
        abi: FlashDuelsMarketplaceFacet,
        address: SERVER_CONFIG.DIAMOND as Hex,
        functionName: 'sell',
        chainId: SEI_TESTNET_CHAIN_ID,
        args: [optionTokenAddress, duelId, optionIndex, quantityInWei, totalUSDCFormatted],
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

      let sellId: number | undefined;
      let amountFilled: number | undefined;

      const saleCreatedEvent = receipt.logs.find((log: Log) => {
        try {
          const event = decodeEventLog({
            abi: FlashDuelsMarketplaceFacet,
            data: log.data,
            topics: log.topics,
          });
          return event.eventName === 'SaleCreated';
        } catch {
          return false;
        }
      });

      if (saleCreatedEvent) {
        const decodedEvent = decodeEventLog({
          abi: FlashDuelsMarketplaceFacet,
          data: saleCreatedEvent.data,
          topics: saleCreatedEvent.topics,
        });

        if (decodedEvent.eventName === 'SaleCreated') {
          const [saleIdBigInt, , , , totalPriceBigInt] = decodedEvent.args as SaleCreatedEventArgs;
          sellId = Number(saleIdBigInt);
          amountFilled = Number(formatUnits(totalPriceBigInt, 6));
        }
      }

      setStatus(TRANSACTION_STATUS.SUCCESS);
      toast({
        title: 'Sell Order Placed',
        description: 'Sell order placed successfully.',
      });
      return { success: true, sellId, amount: amountFilled };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error(errorMessage);
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
    sellOrder,
    txHash,
    status,
    error,
    isReading,
  };
};

export default useSellOrder;
