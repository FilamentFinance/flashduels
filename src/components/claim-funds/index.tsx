'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { LOGOS } from '@/constants/app/logos';
import { CLAIM_FUNDS } from '@/constants/content/claim-funds';
import { Button } from '@/shadcn/components/ui/button';
import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { parseEther, formatEther, Hex } from 'viem';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { sei, seiTestnet } from 'viem/chains';
import { SERVER_CONFIG } from '@/config/server-config';
import { FlashDuelCoreFaucetAbi } from '@/abi/FlashDualCoreFaucet';
// import { TRANSACTION_STATUS } from '@/constants/app';
// import { TransactionStatusType } from '@/types/app';
import { handleTransactionError } from '@/utils/token';

const symbol = SERVER_CONFIG.PRODUCTION ? 'CRD' : 'FDCRD';
const ClaimFunds: FC = () => {
  const [amount, setAmount] = useState('');
  const [earnings, setEarnings] = useState('0');
  // const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  // const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);

  const { toast } = useToast();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  // Read earnings from contract
  const { data: earningsData } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getAllTimeEarnings',
    address: SERVER_CONFIG.DIAMOND as Hex,
    args: [address],
    chainId: SERVER_CONFIG.PRODUCTION ? sei.id : seiTestnet.id,
  });

  const { isLoading: isWithdrawing } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: SERVER_CONFIG.PRODUCTION ? sei.id : seiTestnet.id,
  });

  // Update earnings when data changes
  useEffect(() => {
    if (earningsData) {
      setEarnings(formatEther(earningsData as bigint));
    }
  }, [earningsData]);

  const handleError = (error: unknown) => {
    const { message, type } = handleTransactionError(error);
    console.error('Transaction error:', { message, type });
    // setError(message);
    // setStatus(TRANSACTION_STATUS.FAILED);
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

  const handleWithdraw = async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    if (parseFloat(amount) > parseFloat(earnings)) {
      toast({
        title: 'Error',
        description: 'Amount exceeds available earnings',
        variant: 'destructive',
      });
      return;
    }

    try {
      // setStatus(TRANSACTION_STATUS.PENDING);
      // setError(null);
      setTxHash(undefined);

      const tx = await writeContractAsync({
        abi: FlashDuelCoreFaucetAbi,
        address: SERVER_CONFIG.DIAMOND as Hex,
        functionName: 'withdrawEarnings',
        args: [parseEther(amount)],
      });

      if (!tx) {
        throw new Error('Failed to send withdrawal transaction');
      }

      setTxHash(tx);
      // setStatus(TRANSACTION_STATUS.PENDING);

      const isWithdrawSuccess = await waitForTransaction(tx);
      if (!isWithdrawSuccess) {
        throw new Error('Withdrawal transaction failed');
      }

      // setStatus(TRANSACTION_STATUS.SUCCESS);
      setAmount('');
      toast({
        title: 'Withdrawal Successful',
        description: `Successfully withdrew ${amount} ${symbol}`,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input
    if (value === '') {
      setAmount('');
      return;
    }

    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      // Prevent more than one decimal point
      if ((value.match(/\./g) || []).length <= 1) {
        setAmount(value);
      }
    }
  };

  const handleMaxClick = () => {
    setAmount(earnings);
  };

  const isValidAmount = () => {
    if (amount === '') return false;
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= parseFloat(earnings);
  };

  return (
    <Dialog
      title={CLAIM_FUNDS.DIALOG.TITLE}
      maxWidth="max-w-md"
      trigger={
        <div className="inline-flex items-center gap-2 px-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <Image src="/logo/dollar.svg" alt="Funds" width={12} height={12} className="mr-2" />
          <span>
            {earnings} {symbol}
          </span>
          <Button variant="pink" size="sm" className="text-black font-bold">
            {CLAIM_FUNDS.TRIGGER.CLAIM_TEXT}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm">Available Balance:</span>
          <span className="text-white text-sm">
            {earnings} {symbol}
          </span>
        </div>

        {/* Amount Input */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <input
            type="text"
            value={amount}
            onChange={handleInputChange}
            placeholder="Enter amount to withdraw"
            className="flex-1 bg-transparent outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleMaxClick}
              className="px-2 py-1 text-xs text-pink-300 hover:text-pink-400 transition-colors"
            >
              MAX
            </button>
            <span>{symbol}</span>
          </div>
        </div>

        {/* Error Message - only show when amount is invalid and user has typed something */}
        {amount !== '' && !isValidAmount() && (
          <div className="text-red-500 text-xs">
            {parseFloat(amount) > parseFloat(earnings)
              ? `Amount exceeds available balance of ${earnings} ${symbol}`
              : 'Please enter a valid amount'}
          </div>
        )}

        {/* Claim Button */}
        <Button
          variant="pink"
          size="lg"
          className="w-full"
          onClick={handleWithdraw}
          disabled={isWithdrawing || !isValidAmount()}
        >
          {isWithdrawing ? 'Withdrawing...' : 'Withdraw Earnings'}
        </Button>
      </div>
    </Dialog>
  );
};

export default ClaimFunds;
