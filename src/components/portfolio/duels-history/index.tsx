'use client';

import React, { FC } from 'react';
import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { ActiveDuels } from '@/types/dual';
import { useAccount } from 'wagmi';
import { TabButton } from './tab-button';
import { TableHeader } from './tab-header';
import { DuelRow } from './duel-row';

const DuelsHistory: FC = () => {
  const [activeTab, setActiveTab] = React.useState('duels');
  const [duels, setDuels] = React.useState<ActiveDuels>([]);
  const [history, setHistory] = React.useState<ActiveDuels>([]);
  const { address } = useAccount();

  const getDuelsData = async () => {
    try {
      const response = await baseApiClient.post(
        `${SERVER_CONFIG.API_URL}/portfolio/table/duels`,
        { userAddress: address?.toLowerCase() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setDuels(response.data);
    } catch (error) {
      console.error('Error fetching duels data:', error);
    }
  };

  const getHistoryData = async () => {
    try {
      const response = await baseApiClient.post(
        `${SERVER_CONFIG.API_URL}/portfolio/table/history`,
        { userAddress: address?.toLowerCase() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  // Fetch data when activeTab changes or when address is available
  React.useEffect(() => {
    if (activeTab === 'duels') {
      getDuelsData();
    } else if (activeTab === 'history') {
      getHistoryData();
    }
  }, [activeTab, address]);

  const activeData = activeTab === 'duels' ? duels : history;

  return (
    <div className="flex flex-col min-h-[291px] w-full rounded-lg border border-neutral-800 shadow-sm bg-neutral-900">
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
      <div className="flex flex-col overflow-x-auto w-full">
        {/* Table Header */}
        <div className="flex items-center px-4 py-2 text-sm font-semibold text-stone-300 border-b border-neutral-800">
          <TableHeader label="Duel" width="w-[25%]" />
          <TableHeader label="Direction" width="w-[15%]" align="center" />
          <TableHeader label="Quantity" width="w-[15%]" align="center" />
          <TableHeader label="Avg. Price" width="w-[15%]" align="center" />
          <TableHeader label="Value" width="w-[15%]" align="center" />
          {activeTab === 'history' ? (
            <TableHeader label="Profit/Loss" width="w-[20%]" align="center" />
          ) : (
            <TableHeader label="Resolves in" width="w-[20%]" align="center" />
          )}
        </div>

        {/* Table Rows */}
        <div className="flex flex-col w-full">
          {activeData.length > 0 ? (
            activeData.map((item, index) => (
              <React.Fragment key={index}>
                {item.yesBet.amount && (
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
                    pnl={item.pnl}
                    activeTab={activeTab}
                  />
                )}
                {item.noBet.amount && (
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
                    amount={item.yesBet.amount as string}
                    resolvesIn={item.duelDetails.endsIn as number}
                    icon={item.duelDetails.betIcon}
                    pnl={item.pnl}
                    activeTab={activeTab}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="text-center text-stone-400">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DuelsHistory;
