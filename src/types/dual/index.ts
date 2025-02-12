import { DUAL, DUAL_DURATION, DUAL_STATUS } from '@/constants/dual';

export type DualType = (typeof DUAL)[keyof typeof DUAL];
export type DualDuration = (typeof DUAL_DURATION)[keyof typeof DUAL_DURATION];

export interface BaseDualFormData {
  duration: DualDuration;
}

export interface CoinDualFormData extends BaseDualFormData {
  token: string;
  triggerPrice: string;
  winCondition: 'above' | 'below';
}

export interface FlashDualFormData extends BaseDualFormData {
  category: string;
  duelText: string;
  betIcon: File | null;
}

export type DualStatus = (typeof DUAL_STATUS)[keyof typeof DUAL_STATUS];
