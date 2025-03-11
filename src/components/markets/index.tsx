'use client';

import { SERVER_CONFIG } from '@/config/server-config';
import { DUEL_STATUS } from '@/constants/duel';
import { CATEGORIES } from '@/constants/markets';
import { setSelectedPosition } from '@/store/slices/betSlice';
import { Duel, NewDuelItem, Position, DuelStatus as TDualStatus } from '@/types/duel';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Categories from './categories';
import Duels from './duals';
import DuelStatus from './duel-status';
import SearchDuels from './search-duel';

const Markets: FC = () => {
  const router = useRouter();
  const [duels, setDuels] = useState<Duel[]>([]);
  const [activeStatus, setActiveStatus] = useState<TDualStatus>(DUEL_STATUS.LIVE);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES['ALL_DUELS'].title); // Category state
  const wsRef = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();

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
              if (activeStatus === DUEL_STATUS.LIVE) {
                return item.status === 0;
              } else if (activeStatus === DUEL_STATUS.BOOTSTRAPPING) {
                return item.status === -1; // Only bootstrapping duels
              } else if (activeStatus === DUEL_STATUS.COMPLETED) {
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
              winner: item.winner,
            }));
          console.log({ filteredDuels });
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
    const matchesCategory =
      activeCategory === 'All Duels' ? true : duel.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDuelRowClick = (duelId: string) => {
    dispatch(setSelectedPosition(null)); // Reset position when clicking the row
    router.push(`/bet?duelId=${duelId}`);
  };

  const handlePositionSelect = (duelId: string, position: Position) => {
    dispatch(setSelectedPosition(position));
    router.push(`/bet?duelId=${duelId}`);
  };
  return (
    <div className="px-4">
      <Categories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <div className="flex justify-between items-center">
        <DuelStatus activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
        <SearchDuels placeholder="Search Duels" onSearch={setSearchQuery} />
      </div>
      <div className="max-h-sm">
        <Duels
          data={filteredDuels}
          handleDuelRowClick={handleDuelRowClick}
          onPositionSelect={handlePositionSelect}
        />
      </div>
    </div>
  );
};

export default Markets;
