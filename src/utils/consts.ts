export const NEXT_PUBLIC_PRIVY_APP_ID=process.env.NEXT_PUBLIC_PRIVY_APP_ID as string
export const PRODUCTION = process.env.NEXT_PUBLIC_PRODUCTION as string;
export const NEXT_PUBLIC_API = PRODUCTION === "false" ? process.env.NEXT_PUBLIC_API as string : process.env.NEXT_PUBLIC_API_PRODUCTION as string;
export const NEXT_PUBLIC_FLASH_USDC=process.env.NEXT_PUBLIC_FLASH_USDC as string
// export const NEXT_PUBLIC_FLASH_DUELS=process.env.NEXT_PUBLIC_FLASH_DUELS as string
// export const NEXT_PUBLIC_MARKETPLACE_FACET=process.env.NEXT_PUBLIC_MARKETPLACE_FACET as string
export const CHAIN_ID=1328
export const NEXT_PUBLIC_TIMER_BOT_URL = PRODUCTION === "false" ? process.env.NEXT_PUBLIC_TIMER_BOT_URL as string : process.env.NEXT_PUBLIC_TIMER_BOT_URL_PRODUCTION as string
export const NEXT_PUBLIC_WS_URL = PRODUCTION === "false" ? process.env.NEXT_PUBLIC_API_WS as string : process.env.NEXT_PUBLIC_API_WS_PRODUCTION as string
export const NEXT_PUBLIC_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string
export const NEXT_PUBLIC_DIAMOND = process.env.NEXT_PUBLIC_DIAMOND as string



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
    totalBetAmount:number
  };

export type OptionBetType = {
  id: string;
  quantity: string;
  amount: string;
  index: number;
  price: string;
  betOption?:{index:number}
}


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
    totalBetAmount: number;
    triggerPrice? : string
  };


  type TableDuel = {
    pnl: number;
    betId: string | null;
    duelId: string;
    duelType: string;
    totalBetAmount: string;
    yesBet: {
      amount: string | null;
      price: string | null;
      value?: string; // optional, based on your data
    };
    noBet: {
      amount: string | null;
      price: string | null;
    };
    duelDetails: {
      id: string;
      createdAt: number;
      startAt: number;
      betString?:string
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
  
  export interface BetInfoProps {
    betTitle: string;
    imageUrl: string;
    volume: string;
    endTime: number;
    probability: number;
    createdBy: string;
    bet: string;
    setBet: (bet: string) => void;
    startAt: number;
    createdAt: number;
    totalBetAmount: number;
    noPrice?: number;
    yesPrice?: number;
    status:number;
    // duelId:string
  }

  export interface BetCardProps {
    betTitle: string;
    imageUrl: string;
    volume: string;
    endTime: number;
    percentage: number;
    createdBy: string;
    availableAmount: number;
    onClose: () => void,
    duelId: string,
    duelType: string,
    startAt: number,
    createdAt: number,
    asset?: string,
    totalBetAmount: number,
    endsIn: number
    triggerPrice?: string,
    status: number;
    setIsModalOpen: (arg0: boolean) => void;
  }

  export type ActiveDuels = TableDuel[];
  
  export const durations = [3, 6, 12];