import { SERVER_CONFIG } from '@/config/server-config';
import { useEffect, useState } from 'react';

interface PriceData {
  yesPrice: number | undefined;
  noPrice: number | undefined;
  ws: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
}

interface WebSocketMessage {
  type?: string;
  error?: string;
  result?: {
    prices?: {
      'yes': number;
      'no': number;
    };
  };
  priceYes?: number;
  priceNo?: number;
}

export const useWebSocketPrices = (asset: string | undefined): PriceData => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [yesPrice, setYesPrice] = useState<number>();
  const [noPrice, setNoPrice] = useState<number>();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  useEffect(() => {
    let websocket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      if (isConnecting) return;
      setIsConnecting(true);

      const wsUrl = asset
        ? `${SERVER_CONFIG.API_WS_URL}/cryptoduelsOptionPricingWebSocket`
        : `${SERVER_CONFIG.API_WS_URL}/flashduelsOptionPricingWebSocket`;

      websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        setIsConnecting(false);
        setReconnectAttempts(0);
      };

      websocket.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data);

        // Handle initial connection message
        if (data.type === 'connected') {
          console.log('Received connection confirmation');
          return;
        }

        if (data.error) {
          console.error('WebSocket error:', data.error);
          return;
        }

        if (asset) {
          setNoPrice(data.result?.prices?.no);
          setYesPrice(data.result?.prices?.yes);
        } else {
          setNoPrice(data.priceNo);
          setYesPrice(data.priceYes);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnecting(false);
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          setReconnectAttempts(prev => prev + 1);
          reconnectTimeout = setTimeout(connectWebSocket, 1000 * Math.pow(2, reconnectAttempts));
        }
      };

      websocket.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          setReconnectAttempts(prev => prev + 1);
          reconnectTimeout = setTimeout(connectWebSocket, 1000 * Math.pow(2, reconnectAttempts));
        }
      };

      setWs(websocket);
    };

    connectWebSocket();

    return () => {
      if (websocket) {
        websocket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [asset]);

  return {
    yesPrice,
    noPrice,
    ws,
    isConnected,
    isConnecting
  };
};
