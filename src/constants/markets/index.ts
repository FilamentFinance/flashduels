export const CATEGORIES: {
  [key: string]: {
    title: string;
    icon: string;
    comingSoon?: boolean;
    hidden?: boolean;
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
    hidden: true,
  },
  SPORTS: {
    title: 'Sports',
    icon: '🏎️',
    comingSoon: false,
  },
} as const;

export const FLASH_DUEL_CATEGORIES = {
  ANY: 'any',
  POLITICS: 'politics',
  SPORTS: 'sports',
  TWITTER: 'twitter',
  NFTS: 'nfts',
  NEWS: 'news',
} as const;
