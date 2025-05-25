import { FlashDuelsMarketplaceFacet } from '@/abi/FlashDuelsMarketplaceFacet';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { OptionTokenABI } from '@/abi/OptionToken';
import { SERVER_CONFIG } from '@/config/server-config';
// import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { mapCategoryToEnumIndex } from '@/utils/general/create-duels';
import { TRANSACTION_STATUS } from '@/constants/app';
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
  useChainId,
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
  category: string,
): UseSellOrderReturn => {
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [approvalHash, setApprovalHash] = useState<Hex | undefined>(undefined);
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const DIAMOND_ADDRESS = SERVER_CONFIG.getContractAddresses(chainId).DIAMOND;
  const { data: optionTokenAddress, isLoading: isReading } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getOptionIndexToOptionToken',
    address: DIAMOND_ADDRESS as Hex,
    chainId: chainId,
    args: [duelId, optionIndex],
  });

  const { writeContractAsync: approveAsync } = useWriteContract();
  const { writeContractAsync: sellAsync } = useWriteContract();

  // Watch approval transaction
  const { isLoading: isApprovalMining } = useWaitForTransactionReceipt({
    hash: approvalHash,
    chainId: chainId,
  });

  // Watch sell transaction
  const { isLoading: isSellMining } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: chainId,
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
      // console.log('quantityin sellOrder', quantity);
      // Convert quantity to wei (18 decimals)
      const quantityInWei = parseUnits(quantity, 18);
      // console.log('quantityInWei', quantityInWei);

      // Calculate total value in USDC (6 decimals) @CRD is 18 dec
      // const totalValue = parseUnits((Number(price) * Number(quantity)).toString(), 6);
      const totalValue = parseUnits((Number(price) * Number(quantity)).toString(), 18);
      console.log('totalValue', totalValue);
      // Check current allowance
      // const allowanceResult = await publicClient?.readContract({
      //   address: optionTokenAddress as Hex,
      //   abi: OptionTokenABI,
      //   functionName: 'allowance',
      //   args: [address, SERVER_CONFIG.DIAMOND],
      // });

      // const allowance = BigInt(allowanceResult as unknown as string);
      // console.log('allowance', allowance);
      // Only request approval if current allowance is insufficient
      // if (allowance < quantityInWei) {
      setStatus(TRANSACTION_STATUS.APPROVAL_NEEDED);
      const approveTx = await approveAsync({
        abi: OptionTokenABI,
        address: optionTokenAddress as Hex,
        functionName: 'approve',
        chainId: chainId,
        args: [SERVER_CONFIG.getContractAddresses(chainId).DIAMOND, quantityInWei],
      });
      console.log('approveTx', approveTx);
      if (!approveTx) {
        throw new Error('Failed to approve token transfer');
      }

      setApprovalHash(approveTx);
      setStatus(TRANSACTION_STATUS.APPROVAL_MINING);

      const isApprovalSuccess = await waitForTransaction(approveTx);
      if (!isApprovalSuccess) {
        throw new Error('Token approval failed');
      }
      // console.log('isApprovalSuccess', isApprovalSuccess);
      setStatus(TRANSACTION_STATUS.APPROVAL_COMPLETE);
      toast({
        title: 'Approval Successful',
        description: 'Creating sell order...',
      });
      // }
      // console.log('before sellAsync');
      // Execute the sell
      setStatus(TRANSACTION_STATUS.CREATING_DUEL);
      console.log('before sellTx', optionTokenAddress, duelId, optionIndex, quantityInWei, totalValue);
      // console.log('chainId', chainId);
      const sellTx = await sellAsync({
        abi: FlashDuelsMarketplaceFacet,
        address: DIAMOND_ADDRESS as Hex,
        functionName: 'sell',
        chainId: chainId,
        args: [duelId, optionTokenAddress, mapCategoryToEnumIndex(category), optionIndex, quantityInWei, totalValue],
      });

      if (!sellTx) {
        throw new Error('Transaction failed to send');
      }
      console.log('sellTx', sellTx);
      setTxHash(sellTx);
      setStatus(TRANSACTION_STATUS.DUEL_MINING);

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: sellTx,
        confirmations: 1,
      });
      console.log('receipt', receipt);
      if (receipt?.status !== 'success') {
        throw new Error('Transaction did not succeed');
      }
      // console.log('before for loop');
      // Find and decode the SaleCreated event
      for (const log of receipt.logs) {
        try {
          // Check if this log is from our contract
          if (log.address.toLowerCase() === DIAMOND_ADDRESS.toLowerCase()) {
            const decodedEvent = decodeEventLog({
              abi: FlashDuelsMarketplaceFacet,
              data: log.data,
              topics: log.topics,
            });
            // console.log('decodedEvent', decodedEvent);
            if (decodedEvent.eventName === 'SaleCreated') {
              console.log('Found SaleCreated event:', decodedEvent);

              // Cast the event args to our expected type
              const args = decodedEvent.args as unknown as SaleCreatedEventArgs;
              const { saleId, totalPrice } = args;

              if (saleId === undefined || saleId === null || totalPrice === undefined || totalPrice === null) {
                console.error('Required event args are missing:', { saleId, totalPrice });
                continue;
              }
              console.log('saleId', saleId);
              // const amountFilled = Number(formatUnits(totalPrice, 6));
              const amountFilled = Number(formatUnits(totalPrice, 18)); // CRD is 18 decimals

              setStatus(TRANSACTION_STATUS.DUEL_COMPLETE);
              toast({
                title: 'Success',
                description: 'Sell order placed successfully.',
              });
              console.log('amountFilled', amountFilled);
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
      // console.log('before throw');
      throw new Error('SaleCreated event not found in transaction logs');
    } catch (err: unknown) {
      return handleError(err);
    }
  };
  // console.log('before return.....');
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
