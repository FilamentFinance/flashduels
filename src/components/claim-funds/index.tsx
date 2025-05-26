'use client';

import { Dialog } from '@/components/ui/custom-modal';
// import { LOGOS } from '@/constants/app/logos';
import { CLAIM_FUNDS } from '@/constants/content/claim-funds';
import { Button } from '@/shadcn/components/ui/button';
// import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useChainId,
} from 'wagmi';
import { Hex } from 'viem';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { useToast } from '@/shadcn/components/ui/use-toast';
// import { sei } from 'viem/chains';
import { SERVER_CONFIG } from '@/config/server-config';
import { FlashDuelCoreFacetAbi } from '@/abi/FlashDuelCoreFacet';
// import { TRANSACTION_STATUS } from '@/constants/app';
// import { TransactionStatusType } from '@/types/app';
import { handleTransactionError, parseTokenAmount, formatTokenAmount } from '@/utils/token';
import { Loader2 } from 'lucide-react';
import { decodeEventLog } from 'viem';

const MAX_AUTO_WITHDRAW = 5000;

const ClaimFunds: FC = () => {
  const [amount, setAmount] = useState('');
  const [earnings, setEarnings] = useState('0');
  // const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  // const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const defaultSymbol = SERVER_CONFIG.DEFAULT_TOKEN_SYMBOL || 'USDC';

  // Read earnings from contract
  const { data: earningsData } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getAllTimeEarnings',
    address:
      address && chainId ? (SERVER_CONFIG.getContractAddresses(chainId).DIAMOND as Hex) : undefined,
    args: [address],
    chainId: chainId,
  });

  // Add logging for chain and contract changes
  // useEffect(() => {
  //   if (!address || !chainId) return;

  //   const contractAddress = SERVER_CONFIG.getContractAddresses(chainId).DIAMOND;
  //   console.log('Chain/Contract Debug:', {
  //     chainId,
  //     chainName: SERVER_CONFIG.getChainName(chainId),
  //     contractAddress,
  //     userAddress: address,
  //     earningsData: earningsData?.toString(),
  //     isContractAddressValid: !!contractAddress && contractAddress !== 'undefined',
  //   });
  // }, [chainId, address, earningsData]);

  // Add validation for contract address
  useEffect(() => {
    if (!chainId) return;

    try {
      const contractAddress = SERVER_CONFIG.getContractAddresses(chainId).DIAMOND;
      if (!contractAddress || contractAddress === 'undefined') {
        console.error(`Invalid contract address for chain ${chainId}:`, contractAddress);
      }
    } catch (error) {
      console.error(`Error getting contract address for chain ${chainId}:`, error);
    }
  }, [chainId]);

  const { isLoading: isWithdrawing } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: chainId,
  });

  // Update earnings when data changes
  useEffect(() => {
    // Reset earnings when chain changes
    setEarnings('0');

    if (earningsData) {
      const formattedEarnings = formatTokenAmount(earningsData as bigint, chainId, defaultSymbol);
      // console.log('Updating earnings:', {
      //   chainId,
      //   rawEarnings: earningsData.toString(),
      //   formattedEarnings,
      //   defaultSymbol,
      // });
      setEarnings(formattedEarnings);
    }
  }, [earningsData, chainId, defaultSymbol]);

  // Reset amount when chain changes
  useEffect(() => {
    setAmount('');
  }, [chainId]);

  // Function to trim to 4 decimal places without rounding
  const trimToFourDecimals = (value: string): string => {
    const parts = value.split('.');
    if (parts.length === 1) return value; // No decimal part
    return parts[0] + '.' + parts[1].substring(0, 4);
  };

  // Check if user has funds to withdraw
  const hasEarnings = parseFloat(earnings) > 0;
  const canWithdraw = hasEarnings;

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

  // const waitForTransaction = async (hash: Hex): Promise<boolean> => {
  //   try {
  //     const receipt = await publicClient?.waitForTransactionReceipt({
  //       hash,
  //       confirmations: 1,
  //     });
  //     return receipt?.status === 'success';
  //   } catch (error) {
  //     console.error('Error waiting for transaction:', error);
  //     return false;
  //   }
  // };

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
      setIsLoading(true);
      setTxHash(undefined);

      // console.log('chainId', chainId);

      // console.log(
      //   'parseTokenAmount(amount, chainId)',
      //   parseTokenAmount(amount, chainId, defaultSymbol),
      // );
      // console.log(
      //   'parseTokenAmount(earnings, chainId)',
      //   parseTokenAmount(earnings, chainId, defaultSymbol),
      // );
      // console.log(
      //   'parseTokenAmount(MAX_AUTO_WITHDRAW.toString(), chainId)',
      //   parseTokenAmount(MAX_AUTO_WITHDRAW.toString(), chainId, defaultSymbol),
      // );

      const DIAMOND_ADDRESS = SERVER_CONFIG.getContractAddresses(chainId).DIAMOND;
      // const maxAutoWithdraw = await publicClient?.readContract({
      //   abi: FlashDuelsViewFacetABI,
      //   address: DIAMOND_ADDRESS as Hex,
      //   functionName: 'getMaxAutoWithdraw',
      // });
      // console.log('getMaxAutoWithdraw', maxAutoWithdraw);

      const tx = await writeContractAsync({
        abi: FlashDuelCoreFacetAbi,
        address: DIAMOND_ADDRESS as Hex,
        functionName: 'withdrawEarnings',
        args: [parseTokenAmount(amount, chainId, defaultSymbol).toString()],
      });

      if (!tx) {
        throw new Error('Failed to send withdrawal transaction');
      }

      setTxHash(tx);

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      });

      // Parse logs for WithdrawalRequested event
      if (receipt && receipt.logs) {
        for (const log of receipt.logs) {
          try {
            const event = decodeEventLog({
              abi: FlashDuelCoreFacetAbi,
              data: log.data,
              topics: log.topics,
            });
            // console.log({ event });
            if (event.eventName === 'WithdrawalRequested') {
              const args = event.args as unknown as {
                requestId: bigint;
                user: string;
                amount: bigint;
                timestamp: bigint;
              };
              const { requestId, user, amount, timestamp } = args;
              console.log({ requestId, user, amount, timestamp });
              await fetch(`${SERVER_CONFIG.getApiUrl(chainId)}/user/withdrawal-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  requestId: requestId.toString(),
                  user: user.toLowerCase(),
                  amount: amount.toString(),
                  timestamp: new Date(Number(timestamp) * 1000).toISOString(),
                }),
              });
            }
          } catch (e) {
            // Not the event we're looking for, skip
            console.log(e);
          }
        }
      }

      const isWithdrawSuccess = receipt?.status === 'success';
      if (!isWithdrawSuccess) {
        throw new Error('Withdrawal transaction failed');
      }

      setAmount('');
      setIsLoading(false);
      if (parseFloat(amount) > MAX_AUTO_WITHDRAW) {
        toast({
          title: 'Withdrawal Requested',
          description: `You will be credited ${amount} ${defaultSymbol} once admin approves your withdrawal request. Check the Portfolio page (Withdrawal History) for the status.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Withdrawal Successful',
          description: `Successfully withdrew ${amount} ${defaultSymbol}`,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      handleError(error);
      setIsLoading(false);
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
        <Button
          type="button"
          disabled={!canWithdraw}
          className={`flex rounded-l px-0 py-1 min-w-[180px] transition-all duration-200 font-bold text-black ${
            canWithdraw ? 'bg-gradient-pink' : 'bg-gradient-to-b from-[#F19ED2]/80 to-[#B67BE9]/80'
          }`}
        >
          <span className="flex flex items-center justify-center font-bold">
            {Number(earnings).toFixed(2)} {defaultSymbol}
          </span>
          <span className="h-6 border-l border-black/40" />
          <span className="flex flex items-center justify-center font-bold">Withdraw</span>
        </Button>
      }
      open={undefined}
      onOpenChange={(open) => {
        // Only allow opening if user has earnings
        if (!canWithdraw && open) return;
      }}
    >
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm">Available Balance:</span>
          <span className="text-white text-sm">
            {trimToFourDecimals(earnings)} {defaultSymbol}
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
            <span>{defaultSymbol}</span>
          </div>
        </div>

        {/* Message for admin approval */}
        <div className="text-xs text-center text-gray-400 italic -mt-2">
          (Note: Amounts greater than 5,000 require admin approval.)
        </div>

        {/* Error Message - only show when amount is invalid and user has typed something */}
        {amount !== '' && !isValidAmount() && (
          <div className="text-red-500 text-xs">
            {parseFloat(amount) > parseFloat(earnings)
              ? `Amount exceeds available balance of ${trimToFourDecimals(earnings)} ${defaultSymbol}`
              : 'Please enter a valid amount'}
          </div>
        )}

        {/* Claim Button */}
        <Button
          variant="pink"
          size="lg"
          className="w-full"
          onClick={handleWithdraw}
          disabled={isLoading || isWithdrawing || !isValidAmount()}
        >
          {isLoading || isWithdrawing ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isLoading ? 'Confirming...' : 'Processing Withdrawal...'}</span>
            </div>
          ) : (
            'Withdraw Earnings'
          )}
        </Button>
      </div>
    </Dialog>
  );
};

export default ClaimFunds;
