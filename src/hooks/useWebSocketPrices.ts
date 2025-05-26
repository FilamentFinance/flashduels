import { useEffect, useRef, useState, useCallback } from 'react';
import { SERVER_CONFIG } from '@/config/server-config';
import { useChainId } from 'wagmi';
import { PriceRequestData } from './usePriceCalculation';

export const useWebSocketPrices = (asset: string | undefined) => {
  const [yesPrice, setYesPrice] = useState<number>();
  const [noPrice, setNoPrice] = useState<number>();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const chainId = useChainId();
  const MAX_RECONNECT_ATTEMPTS = 3;

  const connectWebSocket = useCallback(() => {
    if (isConnecting || wsRef.current?.readyState === WebSocket.OPEN) return;
    setIsConnecting(true);

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = asset
      ? `${SERVER_CONFIG.getApiWsUrl(chainId)}/cryptoduelsOptionPricingWebSocket`
      : `${SERVER_CONFIG.getApiWsUrl(chainId)}/flashduelsOptionPricingWebSocket`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected successfully');
      setIsConnected(true);
      setIsConnecting(false);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error('WebSocket error:', data.error);
          return;
        }
        if (asset) {
          if (data.result?.prices?.no !== undefined) {
            setNoPrice(data.result.prices.no);
          }
          if (data.result?.prices?.yes !== undefined) {
            setYesPrice(data.result.prices.yes);
          }
        } else {
          if (data.priceNo !== undefined) {
            setNoPrice(data.priceNo);
          }
          if (data.priceYes !== undefined) {
            setYesPrice(data.priceYes);
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setIsConnecting(false);

      // Only attempt to reconnect if we haven't reached max attempts
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
        reconnectTimeout.current = setTimeout(connectWebSocket, delay);
      } else {
        console.log('Max reconnection attempts reached');
        // Reset reconnection attempts after a longer delay
        setTimeout(() => {
          reconnectAttempts.current = 0;
        }, 30000);
      }
    };
  }, [asset, chainId, isConnecting]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

  const send = useCallback((data: PriceRequestData) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return {
    yesPrice,
    noPrice,
    ws: wsRef.current,
    isConnected,
    send
  };
};
