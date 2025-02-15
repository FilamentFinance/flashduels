import { useEffect } from 'react';

interface PriceCalculationProps {
  ws: WebSocket | null;
  asset?: string;
  endsIn: number;
  priceFormatted?: number;
  triggerPrice?: number;
  winCondition?: number;
  totalBetYes: number;
  totalBetNo: number;
}

export const usePriceCalculation = ({
  ws,
  asset,
  endsIn,
  priceFormatted,
  triggerPrice,
  winCondition,
  totalBetYes,
  totalBetNo,
}: PriceCalculationProps) => {
  useEffect(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (asset) {
        // Crypto Duel calculation
        const timePeriod = endsIn / (365 * 24); // Convert endsIn to time period in years

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
        // Flash Duel calculation
        const timePeriod = endsIn / 24; // Convert endsIn to time period in days

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
  ]);
};
