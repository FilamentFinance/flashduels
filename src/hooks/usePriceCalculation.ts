import { useEffect, useCallback } from 'react';

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
  interval = 500, // Reduced to 500ms for more frequent updates
}: PriceCalculationProps) => {
  const sendPriceRequest = useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

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
  ]);

  useEffect(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    // Send initial request
    sendPriceRequest();

    // Set up interval for updates
    const timer = setInterval(sendPriceRequest, interval);

    // Cleanup
    return () => {
      clearInterval(timer);
    };
  }, [ws, ws?.readyState, sendPriceRequest, interval]);

  // Additional effect to handle WebSocket state changes
  useEffect(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      sendPriceRequest();
    }
  }, [ws?.readyState, sendPriceRequest]);
};
