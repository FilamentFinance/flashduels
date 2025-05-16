'use client';

import { LEADERBOARD } from '@/constants/content/leaderboard';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Button } from '@/shadcn/components/ui/button';
import { LeaderboardItem, TraderLeaderboardItem } from '@/types/leaderboard';
import CopyToClipboard from '@/utils/general/copy-to-clipboard';
import { AlertCircle, Check, Copy, Trophy } from 'lucide-react';
import { FC, useState } from 'react';
import { LEADERBOARD_TABS } from '@/constants/leaderboard';

type Props = {
  data: (LeaderboardItem | TraderLeaderboardItem)[];
  isLoading: boolean;
  isError: boolean;
  activeTab: string;
};

const TableSkeleton = () => {
  return (
    <div className="divide-y divide-zinc-800">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 p-4 text-sm animate-pulse">
          <div className="col-span-1">
            <div className="h-4 w-4 bg-zinc-800 rounded" />
          </div>
          <div className="col-span-9">
            <div className="h-4 w-3/4 bg-zinc-800 rounded" />
          </div>
          <div className="col-span-2">
            <div className="h-4 w-16 bg-zinc-800 rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Trophy className="h-12 w-12 text-zinc-700 mb-4" />
      <h3 className="text-lg font-medium text-zinc-400 mb-2">{LEADERBOARD.EMPTY_STATE.TITLE}</h3>
      <p className="text-sm text-zinc-500 text-center max-w-sm">
        {LEADERBOARD.EMPTY_STATE.DESCRIPTION}
      </p>
    </div>
  );
};

const formatNumber = (value: string | number) => {
  const num = Number(value);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const shortenAddress = (address: string) => {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
};

const Table: FC<Props> = ({ data, isLoading, isError, activeTab }) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = async (account: string) => {
    await CopyToClipboard(account);
    setCopiedAccount(account);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div
      className="mt-8 bg-[#141217] rounded-xl border border-zinc-800 overflow-hidden mx-auto"
      style={{ width: 700 }}
    >
      {/* Header */}
      {activeTab === LEADERBOARD_TABS.TRADERS ? (
        <div className="grid grid-cols-[80px_220px_130px_130px_135px] p-2 bg-zinc-900/50 text-zinc-400 text-sm items-center">
          <div className="text-center">Rank</div>
          <div className="text-center">Account</div>
          <div className="text-center">Total Traded Value</div>
          <div className="text-center">Earnings</div>
          <div className="text-center">P&L (CRD)</div>
        </div>
      ) : (
        <div className="grid grid-cols-[80px_220px_130px_130px_135px] p-2 bg-zinc-900/50 text-zinc-400 text-sm items-center">
          <div className="text-center">{LEADERBOARD.TABLE.HEADERS.RANK}</div>
          <div className="text-center">{LEADERBOARD.TABLE.HEADERS.ACCOUNT}</div>
          <div className="text-center">Fees Paid</div>
          <div className="text-center">Earnings</div>
          <div className="text-center">{LEADERBOARD.TABLE.HEADERS.PROFIT}</div>
        </div>
      )}

      {/* Body */}
      {isError ? (
        <div className="p-4">
          <Alert variant="destructive" className="bg-transparent border-red-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{LEADERBOARD.ERROR.MESSAGE}</AlertDescription>
          </Alert>
        </div>
      ) : isLoading ? (
        <TableSkeleton />
      ) : data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-zinc-800">
          {data.map((item) => {
            const isCopied = copiedAccount === item.address;
            return activeTab === LEADERBOARD_TABS.TRADERS ? (
              <div
                key={item.address}
                className={`grid grid-cols-[80px_220px_130px_130px_140px] p-2 text-sm hover:bg-zinc-900/40 transition-colors duration-200 items-center`}
              >
                <div className="text-center text-zinc-400 flex items-center justify-center">
                  <span className={item.rank <= 3 ? 'text-xl' : ''}>
                    {item.rank === 1 ? (
                      <span title="1st" className="text-2xl">
                        🥇
                      </span>
                    ) : item.rank === 2 ? (
                      <span title="2nd" className="text-2xl">
                        🥈
                      </span>
                    ) : item.rank === 3 ? (
                      <span title="3rd" className="text-2xl">
                        🥉
                      </span>
                    ) : (
                      item.rank
                    )}
                  </span>
                </div>
                <div className="font-mono flex items-center gap-2 truncate overflow-hidden justify-center">
                  <span title={item.address} className="truncate block max-w-full">
                    {shortenAddress(item.address)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-4 w-4 ${isCopied ? 'text-[#95DE64]' : 'text-zinc-400 hover:text-zinc-300'}`}
                    onClick={() => handleCopy(item.address)}
                  >
                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="text-right tabular-nums flex items-center justify-center">
                  {'totalTradedValue' in item &&
                  item.totalTradedValue !== undefined &&
                  !isNaN(Number(item.totalTradedValue))
                    ? formatNumber(item.totalTradedValue)
                    : '0.00'}
                </div>
                <div className="text-right tabular-nums flex items-center justify-center">
                  {'earnings' in item &&
                  item.earnings !== undefined &&
                  !isNaN(Number(item.earnings))
                    ? formatNumber(item.earnings)
                    : '0.00'}
                </div>
                <div
                  className={`text-right tabular-nums flex items-center justify-center ${
                    Number(item.pnl) >= 0 ? 'text-[#95DE64]' : 'text-red-500'
                  }`}
                >
                  {formatNumber(item.pnl)}
                </div>
              </div>
            ) : (
              <div
                key={item.address}
                className="grid grid-cols-[80px_220px_130px_130px_140px] p-2 text-sm hover:bg-zinc-900/40 transition-colors duration-200 items-center"
              >
                <div className="text-center text-zinc-400 flex items-center justify-center">
                  <span className={item.rank <= 3 ? 'text-xl' : ''}>
                    {item.rank === 1 ? (
                      <span title="1st" className="text-2xl">
                        🥇
                      </span>
                    ) : item.rank === 2 ? (
                      <span title="2nd" className="text-2xl">
                        🥈
                      </span>
                    ) : item.rank === 3 ? (
                      <span title="3rd" className="text-2xl">
                        🥉
                      </span>
                    ) : (
                      item.rank
                    )}
                  </span>
                </div>
                <div className="font-mono flex items-center gap-2 truncate overflow-hidden justify-center">
                  <span title={item.address} className="truncate block max-w-full">
                    {shortenAddress(item.address)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-4 w-4 ${isCopied ? 'text-[#95DE64]' : 'text-zinc-400 hover:text-zinc-300'}`}
                    onClick={() => handleCopy(item.address)}
                  >
                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="text-right tabular-nums flex items-center justify-center">
                  {'feesPaid' in item &&
                  item.feesPaid !== undefined &&
                  !isNaN(Number(item.feesPaid))
                    ? formatNumber(item.feesPaid)
                    : '0.00'}
                </div>
                <div className="text-right tabular-nums flex items-center justify-center">
                  {'earnings' in item &&
                  item.earnings !== undefined &&
                  !isNaN(Number(item.earnings))
                    ? formatNumber(item.earnings)
                    : '0.00'}
                </div>
                <div
                  className={`text-right tabular-nums flex items-center justify-center ${
                    Number(item.pnl) >= 0 ? 'text-[#95DE64]' : 'text-red-500'
                  }`}
                >
                  {formatNumber(item.pnl)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Table;
