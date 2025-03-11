import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type fetchAssetType = {
  symbol: string;
  image: string;
  priceFeedId: string;
};

interface PriceState {
  price: number;
  cryptoAsset: fetchAssetType[];
  selectedCryptoAsset: fetchAssetType | null;
}

const initialState: PriceState = {
  price: 0,
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
    setCryptoAsset: (state, action: PayloadAction<fetchAssetType[]>) => {
      state.cryptoAsset = action.payload;
    },
    selectedCryptoAsset: (state, action: PayloadAction<fetchAssetType>) => {
      state.selectedCryptoAsset = action.payload;
    },
  },
});

export const { setPrice, setCryptoAsset, selectedCryptoAsset } = priceSlice.actions;
export default priceSlice.reducer;
