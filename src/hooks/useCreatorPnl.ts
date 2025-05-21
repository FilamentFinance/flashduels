import { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_CONFIG } from '@/config/server-config';
import { useChainId } from 'wagmi';

export function useCreatorPnl(address?: string) {
    const chainId = useChainId();
    const [pnl, setPnl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!address) {
            setPnl(null);
            return;
        }
        setLoading(true);
        setError(null);
        axios
            .get(`${SERVER_CONFIG.getApiUrl(chainId)}/leaderboard/creators/pnl?address=${address}`)
            .then((res) => setPnl(res.data.pnl))
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    setPnl('0');
                    setError(null);
                } else {
                    setError('Failed to fetch Creator PNL');
                }
            })
            .finally(() => setLoading(false));
    }, [address]);

    return { pnl, loading, error };
} 