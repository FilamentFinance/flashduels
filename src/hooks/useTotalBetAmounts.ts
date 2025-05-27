import { useEffect, useState, useCallback } from 'react';
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
    duelId: string;
}

// Shared WebSocket instance
let sharedSocket: WebSocket | null = null;
const subscribers = new Map<string, Set<(data: TotalBetAmounts) => void>>();
let reconnectTimeout: NodeJS.Timeout | null = null;
const MAX_RECONNECT_ATTEMPTS = 3;
let reconnectAttempts = 0;

// Helper to convert http(s) to ws(s)
function httpToWs(url: string): string {
    if (url.startsWith('https://')) return url.replace('https://', 'wss://');
    if (url.startsWith('http://')) return url.replace('http://', 'ws://');
    return url;
}

export const useTotalBetAmounts = (duelId: string) => {
    const [totalYesAmount, setTotalYesAmount] = useState<number>(0);
    const [totalNoAmount, setTotalNoAmount] = useState<number>(0);
    const [yesPercentage, setYesPercentage] = useState<number>(50);
    const [noPercentage, setNoPercentage] = useState<number>(50);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const chainId = useChainId();

    const connectWebSocket = useCallback(() => {
        if (sharedSocket?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            // Close existing connection if any
            if (sharedSocket) {
                sharedSocket.close();
            }

            const wsUrl = `${SERVER_CONFIG.getApiWsUrl(chainId)}/betWebSocket?duelId=${duelId}`;
            const wsFinalUrl = httpToWs(wsUrl);
            console.log('[WebSocket] Connecting to:', wsFinalUrl);
            sharedSocket = new WebSocket(wsFinalUrl);

            sharedSocket.onopen = () => {
                console.log('WebSocket connected successfully');
                reconnectAttempts = 0;
                // // Subscribe to all active duel IDs
                // const duelIds = Array.from(subscribers.keys());
                // if (duelIds.length > 0) {
                //     sharedSocket?.send(JSON.stringify({ type: 'subscribeToDuels', duelIds }));
                // }
                setError(null);
                setLoading(false);
            };

            sharedSocket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data) as WebSocketMessage;
                    if (message.totalBetAmounts && message.duelId) {
                        const duelSubscribers = subscribers.get(message.duelId);
                        if (duelSubscribers) {
                            duelSubscribers.forEach(callback => callback(message.totalBetAmounts));
                        }
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            sharedSocket.onerror = (error) => {
                console.error('WebSocket error occurred:', error);
                setError('WebSocket connection error');
            };

            sharedSocket.onclose = (event) => {
                console.log('WebSocket disconnected:', event.code, event.reason);

                // Only attempt to reconnect if there are active subscribers
                if (subscribers.size > 0 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttempts++;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
                    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
                    reconnectTimeout = setTimeout(connectWebSocket, delay);
                } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                    console.log('Max reconnection attempts reached');
                    setError('Failed to establish WebSocket connection after multiple attempts');
                    // Reset reconnection attempts after a longer delay
                    setTimeout(() => {
                        reconnectAttempts = 0;
                    }, 30000);
                }
            };
        } catch (err) {
            console.error('Error creating WebSocket:', err);
            setError('Failed to establish WebSocket connection');
            setLoading(false);
        }
    }, [chainId, duelId]);

    useEffect(() => {
        if (!duelId) return;

        // Add this component as a subscriber
        const updateState = (data: TotalBetAmounts) => {
            setTotalYesAmount(data.totalYesAmount);
            setTotalNoAmount(data.totalNoAmount);
            setYesPercentage(data.yesPercentage);
            setNoPercentage(data.noPercentage);
            setError(null);
            setLoading(false);
        };

        if (!subscribers.has(duelId)) {
            subscribers.set(duelId, new Set());
        }
        subscribers.get(duelId)?.add(updateState);

        // Connect WebSocket if not already connected
        if (!sharedSocket || sharedSocket.readyState !== WebSocket.OPEN) {
            connectWebSocket();
        } else {
            // Subscribe to this specific duel
            sharedSocket.send(JSON.stringify({ type: 'subscribeToDuel', duelId }));
        }

        return () => {
            // Remove this component as a subscriber
            const duelSubscribers = subscribers.get(duelId);
            if (duelSubscribers) {
                duelSubscribers.delete(updateState);
                if (duelSubscribers.size === 0) {
                    subscribers.delete(duelId);
                    // Unsubscribe from this duel
                    if (sharedSocket?.readyState === WebSocket.OPEN) {
                        sharedSocket.send(JSON.stringify({ type: 'unsubscribeFromDuel', duelId }));
                    }
                }
            }

            // If no more subscribers, close the WebSocket
            if (subscribers.size === 0 && sharedSocket) {
                if (reconnectTimeout) {
                    clearTimeout(reconnectTimeout);
                    reconnectTimeout = null;
                }
                sharedSocket.close();
                sharedSocket = null;
            }
        };
    }, [duelId, chainId, connectWebSocket]);

    return {
        totalYesAmount,
        totalNoAmount,
        yesPercentage,
        noPercentage,
        loading,
        error
    };
}; 