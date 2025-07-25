'use client';

import { useApiClient } from '@/config/api-client';
// import { getIconPath } from '@/components/bet';
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
import { useAccount, useChainId } from 'wagmi';
import { DuelShimmer } from './duel-shimmer';
import { DuelState } from './duel-state';
import { useRouter } from 'next/navigation';

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
  duelId: string;
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
  duelId: string;
  durationMinutes?: number;
}
const getIconPath = (duelType?: string, title?: string): string => {
  if (duelType === 'COIN_DUEL' && title) {
    const symbol = title.split(' ')[1];
    return `/crypto-icons/light/crypto-${symbol.toLowerCase()}-usd.inline.svg`;
  }
  return '';
};

const TokenIcon: FC<{ duelType?: string; title?: string; duel: DuelItem }> = ({
  duelType,
  title,
  duel,
}) => {
  // For crypto duels, use getIconPath
  if (duelType === 'COIN_DUEL') {
    return title ? (
      <Image
        src={getIconPath(duelType, title)}
        alt={`${title} icon`}
        width={24}
        height={24}
        className="rounded-full"
      />
    ) : null;
  }

  // For other duels, use provided imageSrc
  if (duel.imageSrc) {
    console.log('duel.imageSrc', duel);
    return (
      <Image src={duel.imageSrc} alt="Token icon" width={24} height={24} className="rounded-full" />
    );
  }

  return null;
};

const StatusBadge: FC<{ status: number }> = ({ status }) => {
  const statusMap: Record<number, { label: string; style: string }> = {
    0: { label: 'Active', style: 'bg-green-500/20 text-green-500' },
    1: { label: 'Completed', style: 'bg-blue-500/20 text-blue-500' },
    2: { label: 'Pending', style: 'bg-yellow-500/20 text-yellow-500' },
    3: { label: 'Approved', style: 'bg-green-500/20 text-green-500' },
    4: { label: 'Rejected', style: 'bg-red-500/20 text-red-500' },
    5: { label: 'Cancelled', style: 'bg-orange-500/20 text-orange-500' },
    [-1]: { label: 'Bootstrapping', style: 'bg-purple-500/20 text-purple-500' },
  };

  const { label, style } = statusMap[status] || {
    label: 'Unknown',
    style: 'bg-gray-500/20 text-gray-500',
  };

  return <span className={cn('px-2 py-1 rounded-full text-sm font-medium', style)}>{label}</span>;
};

const calculateTimeLeft = (duel: DuelItem): number => {
  if (duel.status === -1) {
    // 30 minutes bootstrapping + duel duration (in seconds)
    const bootstrappingPeriod = 30 * 60; // 30 minutes in seconds
    // const duelDurationSec = (duel.durationMinutes || 0) * 60;
    // const totalPeriod = bootstrappingPeriod + duelDurationSec;
    const totalPeriod = bootstrappingPeriod;

    const rawCreatedAt = duel.createdAt ?? 0;
    const createdAtSec = rawCreatedAt > 1e12 ? Math.floor(rawCreatedAt / 1000) : rawCreatedAt;
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - createdAtSec;
    const remaining = totalPeriod - elapsed;
    return Math.max(remaining, 0);
  } else {
    const endTimeSec = (duel.startAt || 0) + (duel.durationMinutes || 0) * 60;
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTimeSec - now;
    return Math.max(remaining, 0);
  }
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TimeLeftCell: FC<{ duel: DuelItem }> = ({ duel }) => {
  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft(duel));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(duel));
    }, 1000);

    return () => clearInterval(timer);
  }, [duel]);

  return <TableCell className="text-gray-300 font-mono">{formatDuration(timeLeft)}</TableCell>;
};

const isDuelClickable = (status: number): boolean => {
  return status === 0 || status === -1; // Active or Bootstrapping
};

