'use client';

import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { ActiveDuels, TableDuel } from '@/types/duel';
import React, { FC } from 'react';
import { useAccount } from 'wagmi';
import { DuelShimmer } from '../duels/duel-shimmer';
import { DuelState } from '../duels/duel-state';
import { DuelRow } from './duel-row';
import { TabButton } from './tab-button';
import { TableHeader } from './tab-header';

const DuelsHistory: FC = () => {
  const [activeTab, setActiveTab] = React.useState('duels');
  const [duels, setDuels] = React.useState<ActiveDuels>([]);
  const [history, setHistory] = React.useState<ActiveDuels>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { address } = useAccount();

  const getDuelsData = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);
      const response = await baseApiClient.post(
        `${SERVER_CONFIG.API_URL}/user/portfolio/table/duels`,
        { userAddress: address.toLowerCase() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      // Sort duels by createdAt timestamp in descending order (latest first)
      const sortedDuels = response.data.sort((a: TableDuel, b: TableDuel) => {
        const timeA = a.duelDetails?.createdAt || 0;
        const timeB = b.duelDetails?.createdAt || 0;
        return timeB - timeA;
      });
      setDuels(sortedDuels);
    } catch (error) {
      console.error('Error fetching duels data:', error);
      setError('Failed to fetch duels data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getHistoryData = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);
      const response = await baseApiClient.post(
        `${SERVER_CONFIG.API_URL}/user/portfolio/table/history`,
        { userAddress: address.toLowerCase() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      // Sort history by createdAt timestamp in descending order (latest first)
      const sortedHistory = response.data.sort((a: TableDuel, b: TableDuel) => {
        const timeA = a.duelDetails?.createdAt || 0;
        const timeB = b.duelDetails?.createdAt || 0;
        return timeB - timeA;
      });
      setHistory(sortedHistory);
    } catch (error) {
      console.error('Error fetching history data:', error);
      setError('Failed to fetch history data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    if (activeTab === 'duels') {
      getDuelsData();
    } else if (activeTab === 'history') {
      getHistoryData();
    }
  }, [activeTab, address]);

  const activeData = activeTab === 'duels' ? duels : history;

  if (!address) {
    return <DuelState type="no-wallet" />;
  }

  if (loading) {
    return <DuelShimmer />;
  }

  if (error) {
    return <DuelState type="error" message={error} />;
  }
  return (
    <div className="flex flex-col h-full w-full rounded-lg border border-neutral-800 shadow-sm bg-neutral-900">
      {/* Header Section */}
      <div className="flex items-center w-full px-4 py-2 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <TabButton
            label="Duels"
            active={activeTab === 'duels'}
            onClick={() => setActiveTab('duels')}
          />
          <TabButton
            label="History"
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col h-[calc(100%-3rem)] overflow-auto w-full">
        {/* Table Header */}
        <div className="flex items-center px-4 py-2 text-sm font-semibold text-stone-300 border-b border-neutral-800">
          <TableHeader label="Duel" width="w-[35%]" />
          <TableHeader label="Direction" width="w-[15%]" align="center" />
          <TableHeader label="Quantity" width="w-[15%]" align="center" />
          <TableHeader label="Avg. Price" width="w-[15%]" align="center" />
          <TableHeader label="Value" width="w-[15%]" align="center" />
          {activeTab === 'history' ? (
            <TableHeader label="Profit/Loss" width="w-[20%]" align="center" />
          ) : (
            <TableHeader label="Resolves in" width="w-[20%]" align="center" />
          )}
          {activeTab === 'history' && <TableHeader label="Winner" width="w-[20%]" align="center" />}
        </div>

        {/* Table Rows */}
        <div className="flex flex-col w-full">
          {activeData.length > 0 ? (
            activeData.map((item, index) => {
              console.log('Rendering duel item:', {
                index,
                duelDetails: item.duelDetails,
                yesBet: item.yesBet,
                noBet: item.noBet,
              });

              return (
                <React.Fragment key={index}>
                  {item?.yesBet?.amount && (
                    <DuelRow
                      duelName={
                        item.duelDetails.betString ||
                        `Will ${item.duelDetails.token} be ${
                          item.duelDetails.winCondition === 0 ? 'ABOVE' : 'BELOW'
                        } ${item.duelDetails.triggerPrice}`
                      }
                      direction="Yes"
                      status={item.duelDetails.status}
                      createdAt={item.duelDetails.createdAt}
                      startAt={item.duelDetails.startAt}
                      avgPrice={item.yesBet.price as string}
                      quantity={item.yesBet.quantity as string}
                      amount={item.yesBet.amount as string}
                      resolvesIn={item.duelDetails.endsIn as number}
                      icon={item.duelDetails.betIcon}
                      duelType={item.duelDetails.duelType}
                      pnl={item.pnl}
                      activeTab={activeTab}
                      winner={activeTab == 'history' ? item.duelDetails.winner : undefined}
                    />
                  )}
                  {item?.noBet?.amount && (
                    <DuelRow
                      duelName={
                        item.duelDetails.betString ||
                        `Will ${item.duelDetails.token} be ${
                          item.duelDetails.winCondition === 0 ? 'ABOVE' : 'BELOW'
                        } ${item.duelDetails.triggerPrice}`
                      }
                      direction="No"
                      status={item.duelDetails.status}
                      createdAt={item.duelDetails.createdAt}
                      startAt={item.duelDetails.startAt}
                      avgPrice={item.noBet.price as string}
                      quantity={item.noBet.quantity}
                      amount={item.noBet.amount as string}
                      resolvesIn={item.duelDetails.endsIn as number}
                      icon={item.duelDetails.betIcon}
                      pnl={item.pnl}
                      activeTab={activeTab}
                      winner={activeTab == 'history' ? item.duelDetails.winner : undefined}
                    />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <DuelState type="empty" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DuelsHistory;
