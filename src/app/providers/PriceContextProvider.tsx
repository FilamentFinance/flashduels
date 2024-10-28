"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PriceContextType {
    prices: Record<string, number>;
    setPrices: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}
const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const usePrice = () => {
    const context = useContext(PriceContext);
    if (!context) {
        throw new Error('usePrice must be used within a PriceProvider');
    }
    return context;
};

export const PriceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [prices, setPrices] = useState<Record<string, number>>({});

    return (
        <PriceContext.Provider value={{ prices, setPrices }}>
            {children}
        </PriceContext.Provider>
    );
};
