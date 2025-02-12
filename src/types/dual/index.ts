import { DUAL, DUAL_DURATION, DUAL_STATUS, POSITION } from '@/constants/dual';

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

export type User = {
  id: string;
  twitterUsername?: string;
  address: string;
};

export type NewDuelItem = {
  id: string;
  createdAt: number;
  token?: string;
  category: string;
  markPrice?: string;
  triggerPrice?: string;
  minimumWager?: number;
  winCondition?: number;
  duelType: string;
  endsIn: number;
  status: number;
  duelId: string;
  winner: number;
  betId?: string | null;
  userId: string;
  user: User;
  betString?: string;
  betIcon?: string;
  startAt?: number;
  totalBetAmount: number;
};

export type Duel = {
  title: string;
  status: number;
  imageSrc: string;
  volume: string;
  category: string;
  duelId: string;
  createdAt: number;
  startAt: number;
  duelType: string;
  timeLeft: number;
  percentage: number;
  createdBy: string;
  onClick?: () => void;
  token?: string;
  winCondition?: number;
  totalBetAmount: number;
  triggerPrice?: string;
};

export type Position = (typeof POSITION)[keyof typeof POSITION];
