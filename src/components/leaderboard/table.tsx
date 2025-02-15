'use client';

import { LEADERBOARD } from '@/constants/content/leaderboard';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Button } from '@/shadcn/components/ui/button';
import { LeaderboardItem } from '@/types/leaderboard';
import CopyToClipboard from '@/utils/general/copy-to-clipboard';
import { AlertCircle, Check, Copy, Trophy } from 'lucide-react';
import { FC, useState } from 'react';

type Props = {
  data: LeaderboardItem[];
  isLoading: boolean;
  isError: boolean;
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

const Table: FC<Props> = ({ data, isLoading, isError }) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = async (account: string) => {
    await CopyToClipboard(account);
    setCopiedAccount(account);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mt-8 bg-[#141217]">
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-zinc-900/50 text-zinc-400 text-sm">
          <div className="col-span-1">{LEADERBOARD.TABLE.HEADERS.RANK}</div>
          <div className="col-span-9">{LEADERBOARD.TABLE.HEADERS.ACCOUNT}</div>
          <div className="col-span-2 text-right">{LEADERBOARD.TABLE.HEADERS.PROFIT}</div>
        </div>

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
              return (
                <div
                  key={item.address}
                  className="grid grid-cols-12 gap-4 p-4 text-sm hover:bg-zinc-900/30"
                >
                  <div className="col-span-1 text-zinc-400">{item.rank}</div>
                  <div className="col-span-9 font-mono flex items-center gap-2">
                    {item.address}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-4 w-4 ${
                        isCopied ? 'text-[#95DE64]' : 'text-zinc-400 hover:text-zinc-300'
                      }`}
                      onClick={() => handleCopy(item.address)}
                    >
                      {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div
                    className={`col-span-2 text-right ${
                      Number(item.pnl) >= 0 ? 'text-[#95DE64]' : 'text-red-500'
                    }`}
                  >
                    {Number(item.pnl).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
