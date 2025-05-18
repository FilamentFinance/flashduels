import {
  DUEL,
  DUEL_DURATION,
  DUEL_STATUS,
  OPTIONS_TYPE,
  ORDER_TYPE,
  POSITION,
  WIN_CONDITIONS,
} from '@/constants/duel';

export type DuelType = (typeof DUEL)[keyof typeof DUEL];
export type DuelDuration = (typeof DUEL_DURATION)[keyof typeof DUEL_DURATION];

export interface BaseDuelFormData {
  duration: DuelDuration;
}

export interface CoinDuelFormData extends BaseDuelFormData {
  token: string;
  triggerPrice: string;
  winCondition: 'above' | 'below';
}

export interface FlashDuelFormData extends BaseDuelFormData {
  category: string;
  duelText: string;
  betIcon: File | null;
}

export type DuelStatus = (typeof DUEL_STATUS)[keyof typeof DUEL_STATUS];

export type User = {
  id: string;
  twitterUsername?: string;
  twitterImageUrl?: string;
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
  winner?: number;
};

export type Position = (typeof POSITION)[keyof typeof POSITION];
export type WinCondition = (typeof WIN_CONDITIONS)[keyof typeof WIN_CONDITIONS];

export type OptionBetType = {
  id: string;
  quantity: string;
  amount: string;
  index: number;
  price: string;
  sellId: number;
  betOption?: { index: number };
};

export interface OrderData {
  id: string;
  sellerId: string;
  duelTitle: string;
  direction: string;
  quantity: string;
  price: string;
  betOptionIndex: number;
  sellId: number;
}

export type TableDuel = {
  pnl: number;
  betId: string | null;
  duelId: string;
  duelType: string;
  totalBetAmount: string;
  yesBet: {
    amount: string;
    price: string;
    quantity: string;
  };
  noBet: {
    quantity: string;
    amount: string;
    price: string;
  };
  duelDetails: {
    id: string;
    createdAt: number;
    startAt: number;
    betString?: string;
    token: string;
    category: string;
    markPrice: string;
    status: number;
    triggerPrice: string;
    minimumWager: string;
    winCondition: number;
    duelType: string;
    endsIn: number;
    duelId: string;
    betIcon: string;
    winner: number; // -1 indicates no winner yet
    betId: string | null;
    userId: string;
  };
};

export type ActiveDuels = TableDuel[];

export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];
export type OptionsType = (typeof OPTIONS_TYPE)[keyof typeof OPTIONS_TYPE];
