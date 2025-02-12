type RouteConfig = {
  title: string;
  path: string;
};

type AppRoutes = {
  [K in 'MARKETS' | 'PORTFOLIO' | 'LEADERBOARD']: RouteConfig;
};

export const APP_ROUTES: AppRoutes = {
  MARKETS: {
    title: 'Markets',
    path: '/',
  },
  LEADERBOARD: {
    title: 'Leaderboard',
    path: '/leaderboard',
  },
  PORTFOLIO: {
    title: 'Portfolio',
    path: '/portfolio',
  },
} as const;

export type AppRoutesKeys = keyof typeof APP_ROUTES;
