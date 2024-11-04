import { FLASHDUELSABI } from '@/abi/FlashDuelsABI';
import { CHAIN_ID, NEXT_PUBLIC_FLASH_DUELS } from '@/utils/consts';
import axios from 'axios';
import { useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const useTotalBets = (duelId: string) => {
    const [totalBetYes, setTotalBetYes] = useState<number | null>(null);
    const [totalBetNo, setTotalBetNo] = useState<number | null>(null);

    // Fetch total bets for "YES" option
    const {
        data: yesData,
        error: yesError,
        isLoading: isYesLoading,
    } = useReadContract({
        abi: FLASHDUELSABI,
        functionName: "totalBetsOnOption",
        address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
        chainId: CHAIN_ID,
        args: [duelId, 0, "YES"],
    });

    // Fetch total bets for "NO" option
    const {
        data: noData,
        error: noError,
        isLoading: isNoLoading,
    } = useReadContract({
        abi: FLASHDUELSABI,
        functionName: "totalBetsOnOption",
        address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
        chainId: CHAIN_ID,
        args: [duelId, 1, "NO"],
    });

    const yesOption = Number(ethers.formatUnits(
        String((yesData) || 0),
        18
    ))

    const noOption = Number(ethers.formatUnits(
        String((yesData) || 0),
        18
    ))


    useEffect(() => {
        if (yesData) setTotalBetYes(yesOption); // Convert to number if needed
        if (noData) setTotalBetNo(noOption);
    }, [yesData, noData]);

    return { totalBetYes, totalBetNo, yesError, noError, isYesLoading, isNoLoading };
}

const postPricingData = async (markPrice: number, triggerPrice: number, asset: string, timePeriod: number, totalYesBets: number, totalNobets: number) => {
    console.log("hello-new")
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
    console.log(data, "data-new")
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
