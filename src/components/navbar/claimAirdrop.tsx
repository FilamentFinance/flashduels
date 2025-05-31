/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState, useEffect } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { useAccount, usePublicClient, useWriteContract, useChainId } from 'wagmi';
import { SERVER_CONFIG } from '@/config/server-config';
import { TRANSACTION_STATUS } from '@/constants/app';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { TransactionStatusType } from '@/types/app';
import { handleTransactionError } from '@/utils/token';
import { formatUnits, Hex } from 'viem';
import { CREDITS } from '@/abi/CREDITS';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/shadcn/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';
import { X, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { shallowEqual } from 'react-redux';

interface ClaimAirdropButtonProps {
  disabled?: boolean;
}

const ClaimAirdropButton: FC<ClaimAirdropButtonProps> = ({ disabled }) => {
  const [status, setStatus] = useState<TransactionStatusType>(TRANSACTION_STATUS.IDLE);
  const [creditsBalance, setCreditsBalance] = useState<string>('0');
  const [availableToClaim, setAvailableToClaim] = useState<string>('0');
  const [claimedAmount, setClaimedAmount] = useState<string>('');
  const { toast } = useToast();
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingToMetamask, setIsAddingToMetamask] = useState(false);
  const symbol = 'CRD'; // Using CRD for all chains now

  // Add authentication state
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated,
    shallowEqual,
  );

  useEffect(() => {
    const checkClaimedAmount = async () => {
      if (!address) return;
      const creditContractAddress = SERVER_CONFIG.getContractAddresses(chainId).CREDIT_CONTRACT;
      try {
        // Check credits balance
        const credits = await publicClient?.readContract({
          abi: CREDITS,
          address: creditContractAddress as Hex,
          functionName: 'credits',
          args: [address.toLowerCase()],
        });
        setAvailableToClaim(credits?.toString() || '0');
        const creditsBalance = await publicClient?.readContract({
          abi: CREDITS,
          address: creditContractAddress as Hex,
          functionName: 'balanceOf',
          args: [address.toLowerCase()],
        });
        setCreditsBalance(creditsBalance?.toString() || '0');

        // Check total claimed amount
        const claimed = await publicClient?.readContract({
          abi: CREDITS,
          address: creditContractAddress as Hex,
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
    const creditContractAddress = SERVER_CONFIG.getContractAddresses(chainId).CREDIT_CONTRACT;
    try {
      setStatus(TRANSACTION_STATUS.PENDING);
      setClaimedAmount('');

      const tx = await writeContractAsync({
        abi: CREDITS,
        address: creditContractAddress as Hex,
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
      const [newBalance, newClaimed, newAvailable] = await Promise.all([
        publicClient?.readContract({
          abi: CREDITS,
          address: creditContractAddress as Hex,
          functionName: 'balanceOf',
          args: [address.toLowerCase()],
        }),
        publicClient?.readContract({
          abi: CREDITS,
          address: creditContractAddress as Hex,
          functionName: 'totalClaimed',
          args: [address.toLowerCase()],
        }),
        publicClient?.readContract({
          abi: CREDITS,
          address: creditContractAddress as Hex,
          functionName: 'credits',
          args: [address.toLowerCase()],
        }),
      ]);

      setCreditsBalance(newBalance?.toString() || '0');
      setClaimedAmount(newClaimed?.toString() || '0');
      setAvailableToClaim(newAvailable?.toString() || '0');
      setStatus(TRANSACTION_STATUS.SUCCESS);

      toast({
        title: 'Claim Successful',
        description: `${formatUnits(BigInt(newClaimed?.toString() || '0'), 18)} ${symbol} claimed successfully`,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddToMetamask = async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask not found',
        description: 'Please install MetaMask extension first',
        variant: 'destructive',
      });
      return;
    }
    const creditContractAddress = SERVER_CONFIG.getContractAddresses(chainId).CREDIT_CONTRACT;
    try {
      setIsAddingToMetamask(true);

      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: creditContractAddress,
            symbol: symbol,
            decimals: 18,
          },
        },
      });

      if (wasAdded) {
        toast({
          title: 'Success',
          description: `${symbol} has been added to your MetaMask wallet`,
        });
      } else {
        toast({
          title: 'Cancelled',
          description: 'You cancelled adding the token to MetaMask',
        });
      }
    } catch (error) {
      console.error('Error adding to MetaMask:', error);
      toast({
        title: 'Error',
        description: 'Failed to add token to MetaMask',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToMetamask(false);
    }
  };

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="text-pink-300 border border-pink-300 bg-transparent hover:shadow-lg hover:scale-[1.02] hover:bg-pink-300/10 text-pink-300 font-bold h-10 px-4"
                size="default"
                disabled={!isAuthenticated || disabled}
              >
                {!isAuthenticated
                  ? `Claim ${symbol}`
                  : status === TRANSACTION_STATUS.SUCCESS
                    ? `${parseFloat(formatUnits(BigInt(claimedAmount.toString()), 18))} ${symbol} Claimed 🎉`
                    : `Claim ${symbol}`}
              </Button>
            </span>
          </TooltipTrigger>
          {!isAuthenticated && (
            <TooltipContent
              side="bottom"
              className="bg-black/90 text-white border border-pink-300/50 px-4 py-2"
            >
              <p className="text-sm">Enable Trading to Claim ${symbol}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

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
            {!isAuthenticated ? (
              <div className="text-center text-sm text-yellow-500">
                Please enable trading first to claim {symbol}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Current Balance:</span>
                    <span className="font-medium">
                      {parseFloat(formatUnits(BigInt(creditsBalance), 18)).toFixed(4)} {symbol}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Available to Claim:</span>
                    <span className="font-medium">
                      {parseFloat(formatUnits(BigInt(availableToClaim), 18)).toFixed(0)} {symbol}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {status !== TRANSACTION_STATUS.SUCCESS && availableToClaim !== '0' && (
                    <Button
                      onClick={handleClaimAirdrop}
                      className="text-pink-300 border border-pink-300 bg-transparent hover:shadow-lg hover:scale-[1.02] hover:bg-pink-300/10 w-full"
                      disabled={status === TRANSACTION_STATUS.PENDING}
                    >
                      {status === TRANSACTION_STATUS.PENDING ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        `Claim ${parseFloat(formatUnits(BigInt(availableToClaim), 18)).toFixed(0)} ${symbol}`
                      )}
                    </Button>
                  )}

                  {availableToClaim === '0' && (
                    <div className="text-center text-sm text-gray-500">
                      No {symbol} Available to Claim
                    </div>
                  )}

                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Add to MetaMask:</h4>
                    <ol className="text-xs text-gray-500 space-y-1 list-decimal pl-4 mb-2">
                      <li>Click the button below to open MetaMask</li>
                      <li>Review the token details</li>
                      <li>Click &quot;Add Token&quot; in your MetaMask wallet</li>
                    </ol>
                    <Button
                      onClick={handleAddToMetamask}
                      variant="outline"
                      className="w-full"
                      disabled={isAddingToMetamask}
                    >
                      {isAddingToMetamask ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding to MetaMask...
                        </>
                      ) : (
                        `Add ${symbol} to MetaMask`
                      )}
                    </Button>
                  </div>
                </div>

                {status === TRANSACTION_STATUS.SUCCESS && (
                  <div className="text-center text-sm text-green-500">
                    Congratulations 🎉 You have claimed{' '}
                    {formatUnits(BigInt(claimedAmount.toString()), 18)} {symbol}!
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimAirdropButton;
