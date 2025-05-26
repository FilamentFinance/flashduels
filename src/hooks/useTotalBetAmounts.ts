import { useEffect, useState, useRef } from 'react';
import { SERVER_CONFIG } from '@/config/server-config';
import { useChainId } from 'wagmi';
// import { formatUnits } from 'viem';

interface TotalBetAmounts {
    totalYesAmount: number;
    totalNoAmount: number;
    yesPercentage: number;
    noPercentage: number;
}

interface WebSocketMessage {
    availableOptions: [];
    totalBetAmounts: TotalBetAmounts;
}

export const useTotalBetAmounts = (duelId: string) => {
    const [totalYesAmount, setTotalYesAmount] = useState<number>(0);
    const [totalNoAmount, setTotalNoAmount] = useState<number>(0);
    const [yesPercentage, setYesPercentage] = useState<number>(50);
    const [noPercentage, setNoPercentage] = useState<number>(50);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const chainId = useChainId();

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const INITIAL_RECONNECT_DELAY = 1000; // 1 second

    const connectWebSocket = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            // Close existing connection if any
            if (socketRef.current) {
                socketRef.current.close();
            }

            const wsUrl = `${SERVER_CONFIG.getApiWsUrl(chainId)}/betWebSocket?duelId=${duelId}`;
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onopen = () => {
                console.log('WebSocket connected successfully');
                reconnectAttemptsRef.current = 0;
                setError(null);
                socketRef.current?.send(JSON.stringify({ type: 'subscribeToDuel', duelId }));
            };

            socketRef.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data) as WebSocketMessage;
                    if (message.totalBetAmounts) {
                        setTotalYesAmount(message.totalBetAmounts.totalYesAmount);
                        setTotalNoAmount(message.totalBetAmounts.totalNoAmount);
                        setYesPercentage(message.totalBetAmounts.yesPercentage);
                        setNoPercentage(message.totalBetAmounts.noPercentage);
                    }
                    setError(null);
                    setLoading(false);
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                    setError('Failed to parse WebSocket message');
                }
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('Connection error occurred');
                setLoading(false);
            };

            socketRef.current.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setLoading(false);

                // Only attempt to reconnect if the connection was not closed normally
                if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                    const delay = Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current), 30000);
                    reconnectAttemptsRef.current += 1;

                    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket();
                    }, delay);
                } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
                    setError('Maximum reconnection attempts reached. Please refresh the page.');
                }
            };
        } catch (err) {
            console.error('Error creating WebSocket:', err);
            setError('Failed to establish WebSocket connection');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!duelId) return;

        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socketRef.current) {
                socketRef.current.close(1000, 'Component unmounting');
                socketRef.current = null;
            }
        };
    }, [duelId, chainId]);

    return {
        totalYesAmount,
        totalNoAmount,
        yesPercentage,
        noPercentage,
        loading,
        error
    };
}; 