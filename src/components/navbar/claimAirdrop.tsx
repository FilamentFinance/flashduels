/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState, useEffect } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { SERVER_CONFIG } from '@/config/server-config';
// import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError } from '@/utils/token';
// import { createWalletClient, formatUnits, Hex, http, parseUnits } from 'viem';
import { formatUnits, Hex } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import { sei, seiTestnet } from 'viem/chains';
import { CREDITS } from '@/abi/CREDITS';

const ClaimAirdropButton: FC = () => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  // const [error, setError] = useState<string | null>(null);
  // const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [creditsBalance, setCreditsBalance] = useState<string>('0');
  const [claimedAmount, setClaimedAmount] = useState<string>('');
  const { toast } = useToast();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  // const { isLoading: isClaiming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
  //   hash: txHash,
  //   chainId: SERVER_CONFIG.PRODUCTION ? sei.id : seiTestnet.id,
  // });

  useEffect(() => {
    const checkClaimedAmount = async () => {
      if (!address) return;
      try {
        // Check credits balance
        const credits = await publicClient?.readContract({
          abi: CREDITS,
          address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
          functionName: 'credits',
          args: [address.toLowerCase()],
        });
        setCreditsBalance(credits?.toString() || '0');

        // Check total claimed amount
        const claimed = await publicClient?.readContract({
          abi: CREDITS,
          address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
          functionName: 'totalClaimed',
          args: [address.toLowerCase()],
        });

        if (claimed && claimed.toString() !== '0') {
          setClaimedAmount(claimed.toString());
          setStatus(TRANSACTION_STATUS.SUCCESS);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    checkClaimedAmount();
  }, [address, publicClient]);

  const handleError = (error: unknown) => {
    const { message, type } = handleTransactionError(error);
    console.error('Transaction error:', { message, type });
    // setError(message);
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

  const handleClaimAirdrop = async () => {
    if (!address) {
      console.error('No address found');
      return;
    }

    try {
      setStatus(TRANSACTION_STATUS.PENDING);
      // setError(null);
      // setTxHash(undefined);
      setClaimedAmount('');

      // Get initial credits balance
      const initialCredits = await publicClient?.readContract({
        abi: CREDITS,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        functionName: 'credits',
        args: [address.toLowerCase()],
      });

      const tx = await writeContractAsync({
        abi: CREDITS,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        functionName: 'claim',
        args: [],
      });

      if (!tx) {
        throw new Error('Failed to send claim transaction');
      }

      // setTxHash(tx);
      setStatus(TRANSACTION_STATUS.PENDING);

      const isClaimSuccess = await waitForTransaction(tx);
      if (!isClaimSuccess) {
        throw new Error('Claim transaction failed');
      }

      // Get final credits balance
      const finalCredits: any = await publicClient?.readContract({
        abi: CREDITS,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        functionName: 'totalClaimed',
        args: [address.toLowerCase()],
      });
      setClaimedAmount(finalCredits);

      setStatus(TRANSACTION_STATUS.SUCCESS);
      toast({
        title: 'Claim Successful',
        description: `${formatUnits(BigInt(finalCredits), 18)} CRD claimed successfully`,
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-2 bg-zinc-900 rounded-xl border border-zinc-800">
      {status !== TRANSACTION_STATUS.SUCCESS && (
        <span>{formatUnits(BigInt(creditsBalance), 18)} CRD</span>
      )}
      <Button
        onClick={handleClaimAirdrop}
        variant="pink"
        size="sm"
        className="text-black font-bold"
        disabled={status === TRANSACTION_STATUS.PENDING || status === TRANSACTION_STATUS.SUCCESS}
      >
        {status === TRANSACTION_STATUS.PENDING
          ? 'Claiming...'
          : status === TRANSACTION_STATUS.SUCCESS
            ? `${formatUnits(BigInt(claimedAmount), 18)} CRD Claimed 🎉`
            : 'Claim'}
      </Button>
    </div>
  );
};

export default ClaimAirdropButton;
