import { LEADERBOARD_TABS } from '@/constants/leaderboard';

export type LeaderboardTab = (typeof LEADERBOARD_TABS)[keyof typeof LEADERBOARD_TABS];

export interface LeaderboardItem {
  rank: number;
  address: string;
  pnl: string;
  feesPaid?: string;
  earnings?: string;
}

export interface TraderLeaderboardItem {
  rank: number;
  address: string;
  pnl: string;
  totalTradedValue: string;
  earnings: string;
}
