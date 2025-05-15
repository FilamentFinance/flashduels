'use client';

import { baseApiClient } from '@/config/api-client';
import { useBalance } from '@/hooks/useBalance';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import {
  AlertCircle,
  ExternalLink,
  LogOut,
  RefreshCw,
  Loader2,
  // ArrowUpRight,
  Wallet,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import {
  useAccount,
  useDisconnect,
  useChainId,
  useReadContract,
  useWriteContract,
  usePublicClient,
} from 'wagmi';
import { AccountShimmer } from './account-shimmer';
import { openExternalLinkInNewTab } from '@/utils/general/open-external-link';
import { SERVER_CONFIG } from '@/config/server-config';
import { sei } from 'viem/chains';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { FlashDuelCoreFacetAbi } from '@/abi/FlashDuelCoreFacet';
import { Hex } from 'viem';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { Toaster } from '@/shadcn/components/ui/toaster';
import { useCreatorPnl } from '@/hooks/useCreatorPnl';
import { useAllTimeEarnings } from '@/hooks/useAllTimeEarnings';
// import { handleTransactionError, parseTokenAmount, formatTokenAmount } from '@/utils/token';
// import { decodeEventLog } from 'viem';
// import ClaimFunds from '@/components/claim-funds';

interface AccountData {
  positionValue: string;
  pnl: string;
  totalBets: number;
  totalDuelCreated: number;
  totalCreatorFees?: number;
}

// const MAX_AUTO_WITHDRAW = 5000;

const AccountDetails: FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { balance, decimals } = useBalance(address);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const chainId = useChainId();
  const symbol = chainId === sei.id ? 'CRD' : 'CRD';
  const publicClient = usePublicClient();
  const { toast } = useToast();

  // Contract-based Creator Earnings (for Creator box)
  const {
    data: creatorEarningsRaw,
    isLoading: isEarningsLoading,
    refetch: refetchEarnings,
  } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getCreatorFeesEarned',
    address: SERVER_CONFIG.DIAMOND as Hex,
    args: [address],
    chainId: chainId,
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const defaultSymbol = SERVER_CONFIG.DEFAULT_TOKEN_SYMBOL || 'USDC';
  const creatorEarnings = creatorEarningsRaw
    ? Number(formatUnits(creatorEarningsRaw as bigint, 18)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00';

  // Backend Creator PNL (for Account Stats/Trader box)
  const { pnl: creatorPnl, loading: pnlLoading } = useCreatorPnl(address);

  // All-time earnings for Trading PNL in Trader box
  const { earnings: tradingPnl, isLoading: isTradingPnlLoading } = useAllTimeEarnings(address);

  // Withdraw Creator Fee function (for Creator box)
  const withdrawCreatorFee = async () => {
    setWithdrawError(null);
    if (!address) return;
    try {
      setIsWithdrawing(true);
      const tx = await writeContractAsync({
        abi: FlashDuelCoreFacetAbi,
        address: SERVER_CONFIG.DIAMOND as Hex,
        functionName: 'withdrawCreatorFee',
        args: [],
        chainId: chainId,
      });
      if (!tx) throw new Error('Failed to send withdraw transaction');
      // Wait for transaction to be mined
      await publicClient?.waitForTransactionReceipt({ hash: tx, confirmations: 1 });
      refetchEarnings();
      toast({
        title: 'Success',
        description: 'Creator earnings withdrawn successfully',
      });
      // Refresh the page after successful withdrawal
      window.location.reload();
    } catch (err: any) {
      console.error('Error withdrawing creator earnings:', err);
      toast({
        title: 'Error',
        description: 'Error Withdrawing Creator Earnings',
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const fetchPortfolio = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await baseApiClient.post('user/portfolio/accountDetails', {
        userAddress: address.toLowerCase(),
      });

      // Check if user is a creator
      let isUserCreator = false;
      try {
        const creatorResponse = await baseApiClient.get(
          `${SERVER_CONFIG.API_URL}/user/creator/status`,
          {
            params: {
              address: address.toLowerCase(),
            },
          },
        );
        isUserCreator = creatorResponse.data.isCreator;
        setIsCreator(isUserCreator);
      } catch (error) {
        console.error('Error checking creator status:', error);
        setIsCreator(false);
      }

      // Set account data with creator fees if applicable
      const portfolioData = response.data.portfolioData;
      if (isUserCreator) {
        portfolioData.totalCreatorFees = (portfolioData.totalDuelCreated || 0) * 5;
      }
      setAccountData(portfolioData);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-[300px] h-full mt-11 ml-auto">
        <AccountShimmer />
      </div>
    );
  }

  const ErrorCard = () => (
    <Card className="w-[300px] bg-neutral-900/50 border-neutral-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <Button
            onClick={fetchPortfolio}
            size="sm"
            variant="secondary"
            className="bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyStateCard = ({ message }: { message: string }) => (
    <Card className="w-[300px] bg-neutral-900/50 border-neutral-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-gray-400">{message}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (error) return <ErrorCard />;
  if (!address) return <EmptyStateCard message="Please connect your wallet" />;
  if (!accountData) return <EmptyStateCard message="No portfolio data available" />;

  const formattedBalance = Number(
    formatUnits((balance ?? 0) as bigint, decimals ?? 0),
  ).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const getPnlColor = (value: string) => {
    const num = Number(value.replace(/[^0-9.-]/g, ''));
    if (num > 0) return 'text-green-400';
    if (num < 0) return 'text-red-500';
    return 'text-zinc-400';
  };

  return (
    <div className="flex flex-col gap-4 w-[300px] h-full mt-11 ml-auto">
      <Card className="w-full h-full bg-neutral-900/50 backdrop-blur-sm border-neutral-800">
        <CardContent className="p-4 h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                  {isCreator === true && <span className="text-green-500">✓</span>}
                  {isCreator === false && <span className="text-orange-400">⚠️</span>}
                  {truncateAddress(address)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0.5 text-zinc-500 hover:text-white hover:bg-transparent"
                  onClick={() =>
                    openExternalLinkInNewTab(
                      `https://seitrace.com/address/${address}?chain=atlantic-2`,
                    )
                  }
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button
              onClick={() => disconnect()}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-zinc-500 hover:text-white hover:bg-transparent"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Logout
            </Button>
          </div>

          {/* Account Value */}
          <div className="rounded-lg bg-zinc-900/70 border border-zinc-800 p-4 mb-2">
            {/* <h2 className="text-sm font-medium text-zinc-500 mb-2">Account Stats</h2> */}
            <div className="flex flex-col gap-1 text-sm">
              {/* Balance */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-[110px]">
                  <Wallet className="w-3 h-3 text-zinc-400" />
                  <span className="text-zinc-400">Current Balance</span>
                </div>
                <span className="text-zinc-400 font-semibold">
                  {formattedBalance} {symbol}
                </span>
              </div>
              {/* Creator PNL (only in Account Stats/Trader box) */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-[110px]">
                  <Trophy className={`w-3 h-3 ${getPnlColor(creatorPnl ?? '0')}`} />
                  <span className={getPnlColor(creatorPnl ?? '0')}>Creator PNL</span>
                </div>
                <span className={`font-semibold ${getPnlColor(creatorPnl ?? '0')}`}>
                  {pnlLoading ? '...' : creatorPnl !== null ? `${creatorPnl} ${symbol}` : '--'}
                </span>
              </div>
              {/* Trading PNL (use all-time earnings) */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-[110px]">
                  <TrendingUp className={`w-3 h-3 ${getPnlColor(tradingPnl)}`} />
                  <span className={getPnlColor(tradingPnl)}>Trading PNL</span>
                </div>
                <span className={`font-medium ${getPnlColor(tradingPnl)}`}>
                  {tradingPnl} {symbol}
                </span>
              </div>
              {/* Total */}
              <div className="flex justify-between items-center mt-2 border-t border-zinc-800 pt-2">
                <div className="flex items-center gap-2 min-w-[110px]">
                  <span className="text-white">Portfolio Value</span>
                </div>
                <span className="text-white text-lg font-bold">
                  {(
                    Number(formattedBalance.replace(/,/g, '')) +
                    Number(creatorPnl?.replace(/[^0-9.-]/g, '')) +
                    Number(tradingPnl.replace(/[^0-9.-]/g, ''))
                  ).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  {symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-2">
            {isCreator && (
              <div className="mt-2">
                <div className="rounded-xl border border-zinc-700 bg-gradient-to-br from-green-500/10 to-pink-500/10 p-4 flex flex-col gap-1 shadow-md">
                  <div className="text-base text-center font-bold text-white mb-2">Creator</div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-zinc-500">Duels Created</div>
                    <div className="text-sm font-medium text-pink-400">
                      {accountData.totalDuelCreated}
                    </div>
                  </div>
                  {accountData.totalCreatorFees !== undefined && (
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-zinc-500">Creation Fees Paid</div>
                      <div className="text-sm font-medium text-red-300">
                        {accountData.totalCreatorFees} {symbol}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-zinc-500">Creator Earnings</div>
                    <span className={`text-sm font-medium ${getPnlColor(creatorEarnings)}`}>
                      {isEarningsLoading || isWithdrawing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        `${creatorEarnings} ${symbol}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-end -mr-2">
                    <Button
                      size="sm"
                      className="hover:bg-green-500/30 text-green-400 border border-green-400 rounded-md px-2 h-6 text-xs flex items-center gap-1"
                      disabled={isWithdrawing || isEarningsLoading || Number(creatorEarnings) === 0}
                      onClick={withdrawCreatorFee}
                    >
                      {isWithdrawing ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          Withdrawing...
                        </>
                      ) : (
                        <>
                          Withdraw
                          <LogOut className="w-3 h-3 -rotate-90" />
                        </>
                      )}
                    </Button>
                  </div>
                  {withdrawError && (
                    <div className="text-xs text-red-500 mt-1 text-center">{withdrawError}</div>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-zinc-700 bg-gradient-to-br from-pink-500/10 to-green-500/10 p-4 flex flex-col gap-2 shadow-md">
              <div className="text-base text-center font-bold text-white mb-2">Trader</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-zinc-500">Duels Joined</div>
                <div className="text-sm font-medium text-orange-400">{accountData.totalBets}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-zinc-500">Total Traded Value</div>
                <div className="text-sm font-medium text-red-300">
                  {accountData.positionValue} {symbol}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-zinc-500">Trading Profits</div>
                <span className={`text-sm font-medium ${getPnlColor(tradingPnl)}`}>
                  {isTradingPnlLoading ? '...' : `${tradingPnl} ${symbol}`}
                </span>
              </div>
              {/* <div className="flex justify-end -mr-2">
                <ClaimFunds />
              </div>
              {withdrawError && (
                <div className="text-xs text-red-500 mt-1 text-center">{withdrawError}</div>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default AccountDetails;
