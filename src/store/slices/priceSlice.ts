import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type fetchAssetType = {
  symbol: string;
  image: string;
  priceFeedId: string;
};

interface PriceState {
  prices: {
    BTC: number;
    ETH: number;
    SOL: number;
  };
  price: number;
  cryptoAsset: fetchAssetType[];
  selectedCryptoAsset: fetchAssetType | null;
}

const initialState: PriceState = {
  price: 0,
  prices: {
    BTC: 0,
    ETH: 0,
    SOL: 0,
  },
  cryptoAsset: [],
  selectedCryptoAsset: null,
};

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
    setPrices: (state, action: PayloadAction<{ BTC: number; ETH: number; SOL: number }>) => {
      state.prices = action.payload;
    },
    setCryptoAsset: (state, action: PayloadAction<fetchAssetType[]>) => {
      state.cryptoAsset = action.payload;
    },
    selectedCryptoAsset: (state, action: PayloadAction<fetchAssetType>) => {
      state.selectedCryptoAsset = action.payload;
    },
  },
});

export const { setPrices, setCryptoAsset, selectedCryptoAsset } = priceSlice.actions;
export default priceSlice.reducer;
