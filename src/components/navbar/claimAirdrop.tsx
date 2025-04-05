/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState, useEffect } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/shadcn/components/ui/dialog';
import { X } from 'lucide-react';

const symbol = SERVER_CONFIG.PRODUCTION ? 'CRD' : 'FDCRD';

const ClaimAirdropButton: FC = () => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  // const [error, setError] = useState<string | null>(null);
  // const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [creditsBalance, setCreditsBalance] = useState<string>('0');
  const [availableToClaim, setAvailableToClaim] = useState<string>('0');
  const [claimedAmount, setClaimedAmount] = useState<string>('');
  const { toast } = useToast();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setAvailableToClaim(credits?.toString() || '0');
        const creditsBalance = await publicClient?.readContract({
          abi: CREDITS,
          address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
          functionName: 'balanceOf',
          args: [address.toLowerCase()],
        });
        setCreditsBalance(creditsBalance?.toString() || '0');

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
      setClaimedAmount('');

      const tx = await writeContractAsync({
        abi: CREDITS,
        address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
        functionName: 'claim',
        args: [],
      });

      if (!tx) {
        throw new Error('Failed to send claim transaction');
      }

      setStatus(TRANSACTION_STATUS.PENDING);

      const isClaimSuccess = await waitForTransaction(tx);
      if (!isClaimSuccess) {
        throw new Error('Claim transaction failed');
      }

      // Wait a brief moment for the blockchain to update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Fetch the updated balances
      const [newBalance, newClaimed] = await Promise.all([
        publicClient?.readContract({
          abi: CREDITS,
          address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
          functionName: 'balanceOf',
          args: [address.toLowerCase()],
        }),
        publicClient?.readContract({
          abi: CREDITS,
          address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
          functionName: 'totalClaimed',
          args: [address.toLowerCase()],
        }),
      ]);

      setCreditsBalance(newBalance?.toString() || '0');
      setClaimedAmount(newClaimed?.toString() || '0');
      setStatus(TRANSACTION_STATUS.SUCCESS);

      toast({
        title: 'Claim Successful',
        description: `${formatUnits(BigInt(newClaimed?.toString() || '0'), 18)} ${symbol} claimed successfully`,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddToMetamask = () => {
    if (window.ethereum) {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: SERVER_CONFIG.CREDIT_CONTRACT,
            symbol: symbol,
            decimals: 18,
          },
        },
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="text-pink-300 border border-pink-300 bg-transparent hover:shadow-lg hover:scale-[1.02] hover:bg-pink-300/10 text-pink-300 font-bold h-10 px-4"
        size="default"
        disabled={false}
      >
        {status === TRANSACTION_STATUS.SUCCESS
          ? `${parseFloat(formatUnits(BigInt(claimedAmount.toString()), 18)).toFixed(4)} ${symbol} Claimed 🎉`
          : `Claim ${symbol}`}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-center">Filament Credits ({symbol})</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Available Balance:</span>
              <span className="font-medium">
                {parseFloat(formatUnits(BigInt(creditsBalance), 18)).toFixed(4)} {symbol}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {status !== TRANSACTION_STATUS.SUCCESS && (
                <Button
                  onClick={handleClaimAirdrop}
                  className="text-pink-300 border border-pink-300 bg-transparent hover:shadow-lg hover:scale-[1.02] hover:bg-pink-300/10 w-full"
                  disabled={status === TRANSACTION_STATUS.PENDING}
                >
                  {status === TRANSACTION_STATUS.PENDING
                    ? 'Claiming...'
                    : `Claim ${symbol}`}
                </Button>
              )}

              <Button onClick={handleAddToMetamask} variant="outline" className="w-full">
                Add {symbol} to MetaMask
              </Button>
            </div>

            {status === TRANSACTION_STATUS.SUCCESS && (
              <div className="text-center text-sm text-green-500">
                Congratulations 🎉 You have claimed {formatUnits(BigInt(claimedAmount.toString()), 18)} {symbol}!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimAirdropButton;
