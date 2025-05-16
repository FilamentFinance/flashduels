import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  token: string | null;
  signingKey: string | null;
  signingKeyExpiry: string | null;
  isCreator: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  address: null,
  token: null,
  signingKey: null,
  signingKeyExpiry: null,
  isCreator: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
    },
    setAuthData: (
      state,
      action: PayloadAction<{
        address: string;
        token: string;
        signingKey: string;
        signingKeyExpiry: string;
        isCreator?: boolean;
      }>,
    ) => {
      const { address, token, signingKey, signingKeyExpiry, isCreator } = action.payload;
      state.address = address;
      state.token = token;
      state.signingKey = signingKey;
      state.signingKeyExpiry = signingKeyExpiry;
      state.isAuthenticated = true;
      state.isCreator = isCreator || false;
    },
    setCreatorStatus: (state, action: PayloadAction<boolean>) => {
      state.isCreator = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.address = null;
      state.token = null;
      state.signingKey = null;
      state.signingKeyExpiry = null;
      state.isCreator = false;
    },
  },
});

export const { setAuthenticated, setAddress, setAuthData, setCreatorStatus, clearAuth } = authSlice.actions;
export default authSlice.reducer;
