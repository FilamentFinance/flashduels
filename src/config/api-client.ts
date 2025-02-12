import { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS } from '@/constants/app/api-client';
import { ExtendedAxiosRequestConfig } from '@/types/general/api-client';
import axios, { AxiosInstance } from 'axios';

class AxiosClient {
  private static instance: AxiosClient | null = null;
  private axiosInstance: AxiosInstance;

  private constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config: ExtendedAxiosRequestConfig = error.config || {};
        config.retryCount = config?.retryCount ?? 0;
        config.shouldRetry = config?.shouldRetry ?? false;
        if (config?.shouldRetry && config?.retryCount < MAX_RETRY_ATTEMPTS) {
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
      AxiosClient?.instance?.axiosInstance?.defaults?.baseURL !== baseURL
    ) {
      AxiosClient.instance = new AxiosClient(baseURL);
    }
    return AxiosClient.instance.axiosInstance;
  }
}

export const baseApiClient = AxiosClient.getInstance('http://localhost:3004');
