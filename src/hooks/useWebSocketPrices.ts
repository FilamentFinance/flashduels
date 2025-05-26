import { useEffect, useRef, useState, useCallback } from 'react';
import { SERVER_CONFIG } from '@/config/server-config';
import { useChainId } from 'wagmi';

export const useWebSocketPrices = (asset: string | undefined) => {
  const [yesPrice, setYesPrice] = useState<number>();
  const [noPrice, setNoPrice] = useState<number>();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const chainId = useChainId();
  const MAX_RECONNECT_ATTEMPTS = 3;

  const connectWebSocket = useCallback(() => {
    if (isConnecting || wsRef.current?.readyState === WebSocket.OPEN) return;
    setIsConnecting(true);

    const wsUrl = asset
      ? `${SERVER_CONFIG.getApiWsUrl(chainId)}/cryptoduelsOptionPricingWebSocket`
      : `${SERVER_CONFIG.getApiWsUrl(chainId)}/flashduelsOptionPricingWebSocket`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setReconnectAttempts(0);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      setIsConnecting(false);
      setIsConnected(false);
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setReconnectAttempts((prev) => prev + 1);
        reconnectTimeout.current = setTimeout(connectWebSocket, 1000 * Math.pow(2, reconnectAttempts));
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setReconnectAttempts((prev) => prev + 1);
        reconnectTimeout.current = setTimeout(connectWebSocket, 1000 * Math.pow(2, reconnectAttempts));
      }
    };
  }, [asset, chainId, isConnecting, reconnectAttempts]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connectWebSocket]);

  // Expose a send method for usePriceCalculation
  const send = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { yesPrice, noPrice, ws: wsRef.current, isConnected, isConnecting, send };
};
