import { FlashDuelCoreFaucetAbi } from '@/abi/FlashDualCoreFaucet';
import { SERVER_CONFIG } from '@/config/server-config';
// import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError, useTokenApproval } from '@/utils/token';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract, useChainId } from 'wagmi';
import { REQUIRED_CREATE_DUEL_USDC } from './useCreateCoinDuel';

interface CreateFlashDuelParams {
  topic: string;
  category: number;
  duration: number;
  options: string[];
}

const useCreateFlashDuel = () => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [approvalHash, setApprovalHash] = useState<Hex | undefined>(undefined);
  const [pendingDuelParams, setPendingDuelParams] = useState<CreateFlashDuelParams | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { toast } = useToast();
  // const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  // const { checkAllowance, requestAllowance } = useTokenApproval(address);
  const { requestAllowance } = useTokenApproval();
  const chainId = useChainId();

  // Watch approval transaction
  const { isLoading: isApprovalMining, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
      chainId: chainId,
    });

  // Watch duel creation transaction
  // const { isLoading: isDuelMining, isSuccess: isDuelSuccess } = useWaitForTransactionReceipt({
  //   hash: txHash,
  //   chainId: chainId,
  // });

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
  }, [isApprovalSuccess, pendingDuelParams]);


  // Watch duel creation transaction
  const { isLoading: isDuelMining, isSuccess: isDuelSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: chainId,
  });
  // Handle duel success
  useEffect(() => {
    if (isDuelSuccess) {
      setStatus(TRANSACTION_STATUS.DUEL_COMPLETE);
      setIsComplete(true);
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
        abi: FlashDuelCoreFaucetAbi,
        address: SERVER_CONFIG.DIAMOND as Hex,
        functionName: 'requestCreateDuel',
        chainId: chainId,
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
      setStatus(TRANSACTION_STATUS.APPROVAL_NEEDED);
      setError(null);
      setTxHash(undefined);
      setApprovalHash(undefined);
      setPendingDuelParams(params);


      const approvalTx = await requestAllowance(REQUIRED_CREATE_DUEL_USDC);
      setApprovalHash(approvalTx);
      setStatus(TRANSACTION_STATUS.APPROVAL_MINING);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const isDuelComplete = () => {
    return isDuelSuccess;
  };

  return {
    status,
    error,
    txHash,
    approvalHash,
    isApprovalMining,
    isDuelMining,
    createFlashDuel,
    isDuelComplete,
    isComplete,
  };
};

export default useCreateFlashDuel;
