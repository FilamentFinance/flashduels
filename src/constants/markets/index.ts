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
    comingSoon: true,
    hidden: true,
  },
  FORMULA_ONE: {
    title: 'Formula One (F1)',
    icon: '🏎️',
  },
} as const;

export const FLASH_DUEL_CATEGORIES = {
  ANY: { value: 'any', enabled: false },
  POLITICS: { value: 'politics', enabled: false },
  SPORTS: { value: 'sports', enabled: false },
  TWITTER: { value: 'twitter', enabled: false },
  NFTS: { value: 'nfts', enabled: false },
  NEWS: { value: 'news', enabled: false },
  FORMULA_ONE: { value: 'sports', enabled: true },
} as const;
