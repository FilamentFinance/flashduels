'use client';

import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import useBuyOrder from '@/hooks/useBuyOrder';
import { useTotalBets } from '@/hooks/useTotalBets';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { NewDuelItem, OptionBetType } from '@/types/dual';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ErrorState from './error-state';
import Header from './header';
import LoadingSkeleton from './loading-skeleton';
import OrderBook from './order-book';
import { OrdersHistory } from './orders-history';
import PlaceOrder from './place-order';

const Bet: FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('duelId');
  const router = useRouter();
  const [duel, setDuel] = useState<NewDuelItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yesBets, setYesBets] = useState<OptionBetType[]>([]);
  const [noBets, setNoBets] = useState<OptionBetType[]>([]);
  const { address } = useAccount();

  const { buyOrder, txHash } = useBuyOrder(id ?? '');
  const { toast } = useToast();

  const fetchDuel = async () => {
    try {
      setLoading(true);
      const response = await baseApiClient.get(
        `${SERVER_CONFIG.API_URL}/user/duels/get-duel-by-id/${id}`,
        {
          params: {
            userAddress: address?.toLowerCase(), // Add the address from useAccount() to the request params
          },
        },
      );
      setDuel(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching duel:', error);
      setError('Failed to fetch duel details.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const socket = new WebSocket(`${SERVER_CONFIG.API_WS_URL}/betWebSocket?duelId=${id}`);

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
    } else {
      setError('Duel ID is missing from the query parameters.');
      setLoading(false);
    }
  }, [id,address]);

  const { totalBetYes, totalBetNo } = useTotalBets(id ?? '');

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !duel) {
    return <ErrorState error={error || 'Duel not found'} />;
  }

  const calculatedPercentage =
    ((totalBetYes as number) / (Number(totalBetYes) + Number(totalBetNo))) * 100;
  const displayPercentage = isNaN(calculatedPercentage)
    ? 50
    : Number(calculatedPercentage.toFixed(2));

  const handleBuyOrders = async (
    betOptionMarketId: string,
    quantity: string,
    index: number,
    sellId: number,
    amount: string,
  ) => {
    const result = await buyOrder(sellId, index, index);

    if (result.success) {
      console.log('Buy order successful!', txHash);

      const response = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/betOption/buy`, {
        duelId: id,
        betOptionMarketId,
        amount,
      });
      const data = response.data.message;
      toast({
        title: 'Success',
        description: data,
      });
    } else {
      console.error('Buy order failed:', result.error);
      toast({
        title: 'Error',
        description: result.error || 'Failed to place order',
        variant: 'destructive',
      });
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
      {duel.betIcon && (
        <div className="flex justify-between items-stretch gap-4">
          <div className="flex w-full flex-col">
            <Header
              title={
                duel.betString ??
                `Will ${duel.token} be ${duel.winCondition === 0 ? 'ABOVE' : 'BELOW'} ${duel.triggerPrice}`
              }
              logo={duel.betIcon}
              triggerPrice={duel.triggerPrice || '0'}
              winCondition={duel.winCondition || 0}
              token={duel.token}
              liquidity={duel.totalBetAmount.toString()}
              endsIn={duel.endsIn}
              percentage={displayPercentage}
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
          />
        </div>
      )}
    </div>
  );
};

export default Bet;
