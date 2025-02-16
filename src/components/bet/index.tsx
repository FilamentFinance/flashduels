'use client';

import { baseApiClient } from '@/config/api-client';
import { NewDuelItem, OptionBetType } from '@/types/dual';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import Header from './header';
import OrderBook from './order-book';
import { OrdersTable } from './orders/OrdersTable';
import PlaceOrder from './place-order';
import { SERVER_CONFIG } from '@/config/server-config';

const LoadingSkeleton = () => (
  <div className="container max-w-screen-xl mx-auto p-4 animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="h-6 w-20 bg-zinc-800 rounded" />
      <div className="h-6 w-24 bg-zinc-800 rounded ml-auto" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-full" />
          <div className="flex-1">
            <div className="h-8 bg-zinc-800 rounded w-3/4" />
          </div>
        </div>
      </div>

      <div className="bg-[#141217] p-6 rounded-xl space-y-6">
        <div className="h-12 bg-zinc-800 rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 bg-zinc-800 rounded-xl" />
          <div className="h-8 bg-zinc-800 rounded-xl" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 bg-zinc-800 rounded w-20" />
              <div className="h-4 bg-zinc-800 rounded w-16" />
            </div>
          </div>
          <div className="h-12 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="container max-w-screen-xl mx-auto p-4">
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
    </div>
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
      <h2 className="text-xl font-semibold text-red-500 mb-2">Error Loading Duel</h2>
      <p className="text-zinc-400">{error}</p>
    </div>
  </div>
);

const Bet: FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('duelId');
  const router = useRouter();
  const [duel, setDuel] = useState<NewDuelItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<'YES' | 'NO' | null>(null);
  const [amount, setAmount] = useState('1000');
  const [yesBets, setYesBets] = useState<OptionBetType[]>([]);
  const [noBets, setNoBets] = useState<OptionBetType[]>([]);
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
      console.log('WebSocket Error:', error);
    };

    socket.onclose = function () {
      console.log('Disconnected from the WebSocket server');
    };

    // Cleanup WebSocket on unmount
    return () => {
      socket.close();
    };
  }, []);

  const fetchDuel = async () => {
    try {
      setLoading(true);
      const response = await baseApiClient.get(
        `${SERVER_CONFIG.API_URL}/duels/get-duel-by-id/${id}`,
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
    if (id) {
      fetchDuel();
    } else {
      setError('Duel ID is missing from the query parameters.');
      setLoading(false);
    }
  }, [id]);

  const handlePlaceOrder = async (position: 'YES' | 'NO', amount: string) => {
    try {
      // Add your order placement logic here
      console.log('Placing order:', { duelId: id, position, amount });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !duel) {
    return <ErrorState error={error || 'Duel not found'} />;
  }
  console.log({ duel });
  const handleBuyOrders = async (
    betOptionMarketId: string,
    quantity: string,
    index: number,
    sellId: number,
    amount: string,
  ) => {
    console.log(amount, 'amount', index);
    // setOptionIndex(index)
    // await lpTokenApproveAsync(amount)
    // if (optionTokenAddress) {
    //   await buyBet(sellId); // Ensure buyBet is called after token address is set
    // }
    // console.log("reached-here")

    // try {
    //   const response = await apiClient.post(
    //     `${NEXT_PUBLIC_API}/betOption/buy`,
    //     { duelId, betOptionMarketId, amount },
    //   );
    //   const data = response.data.message;

    //   console.log(data, "data-new")
    //   setNotification({
    //     isOpen: true,
    //     success: true,
    //     massage: data,
    //   })

    // } catch (error) {
    //   console.error("Error fetching bet:", error);
    //   setNotification({
    //     isOpen: true,
    //     success: false,
    //     massage: "Failed to Purchase Bet",
    //   });
    // }
  };
  return (
    <div className="container max-w-screen-xl mx-auto p-4">
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
              // percentage={duel.percentage}
            />
            <OrderBook yesBets={yesBets} noBets={noBets} handleBuyOrders={handleBuyOrders} />
            <OrdersTable duelId={duel.duelId} />
          </div>
          <PlaceOrder
            onPlaceOrder={handlePlaceOrder}
            amount={amount}
            setAmount={setAmount}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
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
