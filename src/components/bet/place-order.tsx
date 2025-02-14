'use client';
import { useTotalBets } from '@/hooks/useTotalBets';
import { cn } from '@/shadcn/lib/utils';
import { RootState } from '@/store';
import { Position } from '@/types/dual';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import BuyOrder from './buy-order';
import SellOrder from './sell-order';

interface PlaceOrderProps {
  duelId: string;
  availableBalance?: number;
  onPlaceOrder: (
    position: Position,
    amount: string,
    orderType: 'buy' | 'sell',
    price?: string,
  ) => void;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  selectedPosition: Position | null;
  setSelectedPosition: Dispatch<SetStateAction<Position | null>>;
  asset: string | undefined;
  triggerPrice?: string;
  endsIn: number;
  winCondition?: number;
  token: string | undefined;
}
type OptionBetType = {
  id: string;
  quantity: string;
  amount: string;
  index: number;
  price: string;
  sellId: number;
  betOption?: { index: number };
};
const PlaceOrder: FC<PlaceOrderProps> = ({
  duelId,
  availableBalance = 1000,
  onPlaceOrder,
  amount,
  setAmount,
  selectedPosition,
  setSelectedPosition,
  asset,
  endsIn,
  triggerPrice,
  winCondition,
  token,
}) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const handleBuyOrder = (position: Position, amount: string) => {
    onPlaceOrder(position, amount, 'buy');
  };
  const { prices } = useSelector((state: RootState) => state.price, shallowEqual);

  const handleSellOrder = (position: Position, amount: string, price: string) => {
    onPlaceOrder(position, amount, 'sell', price);
  };

  const [yesBets, setYesBets] = useState<OptionBetType[]>([]);
  const [noBets, setNoBets] = useState<OptionBetType[]>([]);
  const [noPrice, setNoPrice] = useState<number>();
  const [yesPrice, setYesPrice] = useState<number>();
  const formattedId = duelId?.startsWith('0x') ? duelId.slice(2) : duelId;
  // const price = formattedId && prices[formattedId];
  // const priceFormatted = price;
  const { totalBetYes, totalBetNo } = useTotalBets(duelId);
  const fetchPrices = async () => {
    if (asset) {
      try {
        const websocket = new WebSocket('ws://localhost:3004/flashduels/cryptoduelsOptionPricingWebSocket');

        websocket.onopen = () => {
          console.log('WebSocket connection established');
        };

        websocket.onmessage = (event) => {
          console.log('WebSocket message', event);
          const data = JSON.parse(event.data);
          console.log({ data });
          if (data.error) {
            // setError(data.error);
            return;
          }
          setNoPrice(data.result['No Price']);
          setYesPrice(data.result['Yes Price']);
        };

        websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          // setError('WebSocket connection failed');
        };

        // Store WebSocket instance in the state
        setWs(websocket);

        return () => {
          // Cleanup WebSocket connection when component unmounts
          websocket.close();
        };
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    } else {
      // const timePeriod = endsIn / 24;

      // const pricingValue = calculateFlashDuelsOptionPrice(
      //   timePeriod < 1 ? 1 : timePeriod,
      //   totalBetNo || 0,
      //   totalBetYes || 0
      // );
      // setNoPrice(pricingValue["priceNo"]);
      // setYesPrice(pricingValue["priceYes"]);
      const websocket = new WebSocket(
        `${process.env.NEXT_PUBLIC_API_WS}/flashduelsOptionPricingWebSocket`,
      );

      websocket.onopen = () => {
        console.log('WebSocket connection established');
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) {
          // setError(data.error);
          return;
        }
        setNoPrice(data.priceNo);
        setYesPrice(data.priceYes);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // setError('WebSocket connection failed');
      };

      // Store WebSocket instance in the state
      setWs(websocket);

      return () => {
        // Cleanup WebSocket connection when component unmounts
        websocket.close();
      };
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [asset]);
  const priceFormatted = prices[token];
  useEffect(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (asset) {
        console.log(winCondition, 'winCondition');
        const timePeriod = endsIn / (365 * 24); // Convert endsIn to time period in years for Crypto Duel
        console.log({
          sending: {
            markPrice: Number(priceFormatted),
            triggerPrice: Number(triggerPrice),
            asset,
            timePeriod,
            winCondition,
            totalYesBets: Number(totalBetYes),
            totalNobets: Number(totalBetNo),
          },
        });
        ws.send(
          JSON.stringify({
            markPrice: priceFormatted as number,
            triggerPrice: Number(triggerPrice),
            asset,
            timePeriod,
            winCondition,
            totalYes: totalBetYes || 0,
            totalNo: totalBetNo || 0,
          }),
        );

       
      } else {
        const timePeriod = endsIn / 24; // Convert endsIn to time period in days for Flash Duel
        console.log('Sending data for flashDuels pricing calculation');

        ws.send(
          JSON.stringify({
            T: timePeriod < 1 ? 1 : timePeriod, // Ensure a minimum value of 1 for T
            totalYes: totalBetYes || 0,
            totalNo: totalBetNo || 0,
          }),
        );
      }
    } else {
      console.log('WebSocket connection is not open');
    }
  }, [totalBetYes, totalBetNo, ws, ws?.readyState, priceFormatted]);

  console.log({ yesPrice, noPrice });
  return (
    <div className="bg-zinc-900 rounded-xl w-full max-w-md p-6 border border-zinc-800">
      {/* Buy/Sell Tabs */}
      <div className="flex items-center border-b border-zinc-800 mb-6">
        <button
          onClick={() => setOrderType('buy')}
          className={cn(
            'pb-2 px-4 relative font-medium text-lg',
            orderType === 'buy' ? 'text-[#F19ED2]' : 'text-zinc-500',
          )}
        >
          Buy
          {orderType === 'buy' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F19ED2]" />
          )}
        </button>
        <button
          onClick={() => setOrderType('sell')}
          className={cn(
            'pb-2 px-4 relative font-medium text-lg',
            orderType === 'sell' ? 'text-[#F19ED2]' : 'text-zinc-500',
          )}
        >
          Sell
          {orderType === 'sell' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F19ED2]" />
          )}
        </button>
      </div>

      {/* Order Form */}
      {orderType === 'buy' ? (
        <BuyOrder
          availableBalance={availableBalance}
          onPlaceOrder={handleBuyOrder}
          amount={amount}
          setAmount={setAmount}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          yesPrice={yesPrice}
          noPrice={noPrice}
        />
      ) : (
        <SellOrder
          availableBalance={availableBalance}
          onPlaceOrder={handleSellOrder}
          amount={amount}
          setAmount={setAmount}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />
      )}
    </div>
  );
};

export default PlaceOrder;
