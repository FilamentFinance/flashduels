import { FlashDuelsMarketplaceFacet } from '@/abi/FlashDuelsMarketplaceFacet';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { OptionTokenABI } from '@/abi/OptionToken';
import { SERVER_CONFIG } from '@/config/server-config';
import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { useState } from 'react';
import type { Hex } from 'viem';
import { decodeEventLog, formatUnits, parseUnits } from 'viem';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

interface UseSellOrderReturn {
  sellOrder: () => Promise<{ success: boolean; sellId?: number; amount?: number; error?: string }>;
  txHash?: Hex;
  status: TransactionStatusType;
  error: string | null;
  isReading: boolean;
  approvalHash?: Hex;
  isApprovalMining: boolean;
  isSellMining: boolean;
}

type SaleCreatedEventArgs = {
  saleId: bigint;
  seller: Hex;
  token: Hex;
  quantity: bigint;
  totalPrice: bigint;
  saleTime: bigint;
};

const useSellOrder = (
  duelId: string,
  optionIndex: number,
  quantity: string,
  price: string,
): UseSellOrderReturn => {
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [approvalHash, setApprovalHash] = useState<Hex | undefined>(undefined);
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const { data: optionTokenAddress, isLoading: isReading } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getOptionIndexToOptionToken',
    address: SERVER_CONFIG.DIAMOND as Hex,
    chainId: SEI_TESTNET_CHAIN_ID,
    args: [duelId, optionIndex],
  });

  const { writeContractAsync: approveAsync } = useWriteContract();
  const { writeContractAsync: sellAsync } = useWriteContract();

  // Watch approval transaction
  const { isLoading: isApprovalMining } = useWaitForTransactionReceipt({
    hash: approvalHash,
    chainId: SEI_TESTNET_CHAIN_ID,
  });

  // Watch sell transaction
  const { isLoading: isSellMining } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: SEI_TESTNET_CHAIN_ID,
  });

  const handleError = (error: unknown) => {
    let message: string;
    let type: string = 'unknown';

    if (error instanceof Error) {
      message = error.message;
      // Check for user rejection
      if (message.includes('User rejected') || message.includes('User denied')) {
        type = 'user_rejected';
      }
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = 'An unknown error occurred';
    }

    console.error('Sell order error:', { message, type });
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

  const sellOrder = async (): Promise<{
    success: boolean;
    sellId?: number;
    amount?: number;
    error?: string;
  }> => {
    try {
      setStatus(TRANSACTION_STATUS.PENDING);
      setError(null);
      setTxHash(undefined);
      setApprovalHash(undefined);

      if (!optionTokenAddress || !address) {
        throw new Error('Option token address or user address not available');
      }

      // Convert quantity to wei (18 decimals)
      const quantityInWei = parseUnits(quantity, 18);

      // Calculate total value in USDC (6 decimals)
      const totalValue = parseUnits((Number(price) * Number(quantity)).toString(), 6);

      // Check current allowance
      const allowanceResult = await publicClient?.readContract({
        address: optionTokenAddress as Hex,
        abi: OptionTokenABI,
        functionName: 'allowance',
        args: [address, SERVER_CONFIG.DIAMOND],
      });

      const allowance = BigInt(allowanceResult as unknown as string);

      // Only request approval if current allowance is insufficient
      if (allowance < quantityInWei) {
        setStatus(TRANSACTION_STATUS.APPROVAL_NEEDED);
        const approveTx = await approveAsync({
          abi: OptionTokenABI,
          address: optionTokenAddress as Hex,
          functionName: 'approve',
          chainId: SEI_TESTNET_CHAIN_ID,
          args: [SERVER_CONFIG.DIAMOND, quantityInWei],
        });

        if (!approveTx) {
          throw new Error('Failed to approve token transfer');
        }

        setApprovalHash(approveTx);
        setStatus(TRANSACTION_STATUS.APPROVAL_MINING);

        const isApprovalSuccess = await waitForTransaction(approveTx);
        if (!isApprovalSuccess) {
          throw new Error('Token approval failed');
        }

        setStatus(TRANSACTION_STATUS.APPROVAL_COMPLETE);
        toast({
          title: 'Approval Successful',
          description: 'Creating sell order...',
        });
      }

      // Execute the sell
      setStatus(TRANSACTION_STATUS.CREATING_DUEL);
      const sellTx = await sellAsync({
        abi: FlashDuelsMarketplaceFacet,
        address: SERVER_CONFIG.DIAMOND as Hex,
        functionName: 'sell',
        chainId: SEI_TESTNET_CHAIN_ID,
        args: [optionTokenAddress, duelId, optionIndex, quantityInWei, totalValue],
      });

      if (!sellTx) {
        throw new Error('Transaction failed to send');
      }

      setTxHash(sellTx);
      setStatus(TRANSACTION_STATUS.DUEL_MINING);

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: sellTx,
        confirmations: 1,
      });

      if (receipt?.status !== 'success') {
        throw new Error('Transaction did not succeed');
      }

      // Find and decode the SaleCreated event
      for (const log of receipt.logs) {
        try {
          // Check if this log is from our contract
          if (log.address.toLowerCase() === SERVER_CONFIG.DIAMOND.toLowerCase()) {
            const decodedEvent = decodeEventLog({
              abi: FlashDuelsMarketplaceFacet,
              data: log.data,
              topics: log.topics,
            });

            if (decodedEvent.eventName === 'SaleCreated') {
              console.log('Found SaleCreated event:', decodedEvent);

              // Cast the event args to our expected type
              const args = decodedEvent.args as unknown as SaleCreatedEventArgs;
              const { saleId, totalPrice } = args;

              if (!saleId || !totalPrice) {
                console.error('Required event args are missing:', { saleId, totalPrice });
                continue;
              }

              const amountFilled = Number(formatUnits(totalPrice, 6));

              setStatus(TRANSACTION_STATUS.DUEL_COMPLETE);
              toast({
                title: 'Success',
                description: 'Sell order placed successfully.',
              });

              return {
                success: true,
                sellId: Number(saleId),
                amount: amountFilled,
              };
            }
          }
        } catch (error) {
          console.error('Error decoding log:', error);
          continue;
        }
      }

      throw new Error('SaleCreated event not found in transaction logs');
    } catch (err: unknown) {
      return handleError(err);
    }
  };

  return {
    sellOrder,
    txHash,
    status,
    error,
    isReading,
    approvalHash,
    isApprovalMining,
    isSellMining,
  };
};

export default useSellOrder;