const Duels: FC = () => {
  const [duels, setDuels] = useState<DuelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const router = useRouter();
  const chainId = useChainId();
  const apiClient = useApiClient(chainId);

  const fetchDuels = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`user/portfolio/duels`, {
        userAddress: address.toLowerCase(),
      });

      const allDuels: DuelItem[] = [];

      // Add regular duels
      if (response.data.allDuels) {
        const filteredDuels = response.data.allDuels.map((item: DuelResponseItem) => ({
          title:
            item.betString ||
            `Will ${item.token} be ${item.winCondition === 0 ? 'ABOVE' : 'BELOW'} $${item.triggerPrice} ?`,
          imageSrc: item.betIcon || '',
          status: item.status,
          duelType: item.duelType,
          timeLeft: item.endsIn,
          token: item.token,
          createdAt: item.createdAt,
          startAt: item.startAt || 0,
          duelId: item.duelId,
          durationMinutes: (item.endsIn || 0) * 60,
        }));
        allDuels.push(...filteredDuels);
      }

      let filteredPendingDuels: DuelItem[] = [];
      if (response.data.pendingDuels) {
        filteredPendingDuels = response.data.pendingDuels.map(
          (item: { data: DuelResponseItem; status: string; type: string; createdAt: number }) => {
            return {
              title:
                item.data.betString ||
                `Will ${item.data.token} be ${item.data.winCondition === 0 ? 'ABOVE' : 'BELOW'} $${item.data.triggerPrice} ?`,
              imageSrc: item.data.betIcon || '',
              status: item.status === 'pending' ? 2 : item.status === 'approved' ? -1 : 4,
              duelType: item.type,
              timeLeft: item.data.endsIn,
              token: item.data.token,
              createdAt: item.createdAt || 0,
              startAt: item.data?.startAt || 0,
              duelId: item.data.duelId,
              durationMinutes: (item.data.endsIn || 0) * 60,
            };
          },
        );
        allDuels.push(...filteredPendingDuels);
      }

      // Helper to normalize timestamps to seconds
      const normalizeTimestamp = (ts: number) => (ts > 1e12 ? Math.floor(ts / 1000) : ts);

      // Prefer pending/bootstrapping duels when de-duplicating
      const duelMap = new Map<string, DuelItem>();
      allDuels.forEach((duel) => {
        duelMap.set(duel.duelId, duel);
      });
      if (response.data.pendingDuels) {
        filteredPendingDuels.forEach((duel: DuelItem) => {
          // If duel is pending or bootstrapping, overwrite any existing entry
          if (duel.status === 2 || duel.status === -1) {
            duelMap.set(duel.duelId, duel);
          }
        });
      }
      const uniqueDuels = Array.from(duelMap.values());

      // Sort duels by createdAt timestamp in descending order (latest first)
      const sortedDuels = uniqueDuels.sort((a, b) => {
        const timeA = normalizeTimestamp(a.createdAt || 0);
        const timeB = normalizeTimestamp(b.createdAt || 0);
        return timeB - timeA;
      });

      setDuels(sortedDuels);
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
    return (
      <div className="flex flex-col gap-4 mt-10">
        <DuelShimmer />
      </div>
    );
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
    <div className="w-full h-full">
      <h1 className="text-xl p-2">Your Duels</h1>
      <div className="w-full h-[calc(100%-3rem)] rounded-lg border border-neutral-800 shadow-sm bg-neutral-900">
        <div className="h-full overflow-auto">
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
                <TableRow
                  key={index}
                  className={cn(
                    'border-neutral-800',
                    isDuelClickable(duel.status)
                      ? 'hover:bg-neutral-800/50 cursor-pointer'
                      : 'hover:bg-neutral-800/50 opacity-70',
                  )}
                  onClick={() =>
                    isDuelClickable(duel.status) && router.push(`/bet?duelId=${duel.duelId}`)
                  }
                >
                  <TableCell className="flex items-center gap-3 font-medium text-gray-100">
                    <TokenIcon duelType={duel.duelType} title={duel.title} duel={duel} />
                    {duel.title}
                  </TableCell>
                  <TableCell className="text-gray-300">{duel.duelType}</TableCell>
                  <TableCell>
                    <StatusBadge status={duel.status} />
                  </TableCell>
                  <TimeLeftCell duel={duel} />
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
