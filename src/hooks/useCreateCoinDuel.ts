import { FlashDualCoreFaucetAbi } from '@/abi/FlashDualCoreFaucet';
import { TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError, useTokenApproval } from '@/utils/token';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

interface CreateCoinDuelParams {
  symbol: string;
  options: string[];
  minWager: number;
  triggerPrice: number;
  triggerType: number;
  winCondition: number;
  durationNumber: number;
}

interface CreateCoinDuelResult {
  success: boolean;
  error?: string;
}

const CONTRACT_ADDRESS = '0x82f8b57891C7EC3c93ABE194dB80e4d8FC931F09' as Hex;

const useCreateCoinDuel = () => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(undefined);
  const [pendingDuelParams, setPendingDuelParams] = useState<CreateCoinDuelParams | null>(null);

  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { checkAllowance, requestAllowance } = useTokenApproval(address);
  const publicClient = usePublicClient();

  // Watch approval transaction
  const { isLoading: isApprovalMining, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
      chainId: 1328,
    });

  // Watch duel creation transaction
  const { isLoading: isDuelMining, isSuccess: isDuelSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: 1328,
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

  const createCryptoDuel = async (params: CreateCoinDuelParams): Promise<CreateCoinDuelResult> => {
    try {
      setStatus(TRANSACTION_STATUS.CREATING_DUEL);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: FlashDualCoreFaucetAbi,
        functionName: 'requestCreateCryptoDuel',
        args: [
          params.symbol,
          params.options,
          params.triggerPrice,
          params.triggerType,
          params.winCondition,
          params.durationNumber,
        ],
      });

      if (!tx) throw new Error('Failed to send duel creation transaction');

      setTxHash(tx);
      setStatus(TRANSACTION_STATUS.DUEL_MINING);

      // Wait for transaction to be mined
      const isSuccess = await waitForTransaction(tx);
      return { success: isSuccess };
    } catch (error) {
      return handleError(error);
    }
  };

  const createCoinDuel = async (params: CreateCoinDuelParams): Promise<CreateCoinDuelResult> => {
    try {
      setStatus(TRANSACTION_STATUS.CHECKING_ALLOWANCE);
      setError(null);
      setTxHash(undefined);
      setApprovalHash(undefined);
      setPendingDuelParams(params);

      const hasAllowance = await checkAllowance();

      if (!hasAllowance) {
        setStatus(TRANSACTION_STATUS.APPROVAL_NEEDED);
        const approvalTx = await requestAllowance();
        if (!approvalTx) throw new Error('Failed to send approval transaction');

        setApprovalHash(approvalTx);
        setStatus(TRANSACTION_STATUS.APPROVAL_MINING);

        // Wait for approval transaction to be mined
        const isApprovalSuccess = await waitForTransaction(approvalTx);
        if (!isApprovalSuccess) {
          throw new Error('Approval failed');
        }

        setStatus(TRANSACTION_STATUS.APPROVAL_COMPLETE);
        toast({
          title: 'Approval Successful',
          description: 'Creating duel...',
        });
      }

      // Create the duel after approval (or if already approved)
      return await createCryptoDuel(params);
    } catch (error) {
      return handleError(error);
    }
  };

  // Handle duel success
  useEffect(() => {
    if (isDuelSuccess) {
      setStatus(TRANSACTION_STATUS.DUEL_COMPLETE);
      toast({
        title: 'Success',
        description: 'Duel created successfully',
      });
      setPendingDuelParams(null);
    }
  }, [isDuelSuccess]);

  return {
    status,
    error,
    txHash,
    approvalHash,
    isApprovalMining,
    isDuelMining,
    isApprovalSuccess,
    isDuelSuccess,
    createCoinDuel,
  };
};

export default useCreateCoinDuel;
