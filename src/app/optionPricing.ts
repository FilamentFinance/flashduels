// import { FLASHDUELSABI } from '@/abi/FLASHUSDC';
import { CHAIN_ID, NEXT_PUBLIC_DIAMOND } from '@/utils/consts';
import axios from 'axios';
import { useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
// import { FLASHDUELS_CORE_ABI } from '@/abi/FlashDuelsCoreFacet';
import { FLASHDUELS_VIEWFACET } from '@/abi/FlashDuelsViewFacet';

const useTotalBets = (duelId: string) => {
    const [totalBetYes, setTotalBetYes] = useState<number | null>(null);
    const [totalBetNo, setTotalBetNo] = useState<number | null>(null);

    // Fetch total bets for "YES" option
    const {
        data: yesData,
        error: yesError,
        isLoading: isYesLoading,
    } = useReadContract({
        abi: FLASHDUELS_VIEWFACET,
        functionName: "totalBetsOnOption",
        address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
        chainId: CHAIN_ID,
        args: [duelId, 0, "YES"],
    });

    // Fetch total bets for "NO" option
    const {
        data: noData,
        error: noError,
        isLoading: isNoLoading,
    } = useReadContract({
        abi: FLASHDUELS_VIEWFACET,
        functionName: "totalBetsOnOption",
        address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
        chainId: CHAIN_ID,
        args: [duelId, 1, "NO"],
    });

    const yesOption = Number(ethers.formatUnits(
        String((yesData) || 0),
        18
    ))

    const noOption = Number(ethers.formatUnits(
        String((noData) || 0),
        18
    ))

    useEffect(() => {
        if (yesData) setTotalBetYes(yesOption); // Convert to number if needed
        if (noData) setTotalBetNo(noOption);
    }, [yesData, noData]);

    return { 
        totalBetYes: totalBetYes ?? 0, 
        totalBetNo: totalBetNo ?? 0, 
        yesError, 
        noError, 
        isYesLoading, 
        isNoLoading 
    };}

const postPricingData = async (markPrice: number, triggerPrice: number, asset: string, timePeriod: number, totalYesBets: number, totalNobets: number) => {
    let data;
    console.log(triggerPrice, "triggerPrice-new")
    if (totalNobets === 0 && totalYesBets === 0) {
        data = {
            S_t: triggerPrice,
            K: markPrice,
            T: timePeriod,
            total_yes_bets: 50,
            total_no_bets: 50,
            beta: 0.15,
            symbol: `${asset}USDT`
        };
    } else {
        data = {
            S_t: triggerPrice,
            K: markPrice,
            T: timePeriod,
            total_yes_bets: totalYesBets,
            total_no_bets: totalNobets,
            beta: 0.15,
            symbol: `${asset}USDT`
        };
    }
    try {
        const response = await axios.post(
            'https://orderbookv3.filament.finance/pricing',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export { useTotalBets, postPricingData };
