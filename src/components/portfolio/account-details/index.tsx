'use client';

import { useApiClient } from '@/config/api-client';
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
import { base, baseSepolia, sei, seiTestnet } from 'viem/chains';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { FlashDuelCoreFacetAbi } from '@/abi/FlashDuelCoreFacet';
import { Hex } from 'viem';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { Toaster } from '@/shadcn/components/ui/toaster';
import { useCreatorPnl } from '@/hooks/useCreatorPnl';
import { useAllTimeEarnings } from '@/hooks/useAllTimeEarnings';
import axios from 'axios';

interface AccountData {
  positionValue: string;
  pnl: string;
  totalBets: number;
  totalDuelCreated: number;
  totalCreatorFees?: number;
}

// const MAX_AUTO_WITHDRAW = 5000;

// Add new hook for trading PNL
function useTradingPnl(address?: string) {
  const [pnl, setPnl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();

  useEffect(() => {
    if (!address) {
      setPnl(null);
      return;
    }
    setLoading(true);
    setError(null);
    // console.log('Fetching trading PNL for address:', address);
    axios
      .get(`${SERVER_CONFIG.getApiUrl(chainId)}/leaderboard/traders/pnl?address=${address}`)
      .then((res) => {
        // console.log('Trading PNL response:', res.data);
        setPnl(res.data.pnl);
      })
      .catch((err) => {
        console.error('Error fetching trading PNL:', err.response || err);
        if (err.response && err.response.status === 404) {
          setPnl('0');
          setError(null);
        } else {
          setError('Failed to fetch Trading PNL');
        }
      })
      .finally(() => setLoading(false));
  }, [address, chainId]);

  return { pnl, loading, error };
}

const AccountDetails: FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { balance, decimals } = useBalance(address);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const chainId = useChainId();
  const apiClient = useApiClient(chainId);
  const symbol = 'CRD'; // Using CRD for all chains now
  const publicClient = usePublicClient();
  const { toast } = useToast();

  const getExplorerUrl = (address: string) => {
    switch (chainId) {
      case sei.id:
        return `https://seitrace.com/address/${address}?chain=pacific-1`;
      case base.id:
        return `https://basescan.org/address/${address}`;
      case baseSepolia.id:
        return `https://sepolia.basescan.org/address/${address}`;
      case seiTestnet.id:
        return `https://seitrace.com/address/${address}?chain=atlantic-2`;
      default:
        return `https://basescan.org/address/${address}`;
    }
  };

  // Contract-based Creator Earnings (for Creator box)
  const {
    data: creatorEarningsRaw,
    isLoading: isEarningsLoading,
    refetch: refetchEarnings,
  } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getCreatorFeesEarned',
    address: SERVER_CONFIG.getContractAddresses(chainId).DIAMOND as Hex,
    args: [address],
    chainId: chainId,
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  // const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  // const defaultSymbol = SERVER_CONFIG.DEFAULT_TOKEN_SYMBOL || 'USDC';
  const creatorEarnings = creatorEarningsRaw
    ? Number(formatUnits(creatorEarningsRaw as bigint, 18)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00';

  // Backend Creator PNL (for Account Stats/Trader box)
  const { pnl: creatorPnl } = useCreatorPnl(address);
  const { pnl: tradingPnl, loading: isTradingPnlLoading } = useTradingPnl(address);

  // All-time earnings for Trading PNL in Trader box
  const { earnings: allTimeEarnings, isLoading: isAllTimeEarningsLoading } =
    useAllTimeEarnings(address);

  // Withdraw Creator Fee function (for Creator box)
  const withdrawCreatorFee = async () => {
    setWithdrawError(null);
    if (!address) return;
    try {
      setIsWithdrawing(true);
      const tx = await writeContractAsync({
        abi: FlashDuelCoreFacetAbi,
        address: SERVER_CONFIG.getContractAddresses(chainId).DIAMOND as Hex,
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
    } catch (err) {
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
      const response = await apiClient.post('user/portfolio/accountDetails', {
        userAddress: address.toLowerCase(),
      });

      // Check if user is a creator
      let isUserCreator = false;
      try {
        const creatorResponse = await apiClient.get(
          `${SERVER_CONFIG.getApiUrl(chainId)}/user/creator/status`,
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
  }, [address, apiClient, chainId]);

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
                  onClick={() => openExternalLinkInNewTab(getExplorerUrl(address))}
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
          <div className="rounded-lg border border-zinc-800 p-4 mb-1">
            {/* <h2 className="text-sm font-medium text-zinc-500 mb-2">Account Stats</h2> */}
            <div className="flex flex-col gap-1 text-sm">
              {/* Balance */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-[110px]">
                  <Wallet className="w-3 h-3 text-zinc-400" />
                  <span className="text-zinc-400">Wallet Balance</span>
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
                  {Number(creatorPnl ?? 0).toFixed(2)} {symbol}
                </span>
              </div>
              {/* Trading PNL (use all-time earnings) */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-[110px]">
                  <TrendingUp className={`w-3 h-3 ${getPnlColor(tradingPnl ?? '0')}`} />
                  <span className={getPnlColor(tradingPnl ?? '0')}>Trading PNL</span>
                </div>
                <span className={`font-bold ${getPnlColor(tradingPnl ?? '0')}`}>
                  {isTradingPnlLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `${Number(tradingPnl ?? 0).toFixed(2)} ${symbol}`
                  )}
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
                    Number(tradingPnl?.replace(/[^0-9.-]/g, '') || '0')
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
          <div className="grid grid-cols-1 gap-1">
            {isCreator && (
              <div className="mt-1">
                <div className="rounded-xl border border-zinc-700 p-4 flex flex-col gap-1 shadow-md">
                  <div className="text-base text-center font-bold text-white mb-2">Creator</div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-zinc-500">Duels Created</div>
                    <div className="text-sm font-medium text-zinc-400">
                      {accountData.totalDuelCreated}
                    </div>
                  </div>
                  {accountData.totalCreatorFees !== undefined && (
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-zinc-500">Creation Fees Paid</div>
                      <div className="text-sm font-medium text-zinc-400">
                        {Number(accountData.totalCreatorFees ?? 0).toFixed(2)} {symbol}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-zinc-500 flex items-center gap-1 group relative">
                      <span>Earnings</span>
                      <span className="text-xs text-zinc-400">*</span>
                      <div className="absolute left-0 top-8 w-48 p-2 bg-zinc-800 text-xs text-pink-300 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 transform translate-y-2 group-hover:translate-y-0">
                        Creators earn 1% of the duel volume when it settles. Click
                        &apos;Withdraw&apos; to claim.
                      </div>
                    </div>
                    <div className="flex items-center rounded-md border border-[#F19ED2]/50">
                      <span
                        className={`text-xs font-medium text-[#F19ED2] px-2 py-1 border-r border-[#F19ED2] whitespace-nowrap`}
                      >
                        {Number(creatorEarnings ?? 0).toFixed(2)} {symbol}
                      </span>
                      <Button
                        size="sm"
                        className="hover:bg-[#F19ED2]/20 text-[#F19ED2] text-xs flex items-center w-[70px] justify-center"
                        disabled={
                          isWithdrawing || isEarningsLoading || Number(creatorEarnings) === 0
                        }
                        onClick={withdrawCreatorFee}
                      >
                        {isWithdrawing ? (
                          <>
                            <Loader2 className="w-2.5 h-2.5 animate-spin mr-1" />
                          </>
                        ) : (
                          <>Withdraw</>
                        )}
                      </Button>
                    </div>
                  </div>
                  {withdrawError && (
                    <div className="text-xs text-red-500 mt-1 text-center">{withdrawError}</div>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-zinc-700 p-4 flex flex-col mt-1 gap-2 shadow-md">
              <div className="text-base text-center font-bold text-white mb-2">Trader</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-zinc-500">Duels Joined</div>
                <div className="text-sm font-medium text-zinc-400">{accountData.totalBets}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-zinc-500">
                  Total Traded Value
                  <div className="text-[10px] italic text-neutral-400">(Settled &amp; Cancelled) Duels</div>
                </div>
                <div className="text-sm font-medium text-zinc-400">
                  {Number(accountData.positionValue ?? 0).toFixed(2)} {symbol}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-zinc-500 flex items-center gap-1 group relative">
                  <span>Earnings <span className="text-[10px] italic text-zinc-400">(Settled Duels)</span></span>
                  <span className="text-xs text-zinc-400">*</span>
                  <div className="absolute left-0 top-8 w-48 p-2 bg-zinc-800 text-xs text-pink-300 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 transform translate-y-2 group-hover:translate-y-0">
                    Profits from settled duels you&apos;ve joined. Click &apos;Withdraw&apos; at the
                    top of the page to claim them.
                  </div>
                </div>
                <span className="text-sm font-medium text-zinc-400">
                  {isAllTimeEarningsLoading
                    ? '...'
                    : `${Number(allTimeEarnings ?? 0).toFixed(2)} ${symbol}`}
                </span>
              </div>
              {/* <div className="flex justify-end -mr-2">
                    <Button
                      size="sm"
                      className="hover:bg-green-500/30 text-green-400 border border-green-400 rounded-md px-2 h-6 text-xs flex items-center gap-1"
                      disabled={isWithdrawing || isEarningsLoading || Number(creatorEarnings) === 0}
                      onClick={withdrawCreatorFee}
                    >
                    Withdraw
                </Button>
              </div> */}
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
