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
  ANY: {
    title: 'Any',
    icon: '🎲',
    comingSoon: true,
    hidden: true,
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
    icon: '⚽',
    comingSoon: true,
    hidden: true,
  },
  TWITTER: {
    title: 'Twitter',
    icon: '🐦',
    comingSoon: true,
    hidden: true,
  },
  NFTS: {
    title: 'NFTs',
    icon: '🖼️',
    comingSoon: true,
    hidden: true,
  },
  NEWS: {
    title: 'News',
    icon: '📰',
    comingSoon: true,
    hidden: true,
  },
  FORMULA_ONE: {
    title: 'Formula One (F1)',
    icon: '🏎️',
  },
  TRENDING: {
    title: 'Trending',
    icon: '🔥',
  },
} as const;

export const FLASH_DUEL_CATEGORIES = {
  ANY: { value: 'any', enabled: false },
  CRYPTO: { value: 'crypto', enabled: false },
  POLITICS: { value: 'politics', enabled: false },
  SPORTS: { value: 'sports', enabled: false },
  TWITTER: { value: 'twitter', enabled: false },
  NFTS: { value: 'nfts', enabled: false },
  NEWS: { value: 'news', enabled: false },
  FORMULA_ONE: { value: 'formula_one', enabled: true },
  TRENDING: { value: 'trending', enabled: true },
} as const;
