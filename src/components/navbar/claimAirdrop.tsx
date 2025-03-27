/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { useAccount, usePublicClient, useWaitForTransactionReceipt } from 'wagmi';
import { FLASHDUELS_CREDITS_ABI } from '@/abi/FlashDuelCredit';
import { SERVER_CONFIG } from '@/config/server-config';
import { SEI_TESTNET_CHAIN_ID, TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError } from '@/utils/token';
import { createWalletClient, Hex, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { seiTestnet } from 'viem/chains';


const ClaimAirdropButton: FC = () => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const { toast } = useToast();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const account = privateKeyToAccount(SERVER_CONFIG.BOT_PRIVATE_KEY as Hex);
  const walletClient = createWalletClient({
    account,
    chain: seiTestnet,
    transport: http(),
  });

  const { isLoading: isClaiming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
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
      setError(null);
      setTxHash(undefined);

      // before claiming log the user's credits once
      const credits = await publicClient?.readContract({
        abi: FLASHDUELS_CREDITS_ABI,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        functionName: 'credits',
        args: [address],
      });
      console.log('User credits before claiming:', credits?.toString());

      const tx = await walletClient.writeContract({
        abi: FLASHDUELS_CREDITS_ABI,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        functionName: 'claim',
        args: [],
      });

      if (!tx) {
        throw new Error('Failed to send claim transaction');
      }

      setTxHash(tx);
      setStatus(TRANSACTION_STATUS.PENDING);

      const isClaimSuccess = await waitForTransaction(tx);
      if (!isClaimSuccess) {
        throw new Error('Claim transaction failed');
      }

      setStatus(TRANSACTION_STATUS.SUCCESS);
      toast({
        title: 'Claim Successful',
        description: 'Airdrop claimed successfully',
      });

    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Button onClick={handleClaimAirdrop} 
    // className="rounded-default bg-glass hover:bg-glass-hover border border-zinc-800 transition-colors duration-200 hover:shadow-lg">
    className="font-semibold bg-gradient-pink text-black opacity-100 
        border border-pink-300
        hover:shadow-lg hover:scale-[1.02]">
      Claim CRE Airdrop
    </Button>
  );
};

export default ClaimAirdropButton;
