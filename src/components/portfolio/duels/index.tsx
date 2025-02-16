'use client';

import { baseApiClient } from '@/config/api-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { cn } from '@/shadcn/lib/utils';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { DuelShimmer } from './duel-shimmer';
import { DuelState } from './duel-state';

interface DuelResponseItem {
  betString: string;
  betIcon: string;
  status: number;
  duelType: string;
  endsIn: number;
  token: string;
  createdAt: number;
  startAt?: number;
  winCondition: number;
  triggerPrice: number;
}
interface DuelItem {
  title: string;
  imageSrc: string;
  status: number;
  duelType: string;
  timeLeft: number;
  token?: string;
  createdAt?: number;
  startAt?: number;
}

const TokenIcon: FC<{ token?: string; imageSrc?: string }> = ({ token, imageSrc }) => {
  if (imageSrc) {
    return (
      <Image src={imageSrc} alt="Token icon" width={24} height={24} className="rounded-full" />
    );
  }

  const tokenIcons = {
    BTC: '/btc.svg',
    ETH: '/eth.svg',
    USDT: '/usdt.svg',
  };

  if (!token || !tokenIcons[token as keyof typeof tokenIcons]) {
    return null;
  }

  return (
    <Image
      src={tokenIcons[token as keyof typeof tokenIcons]}
      alt={`${token} icon`}
      width={24}
      height={24}
      className="rounded-full"
    />
  );
};

const StatusBadge: FC<{ status: number }> = ({ status }) => {
  const statusMap: Record<number, { label: string; style: string }> = {
    0: { label: 'Active', style: 'bg-green-500/20 text-green-500' },
    1: { label: 'Completed', style: 'bg-blue-500/20 text-blue-500' },
    2: { label: 'Pending', style: 'bg-yellow-500/20 text-yellow-500' },
    3: { label: 'Approved', style: 'bg-green-500/20 text-green-500' },
    4: { label: 'Rejected', style: 'bg-red-500/20 text-red-500' },
    [-1]: { label: 'Bootstrapping', style: 'bg-purple-500/20 text-purple-500' },
  };

  const { label, style } = statusMap[status] || {
    label: 'Unknown',
    style: 'bg-gray-500/20 text-gray-500',
  };

  return <span className={cn('px-2 py-1 rounded-full text-sm font-medium', style)}>{label}</span>;
};

const formatDuration = (timeLeft: number): string => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Duels: FC = () => {
  const [duels, setDuels] = useState<DuelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const fetchDuels = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await baseApiClient.post(`/portfolio/duels`, {
        userAddress: address.toLowerCase(),
      });

      const allDuels: DuelItem[] = [];

      // Add regular duels
      if (response.data.allDuels) {
        const filteredDuels = response.data.allDuels.map((item: DuelResponseItem) => ({
          title:
            item.betString ||
            `Will ${item.token} be ${item.winCondition === 0 ? 'ABOVE' : 'BELOW'} ${item.triggerPrice}`,
          imageSrc: item.betIcon || '',
          status: item.status,
          duelType: item.duelType,
          timeLeft: item.endsIn,
          token: item.token,
          createdAt: item.createdAt,
          startAt: item.startAt || 0,
        }));
        allDuels.push(...filteredDuels);
      }

      // Add pending duels
      // if (response.data.pendingDuels) {
      //   const filteredPendingDuels = response.data.pendingDuels.map((item: ) => ({
      //     title:
      //       item.data.betString ||
      //       `Will ${item.data.token} be ${item.data.winCondition === 0 ? 'ABOVE' : 'BELOW'} ${item.data.triggerPrice}`,
      //     imageSrc: item.data.betIcon || '',
      //     status: item.status === 'pending' ? 2 : item.status === 'approved' ? 3 : 4,
      //     duelType: item.type,
      //     timeLeft: item.data.endsIn,
      //     token: item.data.token,
      //   }));
      //   allDuels.push(...filteredPendingDuels);
      // }

      if (response.data.pendingDuels) {
        const filteredPendingDuels = response.data.pendingDuels.map(
          (item: { data: DuelResponseItem; status: string; type: string }) => ({
            title:
              item.data.betString ||
              `Will ${item.data.token} be ${item.data.winCondition === 0 ? 'ABOVE' : 'BELOW'} ${item.data.triggerPrice}`,
            imageSrc: item.data.betIcon || '',
            status: item.status === 'pending' ? 2 : item.status === 'approved' ? 3 : 4,
            duelType: item.type,
            timeLeft: item.data.endsIn,
            token: item.data.token,
          }),
        );
        allDuels.push(...filteredPendingDuels);
      }

      setDuels(allDuels);
    } catch (error) {
      console.error('Error fetching duels:', error);
      setError('Failed to fetch duels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuels();
  }, [address]);

  if (loading) {
    return <DuelShimmer />;
  }

  if (error) {
    return <DuelState type="error" message={error} />;
  }

  if (!address) {
    return <DuelState type="no-wallet" />;
  }

  if (duels.length === 0) {
    return <DuelState type="empty" />;
  }

  return (
    <div className="w-full">
      <h1 className="text-xl p-2">Your Duels</h1>
      <div className="w-full rounded-lg border border-neutral-800 shadow-sm bg-neutral-900">
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-neutral-900 z-10">
              <TableRow className="hover:bg-transparent border-neutral-800">
                <TableHead className="text-gray-400 font-medium">Duel</TableHead>
                <TableHead className="text-gray-400 font-medium">Type</TableHead>
                <TableHead className="text-gray-400 font-medium">Status</TableHead>
                <TableHead className="text-gray-400 font-medium">Time Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {duels.map((duel, index) => (
                <TableRow key={index} className="border-neutral-800 hover:bg-neutral-800/50">
                  <TableCell className="flex items-center gap-3 font-medium text-gray-100">
                    <TokenIcon token={duel.token} imageSrc={duel.imageSrc} />
                    {duel.title}
                  </TableCell>
                  <TableCell className="text-gray-300">{duel.duelType}</TableCell>
                  <TableCell>
                    <StatusBadge status={duel.status} />
                  </TableCell>
                  <TableCell className="text-gray-300 font-mono">
                    {formatDuration(duel.timeLeft)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Duels;
