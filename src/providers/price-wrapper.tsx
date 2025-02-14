// src/components/PriceWrapper.tsx
'use client';
import { COIN_DUAL_ASSETS } from '@/constants/dual';
import { setPrices } from '@/store/slices/priceSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HermesPriceService } from '../config/price-client';
import { formatUnits } from 'viem';
type MappedPrices = {
  BTC?: number; // Adjust type as necessary
  ETH?: number; // Adjust type as necessary
  SOL?: number; // Adjust type as necessary
};

const PriceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const priceService = new HermesPriceService();

  useEffect(() => {
    const connect = async () => {
      await priceService.connect();
      const unsubscribe = priceService.subscribe((prices) => {
        const mappedPrices: MappedPrices = Object.keys(prices).reduce((acc:MappedPrices, key) => {
          const token = COIN_DUAL_ASSETS[`0x${key}`];
          if (token) {
            acc[token.symbol as keyof typeof MappedPrices] = formatUnits(prices[key],8); 
          }
          return acc;
        }, {});
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
