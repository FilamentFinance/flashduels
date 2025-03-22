export const CATEGORIES: {
  [key: string]: {
    title: string;
    icon: string;
    comingSoon?: boolean;
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
  POLITICS: {
    title: 'Politics',
    icon: '🏛️',
    comingSoon: true,
  },
  F1: {
    title: 'F1',
    icon: '🏎️',
    comingSoon: true,
  },
} as const;

export const FLASH_DUEL_CATEGORIES = {
  ANY: 'any',
  CRYPTO: 'crypto',
  POLITICS: 'politics',
  SPORTS: 'sports',
  TWITTER: 'twitter',
  NFTS: 'nfts',
  NEWS: 'news',
} as const;
