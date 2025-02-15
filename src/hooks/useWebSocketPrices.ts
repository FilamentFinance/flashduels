import { SERVER_CONFIG } from '@/config/server-config';
import { useEffect, useState } from 'react';

interface PriceData {
  yesPrice: number | undefined;
  noPrice: number | undefined;
  ws: WebSocket | null;
}

interface WebSocketMessage {
  error?: string;
  result?: {
    'Yes Price': number;
    'No Price': number;
  };
  priceYes?: number;
  priceNo?: number;
}

export const useWebSocketPrices = (asset: string | undefined): PriceData => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [yesPrice, setYesPrice] = useState<number>();
  const [noPrice, setNoPrice] = useState<number>();

  useEffect(() => {
    let websocket: WebSocket;

    const connectWebSocket = () => {
      const wsUrl = asset
        ? `${SERVER_CONFIG.API_WS_URL}/cryptoduelsOptionPricingWebSocket`
        : `${SERVER_CONFIG.API_WS_URL}/flashduelsOptionPricingWebSocket`;

      websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('WebSocket connection established');
      };

      websocket.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data);

        if (data.error) {
          return;
        }

        if (asset) {
          setNoPrice(data.result?.['No Price']);
          setYesPrice(data.result?.['Yes Price']);
        } else {
          setNoPrice(data.priceNo);
          setYesPrice(data.priceYes);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setWs(websocket);
    };

    connectWebSocket();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [asset]);

  return {
    yesPrice,
    noPrice,
    ws,
  };
};
