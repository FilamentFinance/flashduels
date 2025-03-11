// src/components/PriceWrapper.tsx
'use client';
import { RootState } from '@/store';
import { setPrice } from '@/store/slices/priceSlice';
import React, { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { formatUnits } from 'viem';
import { HermesPriceService } from '../config/price-client';

const PriceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const priceServiceRef = useRef<HermesPriceService | null>(null);
  const { selectedCryptoAsset } = useSelector((state: RootState) => state.price, shallowEqual);

  useEffect(() => {
    // Create price service instance only once
    priceServiceRef.current = new HermesPriceService();

    // Cleanup on unmount
    return () => {
      if (priceServiceRef.current) {
        priceServiceRef.current.disconnect();
        priceServiceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedCryptoAsset || !priceServiceRef.current) return;

    const priceService = priceServiceRef.current;
    let isSubscribed = true;

    const connect = async () => {
      try {
        // Set the price ID for the selected asset
        await priceService.setPriceId(selectedCryptoAsset.priceFeedId.slice(2)); // Remove '0x' prefix
        await priceService.connect();

        const unsubscribe = priceService.subscribe((prices) => {
          if (!isSubscribed) return;
          
          const priceFeedId = selectedCryptoAsset.priceFeedId.slice(2);
          const rawPrice = prices[priceFeedId];
          
          if (rawPrice) {
            const bigIntPrice = BigInt(rawPrice);
            const formattedPrice = formatUnits(bigIntPrice, 8);
            dispatch(setPrice(Number(formattedPrice)));
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Failed to connect to price service:', error);
        return () => {};
      }
    };

    connect().then((unsubscribe) => {
      if (!isSubscribed) {
        unsubscribe();
      }
    });

    return () => {
      isSubscribed = false;
      priceService.disconnect();
    };
  }, [dispatch, selectedCryptoAsset]);

  return <>{children}</>;
};

export default PriceWrapper;
