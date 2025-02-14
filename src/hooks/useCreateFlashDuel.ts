import { FlashDualCoreFaucetAbi } from '@/abi/FlashDualCoreFaucet';
import { TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError, useTokenApproval } from '@/utils/token';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

interface CreateFlashDuelParams {
  topic: string;
  category: number;
  duration: number;
  options: string[];
}
const CONTRACT_ADDRESS = '0x82f8b57891C7EC3c93ABE194dB80e4d8FC931F09' as Hex;

const CHAIN_ID = 1328;
const useCreateFlashDuel = () => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(undefined);
  const [pendingDuelParams, setPendingDuelParams] = useState<CreateFlashDuelParams | null>(null);

  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { checkAllowance, requestAllowance } = useTokenApproval(address);

  // Watch approval transaction
  const { isLoading: isApprovalMining, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
      chainId: CHAIN_ID,
    });

  // Watch duel creation transaction
  const { isLoading: isDuelMining, isSuccess: isDuelSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: CHAIN_ID,
  });

  // Handle approval success
  useEffect(() => {
    if (isApprovalSuccess && pendingDuelParams) {
      setStatus(TRANSACTION_STATUS.APPROVAL_COMPLETE);
      toast({
        title: 'Approval Successful',
        description: 'Creating duel...',
      });
      createFlashDuelTransaction(pendingDuelParams);
    }
  }, [isApprovalSuccess]);

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
  };

  const createFlashDuelTransaction = async (params: CreateFlashDuelParams) => {
    try {
      setStatus(TRANSACTION_STATUS.CREATING_DUEL);
      const tx = await writeContractAsync({
        abi: FlashDualCoreFaucetAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'requestCreateDuel',
        chainId: CHAIN_ID,
        args: [params.category, params.topic, params.options, params.duration],
      });

      if (!tx) throw new Error('Failed to send duel creation transaction');

      setTxHash(tx);
      setStatus(TRANSACTION_STATUS.DUEL_MINING);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const createFlashDuel = async (params: CreateFlashDuelParams) => {
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
        setApprovalHash(approvalTx);
        setStatus(TRANSACTION_STATUS.APPROVAL_MINING);
      } else {
        await createFlashDuelTransaction(params);
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  return {
    status,
    error,
    txHash,
    approvalHash,
    isApprovalMining,
    isDuelMining,
    createFlashDuel,
  };
};

export default useCreateFlashDuel;
