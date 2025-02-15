import { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS } from '@/constants/app/api-client';
import { ExtendedAxiosRequestConfig } from '@/types/general/api-client';
import axios, { AxiosInstance } from 'axios';
import { SERVER_CONFIG } from './server-config';

class AxiosClient {
  private static instance: AxiosClient | null = null;
  private axiosInstance: AxiosInstance;

  private constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });

    // Request interceptor to add auth token on every POST request.
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (config.method?.toLowerCase() === 'post') {
          const address =
            (config.data?.userAddress as string) || (config.data?.address as string) || '';

          if (address) {
            // Retrieve the token using your key format.
            const token = localStorage.getItem(`Bearer_${address.toLowerCase()}`);
            if (token) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
            // Optionally attach the signing key if stored with a similar key format.
            const signingKey = localStorage.getItem(`signingKey_${address.toLowerCase()}`);
            if (signingKey) {
              config.headers['X-Signing-Key'] = signingKey;
            }
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

export const baseApiClient = AxiosClient.getInstance(SERVER_CONFIG.API_URL);
