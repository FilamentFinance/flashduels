export const CATEGORIES: {
  [key: string]: {
    title: string;
    icon: string;
  };
} = {
  ANY: {
    title: 'Any',
    icon: '⚡',
  },
  // LIQUIDITY: {
  //   title: 'Liquidity',
  //   icon: '💧',
  // },
  // ENDING_SOON: {
  //   title: 'Ending Soon',
  //   icon: '⌛',
  // },
  // COMPETITIVE: {
  //   title: 'Competitive',
  //   icon: '⚔️',
  // },
  SPORTS: {
    title: 'Sports',
    icon: '⚽',
  },
  CRYPTO: {
    title: 'Crypto',
    icon: '🪙',
  },
} as const;

export const FLASH_DUAL_CATEGORIES = {
  ANY: 'any',
  CRYPTO: 'crypto',
  POLITICS: 'politics',
  SPORTS: 'sports',
  TWITTER: 'twitter',
  NFTS: 'nfts',
  NEWS: 'news',
} as const;
