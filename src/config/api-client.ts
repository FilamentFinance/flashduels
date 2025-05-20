import { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS } from '@/constants/app/api-client';
import { ExtendedAxiosRequestConfig } from '@/types/general/api-client';
import axios, { AxiosInstance } from 'axios';
import { SERVER_CONFIG } from './server-config';
import { base } from 'viem/chains';

class AxiosClient {
  private static instance: AxiosClient | null = null;
  private axiosInstance: AxiosInstance;

  private constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });

    // Request interceptor to add auth token for all requests
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Get address from request data or params
        let address: string | undefined;

        if (config.method?.toLowerCase() === 'get') {
          address = config.params?.address || config.params?.userAddress;

          // Add token to GET request params if address is available
          const token = address ? localStorage.getItem(`Bearer_${address.toLowerCase()}`) : null;
          if (token) {
            config.params = {
              ...config.params,
              token: token.replace('Bearer ', ''),
            };
          }
        } else {
          address = config.data?.address || config.data?.userAddress;
        }

        if (address) {
          // Retrieve and set the bearer token
          const token = localStorage.getItem(`Bearer_${address.toLowerCase()}`);
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }

          // Set the signing key if available
          const signingKey = localStorage.getItem(`signingKey_${address.toLowerCase()}`);
          if (signingKey) {
            config.headers['X-Signing-Key'] = signingKey;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor for retrying failed requests.
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config: ExtendedAxiosRequestConfig = error.config || {};
        config.retryCount = config.retryCount ?? 0;
        config.shouldRetry = config.shouldRetry ?? false;

        if (config.shouldRetry && config.retryCount < MAX_RETRY_ATTEMPTS) {
          config.retryCount += 1;
          await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
          return this.axiosInstance(config);
        }
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(baseURL: string): AxiosInstance {
    if (
      !AxiosClient?.instance?.axiosInstance?.defaults?.baseURL ||
      AxiosClient.instance.axiosInstance.defaults.baseURL !== baseURL
    ) {
      AxiosClient.instance = new AxiosClient(baseURL);
    }
    return AxiosClient.instance.axiosInstance;
  }
}

// Create a default API client with Sei chain
const defaultApiClient = AxiosClient.getInstance(SERVER_CONFIG.getApiUrl(base.id));

// Hook to get API client for current chain
export const useApiClient = (chainId: number) => {
  return AxiosClient.getInstance(SERVER_CONFIG.getApiUrl(chainId));
};

// Export default client for non-React contexts
export const baseApiClient = defaultApiClient;
