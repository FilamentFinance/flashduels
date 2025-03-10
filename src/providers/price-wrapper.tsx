// src/components/PriceWrapper.tsx
'use client';
import { COIN_DUAL_ASSETS } from '@/constants/dual';
import { setPrices } from '@/store/slices/priceSlice';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { formatUnits } from 'viem';
import { HermesPriceService } from '../config/price-client';
type MappedPrices = {
  BTC?: number; // Adjust type as necessary
  ETH?: number; // Adjust type as necessary
  SOL?: number; // Adjust type as necessary
};

type fetchAssetType = {
  symbol: string;
  image: string;
  priceFeedId: string;
}[];

const PriceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const priceService = new HermesPriceService();

  // const [assets, setAssets] = React.useState<fetchAssetType>([]);

  // const fetchAssets = async () => {
  //   try {
  //     const response = await axios.get(
  //       'https://orderbookv3.filament.finance/flashduels/assets/list',
  //     );
  //     setAssets(response.data);
  //   } catch (error) {
  //     console.error('Error fetching assets:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAssets();
  // }, []);
  // console.log({ pk: assets });
  useEffect(() => {
    const connect = async () => {
      await priceService.connect();
      const unsubscribe = priceService.subscribe((prices) => {
        const mappedPrices: MappedPrices = Object.entries(prices).reduce((acc, [key, rawPrice]) => {
          const token = COIN_DUAL_ASSETS[`0x${key}`];
          if (token) {
            const bigIntPrice = BigInt(rawPrice);
            const formattedPrice = formatUnits(bigIntPrice, 8);
            acc[token.symbol as keyof MappedPrices] = Number(formattedPrice);
          }
          return acc;
        }, {} as MappedPrices);
        dispatch(
          setPrices({
            BTC: mappedPrices.BTC || 0,
            ETH: mappedPrices.ETH || 0,
            SOL: mappedPrices.SOL || 0,
          }),
        );
      });
      return () => unsubscribe();
    };

    connect();

    return () => {
      priceService.disconnect();
    };
  }, [dispatch, priceService]);

  return <>{children}</>;
};

export default PriceWrapper;
