'use client';

import { baseApiClient } from '@/config/api-client';
import { useBalance } from '@/hooks/useBalance';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { AlertCircle, LogOut, RefreshCw } from 'lucide-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { AccountShimmer } from './account-shimmer';

interface AccountData {
  positionValue: string;
  pnl: string;
  totalBets: number;
  totalDuelCreated: number;
}

const AccountDetails: FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { balance, decimals } = useBalance(address);

  const fetchPortfolio = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await baseApiClient.post('/flashduels/portfolio/accountDetails', {
        userAddress: address.toLowerCase(),
      });
      setAccountData(response.data.portfolioData);
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
    <Card className="max-w-[287px] bg-neutral-900 border-neutral-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <Button
            onClick={fetchPortfolio}
            size="sm"
            variant="secondary"
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyStateCard = ({ message }: { message: string }) => (
    <Card className="max-w-[287px] bg-neutral-900 border-neutral-800">
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

  const stats = [
    {
      label: 'Positions Value',
      value: accountData.positionValue,
      valueClassName: 'text-white',
    },
    {
      label: 'PNL',
      value: accountData.pnl,
      valueClassName:
        Number(accountData.pnl.replace(/[^0-9.-]/g, '')) >= 0 ? 'text-lime-300' : 'text-red-500',
    },
    {
      label: 'Duels Joined',
      value: accountData.totalBets.toString(),
      valueClassName: 'text-white',
    },
    {
      label: 'Duels Created',
      value: accountData.totalDuelCreated.toString(),
      valueClassName: 'text-white',
    },
  ];

  return (
    <Card className="max-w-[287px] bg-neutral-900 border-neutral-800">
      <CardContent className="p-3">
        <div className="flex relative flex-col max-w-full w-[263px]">
          {/* User Info */}
          <div className="flex justify-between items-center">
            <div className="text-xs tracking-normal leading-relaxed text-gray-500">
              {truncateAddress(address)}
            </div>
            <Button
              onClick={() => disconnect()}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Logout
            </Button>
          </div>

          {/* Account Value */}
          <div className="z-0 mt-3 text-base font-semibold tracking-normal leading-tight text-gray-400">
            Account Value
          </div>
          <div className="z-0 mt-3 text-5xl font-semibold leading-none text-stone-200">
            ${formatUnits((balance ?? 0) as bigint, decimals ?? 0)}
          </div>
        </div>

        {/* Account Stats */}
        <div className="flex flex-col mt-2.5 w-full text-xs tracking-normal leading-none max-w-[268px]">
          {stats.map(({ label, value, valueClassName = 'text-white' }, index) => (
            <div key={index} className="flex justify-between items-center py-0.5 w-full">
              <div className="flex-1 shrink gap-1 self-stretch my-auto text-gray-500">{label}</div>
              <div className={`self-stretch my-auto text-right ${valueClassName}`}>{value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetails;
