import { useEffect, useState } from 'react';
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
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const MAX_RECONNECT_ATTEMPTS = 3;

    useEffect(() => {
        if (!duelId) return;

        let socket: WebSocket | null = null;
        let reconnectTimeout: NodeJS.Timeout;

        const connectWebSocket = () => {
            if (socket?.readyState === WebSocket.OPEN) return;

            try {
                socket = new WebSocket(`${SERVER_CONFIG.getApiWsUrl(chainId)}/betWebSocket?duelId=${duelId}`);

                socket.onopen = () => {
                    console.log('Connected to WebSocket server');
                    setReconnectAttempts(0);
                    socket?.send(JSON.stringify({ type: 'subscribeToDuel', duelId }));
                };

                socket.onmessage = (event) => {
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

                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    setError('WebSocket connection error');
                    setLoading(false);
                };

                socket.onclose = (event) => {
                    console.log('WebSocket closed:', event.code, event.reason);
                    setLoading(false);

                    // Attempt to reconnect if not closed normally
                    if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                        setReconnectAttempts(prev => prev + 1);
                        reconnectTimeout = setTimeout(connectWebSocket, 3000); // Retry after 3 seconds
                    }
                };
            } catch (err) {
                console.error('Error creating WebSocket:', err);
                setError('Failed to create WebSocket connection');
                setLoading(false);
            }
        };

        connectWebSocket();

        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (socket) {
                socket.close(1000, 'Component unmounting');
            }
        };
    }, [duelId, chainId, reconnectAttempts]);

    return {
        totalYesAmount,
        totalNoAmount,
        yesPercentage,
        noPercentage,
        loading,
        error
    };
}; 