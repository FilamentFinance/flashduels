import { useEffect } from 'react';

export type PriceRequestData = {
  markPrice?: number;
  triggerPrice?: number;
  asset?: string;
  timePeriod?: number;
  winCondition?: number;
  totalYes: number;
  totalNo: number;
  duelId?: string;
  T?: number;
};

interface PriceCalculationProps {
  send: (data: PriceRequestData) => void;
  ws: WebSocket | null;
  asset?: string;
  endsIn: number;
  priceFormatted?: number;
  triggerPrice?: number;
  winCondition?: number;
  totalBetYes: number;
  totalBetNo: number;
  duelId?: string;
  interval?: number; // ms, for real-time updates
}

export const usePriceCalculation = ({
  send,
  ws,
  asset,
  endsIn,
  priceFormatted,
  triggerPrice,
  winCondition,
  totalBetYes,
  totalBetNo,
  duelId,
  interval = 1000, // ms, for real-time updates
}: PriceCalculationProps) => {
  useEffect(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const sendPriceRequest = () => {
      if (asset) {
        send({
          markPrice: priceFormatted,
          triggerPrice: Number(triggerPrice),
          asset,
          timePeriod: endsIn * 60,
          winCondition,
          totalYes: totalBetYes || 0,
          totalNo: totalBetNo || 0,
          duelId,
        });
      } else {
        send({
          T: Math.max(endsIn * 60, 1),
          totalYes: totalBetYes || 0,
          totalNo: totalBetNo || 0,
          duelId,
        });
      }
    };

    sendPriceRequest();
    const timer = setInterval(sendPriceRequest, interval);

    return () => clearInterval(timer);
  }, [
    ws,
    ws?.readyState,
    asset,
    endsIn,
    priceFormatted,
    triggerPrice,
    winCondition,
    totalBetYes,
    totalBetNo,
    duelId,
    send,
    interval,
  ]);
};
