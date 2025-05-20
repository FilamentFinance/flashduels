'use client';

import { useApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
// import { useTotalBets } from '@/hooks/useTotalBets';
import { useTotalBetAmounts } from '@/hooks/useTotalBetAmounts';
import { RootState } from '@/store';
import { NewDuelItem, OptionBetType } from '@/types/duel';
import { calculateTimeLeft } from '@/utils/time';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useChainId } from 'wagmi';
import ErrorState from './error-state';
import Header from './header';
import LoadingSkeleton from './loading-skeleton';
import OrderBook from './order-book';
import { OrdersHistory } from './orders-history';
import PlaceOrder from './place-order';
import { selectedCryptoAsset as setSelectedCryptoAsset } from '@/store/slices/priceSlice';
import { truncateAddress } from '@/utils/general/getEllipsisTxt';

const Bet: FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('duelId');
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedPosition = useSelector((state: RootState) => state.bet.selectedPosition);
  const currentPrice = useSelector((state: RootState) => state.price.price);
  const { cryptoAsset } = useSelector((state: RootState) => state.price);
  const [duel, setDuel] = useState<NewDuelItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yesBets, setYesBets] = useState<OptionBetType[]>([]);
  const [noBets, setNoBets] = useState<OptionBetType[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { address } = useAccount();

  const getIconPath = (symbol: string | undefined) => {
    if (!symbol) return '/empty-string.png';
    const baseSymbol = symbol.split('.')[1]?.split('/')[0]?.toLowerCase();
    return baseSymbol
      ? `/crypto-icons/light/crypto-${baseSymbol}-usd.inline.svg`
      : '/empty-string.png';
  };

  const fetchDuel = async () => {
    const chainId = useChainId();
    const apiClient = useApiClient(chainId);
    try {
      setLoading(true);
      const response = await apiClient.get(
        `${SERVER_CONFIG.getApiUrl(chainId)}/user/duels/get-duel-by-id/${id}`,
        {
          params: {
            userAddress: address?.toLowerCase(),
          },
        },
      );
      setDuel(response.data);
      setError(null);

      // Set selected crypto asset for coinduels
      if (response.data.duelType === 'COIN_DUEL' && response.data.token) {
        const selectedAsset = cryptoAsset.find((asset) => {
          const symbol = asset.symbol.split('/')[0].replace('Crypto.', '');
          return symbol === response.data.token;
        });
        if (selectedAsset) {
          dispatch(setSelectedCryptoAsset(selectedAsset));
        }
      }
    } catch (error) {
      console.error('Error fetching duel:', error);
      setError('Failed to fetch duel details.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const chainId = useChainId();
    const socket = new WebSocket(`${SERVER_CONFIG.getApiWsUrl(chainId)}/betWebSocket?duelId=${id}`);

    socket.onopen = function () {
      console.log('Connected to the WebSocket server');
    };

    socket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      const data = message.availableOptions;

      if (data) {
        const yesBets = data.filter((bet: OptionBetType) => bet.betOption?.index === 0);
        const noBets = data.filter((bet: OptionBetType) => bet.betOption?.index === 1);
        setYesBets(yesBets);
        setNoBets(noBets);
      }
    };

    socket.onerror = function (error) {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = function () {
      console.log('Disconnected from the WebSocket server');
    };

    // Cleanup WebSocket on unmount
    return () => {
      socket.close();
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDuel();
      // Log the received position from Redux
      console.log('Received position from Redux:', selectedPosition);
    } else {
      setError('Duel ID is missing from the query parameters.');
      setLoading(false);
    }
  }, [id, address]);

  useEffect(() => {
    if (duel) {
      const updateTime = () => {
        // endsIn is already in hours (e.g., 0.084 for 5 minutes)
        let timeInSeconds = 0;
        if (duel.endsIn > 0.5) {
          timeInSeconds = duel.status === -1 ? duel.createdAt + 1800 : (duel.startAt || 0) + 1800;
          setTimeLeft(calculateTimeLeft(timeInSeconds, duel.endsIn));
        } else {
          timeInSeconds = duel.status === -1 ? duel.createdAt + 1800 : duel.startAt || 0;
          setTimeLeft(calculateTimeLeft(timeInSeconds, duel.endsIn));
        }
      };

      updateTime();
      const timer = setInterval(updateTime, 1000);

      return () => clearInterval(timer);
    }
  }, [duel]);

  // const { totalBetYes, totalBetNo } = useTotalBets(id ?? '');
  const {
    // totalYesAmount,
    // totalNoAmount,
    yesPercentage,
    noPercentage,
    loading: totalBetAmountsLoading,
    error: totalBetAmountsError,
  } = useTotalBetAmounts(id ?? '');

  if (loading || totalBetAmountsLoading) {
    return <LoadingSkeleton />;
  }

  if (error || totalBetAmountsError || !duel) {
    return <ErrorState error={error || totalBetAmountsError || 'Duel not found'} />;
  }

  // Use the percentages directly from the hook
  // const displayPercentage = Number(yesPercentage.toFixed(2));

  const handleBuyOrders = async (
    betOptionMarketId: string,
    quantity: string,
    index: number,
    sellId: number,
    amount: string,
  ) => {
    console.log({ betOptionMarketId, quantity, index, sellId, amount });
    // const result = await buyOrder(sellId, index, index);

    // if (result.success) {
    //   console.log('Buy order successful!', txHash);

    //   const response = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/user/betOption/buy`, {
    //     duelId: id,
    //     betOptionMarketId,
    //     amount,
    //   });
    //   const data = response.data.message;
    //   toast({
    //     title: 'Success',
    //     description: data,
    //   });
    // } else {
    //   console.error('Buy order failed:', result.error);
    //   toast({
    //     title: 'Error',
    //     description: result.error || 'Failed to place order',
    //     variant: 'destructive',
    //   });
    // }
    try {
    } catch (error) {
      console.error('Error placing buy order:', error);
    }
  };

  return (
    <div className=" mx-auto p-4">
      {/* Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-stretch gap-4">
        <div className="flex w-full flex-col">
          <Header
            title={
              duel.betString ??
              `Will ${duel.token} be ${duel.winCondition === 0 ? 'ABOVE' : 'BELOW'} $${duel.triggerPrice} ?`
            }
            logo={getIconPath(duel.token)}
            triggerPrice={duel.triggerPrice || '0'}
            winCondition={duel.winCondition || 0}
            token={duel.token || ''}
            liquidity={duel.totalBetAmount.toString()}
            endsIn={timeLeft}
            yesPercentage={Number(yesPercentage.toFixed(2))}
            noPercentage={Number(noPercentage.toFixed(2))}
            duelType={duel.duelType as 'COIN_DUEL' | 'FLASH_DUEL'}
            imageSrc={duel.betIcon}
            currentPrice={currentPrice ? currentPrice.toString() : undefined}
            duelDuration={duel.endsIn}
            duelStatus={duel.status}
            bootstrappingStartTime={duel.createdAt}
            creator={duel.user?.twitterUsername || truncateAddress(duel.user?.address)}
            creatorTwitterImage={duel.user?.twitterImageUrl}
          />
          <OrderBook yesBets={yesBets} noBets={noBets} handleBuyOrders={handleBuyOrders} />
          <OrdersHistory duelId={duel.duelId} />
        </div>
        <PlaceOrder
          asset={duel.token}
          duelId={duel.duelId}
          endsIn={duel.endsIn}
          token={duel.token}
          triggerPrice={duel.triggerPrice}
          winCondition={duel.winCondition}
          duelType={duel.duelType}
          duration={duel.endsIn}
        />
      </div>
    </div>
  );
};

export default Bet;
