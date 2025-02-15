'use client';

import { SERVER_CONFIG } from '@/config/server-config';
import { DUAL_STATUS } from '@/constants/dual';
import { CATEGORIES } from '@/constants/markets';
import { Duel, NewDuelItem, DualStatus as TDualStatus } from '@/types/dual';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';
import Categories from './categories';
import DualStatus from './dual-status';
import Duals from './duals';
import SearchDuels from './search-dual';

const Markets: FC = () => {
  const router = useRouter();
  const [duels, setDuels] = useState<Duel[]>([]);
  const [activeStatus, setActiveStatus] = useState<TDualStatus>(DUAL_STATUS.LIVE);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES['ANY'].title); // Category state
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const connectWebSocket = () => {
      wsRef.current = new WebSocket(`${SERVER_CONFIG.API_WS_URL}/ws`);

      wsRef.current.onopen = function () {
        console.log('Connected to the WebSocket server');
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'SUBSCRIBE', channel: 'duels' }));
        }
      };

      wsRef.current.onmessage = function (event) {
        if (!isSubscribed) return;

        const message = JSON.parse(event.data);
        if (message.allDuels) {
          const filteredDuels = message.allDuels
            .filter((item: NewDuelItem) => {
              if (activeStatus === DUAL_STATUS.LIVE) {
                return item.status === 0;
              } else if (activeStatus === DUAL_STATUS.BOOTSTRAPPING) {
                return item.status === -1; // Only bootstrapping duels
              } else if (activeStatus === DUAL_STATUS.COMPLETED) {
                return item.status === 1; // Only completed duels
              }
              return true;
            })
            .map((item: NewDuelItem) => ({
              title:
                item.betString ||
                `Will ${item.token} be ${item.winCondition === 0 ? 'ABOVE' : 'BELOW'} ${item.triggerPrice}`,
              imageSrc: item.betIcon || 'empty-string',
              volume: `$${item.totalBetAmount}`,
              category: item.category,
              status: item.status,
              duelId: item.duelId,
              duelType: item.duelType,
              timeLeft: item.endsIn,
              startAt: item.startAt || 0,
              createdAt: item.createdAt,
              percentage: 50,
              createdBy: item.user.twitterUsername || truncateAddress(item.user.address),
              token: item.token,
              triggerPrice: item.triggerPrice,
              totalBetAmount: item.totalBetAmount,
              winCondition: item.winCondition,
            }));

          setDuels(filteredDuels);
        }
      };

      wsRef.current.onerror = function (error) {
        console.log('WebSocket Error:', error);
      };

      wsRef.current.onclose = function () {
        console.log('Disconnected from the WebSocket server');
      };
    };

    connectWebSocket();

    return () => {
      isSubscribed = false;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'UNSUBSCRIBE', channel: 'duels' }));
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [activeStatus]);
  const filteredDuels = duels.filter((duel) => {
    const matchesSearch = duel.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Any' ? true : duel.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDualRowClick = (duelId: string) => {
    router.push(`/bet?duelId=${duelId}`);
  };

  return (
    <div className="px-4">
      <Categories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <div className="flex justify-between items-center">
        <DualStatus activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
        <SearchDuels placeholder="Search Duels" onSearch={setSearchQuery} />
      </div>
      <Duals data={filteredDuels} handleDualRowClick={handleDualRowClick} />
    </div>
  );
};

export default Markets;
