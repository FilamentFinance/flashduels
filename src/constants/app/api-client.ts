import { ExtendedAxiosRequestConfig } from '@/types/general/api-client';

export const MAX_RETRY_ATTEMPTS = 2;
export const RETRY_DELAY_MS = 500;
export const apiRetryConfig: ExtendedAxiosRequestConfig = {
  shouldRetry: true,
};
