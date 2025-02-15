import { AxiosRequestConfig } from 'axios';

type RetryConfig = {
  shouldRetry: boolean;
  retryCount: number;
};

export type ExtendedAxiosRequestConfig = AxiosRequestConfig & Partial<RetryConfig>;
