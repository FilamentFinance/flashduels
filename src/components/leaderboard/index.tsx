'use client';

import { useApiClient } from '@/config/api-client';
import { LEADERBOARD_TABS } from '@/constants/leaderboard';
import { LeaderboardItem, LeaderboardTab } from '@/types/leaderboard';
import { FC, useEffect, useState } from 'react';
import Header from './header';
import Table from './table';
import { useChainId } from 'wagmi';

const Leaderboard: FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>(LEADERBOARD_TABS.CREATORS);
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);
  // const [showContent, setShowContent] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // setIsError(false);
      const chainId = useChainId();
      const apiClient = useApiClient(chainId);
      const response = await apiClient.get(
        `/leaderboard/${activeTab === LEADERBOARD_TABS.CREATORS ? 'creators' : 'traders'}`,
        {
          params: {
            page: 1,
            limit: 10,
          },
        },
      );
      // Add rank numbers to the data
      const dataWithRanks = response.data.data.map((item: LeaderboardItem, index: number) => ({
        ...item,
        rank: index + 1 + (response.data.page - 1) * response.data.limit,
      }));
      setData(dataWithRanks);
    } catch (error) {
      console.error('Error fetching data:', error);
      // setIsError(true);
    } finally {
      setIsLoading(false);
      // Use setTimeout instead of requestAnimationFrame for better SSR compatibility
      // const timer = setTimeout(() => {
      //   setShowContent(true);
      // }, 0);
      // return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    // setShowContent(false);
    fetchData();
  }, [activeTab]);

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <div className="w-full max-w-5xl">
        <div className="relative">
          <div
            className={`transition-all duration-500 ease-in-out ${
              !isLoading ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              visibility: !isLoading ? 'visible' : 'hidden',
              filter: isLoading ? 'blur(2px)' : 'none',
            }}
          >
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <Table data={data} isLoading={isLoading} isError={false} activeTab={activeTab} />
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-transparent backdrop-blur-[2px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
