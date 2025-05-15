import { useReadContract, useChainId } from 'wagmi';
import { useEffect, useState } from 'react';
import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import { SERVER_CONFIG } from '@/config/server-config';
import { formatTokenAmount } from '@/utils/token';
import { Hex } from 'viem';

export function useAllTimeEarnings(address?: string) {
    const chainId = useChainId();
    const defaultSymbol = SERVER_CONFIG.DEFAULT_TOKEN_SYMBOL || 'USDC';
    const [earnings, setEarnings] = useState('0');

    const { data: earningsData, isLoading } = useReadContract({
        abi: FlashDuelsViewFacetABI,
        functionName: 'getAllTimeEarnings',
        address: SERVER_CONFIG.DIAMOND as Hex,
        args: [address],
        chainId: chainId,
    });

    useEffect(() => {
        if (earningsData) {
            setEarnings(formatTokenAmount(earningsData as bigint, chainId, defaultSymbol));
        }
    }, [earningsData, chainId, defaultSymbol]);

    return { earnings, isLoading };
} 