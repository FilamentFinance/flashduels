import { useEffect, useState } from 'react';
import { SERVER_CONFIG } from '@/config/server-config';
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

    useEffect(() => {
        if (!duelId) return;

        const socket = new WebSocket(`${SERVER_CONFIG.API_WS_URL}/betWebSocket?duelId=${duelId}`);

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            socket.send(JSON.stringify({ type: 'subscribeToDuel', duelId }));
        };

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as WebSocketMessage;

                // Update bet amounts and percentages
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
            setLoading(false);
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
            setLoading(false);
        };

        return () => {
            socket.close();
        };
    }, [duelId]);

    return {
        totalYesAmount,
        totalNoAmount,
        yesPercentage,
        noPercentage,
        loading,
        error
    };
}; 