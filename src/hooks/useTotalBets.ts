import { FlashDuelsViewFacetABI } from '@/abi/FlashDuelsViewFacet';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useReadContract, useChainId } from 'wagmi';
import { formatUnits, Hex } from 'viem';
import { SERVER_CONFIG } from '@/config/server-config';

const useTotalBets = (duelId: string) => {
  const [totalBetYes, setTotalBetYes] = useState<number | null>(null);
  const [totalBetNo, setTotalBetNo] = useState<number | null>(null);
  const chainId = useChainId();

  // Fetch total bets for "LONG" option
  const {
    data: yesData,
    error: yesError,
    isLoading: isYesLoading,
    refetch: refetchYes,
  } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getTotalBetsOnOption',
    address: SERVER_CONFIG.DIAMOND as Hex,
    chainId: chainId,
    args: [duelId, 0, 'LONG'],
  });

  // Fetch total bets for "SHORT" option
  const {
    data: noData,
    error: noError,
    isLoading: isNoLoading,
    refetch: refetchNo,
  } = useReadContract({
    abi: FlashDuelsViewFacetABI,
    functionName: 'getTotalBetsOnOption',
    address: SERVER_CONFIG.DIAMOND as Hex,
    chainId: chainId,
    args: [duelId, 1, 'SHORT'],
  });

  const yesOption = yesData ? Number(formatUnits(BigInt(yesData.toString()), 18)) : 0;
  const noOption = noData ? Number(formatUnits(BigInt(noData.toString()), 18)) : 0;

  useEffect(() => {
    if (yesData !== undefined) setTotalBetYes(yesOption);
    if (noData !== undefined) setTotalBetNo(noOption);
  }, [yesData, noData, yesOption, noOption]);

  const refetchTotalBets = useCallback(() => {
    refetchYes();
    refetchNo();
  }, [refetchYes, refetchNo]);

  return {
    totalBetYes: totalBetYes ?? 0,
    totalBetNo: totalBetNo ?? 0,
    yesError,
    noError,
    isYesLoading,
    isNoLoading,
    refetchTotalBets,
  };
};

const postPricingData = async (
  markPrice: number,
  triggerPrice: number,
  asset: string,
  timePeriod: number,
  totalYesBets: number,
  totalNobets: number,
  winCondition: number,
) => {
  let data;
  const condition = winCondition === 0 ? 'above' : 'below';
  if (totalNobets === 0 && totalYesBets === 0) {
    data = {
      S_t: triggerPrice,
      K: markPrice,
      T: timePeriod,
      total_yes_bets: 50,
      total_no_bets: 50,
      condition,
      beta: 0.15,
      symbol: `${asset}USDT`,
    };
  } else {
    data = {
      S_t: triggerPrice,
      K: markPrice,
      T: timePeriod,
      condition,
      total_yes_bets: totalYesBets,
      total_no_bets: totalNobets,
      beta: 0.15,
      symbol: `${asset}USDT`,
    };
  }
  try {
    // const response = await axios.post('https://orderbookv3.filament.finance/pricing', data, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    const response = await axios.post('https://testnetserver.flashduels.xyz/pricing', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export { postPricingData, useTotalBets };
