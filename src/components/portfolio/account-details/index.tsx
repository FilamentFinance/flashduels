'use client';

import { baseApiClient } from '@/config/api-client';
import { useBalance } from '@/hooks/useBalance';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { AlertCircle, ExternalLink, LogOut, RefreshCw } from 'lucide-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { AccountShimmer } from './account-shimmer';
import { openExternalLinkInNewTab } from '@/utils/general/open-external-link';
import { SERVER_CONFIG } from '@/config/server-config';

const symbol = SERVER_CONFIG.PRODUCTION ? 'CRD' : 'FDCRD';
interface AccountData {
  positionValue: string;
  pnl: string;
  totalBets: number;
  totalDuelCreated: number;
  totalCreatorFees?: number;
}

const AccountDetails: FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { balance, decimals } = useBalance(address);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);

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
      setAccountData(response.data.portfolioData);
      
      // Check if user is a creator
      try {
        const creatorResponse = await baseApiClient.get(`${SERVER_CONFIG.API_URL}/user/creator/status`, {
          params: {
            address: address.toLowerCase()
          }
        });
        setIsCreator(creatorResponse.data.isCreator);
        
        // If user is a creator, fetch their total fees
        if (creatorResponse.data.isCreator) {
          try {
            const feesResponse = await baseApiClient.get(`${SERVER_CONFIG.API_URL}/user/creator/fees`, {
              params: {
                address: address.toLowerCase()
              }
            });
            
            // Update accountData with creator fees
            setAccountData(prev => ({
              ...prev!,
              totalCreatorFees: feesResponse.data.totalFees || (prev?.totalDuelCreated || 0) * 5
            }));
          } catch (error) {
            console.error("Error fetching creator fees:", error);
            // Fallback calculation
            setAccountData(prev => ({
              ...prev!,
              totalCreatorFees: (prev?.totalDuelCreated || 0) * 5
            }));
          }
        }
      } catch (error) {
        console.error("Error checking creator status:", error);
        setIsCreator(false);
      }
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
    return <AccountShimmer />;
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

  return (
    <Card className="w-[300px] bg-neutral-900/50 backdrop-blur-sm border-neutral-800">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-500">{truncateAddress(address)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0.5 text-zinc-500 hover:text-white hover:bg-transparent"
              onClick={() =>
                openExternalLinkInNewTab(`https://seitrace.com/address/${address}?chain=atlantic-2`)
              }
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
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
        <div className="mb-8">
          <h2 className="text-sm font-medium text-zinc-500 mb-2">Account Value</h2>
          <div className="text-[2rem] font-bold text-white leading-none">
            {formattedBalance} <span className="text-[1.85rem]">{symbol}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center">
            <div className="text-sm text-zinc-500">Total Invested Value</div>
            <div className="text-sm font-medium text-white">{accountData.positionValue}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-zinc-500">PNL</div>
            <div
              className={`text-sm font-medium ${
                Number(accountData.pnl.replace(/[^0-9.-]/g, '')) >= 0
                  ? 'text-[#95DE64]'
                  : 'text-red-500'
              }`}
            >
              {accountData.pnl}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-zinc-500">Duels Joined</div>
            <div className="text-sm font-medium text-white">{accountData.totalBets}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-zinc-500">Duels Created</div>
            <div className="text-sm font-medium text-white">{accountData.totalDuelCreated}</div>
          </div>
          
          {/* Add Creator Fees if user is a creator */}
          {isCreator && accountData.totalCreatorFees !== undefined && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-zinc-500">Total Creator Fees Paid</div>
              <div className="text-sm font-medium text-white">
                {accountData.totalCreatorFees}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetails;
