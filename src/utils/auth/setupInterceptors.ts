import axios from 'axios';

export const setupInterceptors = async (address: string, disconnect: () => void) => {
  // Create axios instance
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  // Add request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(`Bearer_${address}`);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Add response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Clear local storage
        localStorage.removeItem(`signingKey_${address}`);
        localStorage.removeItem(`signingKeyExpiry_${address}`);
        localStorage.removeItem(`Bearer_${address}`);

        // Disconnect wallet
        disconnect();
      }
      return Promise.reject(error);
    },
  );

  return apiClient;
};
