import { Position } from '@/types/duel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BetState {
  selectedPosition: Position | null;
}

const initialState: BetState = {
  selectedPosition: null,
};

const betSlice = createSlice({
  name: 'bet',
  initialState,
  reducers: {
    setSelectedPosition: (state, action: PayloadAction<Position | null>) => {
      state.selectedPosition = action.payload;
    },
  },
});

export const { setSelectedPosition } = betSlice.actions;
export default betSlice.reducer;
