import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  token: string | null;
  signingKey: string | null;
  signingKeyExpiry: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  address: null,
  token: null,
  signingKey: null,
  signingKeyExpiry: null,
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
      }>,
    ) => {
      const { address, token, signingKey, signingKeyExpiry } = action.payload;
      state.address = address;
      state.token = token;
      state.signingKey = signingKey;
      state.signingKeyExpiry = signingKeyExpiry;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.address = null;
      state.token = null;
      state.signingKey = null;
      state.signingKeyExpiry = null;
    },
  },
});

export const { setAuthenticated, setAddress, setAuthData, clearAuth } = authSlice.actions;
export default authSlice.reducer;
