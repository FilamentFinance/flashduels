import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PriceState {
  prices: {
    BTC: number;
    ETH: number;
    SOL: number;
  };
}

const initialState: PriceState = {
  prices: {
    BTC: 0,
    ETH: 0,
    SOL: 0,
  },
};

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setPrices: (state, action: PayloadAction<{ BTC: number; ETH: number; SOL: number }>) => {
      state.prices = action.payload;
    },
  },
});

export const { setPrices } = priceSlice.actions;
export default priceSlice.reducer;
