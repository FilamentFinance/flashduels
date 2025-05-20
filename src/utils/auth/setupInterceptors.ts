'use client';

import { SERVER_CONFIG } from '@/config/server-config';
import axios from 'axios';
// import { useChainId } from 'wagmi';
let requestInterceptor: number | null = null;
let responseInterceptor: number | null = null;

// Create a single axios instance
const apiClient = (chainId: number) =>
  axios.create({
    baseURL: SERVER_CONFIG.getApiUrl(chainId),
  });

export const isUserAuthenticated = (address: string): boolean => {
  const token = localStorage.getItem(`Bearer_${address.toLowerCase()}`);
  const signingKey = localStorage.getItem(`signingKey_${address.toLowerCase()}`);
  const signingKeyExpiry = localStorage.getItem(`signingKeyExpiry_${address.toLowerCase()}`);

  if (!token || !signingKey || !signingKeyExpiry) {
    return false;
  }

  // Check if the signing key has expired
  const expiryDate = new Date(signingKeyExpiry);
  if (expiryDate < new Date()) {
    // Clear the expired data
    localStorage.removeItem(`Bearer_${address.toLowerCase()}`);
    localStorage.removeItem(`signingKey_${address.toLowerCase()}`);
    localStorage.removeItem(`signingKeyExpiry_${address.toLowerCase()}`);
    return false;
  }

  return true;
};

export const setupInterceptors = async (
  address: string,
  disconnect: () => void,
  onUnauthorized: () => void,
  chainId: number,
) => {
  // Clear any existing interceptors
  if (requestInterceptor !== null) {
    apiClient(chainId).interceptors.request.eject(requestInterceptor);
  }
  if (responseInterceptor !== null) {
    apiClient(chainId).interceptors.response.eject(responseInterceptor);
  }

  // Set up request interceptor
  requestInterceptor = apiClient(chainId).interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(`Bearer_${address.toLowerCase()}`);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Set up response interceptor
  responseInterceptor = apiClient(chainId).interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Clear local storage
        localStorage.removeItem(`Bearer_${address.toLowerCase()}`);
        localStorage.removeItem(`signingKey_${address.toLowerCase()}`);
        localStorage.removeItem(`signingKeyExpiry_${address.toLowerCase()}`);

        // Call onUnauthorized callback
        onUnauthorized();

        // Disconnect wallet
        disconnect();
      }
      return Promise.reject(error);
    },
  );
};

export { apiClient };
