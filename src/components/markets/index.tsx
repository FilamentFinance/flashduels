'use client';

import { SERVER_CONFIG } from '@/config/server-config';
import { DUEL_STATUS } from '@/constants/duel';
import { CATEGORIES } from '@/constants/markets';
import { setSelectedPosition } from '@/store/slices/betSlice';
import { Duel, NewDuelItem, Position, DuelStatus as TDualStatus } from '@/types/duel';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useChainId } from 'wagmi';
import { CreatorVerify } from '../creator/verify';
import Categories from './categories';
import Duels from './duals';
import NoDuels from './duals/no-duels';
import DuelStatus from './duel-status';
import SearchDuels from './search-duel';
// import Banner from './banner';
import TrendingBanner from './trending-banner';

const ITEMS_PER_PAGE = 10;

const Markets: FC = () => {
  const router = useRouter();
  const chainId = useChainId();
  const [duels, setDuels] = useState<Duel[]>([]);
  const [allDuels, setAllDuels] = useState<Duel[]>([]); // New state for all duels
  const [activeStatus, setActiveStatus] = useState<TDualStatus>(DUEL_STATUS.LIVE);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES['ALL_DUELS'].title); // Category state
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('twitterConnected') === 'true') {
      setVerifyModalOpen(true);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    setIsLoading(true);
    setDuels([]); // Clear existing duels when switching tabs

    const connectWebSocket = () => {
      wsRef.current = new WebSocket(`${SERVER_CONFIG.getApiWsUrl(chainId)}/ws`);

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
          const currentTime = Math.floor(Date.now() / 1000);
          const allDuelsData = message.allDuels.map((item: NewDuelItem) => ({
            title:
              item.betString ||
              `Will ${item.token} be ${item.winCondition === 0 ? 'ABOVE' : 'BELOW'} $${item.triggerPrice} ?`,
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
            creatorTwitterImage: item.user.twitterImageUrl,
            token: item.token,
            triggerPrice: item.triggerPrice,
            totalBetAmount: item.totalBetAmount,
            winCondition: item.winCondition,
            winner: item.winner,
          }));

          // Store all duels for trending banner
          setAllDuels(allDuelsData);

          // Filter duels based on active status
          const filteredDuels = allDuelsData.filter((duel: Duel) => {
            if (activeStatus === DUEL_STATUS.LIVE) {
              return duel.status === 0;
            } else if (activeStatus === DUEL_STATUS.BOOTSTRAPPING) {
              return duel.status === -1;
            } else if (activeStatus === DUEL_STATUS.COMPLETED) {
              return duel.status === 1;
            } else if (activeStatus === DUEL_STATUS.YET_TO_BE_RESOLVED) {
              const endTime = (duel.startAt || 0) + duel.timeLeft * 60 * 60;
              return duel.duelType === 'FLASH_DUEL' && duel.status === 0 && endTime < currentTime;
            }
            return true;
          });

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
          setIsLoading(false);
        }
      };

      wsRef.current.onerror = function (error) {
        console.log('WebSocket Error:', error);
        setIsLoading(false);
      };

      wsRef.current.onclose = function () {
        console.log('Disconnected from the WebSocket server');
        setIsLoading(false);
      };
    };

    // Close existing WebSocket connection if it exists
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'UNSUBSCRIBE', channel: 'duels' }));
      wsRef.current.close();
    }

    // Add a small delay before connecting to show the loading state
    const timeoutId = setTimeout(() => {
      connectWebSocket();
    }, 300);

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'UNSUBSCRIBE', channel: 'duels' }));
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [activeStatus as TDualStatus, chainId as number]);

  const filteredDuels = duels.filter((duel) => {
    const matchesSearch = duel.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All Duels'
        ? true
        : duel.category.toLowerCase() === activeCategory.toLowerCase() ||
          (activeCategory === 'Formula One (F1)' && duel.category.toLowerCase() === 'formula_one');
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDuels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDuels = filteredDuels.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, activeCategory, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the duels list
    const duelsContainer = document.querySelector('.duels-container');
    if (duelsContainer) {
      duelsContainer.scrollTop = 0;
    }
  };

  const handleDuelRowClick = (duelId: string, status: number) => {
    // Do nothing if the duel is completed (status === 1)
    if (status === 1) return;

    // For To Be Resolved tab, check if timer has ended
    if (activeStatus === DUEL_STATUS.YET_TO_BE_RESOLVED) {
      const duel = duels.find((d) => d.duelId === duelId);
      if (duel) {
        const endTime = (duel.startAt || 0) + duel.timeLeft * 60 * 60;
        const currentTime = Math.floor(Date.now() / 1000);
        if (endTime < currentTime) return; // Don't allow click if timer has ended
      }
    }

    dispatch(setSelectedPosition(null)); // Reset position when clicking the row
    router.push(`/bet?duelId=${duelId}`);
  };

  const handlePositionSelect = (duelId: string, position: Position, status: number) => {
    // Do nothing if the duel is completed (status === 1)
    if (status === 1) return;

    // For To Be Resolved tab, check if timer has ended
    if (activeStatus === DUEL_STATUS.YET_TO_BE_RESOLVED) {
      const duel = duels.find((d) => d.duelId === duelId);
      if (duel) {
        const endTime = (duel.startAt || 0) + duel.timeLeft * 60 * 60;
        const currentTime = Math.floor(Date.now() / 1000);
        if (endTime < currentTime) return; // Don't allow click if timer has ended
      }
    }

    dispatch(setSelectedPosition(position));
    router.push(`/bet?duelId=${duelId}`);
  };

  // Filter trending duels from all duels, not just filtered ones
  const trendingDuels = allDuels.filter((duel) => duel.category?.toLowerCase() === 'trending');

  return (
    <div className="px-4 min-h-screen flex flex-col mt-4">
      {/* <Banner /> */}
      {trendingDuels.length > 0 && <TrendingBanner trendingDuels={trendingDuels} />}
      <Categories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <div className="flex justify-between items-center mt-2">
        <DuelStatus activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
        <SearchDuels placeholder="Search Duels" onSearch={setSearchQuery} />
      </div>
      {isLoading || !wsRef.current ? (
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-flashDualPink" />
          <p className="text-zinc-400">Loading duels...</p>
        </div>
      ) : filteredDuels.length === 0 ? (
        <div className="flex-1 flex justify-center items-center">
          <NoDuels />
        </div>
      ) : (
        <div className="relative flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-80px)] overflow-y-auto mt-2 pb-16 duels-container">
            <Duels
              data={paginatedDuels}
              handleDuelRowClick={handleDuelRowClick}
              onPositionSelect={handlePositionSelect}
            />
          </div>
        </div>
      )}
      {isVerifyModalOpen && <CreatorVerify onClose={() => setVerifyModalOpen(false)} />}
      {filteredDuels.length > 0 && totalPages > 1 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-800/80 px-3 py-1 rounded-full text-sm shadow-lg z-50 text-zinc-300">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Markets;
