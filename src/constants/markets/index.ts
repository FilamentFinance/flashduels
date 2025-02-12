export const CATEGORIES: {
  [key: string]: {
    title: string;
    icon: string;
  };
} = {
  TRENDING: {
    title: 'Trending',
    icon: '⚡',
  },
  LIQUIDITY: {
    title: 'Liquidity',
    icon: '💧',
  },
  ENDING_SOON: {
    title: 'Ending Soon',
    icon: '⌛',
  },
  COMPETITIVE: {
    title: 'Competitive',
    icon: '⚔️',
  },
  SPORTS: {
    title: 'Sports',
    icon: '⚽',
  },
  CRYPTO: {
    title: 'Crypto',
    icon: '🪙',
  },
} as const;
