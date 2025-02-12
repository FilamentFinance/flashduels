'use client';

import { baseApiClient } from '@/config/api-client';
import { LEADERBOARD_TABS } from '@/constants/leaderboard';
import { LeaderboardItem, LeaderboardTab } from '@/types/leaderboard';
import { FC, useEffect, useState } from 'react';
import Header from './header';
import Table from './table';

const Leaderboard: FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>(LEADERBOARD_TABS.CREATORS);
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await baseApiClient.get(
        `flashduels/leaderboard/${activeTab === LEADERBOARD_TABS.CREATORS ? 'creators' : 'traders'}`,
      );
      setData(response.data.userProfits);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="flex flex-col items-center w-full">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Table data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
};

export default Leaderboard;
