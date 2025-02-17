export const CATEGORIES: {
  [key: string]: {
    title: string;
    icon: string;
  };
} = {
  ALL_DUELS: {
    title: 'All Duels',
    icon: '⚡',
  },
  CRYPTO: {
    title: 'Crypto',
    icon: '🪙',
  },
  US_ELECTION: {
    title: 'US Election',
    icon: '🇺🇸',
  },
  SPORTS: {
    title: 'Sports',
    icon: '⚽',
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
