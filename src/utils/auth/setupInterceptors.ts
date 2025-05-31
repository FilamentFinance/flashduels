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
      // Handle both 401 (Unauthorized) and 403 (Forbidden) responses
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Show toast message
        const { toast } = await import('@/shadcn/components/ui/use-toast');
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please reconnect your wallet and enable trading again.',
          variant: 'destructive',
        });

        // Clear all authentication data from localStorage
        console.log('Clearing authentication data from localStorage');
        const keysToRemove = Object.keys(localStorage).filter(key =>
          key.startsWith('Bearer_') ||
          key.startsWith('signingKey_') ||
          key.startsWith('signingKeyExpiry_')
        );
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });

        // Call onUnauthorized callback to clear Redux state
        onUnauthorized();

        // Disconnect wallet
        disconnect();

        // Clear any cached data
        console.log('Clearing browser cache');
        if (window.caches) {
          try {
            const cacheNames = await window.caches.keys();
            await Promise.all(cacheNames.map(name => window.caches.delete(name)));
          } catch (err) {
            console.error('Error clearing cache:', err);
          }
        }

        // Clear session storage
        console.log('Clearing session storage');
        sessionStorage.clear();

        // Force reload the page with cache busting
        console.log('Reloading page with cache busting');
        window.location.href = window.location.pathname + '?t=' + new Date().getTime();
      }
      return Promise.reject(error);
    },
  );
};

export const checkCreatorStatus = async (address: string, chainId: number, apiClient: any): Promise<boolean> => {
  try {
    const response = await apiClient.get(
      `${SERVER_CONFIG.getApiUrl(chainId)}/user/creator/status`,
      {
        params: {
          address: address.toLowerCase(),
        },
      },
    );
    return response.data.isCreator;
  } catch (error) {
    console.error('Error checking creator status:', error);
    return false;
  }
};

export { apiClient };
