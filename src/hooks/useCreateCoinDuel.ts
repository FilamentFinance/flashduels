import { FlashDuelCoreFaucetAbi } from '@/abi/FlashDualCoreFaucet';
import { SERVER_CONFIG } from '@/config/server-config';
import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError, useTokenApproval } from '@/utils/token';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';

// export const REQUIRED_CREATE_DUEL_USDC = BigInt(5 * 10 ** 6);
export const REQUIRED_CREATE_DUEL_USDC = BigInt(5 * 10 ** 18); // crd 18
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
  duelId: string;
  createdAt: number;
  success: boolean;
  error?: string;
}

const useCreateCoinDuel = () => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [approvalHash, setApprovalHash] = useState<Hex | undefined>(undefined);
  const { toast } = useToast();
  // const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  // const { checkAllowance, requestAllowance } = useTokenApproval(address);
  const { requestAllowance } = useTokenApproval();
  const publicClient = usePublicClient();

  // Watch approval transaction
  const { isLoading: isApprovalMining, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
      chainId: SEI_TESTNET_CHAIN_ID,
    });

  // Watch duel creation transaction
  const { isLoading: isDuelMining, isSuccess: isDuelSuccess } = useWaitForTransactionReceipt({
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
    return { success: false, error: message, duelId: '', createdAt: 0 };
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
        address: SERVER_CONFIG.DIAMOND as Hex,
        abi: FlashDuelCoreFaucetAbi,
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
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      });
      const logs = await publicClient?.getLogs({
        fromBlock: receipt?.blockNumber,
        toBlock: receipt?.blockNumber,
        address: SERVER_CONFIG.DIAMOND as Hex,
      });
      let duelId: string | undefined;
      let createdAt: number | undefined;
      logs?.forEach((log) => {
        try {
          if (!log || !log.topics || !log.data) {
            throw new Error('Invalid log format');
          }
          const iface = new ethers.Interface(FlashDuelCoreFaucetAbi);
          const decodedLog = iface.parseLog(log);

          if (decodedLog?.name === "CryptoDuelCreated") {
            duelId = decodedLog.args[2];
            createdAt = Number(decodedLog.args[3]);
          }
        } catch (error) {
          console.log("Error decoding log from provider:", error, log);
        }
      });
      return { duelId: duelId as string, createdAt: createdAt as number, success: receipt?.status === 'success' };
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

      // const hasAllowance = await checkAllowance();
      const hasAllowance = false;

      if (!hasAllowance) {
        setStatus(TRANSACTION_STATUS.APPROVAL_NEEDED);
        const approvalTx = await requestAllowance(REQUIRED_CREATE_DUEL_USDC);
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
