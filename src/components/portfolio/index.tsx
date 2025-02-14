'use client';
import { baseApiClient } from '@/config/api-client';
import { FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const Portfolio: FC = () => {
  const { address } = useAccount();

  interface AccountData {
    positionValue: string;
    pnl: string;
    totalBets: number;
    totalDuelCreated: number;
  }

  const [accountData, setAccountData] = useState<AccountData | null>(null);

  const fetchPortfolio = async () => {
    try {
      const response = await baseApiClient.post(
        
        'http://localhost:3004/flashduels/portfolio/accountDetails',
        {
          userAddress: address?.toLowerCase(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAccountData(response.data.portfolioData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (address) {
      fetchPortfolio();
    }
  }, [address]);
  console.log({ accountData });
  return <div>Portfolio {address}</div>;
};

export default Portfolio;
