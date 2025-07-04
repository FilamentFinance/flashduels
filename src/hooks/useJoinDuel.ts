// import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError, useTokenApproval } from '@/utils/token';
import { useState } from 'react';
import { Hex } from 'viem';
import { usePublicClient, useWaitForTransactionReceipt, useChainId } from 'wagmi';

const useJoinDuel = () => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(undefined);
  // const [currentAmount, setCurrentAmount] = useState<bigint>(BigInt(0));

  const { toast } = useToast();
  // const { address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  // const { checkAllowance, requestAllowance } = useTokenApproval(address, currentAmount);
  const { requestAllowance } = useTokenApproval();
  // Watch approval transaction
  const { isLoading: isApprovalMining, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
      chainId: chainId,
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

  const joinDuel = async (amount: bigint): Promise<{ success: boolean; error?: string }> => {
    try {
      setStatus(TRANSACTION_STATUS.CHECKING_ALLOWANCE);
      setError(null);
      setApprovalHash(undefined);

      const hasAllowance = false;

      if (!hasAllowance) {
        setStatus(TRANSACTION_STATUS.APPROVAL_NEEDED);
        const approvalTx = await requestAllowance(amount);
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
          description: 'Token allowance increased successfully',
        });
      }

      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  };

  return {
    joinDuel,
    status,
    error,
    approvalHash,
    isApprovalMining,
    isApprovalSuccess,
  };
};

export default useJoinDuel;
