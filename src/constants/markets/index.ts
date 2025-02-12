export const CATEGORIES: {
  [key: string]: {
    title: string;
    icon: string;
  };
} = {
  TRENDING: {
    title: 'Trending',
    icon: '/logo/categories/trendings.svg',
  },
  LIQUIDITY: {
    title: 'Liquidity',
    icon: '/logo/categories/liquidity.svg',
  },
  ENDING_SOON: {
    title: 'Ending Soon',
    icon: '/logo/categories/ending-soon.svg',
  },
  COMPETITIVE: {
    title: 'Competitive',
    icon: '/logo/categories/competitive.svg',
  },
  SPORTS: {
    title: 'Sports',
    icon: '/logo/categories/sports.svg',
  },
  CRYPTO: {
    title: 'Crypto',
    icon: '/logo/categories/crypto.svg',
  },
} as const;
