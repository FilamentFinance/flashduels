'use client';

import { baseApiClient } from '@/config/api-client';
import { NewDuelItem } from '@/types/dual';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import Header from './header';
import PlaceOrder from './place-order';

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

  useEffect(() => {
    if (id) {
      const fetchDuel = async () => {
        try {
          setLoading(true);
          const response = await baseApiClient.get(
            `${process.env.NEXT_PUBLIC_API}/duels/get-duel-by-id/${id}`,
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
        <div className="flex justify-between items-stretch">
          <Header
            title={
              duel.betString ??
              `Will ${duel.token} be ${duel.winCondition === 0 ? 'ABOVE' : 'BELOW'} ${duel.triggerPrice}`
            }
            logo={duel.betIcon}
            triggerPrice={duel.triggerPrice || '0'}
            winCondition={duel.winCondition || 0}
            token={duel.token}
          />
          <PlaceOrder
            onPlaceOrder={handlePlaceOrder}
            amount={amount}
            setAmount={setAmount}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            asset={duel.token}
            duelId={duel.id}
            endsIn={duel.endsIn}
            token={duel.token}
            triggerPrice={duel.triggerPrice}
            winCondition={duel.winCondition}
          />
        </div>
      )}
    </div>
  );
};

export default Bet;
