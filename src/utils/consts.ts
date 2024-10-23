export const NEXT_PUBLIC_PRIVY_APP_ID=process.env.NEXT_PUBLIC_PRIVY_APP_ID as string
export const NEXT_PUBLIC_API=process.env.NEXT_PUBLIC_API as string
export const NEXT_PUBLIC_FLASH_USDC=process.env.NEXT_PUBLIC_FLASH_USDC as string
export const NEXT_PUBLIC_FLASH_DUELS=process.env.NEXT_PUBLIC_FLASH_DUELS as string
export const NEXT_PUBLIC_FLASH_DUELS_MARKETPLACE=process.env.NEXT_PUBLIC_FLASH_DUELS_MARKETPLACE as string
export const CHAIN_ID=1328
export const NEXT_PUBLIC_TIMER_BOT_URL = process.env.NEXT_PUBLIC_TIMER_BOT_URL as string

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
    duelId: string;
    winner: number;
    betId?: string | null;
    userId: string;
    user: User;
    betString?: string;
    betIcon?: string;
    startAt?: number
  };

export type Duel = {
    title: string;
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
  };

  export const durations = [3, 6, 12];