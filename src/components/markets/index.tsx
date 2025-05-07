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
import { CreatorVerify } from '../creator/verify';

const Markets: FC = () => {
  const router = useRouter();
  const [duels, setDuels] = useState<Duel[]>([]);
  const [activeStatus, setActiveStatus] = useState<TDualStatus>(DUEL_STATUS.LIVE);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES['ALL_DUELS'].title); // Category state
  const wsRef = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('twitterConnected') === 'true') {
      setVerifyModalOpen(true);
    }
  }, []);

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
          const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
          const filteredDuels = message.allDuels
            .filter((item: NewDuelItem) => {
              const endTime = item.startAt! + item.endsIn;

              if (activeStatus === DUEL_STATUS.LIVE) {
                // For FLASH_DUELS in LIVE section:
                // Show if status is 0 (live) and end time hasn't been reached
                if (item.duelType === 'FLASH_DUEL') {
                  const endTime = (item.startAt || 0) + item.endsIn * 60 * 60;
                  return item.status === 0 && endTime > currentTime;
                }
                // For other duels in LIVE section:
                return item.status === 0;
              } else if (activeStatus === DUEL_STATUS.BOOTSTRAPPING) {
                return item.status === -1; // Only bootstrapping duels
              } else if (activeStatus === DUEL_STATUS.COMPLETED) {
                // console.log('Completed duels', item.status, item.createdAt);
                return item.status === 1; // Only completed duels
              } else if (activeStatus === DUEL_STATUS.YET_TO_BE_RESOLVED) {
                // Only show FLASH_DUELS that have passed their end time but haven't been resolved
                return item.duelType === 'FLASH_DUEL' && item.status === 0 && endTime < currentTime;
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

          // Sort completed duels from latest to oldest based on completion time
          if (activeStatus === DUEL_STATUS.COMPLETED) {
            filteredDuels.sort(
              (a: { createdAt: number }, b: { createdAt: number }) => b.createdAt - a.createdAt,
            );
          }
          // Sort bootstrapping and live duels from latest to oldest based on creation time
          else if (
            activeStatus === DUEL_STATUS.BOOTSTRAPPING ||
            activeStatus === DUEL_STATUS.LIVE
          ) {
            filteredDuels.sort(
              (a: { createdAt: number }, b: { createdAt: number }) => b.createdAt - a.createdAt,
            );
          }
          // Sort yet to be resolved duels from latest to oldest based on creation time
          else if (activeStatus === DUEL_STATUS.YET_TO_BE_RESOLVED) {
            filteredDuels.sort(
              (a: { createdAt: number }, b: { createdAt: number }) => b.createdAt - a.createdAt,
            );
          }

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

  const handleDuelRowClick = (duelId: string, status: number) => {
    // Do nothing if the duel is completed (status === 1)
    if (status === 1) return;

    dispatch(setSelectedPosition(null)); // Reset position when clicking the row
    router.push(`/bet?duelId=${duelId}`);
  };

  const handlePositionSelect = (duelId: string, position: Position, status: number) => {
    // Do nothing if the duel is completed (status === 1)
    if (status === 1) return;

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
      {isVerifyModalOpen && <CreatorVerify onClose={() => setVerifyModalOpen(false)} />}
    </div>
  );
};

export default Markets;
